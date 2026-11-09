import { create } from "zustand";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MOCK_LINKS, LinkItem } from "@/data/mockLinks";

// 로딩 UI가 너무 순식간에 깜빡이지 않고 육안으로 명확히 보이도록 최소 지연 보장
const minLoadingDelay = (ms = 600) =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface LinkState {
  links: LinkItem[];
  isLoading: boolean;
  error: string | null;
  fetchLinks: () => Promise<void>;
  addLink: (
    newLink: Omit<LinkItem, "id" | "clicks" | "enabled">
  ) => Promise<void>;
  updateLink: (
    id: string,
    updatedData: Pick<LinkItem, "title" | "url" | "description" | "badge">
  ) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  incrementClicks: (id: string) => void;
  resetLinks: () => void;
}

export const useLinkStore = create<LinkState>()((set, get) => ({
  // 기존 기본 링크 목록(MOCK_LINKS)을 그대로 유지
  links: MOCK_LINKS,
  isLoading: false,
  error: null,

  fetchLinks: async () => {
    console.log("📥 [Firestore] 링크 목록 불러오기 시작 (경로: users/anonymous/links)");
    set({ isLoading: true, error: null });
    try {
      const linksCollectionRef = collection(db, "users", "anonymous", "links");
      const q = query(linksCollectionRef, orderBy("createdAt", "desc"));
      const [querySnapshot] = await Promise.all([
        getDocs(q),
        minLoadingDelay(400),
      ]);

      const fetchedLinks: LinkItem[] = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || "",
          description: data.description || "",
          url: data.url || "#",
          badge: data.badge || "DEV",
          iconName: data.iconName || "ExternalLink",
          color: data.color || "#21242e",
          enabled: data.enabled ?? true,
          clicks: data.clicks ?? 0,
        };
      });

      console.log(`✅ [Firestore] 링크 목록 조회 완료 (${fetchedLinks.length}개):`, fetchedLinks);

      // Firestore에서 불러온 최신순 링크들 + 기존 기본 메뉴(MOCK_LINKS) 함께 유지
      set({
        links: [...fetchedLinks, ...MOCK_LINKS],
        isLoading: false,
      });
    } catch (err) {
      console.error("❌ [Firestore] 링크 목록 불러오기 실패:", err);
      set({
        error: "Firestore에서 링크 목록을 불러오는 중 오류가 발생했습니다.",
        isLoading: false,
      });
    }
  },

  addLink: async (linkData) => {
    console.log("➕ [링크 추가 클릭] Firestore 저장 요청 데이터:", linkData);
    set({ isLoading: true, error: null });
    const payload = {
      title: linkData.title,
      description: linkData.description || "",
      url: linkData.url,
      badge: linkData.badge,
      iconName: linkData.iconName || "ExternalLink",
      color: linkData.color || "#21242e",
      enabled: true,
      clicks: 0,
      createdAt: serverTimestamp(),
    };

    try {
      // Save new link document under: users -> anonymous -> links
      const linksCollectionRef = collection(db, "users", "anonymous", "links");
      const [docRef] = await Promise.all([
        addDoc(linksCollectionRef, payload),
        minLoadingDelay(600),
      ]);
      console.log("✅ [링크 추가 완료] 생성된 Firestore 문서 ID:", docRef.id);

      // Refresh link list from Firestore sorted by createdAt desc
      await get().fetchLinks();
    } catch (err) {
      console.error("❌ [링크 추가 실패]:", err);
      set({
        error:
          "Firestore 저장에 실패했습니다. Firebase 콘솔의 Firestore 규칙(Rules)을 확인해주세요.",
        isLoading: false,
      });
      throw err;
    }
  },

  updateLink: async (id, updatedData) => {
    console.log(`✏️ [링크 수정 클릭] 대상 ID: ${id}, 수정 데이터:`, updatedData);
    set({ isLoading: true, error: null });
    try {
      // Firestore 문서(users/anonymous/links/{id}) 수정 수행
      if (!id.startsWith("link-")) {
        const linkDocRef = doc(db, "users", "anonymous", "links", id);
        await Promise.all([
          updateDoc(linkDocRef, {
            title: updatedData.title,
            url: updatedData.url,
            description: updatedData.description || "",
            badge: updatedData.badge,
            updatedAt: serverTimestamp(),
          }),
          minLoadingDelay(600),
        ]);
        console.log(`✅ [링크 수정 완료] Firestore 문서 업데이트 성공 (ID: ${id})`);

        // 링크 추가와 동일하게 fetchLinks()를 다시 호출해 목록 갱신
        await get().fetchLinks();
      } else {
        await minLoadingDelay(600);
        console.log(`✅ [기본 링크 수정 완료] 로컬 상태 업데이트 성공 (ID: ${id})`);
        set((state) => ({
          links: state.links.map((item) =>
            item.id === id ? { ...item, ...updatedData } : item
          ),
          isLoading: false,
        }));
      }
    } catch (err) {
      console.error("❌ [링크 수정 실패]:", err);
      set({
        error: "링크 수정 중 오류가 발생했습니다.",
        isLoading: false,
      });
      throw err;
    }
  },

  deleteLink: async (id) => {
    console.log(`🗑️ [링크 삭제 클릭] 삭제할 대상 ID: ${id}`);
    set({ isLoading: true, error: null });
    try {
      // Firestore 문서(users/anonymous/links/{id}) 삭제 수행
      if (!id.startsWith("link-")) {
        const linkDocRef = doc(db, "users", "anonymous", "links", id);
        await Promise.all([deleteDoc(linkDocRef), minLoadingDelay(600)]);
        console.log(`✅ [링크 삭제 완료] Firestore 문서 삭제 성공 (ID: ${id})`);

        // 링크 추가와 동일하게 fetchLinks()를 다시 호출해 목록 갱신
        await get().fetchLinks();
      } else {
        await minLoadingDelay(600);
        console.log(`✅ [기본 링크 삭제 완료] 로컬 상태에서 제거 성공 (ID: ${id})`);
        set((state) => ({
          links: state.links.filter((item) => item.id !== id),
          isLoading: false,
        }));
      }
    } catch (err) {
      console.error("❌ [링크 삭제 실패]:", err);
      set({
        error: "링크 삭제 중 오류가 발생했습니다.",
        isLoading: false,
      });
      throw err;
    }
  },

  incrementClicks: (id) => {
    console.log(`🔗 [링크 카드 클릭] 클릭된 링크 ID: ${id}`);
    set((state) => ({
      links: state.links.map((link) =>
        link.id === id ? { ...link, clicks: link.clicks + 1 } : link
      ),
    }));
  },

  resetLinks: () => set({ links: MOCK_LINKS }),
}));
