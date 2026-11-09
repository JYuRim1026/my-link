"use client";

import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MOCK_LINKS, LinkItem } from "@/data/mockLinks";
import { UserProfile } from "@/store/useLinkStore";

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

export interface PublicProfileData {
  found: boolean;
  userId: string | null;
  profile: UserProfile | null;
  links: LinkItem[];
}

/**
 * /{displayName} 동적 라우팅 페이지용 단발성 조회 Query 훅
 * 1. users 컬렉션에서 where("displayName", "==", displayName)으로 유저(userId) 검색
 * 2. 해당 유저가 존재하면 users/{userId}/links 컬렉션에서 링크 목록 조회
 * 3. 유저가 없으면 found: false 반환 -> 404 페이지 처리
 */
export function usePublicProfileQuery(rawDisplayName: string) {
  const decodedDisplayName = decodeURIComponent(rawDisplayName || "").trim();

  return useQuery<PublicProfileData>({
    queryKey: ["publicProfile", decodedDisplayName],
    enabled: !!decodedDisplayName,
    queryFn: async () => {
      console.log(
        `🔍 [Public Profile] displayName으로 유저 검색 시작: "${decodedDisplayName}"`
      );

      // 1. displayName으로 users 컬렉션에서 유저 검색 (where 쿼리)
      const usersRef = collection(db, "users");
      const userQuery = query(
        usersRef,
        where("displayName", "==", decodedDisplayName)
      );
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        console.warn(
          `⚠️ [Public Profile] "${decodedDisplayName}" displayName을 가진 유저를 찾을 수 없습니다 (404).`
        );
        return {
          found: false,
          userId: null,
          profile: null,
          links: [],
        };
      }

      const userDoc = userSnapshot.docs[0];
      const userId = userDoc.id;
      const userData = userDoc.data();

      const profile: UserProfile = {
        uid: userId,
        name: userData.displayName || decodedDisplayName,
        displayName: userData.displayName || decodedDisplayName,
        role: userData.role || "Backend & Server Engineer",
        bio:
          userData.bio ||
          "안정적인 백엔드 시스템과 99.9% 업타임의 서버 아키텍처를 구축하는 개발자입니다.",
        email: userData.email || "",
        photoURL: userData.photoURL || "/avatar.jpg",
      };

      // 2. users/{userId}/links 컬렉션에서 해당 유저의 링크 목록 단발성 조회
      const linksRef = collection(db, "users", userId, "links");
      const linksQuery = query(linksRef, orderBy("createdAt", "desc"));
      const linksSnapshot = await getDocs(linksQuery);

      const fetchedLinks: LinkItem[] = linksSnapshot.docs.map((docSnap) => {
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

      console.log(
        `✅ [Public Profile] 유저(${userId}) 및 링크(${mergedLinks.length}개) 조회 완료`
      );

      return {
        found: true,
        userId,
        profile,
        links: mergedLinks,
      };
    },
  });
}
