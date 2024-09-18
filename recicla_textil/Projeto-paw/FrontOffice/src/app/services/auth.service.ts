import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  setToken(token: string) {
    try {
      localStorage.setItem('token', token);
      return true;
    } catch (error) {
      return null;
    }
  }

  clearToken() {
    try {
      localStorage.removeItem('token');
      return true;
    } catch (error) {
      return null;
    }
  }

  getToken() {
    try {
      const token = localStorage.getItem('token');
      return token;
    } catch (error) {
      return null;
    }
  }

  getEmail() {
    const decoded = this.getDecodedToken();
    if (decoded === null) {
      return null;
    }

    try {
      const decodedEmail = (decoded as any).email;
      return decodedEmail;
    } catch (error) {
      return null;
    }
  }

  getDecodedToken() {
    const token = this.getToken();
    if (token === null) {
      return null;
    }

    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      return null;
    }
  }

  getRole() {
    const decoded = this.getDecodedToken();
    if (decoded === null) {
      return null;
    }

    try {
      const decodedRole = (decoded as any).role;
      return decodedRole;
    } catch (error) {
      return null;
    }
  }

  logout() {
    this.clearToken();
    this.router.navigate(['/login']);
  }
}
