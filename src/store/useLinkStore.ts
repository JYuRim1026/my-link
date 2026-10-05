import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_LINKS, LinkItem } from "@/data/mockLinks";

interface LinkState {
  links: LinkItem[];
  addLink: (newLink: Omit<LinkItem, "id" | "clicks" | "enabled">) => void;
  incrementClicks: (id: string) => void;
  deleteLink: (id: string) => void;
  resetLinks: () => void;
}

export const useLinkStore = create<LinkState>()(
  persist(
    (set) => ({
      links: MOCK_LINKS,

      addLink: (linkData) =>
        set((state) => ({
          links: [
            {
              id: `link-${Date.now()}`,
              ...linkData,
              enabled: true,
              clicks: 0,
            },
            ...state.links,
          ],
        })),

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
    }),
    {
      name: "mylink_profile_storage",
    }
  )
);
