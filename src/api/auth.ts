import axios from "axios";
import type { LoginRequest, LoginResponse } from "../types/Auth";

const API_URL = "http://localhost:8080";

export async function login(
  data: LoginRequest
): Promise<LoginResponse> {

  const response = await axios.post<LoginResponse>(
    `${API_URL}/auth`,
    data
  );

  return response.data;
}