import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoginRequest, RegisterRequest, AuthResponse, AuthenticationState } from '../model/auth.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<AuthenticationState>({
    isAuthenticated: false
  });

  constructor(private http: HttpClient) {
    this.loadAuthStateFromStorage();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = error.error.message;
    } else {
      // Erreur côté serveur
      if (error.status === 401) {
        errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
      } else if (error.status === 400) {
        errorMessage = error.error.message || 'Données invalides';
      } else if (error.status === 409) {
        errorMessage = 'Cet utilisateur existe déjà';
      }
    }
    return throwError(() => errorMessage);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.backendHost}/auth/login`, request)
      .pipe(
        tap(response => {
          const newState: AuthenticationState = {
            isAuthenticated: true,
            username: response.username,
            roles: response.roles,
            token: response.token
          };
          this.authState.next(newState);
          localStorage.setItem('authState', JSON.stringify(newState));
        }),
        catchError(this.handleError)
      );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.backendHost}/auth/register`, request)
      .pipe(
        tap(response => {
          const newState: AuthenticationState = {
            isAuthenticated: true,
            username: response.username,
            roles: response.roles,
            token: response.token
          };
          this.authState.next(newState);
          localStorage.setItem('authState', JSON.stringify(newState));
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.authState.next({ isAuthenticated: false });
    localStorage.removeItem('authState');
  }

  isAuthenticated(): boolean {
    return this.authState.value.isAuthenticated;
  }

  private loadAuthStateFromStorage(): void {
    const storedState = localStorage.getItem('authState');
    if (storedState) {
      try {
        const state = JSON.parse(storedState);
        this.authState.next(state);
      } catch (error) {
        console.error('Error parsing stored auth state:', error);
        localStorage.removeItem('authState');
      }
    }
  }

  getAuthState(): Observable<AuthenticationState> {
    return this.authState.asObservable();
  }

  getAuthToken(): string | undefined {
    return this.authState.value.token;
  }
}
