import { create } from "zustand";
import { toast } from "sonner";
import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { db, auth, googleProvider } from "@/lib/firebase";
import { MOCK_LINKS, LinkItem } from "@/data/mockLinks";

export interface UserProfile {
  uid: string;
  name: string;
  displayName?: string;
  email: string;
  photoURL: string;
}

// 로딩 UI가 너무 순식간에 깜빡이지 않고 육안으로 명확히 보이도록 최소 지연 보장
const minLoadingDelay = (ms = 600) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Firestore Timestamp 또는 Date를 읽기 쉬운 한국어 시각 문자열로 변환
const formatTimestamp = (ts: unknown): string | undefined => {
  if (!ts) return undefined;
  if (
    typeof ts === "object" &&
    ts !== null &&
    "toDate" in ts &&
    typeof (ts as { toDate: () => Date }).toDate === "function"
  ) {
    return (ts as { toDate: () => Date }).toDate().toLocaleString("ko-KR");
  }
  if (ts instanceof Date) {
    return ts.toLocaleString("ko-KR");
  }
  if (typeof ts === "string") {
    return ts;
  }
  return undefined;
};

interface LinkState {
  user: UserProfile | null;
  authLoading: boolean;
  links: LinkItem[];
  isLoading: boolean;
  error: string | null;
  setUserFromAuth: (
    firebaseUser: {
      uid: string;
      displayName: string | null;
      email: string | null;
      photoURL: string | null;
    } | null
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateDisplayName: (newDisplayName: string) => Promise<void>;
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
  user: null,
  authLoading: true,
  links: MOCK_LINKS,
  isLoading: false,
  error: null,

  setUserFromAuth: async (firebaseUser) => {
    if (!firebaseUser) {
      set({ user: null, authLoading: false, links: MOCK_LINKS });
      return;
    }

    // 이메일 앞 부분(@ 앞 아이디)을 displayName으로 추출
    const emailPrefix = firebaseUser.email
      ? firebaseUser.email.split("@")[0]
      : firebaseUser.displayName || "user";

    const currentUserProfile: UserProfile = {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || emailPrefix,
      email: firebaseUser.email || "",
      photoURL: firebaseUser.photoURL || "/avatar.jpg",
    };

    // 먼저 스토어에 user를 즉시 반영하여 추가/조회가 끊기지 않게 보장
    set({
      user: currentUserProfile,
      authLoading: false,
    });

    // Firestore users/{user.uid} 문서에 유저 정보(displayName은 이메일 앞부분) 저장
    try {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      await setDoc(
        userDocRef,
        {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: emailPrefix,
          photoURL: firebaseUser.photoURL || "",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      console.log(
        `✅ [Firestore 유저 등록 완료] 경로: users/${firebaseUser.uid} (displayName: ${emailPrefix})`
      );
    } catch (err) {
      console.error("❌ [Firestore 유저 문서 저장 실패]:", err);
    }

    // 해당 유저의 개인화 경로(users/{user.uid}/links)에서 링크 목록 불러오기
    await get().fetchLinks();
  },

  loginWithGoogle: async () => {
    console.log("🔑 [Google 로그인 클릭] 구글 소셜 로그인 팝업 요청");
    set({ error: null });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(
        "✅ [Google 로그인 성공] UID:",
        result.user.uid,
        "이메일:",
        result.user.email
      );

      // 로그인 직후 즉시 유저 상태 및 Firestore users/{uid} 반영
      await get().setUserFromAuth({
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      });
      toast.success("Google 로그인에 성공했습니다!", {
        description: `${result.user.email} 계정으로 연결되었습니다.`,
      });
    } catch (err) {
      console.error("❌ [Google 로그인 실패]:", err);
      toast.error("Google 로그인에 실패했습니다.");
      set({
        error:
          "구글 로그인에 실패했습니다. Firebase 콘솔 > Authentication > 로그인 방법에서 Google이 사용 설정되어 있는지 확인해주세요.",
      });
      throw err;
    }
  },

  logout: async () => {
    console.log("🚪 [로그아웃 클릭] 로그아웃 요청");
    try {
      await signOut(auth);
      set({ user: null, links: MOCK_LINKS, error: null });
      console.log("✅ [로그아웃 완료]");
      toast.success("안전하게 로그아웃되었습니다.");
    } catch (err) {
      console.error("❌ [로그아웃 실패]:", err);
      toast.error("로그아웃 중 오류가 발생했습니다.");
    }
  },

  updateDisplayName: async (newDisplayName) => {
    const currentUser = get().user || auth.currentUser;
    if (!currentUser) return;
    const trimmed = newDisplayName.trim();
    if (!trimmed) return;

    console.log(
      `✏️ [프로필 닉네임 변경] UID: ${currentUser.uid}, 새 닉네임: ${trimmed}`
    );
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(
        userDocRef,
        {
          displayName: trimmed,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      set((state) => ({
        user: state.user
          ? { ...state.user, name: trimmed, displayName: trimmed }
          : null,
      }));
      console.log(`✅ [프로필 닉네임 변경 완료] ${trimmed}`);
      toast.success("닉네임이 변경되었습니다!", {
        description: `새 닉네임: ${trimmed}`,
      });
    } catch (err) {
      console.error("❌ [프로필 닉네임 변경 실패]:", err);
      toast.error("닉네임 변경에 실패했습니다.");
      throw err;
    }
  },

  fetchLinks: async () => {
    const currentUser = get().user || auth.currentUser;
    if (!currentUser) {
      set({ links: MOCK_LINKS, isLoading: false });
      return;
    }

    const uid = currentUser.uid;
    console.log(
      `📥 [Firestore] 링크 목록 불러오기 시작 (경로: users/${uid}/links)`
    );
    set({ isLoading: true, error: null });
    try {
      const linksCollectionRef = collection(db, "users", uid, "links");
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
          createdAt: formatTimestamp(data.createdAt),
          updatedAt: formatTimestamp(data.updatedAt),
        };
      });

      console.log(
        `✅ [Firestore] 링크 목록 조회 완료 (users/${uid}/links, ${fetchedLinks.length}개):`,
        fetchedLinks
      );

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
    const currentUser = get().user || auth.currentUser;
    const uid = currentUser?.uid || "anonymous";
    console.log(
      `➕ [링크 추가 클릭] Firestore 저장 요청 (경로: users/${uid}/links):`,
      linkData
    );
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
      updatedAt: serverTimestamp(),
    };

    try {
      // Save new link document under: users -> {user.uid} -> links
      const linksCollectionRef = collection(db, "users", uid, "links");
      const [docRef] = await Promise.all([
        addDoc(linksCollectionRef, payload),
        minLoadingDelay(600),
      ]);
      console.log(
        `✅ [링크 추가 완료] 생성된 Firestore 문서 ID (users/${uid}/links/${docRef.id})`
      );

      // Refresh link list from Firestore sorted by createdAt desc
      await get().fetchLinks();
      toast.success("새 링크가 추가되었습니다!", {
        description: linkData.title,
      });
    } catch (err) {
      console.error("❌ [링크 추가 실패]:", err);
      toast.error("링크 추가에 실패했습니다.");
      set({
        error:
          "Firestore 저장에 실패했습니다. Firebase 콘솔의 Firestore 규칙(Rules)을 확인해주세요.",
        isLoading: false,
      });
      throw err;
    }
  },

  updateLink: async (id, updatedData) => {
    const currentUser = get().user || auth.currentUser;
    const uid = currentUser?.uid || "anonymous";
    console.log(
      `✏️ [링크 수정 클릭] 대상 경로: users/${uid}/links/${id}, 수정 데이터:`,
      updatedData
    );
    set({ isLoading: true, error: null });
    try {
      // Firestore 문서(users/{user.uid}/links/{id}) 수정 수행
      if (!id.startsWith("link-")) {
        const linkDocRef = doc(db, "users", uid, "links", id);
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
        console.log(
          `✅ [링크 수정 완료] Firestore 문서 업데이트 성공 (users/${uid}/links/${id})`
        );

        // 링크 추가와 동일하게 fetchLinks()를 다시 호출해 목록 갱신
        await get().fetchLinks();
      } else {
        await minLoadingDelay(600);
        const nowStr = new Date().toLocaleString("ko-KR");
        console.log(
          `✅ [기본 링크 수정 완료] 로컬 상태 업데이트 성공 (ID: ${id}, updatedAt: ${nowStr})`
        );
        set((state) => ({
          links: state.links.map((item) =>
            item.id === id
              ? { ...item, ...updatedData, updatedAt: nowStr }
              : item
          ),
          isLoading: false,
        }));
      }
      toast.success("링크가 성공적으로 수정되었습니다!", {
        description: updatedData.title,
      });
    } catch (err) {
      console.error("❌ [링크 수정 실패]:", err);
      toast.error("링크 수정 중 오류가 발생했습니다.");
      set({
        error: "링크 수정 중 오류가 발생했습니다.",
        isLoading: false,
      });
      throw err;
    }
  },

  deleteLink: async (id) => {
    const currentUser = get().user || auth.currentUser;
    const uid = currentUser?.uid || "anonymous";
    console.log(`🗑️ [링크 삭제 클릭] 삭제할 대상 경로: users/${uid}/links/${id}`);
    set({ isLoading: true, error: null });
    try {
      // Firestore 문서(users/{user.uid}/links/{id}) 삭제 수행
      if (!id.startsWith("link-")) {
        const linkDocRef = doc(db, "users", uid, "links", id);
        await Promise.all([deleteDoc(linkDocRef), minLoadingDelay(600)]);
        console.log(
          `✅ [링크 삭제 완료] Firestore 문서 삭제 성공 (users/${uid}/links/${id})`
        );

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
      toast.success("링크가 삭제되었습니다.");
    } catch (err) {
      console.error("❌ [링크 삭제 실패]:", err);
      toast.error("링크 삭제 중 오류가 발생했습니다.");
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
