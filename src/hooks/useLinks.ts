"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
 * 1. 사용자별 링크 목록 조회 Query 훅 (useLinksQuery)
 * - 경로: users/{uid}/links (createdAt desc 정렬)
 */
export function useLinksQuery() {
  const user = useLinkStore((state) => state.user);
  const uid = user?.uid || auth.currentUser?.uid;

  return useQuery<LinkItem[]>({
    queryKey: ["links", uid || "guest"],
    enabled: !!uid,
    queryFn: async () => {
      if (!uid) return MOCK_LINKS;

      console.log(
        `📥 [TanStack Query] Firestore 링크 목록 조회 시작 (경로: users/${uid}/links)`
      );
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

      const mergedLinks = [...fetchedLinks, ...MOCK_LINKS];
      // 헤더 드롭다운 통계 등과의 호환을 위해 store의 links도 동기화
      useLinkStore.setState({ links: mergedLinks });

      console.log(
        `✅ [TanStack Query] 링크 목록 조회 완료 (users/${uid}/links, ${fetchedLinks.length}개):`,
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
      const uid = user?.uid || auth.currentUser?.uid || "anonymous";
      console.log(
        `➕ [TanStack Mutation] 링크 추가 요청 (경로: users/${uid}/links):`,
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

      const linksCollectionRef = collection(db, "users", uid, "links");
      const [docRef] = await Promise.all([
        addDoc(linksCollectionRef, payload),
        minLoadingDelay(600),
      ]);

      console.log(
        `✅ [TanStack Mutation] 링크 추가 완료 (문서 ID: users/${uid}/links/${docRef.id})`
      );
      return { docId: docRef.id, linkData, uid };
    },
    onSuccess: async ({ linkData, uid }) => {
      toast.success("새 링크가 추가되었습니다!", {
        description: linkData.title,
      });
      // 캐시 무효화 및 최신 목록 자동 갱신(Refetch)
      await queryClient.invalidateQueries({ queryKey: ["links", uid] });
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
      const uid = user?.uid || auth.currentUser?.uid || "anonymous";
      console.log(
        `✏️ [TanStack Mutation] 링크 수정 요청 (경로: users/${uid}/links/${id}):`,
        updatedData
      );

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
        return { isFirestoreDoc: true, id, updatedData, uid };
      } else {
        await minLoadingDelay(600);
        const nowStr = new Date().toLocaleString("ko-KR");
        return { isFirestoreDoc: false, id, updatedData, nowStr, uid };
      }
    },
    onSuccess: async (result) => {
      toast.success("링크가 성공적으로 수정되었습니다!", {
        description: result.updatedData.title,
      });

      if (result.isFirestoreDoc) {
        await queryClient.invalidateQueries({
          queryKey: ["links", result.uid],
        });
      } else {
        // 기본 MOCK_LINKS 항목 수정 시 쿼리 캐시 및 스토어 반영
        queryClient.setQueryData<LinkItem[]>(
          ["links", result.uid],
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
      const uid = user?.uid || auth.currentUser?.uid || "anonymous";
      console.log(
        `🗑️ [TanStack Mutation] 링크 삭제 요청 (경로: users/${uid}/links/${id})`
      );

      if (!id.startsWith("link-")) {
        const linkDocRef = doc(db, "users", uid, "links", id);
        await Promise.all([deleteDoc(linkDocRef), minLoadingDelay(600)]);
        return { isFirestoreDoc: true, id, uid };
      } else {
        await minLoadingDelay(600);
        return { isFirestoreDoc: false, id, uid };
      }
    },
    onSuccess: async (result) => {
      toast.success("링크가 삭제되었습니다.");
      if (result.isFirestoreDoc) {
        await queryClient.invalidateQueries({
          queryKey: ["links", result.uid],
        });
      } else {
        queryClient.setQueryData<LinkItem[]>(
          ["links", result.uid],
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
