import axios from "axios";
import useSWR from "swr";
import { UserProfile } from "@/infrastructure/interfaces/profile.interface";

const fetchProfile = async (url: string): Promise<UserProfile> => {
  const response = await axios.get<{ result: UserProfile }>(url);
  return response.data.result;
};

export const getProfileKey = (userId?: number | null): string | null => {
  if (!userId || !Number.isFinite(userId)) return null;
  return `/api/usuario/${userId}/perfil`;
};

export const useProfileData = (userId?: number | null) => {
  const { data, error, isLoading, mutate } = useSWR(getProfileKey(userId), fetchProfile, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: false,
  });

  return {
    profile: data,
    error,
    loading: isLoading,
    mutateProfile: mutate,
  };
};
