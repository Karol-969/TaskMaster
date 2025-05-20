import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phone?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  phone?: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const res = await apiRequest("POST", "/api/auth/login", credentials);
  const user = await res.json();
  queryClient.setQueryData(["/api/auth/me"], user);
  return user;
}

export async function register(data: RegisterData): Promise<User> {
  const res = await apiRequest("POST", "/api/auth/register", data);
  return await res.json();
}

export async function logout(): Promise<void> {
  await apiRequest("POST", "/api/auth/logout");
  queryClient.setQueryData(["/api/auth/me"], null);
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        return null;
      }
      throw new Error("Failed to fetch user data");
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export function useAuth() {
  return {
    login,
    register,
    logout,
    fetchCurrentUser
  };
}
