import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  Token?: string; // Backend'den gelen property
  role: string;
  Role?: string; // Backend'den gelen property
  fullName: string;
  FullName?: string; // Backend'den gelen property
  userId: string;
  UserId?: string | Guid; // Backend'den gelen property
}

type Guid = string;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        // Backend'den gelen response'u normalize et (PascalCase -> camelCase)
        const normalizedResponse: LoginResponse = {
          token: response.Token || response.token || '',
          role: response.Role || response.role || '',
          fullName: response.FullName || response.fullName || '',
          userId: (response.UserId || response.userId)?.toString() || ''
        };
        
        // LocalStorage'a kaydet
        if (normalizedResponse.token) {
          localStorage.setItem('token', normalizedResponse.token);
          localStorage.setItem('role', normalizedResponse.role);
          localStorage.setItem('fullName', normalizedResponse.fullName);
          localStorage.setItem('userId', normalizedResponse.userId);
        }
        
        return normalizedResponse;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    localStorage.removeItem('userId');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getFullName(): string | null {
    return localStorage.getItem('fullName');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    return this.getRole() === role;
  }
}

