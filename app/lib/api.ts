import axios from "axios";

const API_URL = process.env.SERVER_URL || "http://localhost:4000/";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (name: string, email: string, password: string) =>
  api.post<{
    success: boolean;
    token: string;
    user: { id: string; name: string; email: string };
  }>("/auth/register", { name, email, password });

export const login = (email: string, password: string) =>
  api.post<{
    success: boolean;
    token: string;
    user: { id: string; name: string; email: string };
  }>("/auth/login", { email, password });

export const getProfile = () =>
  api.get<{
    success: boolean;
    user: { id: string; name: string; email: string };
  }>("/auth/profile");

export const getServices = () =>
  api.get<{
    success: boolean;
    data: { id: string; name: string; description: string; price: number }[];
  }>("/services");

export const saveBuild = (
  carModel: string,
  color: string,
  selectedParts: Record<string, string>,
) =>
  api.post<{
    success: boolean;
    data: {
      id: string;
      userId: string;
      carModel: string;
      color: string;
      selectedParts: Record<string, string>;
      createdAt: string;
    };
  }>("/builds", { carModel, color, selectedParts });

export const getBuilds = (userId: string) =>
  api.get<{
    success: boolean;
    data: {
      id: string;
      userId: string;
      carModel: string;
      color: string;
      selectedParts: Record<string, string>;
      createdAt: string;
    }[];
  }>(`/builds/${userId}`);
