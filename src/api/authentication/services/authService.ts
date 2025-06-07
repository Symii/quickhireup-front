import axios from 'axios';
import type {
  UserRegisterDto,
  UserLoginDto,
  TokenResponse,
  TokenRequestDto,
} from '@/api/authentication/types/auth';

const API_URL = 'https://localhost:7184/api/account';

export async function register(userData: UserRegisterDto): Promise<void> {
  await axios.post(`${API_URL}/register`, userData);
}

export async function login(credentials: UserLoginDto): Promise<TokenResponse> {
  const response = await axios.post<TokenResponse>(`${API_URL}/login`, credentials);
  return response.data;
}

export async function refreshToken(tokenRequest: TokenRequestDto): Promise<TokenResponse> {
  const response = await axios.post<TokenResponse>(`${API_URL}/refresh-token`, tokenRequest);
  return response.data;
}
