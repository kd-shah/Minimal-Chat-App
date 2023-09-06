import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageResponse } from './model';
import { SendMessageRequest } from './model';
import { EditMessageRequest } from './model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private baseUrl: string = "https://localhost:7034/api/"

  constructor(private http: HttpClient) { }


  getMessages(userId: number, beforeTimestamp?: string | null) {

    let url = `${this.baseUrl}messages?userId=${userId}`;
    if (beforeTimestamp) {
      url += `&before=${beforeTimestamp}`;
    }
    return this.http.get<MessageResponse[]>(url);
  }

  receiverId!: number;

  sendMessages(userId: number, content: string) {
    const requestBody = { content: content };
    return this.http.post<SendMessageRequest>(`${this.baseUrl}messages?receiverId=${userId}`, requestBody)
  }

  editMessage(messageId: number, content: string) {
    const requestBody = { content: content };
    return this.http.put<EditMessageRequest>(`${this.baseUrl}messages/${messageId}`, requestBody)
  }

  deleteMessage(messageId: number) {
    return this.http.delete<number>(`${this.baseUrl}messages/${messageId}`)
  }
} 
