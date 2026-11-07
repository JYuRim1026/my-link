import { create } from "zustand";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MOCK_LINKS, LinkItem } from "@/data/mockLinks";

interface LinkState {
  links: LinkItem[];
  error: string | null;
  addLink: (
    newLink: Omit<LinkItem, "id" | "clicks" | "enabled">
  ) => Promise<void>;
  incrementClicks: (id: string) => void;
  deleteLink: (id: string) => void;
  resetLinks: () => void;
}

export const useLinkStore = create<LinkState>()((set) => ({
  links: MOCK_LINKS,
  error: null,

  addLink: async (linkData) => {
    set({ error: null });
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
      const docRef = await addDoc(linksCollectionRef, payload);

      // Update local state immediately for UI
      const newLinkItem: LinkItem = {
        id: docRef.id,
        title: payload.title,
        description: payload.description,
        url: payload.url,
        badge: payload.badge,
        iconName: payload.iconName,
        color: payload.color,
        enabled: true,
        clicks: 0,
      };

      set((state) => ({
        links: [newLinkItem, ...state.links],
      }));
    } catch (err) {
      console.error("Failed to save link to Firestore:", err);
      set({
        error:
          "Firestore 저장에 실패했습니다. Firebase 콘솔의 Firestore 규칙(Rules)이 테스트 모드인지 확인해주세요.",
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
