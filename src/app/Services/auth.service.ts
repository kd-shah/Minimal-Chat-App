import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = "https://localhost:7034/api/"
  constructor(private http: HttpClient) { }
  register(userObj:any){
    return this.http.post<any>(`${this.baseUrl}register`, userObj)
  }

    login(loginObj:any){
    return this.http.post<any>(`${this.baseUrl}login`, loginObj)
  }

  isLoggedIn(): boolean{
    const token = this.getToken();
    return !!token;
  }

  storeToken(token : string){
    localStorage.setItem('auth-token', token)
  }

  getToken() : string | null{
    return localStorage.getItem('auth-token')
  }

  storeDetails(name: string, id: number){
    localStorage.setItem('user-name', name )
    localStorage.setItem('user-id', id.toString() )
  }

  getName() : string | null{
    return localStorage.getItem('user-name')
  }

  getUserId() : string | null{
    return localStorage.getItem('user-id')
  }

  removetoken() {
    return localStorage.removeItem('auth-token')
  }

}
