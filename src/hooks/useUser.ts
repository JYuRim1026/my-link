"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useLinkStore, UserProfile } from "@/store/useLinkStore";

/**
 * 로그인 상태 유지를 위한 useUser 커스텀 훅
 * - Firebase Auth 로그인 상태 감지
 * - Firestore users/{uid} 프로필 실시간 동기화 (onSnapshot)
 * - 사용자 프로필 초기화 시 displayName을 이메일 아이디(@ 앞부분)로 설정
 */
export function useUser() {
  const user = useLinkStore((state) => state.user);
  const authLoading = useLinkStore((state) => state.authLoading);
  const loginWithGoogle = useLinkStore((state) => state.loginWithGoogle);
  const logout = useLinkStore((state) => state.logout);
  const fetchLinks = useLinkStore((state) => state.fetchLinks);

  const [profile, setProfile] = useState<UserProfile | null>(user);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (!firebaseUser) {
        useLinkStore.setState({ user: null, authLoading: false });
        setProfile(null);
        return;
      }

      // 이메일 아이디(@ 앞부분)를 기본 displayName으로 설정
      const emailPrefix = firebaseUser.email
        ? firebaseUser.email.split("@")[0]
        : firebaseUser.displayName || "user";

      const userDocRef = doc(db, "users", firebaseUser.uid);

      // Firestore 프로필 문서 실시간 동기화 (onSnapshot)
      unsubscribeProfile = onSnapshot(
        userDocRef,
        async (docSnap) => {
          if (!docSnap.exists()) {
            const initialProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: emailPrefix,
              displayName: emailPrefix,
              email: firebaseUser.email || "",
              photoURL: firebaseUser.photoURL || "/avatar.jpg",
            };

            try {
              await setDoc(
                userDocRef,
                {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || "",
                  displayName: emailPrefix,
                  photoURL: firebaseUser.photoURL || "",
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp(),
                },
                { merge: true }
              );
            } catch (err) {
              console.error("❌ [useUser] 초기 프로필 생성 실패:", err);
            }

            useLinkStore.setState({ user: initialProfile, authLoading: false });
            setProfile(initialProfile);
          } else {
            const data = docSnap.data();
            const syncedDisplayName = data.displayName || emailPrefix;
            const syncedProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: syncedDisplayName,
              displayName: syncedDisplayName,
              role: data.role || "Backend & Server Engineer",
              bio:
                data.bio ||
                "안정적인 백엔드 시스템과 99.9% 업타임의 서버 아키텍처를 구축하는 개발자입니다.",
              email: data.email || firebaseUser.email || "",
              photoURL: data.photoURL || firebaseUser.photoURL || "/avatar.jpg",
            };

            useLinkStore.setState({ user: syncedProfile, authLoading: false });
            setProfile(syncedProfile);
          }
        },
        (err) => {
          console.error("❌ [useUser] 프로필 실시간 동기화 에러:", err);
          const fallbackProfile: UserProfile = {
            uid: firebaseUser.uid,
            name: emailPrefix,
            displayName: emailPrefix,
            email: firebaseUser.email || "",
            photoURL: firebaseUser.photoURL || "/avatar.jpg",
          };
          useLinkStore.setState({ user: fallbackProfile, authLoading: false });
          setProfile(fallbackProfile);
        }
      );

      // 로그인된 사용자의 개인화 링크 목록(users/{uid}/links) 조회
      await fetchLinks();
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, [fetchLinks]);

  return {
    user: profile || user,
    loading: authLoading,
    loginWithGoogle,
    logout,
  };
}
