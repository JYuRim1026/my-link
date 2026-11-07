import { create } from "zustand";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MOCK_LINKS, LinkItem } from "@/data/mockLinks";

interface LinkState {
  links: LinkItem[];
  isLoading: boolean;
  error: string | null;
  fetchLinks: () => Promise<void>;
  addLink: (
    newLink: Omit<LinkItem, "id" | "clicks" | "enabled">
  ) => Promise<void>;
  incrementClicks: (id: string) => void;
  deleteLink: (id: string) => void;
  resetLinks: () => void;
}

export const useLinkStore = create<LinkState>()((set, get) => ({
  // 기존 기본 링크 목록(MOCK_LINKS)을 그대로 유지
  links: MOCK_LINKS,
  isLoading: false,
  error: null,

  fetchLinks: async () => {
    set({ isLoading: true, error: null });
    try {
      const linksCollectionRef = collection(db, "users", "anonymous", "links");
      const q = query(linksCollectionRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

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

      // Firestore에서 불러온 최신순 링크들 + 기존 기본 메뉴(MOCK_LINKS) 함께 유지
      set({
        links: [...fetchedLinks, ...MOCK_LINKS],
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to fetch links from Firestore:", err);
      set({
        error: "Firestore에서 링크 목록을 불러오는 중 오류가 발생했습니다.",
        isLoading: false,
      });
    }
  },

  addLink: async (linkData) => {
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
      await addDoc(linksCollectionRef, payload);

      // Refresh link list from Firestore sorted by createdAt desc
      await get().fetchLinks();
    } catch (err) {
      console.error("Failed to save link to Firestore:", err);
      set({
        error:
          "Firestore 저장에 실패했습니다. Firebase 콘솔의 Firestore 규칙(Rules)을 확인해주세요.",
        isLoading: false,
      });
      throw err;
    }
  },

  incrementClicks: (id) =>
    set((state) => ({
      links: state.links.map((link) =>
        link.id === id ? { ...link, clicks: link.clicks + 1 } : link
      ),
    })),

  deleteLink: (id) =>
    set((state) => ({
      links: state.links.filter((link) => link.id !== id),
    })),

  resetLinks: () => set({ links: MOCK_LINKS }),
}));
