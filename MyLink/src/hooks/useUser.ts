"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { auth, db } from "@/lib/firebase";
import { useLinkStore, UserProfile } from "@/store/useLinkStore";

/**
 * 1. 로그인 상태 유지 및 프로필 조회를 위한 useUser 커스텀 훅 (실시간 onSnapshot 제거, TanStack Query 적용)
 * - Firebase Auth 로그인 상태 감지
 * - TanStack Query(useQuery + getDoc)로 Firestore users/{uid} 단발성 조회
 * - 사용자 프로필 초기화 시 displayName을 이메일 아이디(@ 앞부분)로 설정
 */
export function useUser() {
  const queryClient = useQueryClient();
  const user = useLinkStore((state) => state.user);
  const authLoading = useLinkStore((state) => state.authLoading);
  const loginWithGoogle = useLinkStore((state) => state.loginWithGoogle);
  const logout = useLinkStore((state) => state.logout);

  // Firebase Auth 상태 감지 (실시간 DB 리스너 없이 인증 세션만 확인)
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        useLinkStore.setState({ user: null, authLoading: false });
        queryClient.setQueryData(["userProfile", "guest"], null);
        return;
      }

      const emailPrefix = firebaseUser.email
        ? firebaseUser.email.split("@")[0]
        : firebaseUser.displayName || "user";

      if (typeof window !== "undefined") {
        window.localStorage.setItem("mylink_owner_uid", firebaseUser.uid);
      }

      // 우선 Auth 기본 정보로 세팅 후 useQuery가 Firestore 문서를 단발성(getDoc)으로 조회
      const currentAuthProfile: UserProfile = {
        uid: firebaseUser.uid,
        name: emailPrefix,
        displayName: emailPrefix,
        role: "Backend & Server Engineer",
        bio: "안정적인 백엔드 시스템과 99.9% 업타임의 서버 아키텍처를 구축하는 개발자입니다.",
        email: firebaseUser.email || "",
        photoURL: firebaseUser.photoURL || "/avatar.jpg",
      };

      useLinkStore.setState((state) => ({
        user: state.user?.uid === firebaseUser.uid ? state.user : currentAuthProfile,
        authLoading: false,
      }));
    });

    return () => unsubscribeAuth();
  }, [queryClient]);

  const uid = user?.uid || auth.currentUser?.uid;

  // TanStack Query로 사용자 프로필 단발성 조회 (onSnapshot 미사용)
  const profileQuery = useQuery<UserProfile | null>({
    queryKey: ["userProfile", uid || "guest"],
    enabled: !!uid,
    queryFn: async () => {
      const currentUser = auth.currentUser || user;
      if (!currentUser) return null;

      const emailPrefix = currentUser.email
        ? currentUser.email.split("@")[0]
        : "displayName" in currentUser && currentUser.displayName
        ? currentUser.displayName
        : "user";

      const userDocRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        const initialProfile: UserProfile = {
          uid: currentUser.uid,
          name: emailPrefix,
          displayName: emailPrefix,
          role: "Backend & Server Engineer",
          bio: "안정적인 백엔드 시스템과 99.9% 업타임의 서버 아키텍처를 구축하는 개발자입니다.",
          email: currentUser.email || "",
          photoURL: currentUser.photoURL || "/avatar.jpg",
        };

        await setDoc(
          userDocRef,
          {
            uid: currentUser.uid,
            email: currentUser.email || "",
            displayName: emailPrefix,
            role: initialProfile.role,
            bio: initialProfile.bio,
            photoURL: currentUser.photoURL || "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        useLinkStore.setState({ user: initialProfile });
        return initialProfile;
      }

      const data = docSnap.data();
      const syncedDisplayName = data.displayName || emailPrefix;
      const loadedProfile: UserProfile = {
        uid: currentUser.uid,
        name: syncedDisplayName,
        displayName: syncedDisplayName,
        role: data.role || "Backend & Server Engineer",
        bio:
          data.bio ||
          "안정적인 백엔드 시스템과 99.9% 업타임의 서버 아키텍처를 구축하는 개발자입니다.",
        email: data.email || currentUser.email || "",
        photoURL: data.photoURL || currentUser.photoURL || "/avatar.jpg",
      };

      useLinkStore.setState({ user: loadedProfile });
      return loadedProfile;
    },
  });

  return {
    user: profileQuery.data || user,
    loading: authLoading,
    loginWithGoogle,
    logout,
  };
}

/**
 * 2. 프로필 수정 Mutation 훅 (낙관적 업데이트 Optimistic Update 적용)
 * - onMutate에서 서버 응답 전에 UI(Query 캐시 & Zustand 스토어)를 즉시 업데이트
 * - 에러 발생 시 onError에서 이전 프로필 데이터로 자동 롤백(Rollback)
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const checkDisplayNameDuplicate = useLinkStore(
    (state) => state.checkDisplayNameDuplicate
  );

  return useMutation({
    mutationFn: async (profileData: {
      displayName: string;
      role?: string;
      bio?: string;
    }) => {
      const currentUser = useLinkStore.getState().user || auth.currentUser;
      if (!currentUser) throw new Error("로그인이 필요합니다.");

      const trimmedName = profileData.displayName.trim();
      const trimmedRole =
        profileData.role !== undefined
          ? profileData.role.trim()
          : (currentUser as UserProfile).role || "Backend & Server Engineer";
      const trimmedBio =
        profileData.bio !== undefined
          ? profileData.bio.trim()
          : (currentUser as UserProfile).bio ||
            "안정적인 백엔드 시스템과 99.9% 업타임의 서버 아키텍처를 구축하는 개발자입니다.";

      // 중복 확인 검증
      const isDup = await checkDisplayNameDuplicate(trimmedName);
      if (isDup) {
        throw new Error("DUPLICATE_DISPLAY_NAME");
      }

      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(
        userDocRef,
        {
          displayName: trimmedName,
          role: trimmedRole,
          bio: trimmedBio,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      return {
        uid: currentUser.uid,
        displayName: trimmedName,
        role: trimmedRole,
        bio: trimmedBio,
      };
    },

    // ⚡ 낙관적 업데이트 (Optimistic Update)
    onMutate: async (newProfileData) => {
      const currentUser = useLinkStore.getState().user;
      const uid = currentUser?.uid || auth.currentUser?.uid || "guest";
      const queryKey = ["userProfile", uid];

      // 1. 진행 중인 프로필 refetch 취소 (낙관적 상태를 덮어쓰지 않도록)
      await queryClient.cancelQueries({ queryKey });

      // 2. 롤백을 위해 이전 프로필 스냅샷 저장
      const previousProfile =
        queryClient.getQueryData<UserProfile | null>(queryKey) || currentUser;

      // 3. 새로운 프로필 값으로 Query 캐시 및 Zustand 스토어를 즉시(낙관적) 업데이트
      if (previousProfile) {
        const optimisticProfile: UserProfile = {
          ...previousProfile,
          name: newProfileData.displayName.trim(),
          displayName: newProfileData.displayName.trim(),
          role:
            newProfileData.role !== undefined
              ? newProfileData.role.trim()
              : previousProfile.role,
          bio:
            newProfileData.bio !== undefined
              ? newProfileData.bio.trim()
              : previousProfile.bio,
        };

        console.log(
          "⚡ [Optimistic Update] 서버 응답 전 프로필 UI 즉시 반영:",
          optimisticProfile
        );
        queryClient.setQueryData(queryKey, optimisticProfile);
        useLinkStore.setState({ user: optimisticProfile });
      }

      return { previousProfile, queryKey };
    },

    // ❌ 에러 발생 시 이전 프로필 상태로 롤백 (Rollback)
    onError: (err, _newProfile, context) => {
      if (context?.previousProfile) {
        console.warn(
          "↩️ [Optimistic Rollback] 프로필 업데이트 실패로 이전 상태 복원:",
          context.previousProfile
        );
        queryClient.setQueryData(context.queryKey, context.previousProfile);
        useLinkStore.setState({ user: context.previousProfile });
      }

      if (err instanceof Error && err.message === "DUPLICATE_DISPLAY_NAME") {
        toast.error("이미 사용 중인 닉네임(displayName)입니다.");
      } else {
        toast.error("프로필 수정에 실패하여 이전 상태로 복구되었습니다.");
      }
    },

    // ✅ 성공 안내
    onSuccess: (data) => {
      console.log(
        `✅ [Firestore 프로필 저장 완료] users/${data.uid} 동기화 성공`
      );
      toast.success("프로필 업데이트가 진행되었습니다.", {
        description: `닉네임: ${data.displayName}`,
      });
    },

    // 🔄 완료 후 서버 데이터와 최종 정합성 맞추기
    onSettled: (_data, _error, _variables, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });
}
