import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private baseUrl: string = "https://localhost:7034/api/"
  constructor(private http: HttpClient) { }

  getMessages(userId : any){
    return this.http.get<any>(`${this.baseUrl}messages?userId=${userId}`)
  }
}
