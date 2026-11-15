"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  limit,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { toast } from "sonner";
import { db, auth } from "@/lib/firebase";
import { MOCK_LINKS, LinkItem } from "@/data/mockLinks";
import { useLinkStore } from "@/store/useLinkStore";

const minLoadingDelay = (ms = 600) =>
  new Promise((resolve) => setTimeout(resolve, ms));

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

/**
 * 비로그인 상태에서도 서버 주인(또는 기본 프로필)의 UID를 찾아 마이링크를 사용할 수 있도록 지원
 */
async function resolveActiveOwnerUid(currentAuthUid?: string | null): Promise<string> {
  if (currentAuthUid) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mylink_owner_uid", currentAuthUid);
    }
    return currentAuthUid;
  }

  if (typeof window !== "undefined") {
    const cachedOwnerUid = window.localStorage.getItem("mylink_owner_uid");
    if (cachedOwnerUid) return cachedOwnerUid;
  }

  try {
    const usersRef = collection(db, "users");
    const snap = await getDocs(query(usersRef, limit(1)));
    if (!snap.empty) {
      const foundUid = snap.docs[0].id;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("mylink_owner_uid", foundUid);
      }
      return foundUid;
    }
  } catch {
    // ignore and fallback
  }

  return "anonymous";
}

/**
 * 1. 링크 목록 조회 Query 훅 (useLinksQuery)
 * - 로그인 여부와 상관없이 항상 활성화 (비로그인 시에도 마이링크 조회·사용 가능)
 * - 경로: users/{targetUid}/links (createdAt desc 정렬)
 */
export function useLinksQuery() {
  const user = useLinkStore((state) => state.user);
  const currentAuthUid = user?.uid || auth.currentUser?.uid || null;

  return useQuery<LinkItem[]>({
    queryKey: ["links", currentAuthUid || "guest"],
    refetchOnMount: "always",
    queryFn: async () => {
      const targetUid = await resolveActiveOwnerUid(currentAuthUid);

      console.log(
        `📥 [TanStack Query] Firestore 링크 목록 조회 시작 (경로: users/${targetUid}/links)`
      );
      const linksCollectionRef = collection(db, "users", targetUid, "links");
      const q = query(linksCollectionRef, orderBy("createdAt", "desc"));
      const [querySnapshot] = await Promise.all([
        getDocs(q),
        minLoadingDelay(300),
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
          clicks: typeof data.clicks === "number" ? data.clicks : 0,
          ownerUid: targetUid,
          createdAt: formatTimestamp(data.createdAt),
          updatedAt: formatTimestamp(data.updatedAt),
        };
      });

      // 기본 MOCK_LINKS 클릭 수 localStorage 저장분 반영
      let savedMockClicks: Record<string, number> = {};
      if (typeof window !== "undefined") {
        try {
          const raw = window.localStorage.getItem(
            `mylink_mock_clicks_${targetUid}`
          );
          if (raw) savedMockClicks = JSON.parse(raw);
        } catch {
          // ignore parse error
        }
      }

      const fetchedIds = new Set(fetchedLinks.map((item) => item.id));
      const hydratedMockLinks = MOCK_LINKS.filter(
        (item) => !fetchedIds.has(item.id)
      ).map((item) => ({
        ...item,
        ownerUid: targetUid,
        clicks:
          savedMockClicks[item.id] !== undefined
            ? savedMockClicks[item.id]
            : item.clicks,
      }));

      const mergedLinks = [...fetchedLinks, ...hydratedMockLinks];
      useLinkStore.setState({ links: mergedLinks });

      console.log(
        `✅ [TanStack Query] 링크 목록 조회 완료 (users/${targetUid}/links, ${fetchedLinks.length}개):`,
        fetchedLinks
      );

      return mergedLinks;
    },
  });
}

/**
 * 2. 새 링크 추가 Mutation 훅 (useAddLinkMutation)
 * - Firestore 저장 후 invalidateQueries로 목록 자동 갱신
 */
export function useAddLinkMutation() {
  const queryClient = useQueryClient();
  const user = useLinkStore((state) => state.user);

  return useMutation({
    mutationFn: async (
      linkData: Omit<LinkItem, "id" | "clicks" | "enabled">
    ) => {
      const currentAuthUid = user?.uid || auth.currentUser?.uid || null;
      const targetUid = await resolveActiveOwnerUid(currentAuthUid);
      console.log(
        `➕ [TanStack Mutation] 링크 추가 요청 (경로: users/${targetUid}/links):`,
        linkData
      );

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

      const linksCollectionRef = collection(db, "users", targetUid, "links");
      const [docRef] = await Promise.all([
        addDoc(linksCollectionRef, payload),
        minLoadingDelay(600),
      ]);

      console.log(
        `✅ [TanStack Mutation] 링크 추가 완료 (문서 ID: users/${targetUid}/links/${docRef.id})`
      );
      return { docId: docRef.id, linkData, targetUid };
    },
    onSuccess: async ({ linkData }) => {
      toast.success("새 링크가 추가되었습니다!", {
        description: linkData.title,
      });
      await queryClient.invalidateQueries({ queryKey: ["links"] });
      await queryClient.invalidateQueries({ queryKey: ["publicProfile"] });
    },
    onError: (err) => {
      console.error("❌ [TanStack Mutation] 링크 추가 실패:", err);
      toast.error("링크 추가에 실패했습니다.");
    },
  });
}

/**
 * 3. 링크 수정 Mutation 훅 (useUpdateLinkMutation)
 */
export function useUpdateLinkMutation() {
  const queryClient = useQueryClient();
  const user = useLinkStore((state) => state.user);

  return useMutation({
    mutationFn: async ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: Pick<LinkItem, "title" | "url" | "description" | "badge">;
    }) => {
      const currentAuthUid = user?.uid || auth.currentUser?.uid || null;
      const targetUid = await resolveActiveOwnerUid(currentAuthUid);
      console.log(
        `✏️ [TanStack Mutation] 링크 수정 요청 (경로: users/${targetUid}/links/${id}):`,
        updatedData
      );

      if (!id.startsWith("link-")) {
        const linkDocRef = doc(db, "users", targetUid, "links", id);
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
        return { isFirestoreDoc: true, id, updatedData, targetUid };
      } else {
        await minLoadingDelay(600);
        const nowStr = new Date().toLocaleString("ko-KR");
        return { isFirestoreDoc: false, id, updatedData, nowStr, targetUid };
      }
    },
    onSuccess: async (result) => {
      toast.success("링크가 성공적으로 수정되었습니다!", {
        description: result.updatedData.title,
      });

      if (result.isFirestoreDoc) {
        await queryClient.invalidateQueries({ queryKey: ["links"] });
        await queryClient.invalidateQueries({ queryKey: ["publicProfile"] });
      } else {
        queryClient.setQueriesData<LinkItem[]>(
          { queryKey: ["links"] },
          (old = MOCK_LINKS) =>
            old.map((item) =>
              item.id === result.id
                ? {
                    ...item,
                    ...result.updatedData,
                    updatedAt: result.nowStr,
                  }
                : item
            )
        );
      }
    },
    onError: (err) => {
      console.error("❌ [TanStack Mutation] 링크 수정 실패:", err);
      toast.error("링크 수정 중 오류가 발생했습니다.");
    },
  });
}

/**
 * 4. 링크 삭제 Mutation 훅 (useDeleteLinkMutation)
 */
export function useDeleteLinkMutation() {
  const queryClient = useQueryClient();
  const user = useLinkStore((state) => state.user);

  return useMutation({
    mutationFn: async (id: string) => {
      const currentAuthUid = user?.uid || auth.currentUser?.uid || null;
      const targetUid = await resolveActiveOwnerUid(currentAuthUid);
      console.log(
        `🗑️ [TanStack Mutation] 링크 삭제 요청 (경로: users/${targetUid}/links/${id})`
      );

      if (!id.startsWith("link-")) {
        const linkDocRef = doc(db, "users", targetUid, "links", id);
        await Promise.all([deleteDoc(linkDocRef), minLoadingDelay(600)]);
        return { isFirestoreDoc: true, id, targetUid };
      } else {
        await minLoadingDelay(600);
        return { isFirestoreDoc: false, id, targetUid };
      }
    },
    onSuccess: async (result) => {
      toast.success("링크가 삭제되었습니다.");
      if (result.isFirestoreDoc) {
        await queryClient.invalidateQueries({ queryKey: ["links"] });
        await queryClient.invalidateQueries({ queryKey: ["publicProfile"] });
      } else {
        queryClient.setQueriesData<LinkItem[]>(
          { queryKey: ["links"] },
          (old = MOCK_LINKS) => old.filter((item) => item.id !== result.id)
        );
      }
    },
    onError: (err) => {
      console.error("❌ [TanStack Mutation] 링크 삭제 실패:", err);
      toast.error("링크 삭제 중 오류가 발생했습니다.");
    },
  });
}

/**
 * 5. 링크 클릭 시 클릭 카운트(+1) 저장 Mutation 훅 (useIncrementLinkClickMutation)
 * - 서버/페이지 주인(본인, currentViewerUid === ownerUid)이 클릭했을 때는 클릭 수를 반영하지 않음!
 * - 다른 사용자 또는 비로그인 방문자가 클릭했을 때만 클릭 수를 +1 반영 및 Firestore에 저장
 */
export function useIncrementLinkClickMutation() {
  const queryClient = useQueryClient();
  const user = useLinkStore((state) => state.user);
  const incrementClicksInStore = useLinkStore((state) => state.incrementClicks);

  return useMutation({
    mutationFn: async ({
      id,
      targetUid,
    }: {
      id: string;
      targetUid?: string;
      publicDisplayName?: string;
    }) => {
      const currentViewerUid = auth.currentUser?.uid || user?.uid || null;
      const ownerUid = targetUid || (await resolveActiveOwnerUid(currentViewerUid));

      // 서버 주인(로그인한 본인)이 자신의 링크를 클릭한 경우: 클릭 수 미반영
      if (currentViewerUid && ownerUid && currentViewerUid === ownerUid) {
        console.log(
          `ℹ️ [클릭 카운트 제외] 서버 주인(${currentViewerUid}) 본인의 클릭이므로 클릭 수를 반영하지 않습니다.`
        );
        return { skipped: true, id, uid: ownerUid, isFirestoreDoc: false };
      }

      if (!id.startsWith("link-")) {
        const linkDocRef = doc(db, "users", ownerUid, "links", id);
        await updateDoc(linkDocRef, {
          clicks: increment(1),
        });
        console.log(
          `🔥 [Firestore 클릭 카운트 저장 완료] 경로: users/${ownerUid}/links/${id} (+1)`
        );
        return { skipped: false, id, uid: ownerUid, isFirestoreDoc: true };
      } else {
        // 기본 MOCK_LINKS 클릭 수도 localStorage 및 Firestore(users/{ownerUid}/links/{id})에 함께 저장 시도
        let nextClicks =
          (MOCK_LINKS.find((item) => item.id === id)?.clicks ?? 0) + 1;
        if (typeof window !== "undefined") {
          try {
            const storageKey = `mylink_mock_clicks_${ownerUid}`;
            const raw = window.localStorage.getItem(storageKey);
            const saved: Record<string, number> = raw ? JSON.parse(raw) : {};
            const baseClicks =
              MOCK_LINKS.find((item) => item.id === id)?.clicks ?? 0;
            nextClicks = (saved[id] ?? baseClicks) + 1;
            saved[id] = nextClicks;
            window.localStorage.setItem(storageKey, JSON.stringify(saved));
          } catch {
            // ignore storage error
          }
        }
        try {
          const mockItem = MOCK_LINKS.find((item) => item.id === id);
          if (mockItem) {
            const linkDocRef = doc(db, "users", ownerUid, "links", id);
            await setDoc(
              linkDocRef,
              {
                title: mockItem.title,
                description: mockItem.description,
                url: mockItem.url,
                badge: mockItem.badge,
                iconName: mockItem.iconName || "ExternalLink",
                color: mockItem.color || "#21242e",
                enabled: true,
                clicks: nextClicks,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        } catch {
          // 비로그인 상태에서 create 권한이 제한된 경우 localStorage 값으로 유지
        }
        return { skipped: false, id, uid: ownerUid, isFirestoreDoc: false };
      }
    },

    onMutate: async ({ id, targetUid, publicDisplayName }) => {
      const currentViewerUid = auth.currentUser?.uid || user?.uid || null;
      const ownerUid =
        targetUid ||
        (typeof window !== "undefined"
          ? window.localStorage.getItem("mylink_owner_uid")
          : null) ||
        currentViewerUid;

      // 서버 주인(로그인한 본인)이 클릭한 경우 UI에서도 클릭 수를 올리지 않음
      if (currentViewerUid && ownerUid && currentViewerUid === ownerUid) {
        return { skipped: true };
      }

      // 1. Zustand 스토어 클릭 수 즉시 +1
      incrementClicksInStore(id);

      // 2. 마이페이지 링크 목록 Query 캐시(["links", ...]) 전체에 즉시 +1
      queryClient.setQueriesData<LinkItem[]>(
        { queryKey: ["links"] },
        (old) =>
          old
            ? old.map((item) =>
                item.id === id
                  ? { ...item, clicks: (item.clicks ?? 0) + 1 }
                  : item
              )
            : old
      );

      // 3. 개인 웹페이지(/{displayName}) Query 캐시 즉시 +1
      if (publicDisplayName) {
        queryClient.setQueryData<{
          found: boolean;
          userId: string | null;
          profile: unknown;
          links: LinkItem[];
        }>(["publicProfile", publicDisplayName], (old) =>
          old
            ? {
                ...old,
                links: old.links.map((item) =>
                  item.id === id
                    ? { ...item, clicks: (item.clicks ?? 0) + 1 }
                    : item
                ),
              }
            : old
        );
      }

      return { skipped: false };
    },

    onSuccess: async (result) => {
      if (result && !result.skipped && result.isFirestoreDoc) {
        await queryClient.invalidateQueries({ queryKey: ["links"] });
        await queryClient.invalidateQueries({ queryKey: ["publicProfile"] });
      }
    },

    onError: (err) => {
      console.error("❌ [링크 클릭 카운트 저장 실패]:", err);
    },
  });
}
