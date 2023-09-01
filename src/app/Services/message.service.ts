import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private baseUrl: string = "https://localhost:7034/api/"

  private messageCreatedSubject = new Subject<any>();

  messageCreated$ = this.messageCreatedSubject.asObservable();

  private messageEditedSubject = new Subject<any>();

  messageEdited$ = this.messageEditedSubject.asObservable();


  constructor(private http: HttpClient) { }

  getMessages(userId: number) {
    return this.http.get<any>(`${this.baseUrl}messages?userId=${userId}`)
  }

  receiverId: number | null = null;

  // sendMessages(userId: number | null, content: any) {
  //   const requestBody = { content: content };
  //   return this.http.post<any>(`${this.baseUrl}messages?receiverId=${userId}`, requestBody)
  //     .pipe(
  //       tap((response: any) => {
  //         this.messageCreatedSubject.next(response);
  //       }),
  //       catchError((error: any) => {
  //         console.error('Error sending message:', error);
  //         throw error; // Rethrow the error
  //       })
  //     );
  // }

  sendMessages(userId: number | null, content: any) {
    const requestBody = { content: content };
    return this.http.post<any>(`${this.baseUrl}messages?receiverId=${userId}`, requestBody)
  }

  // editMessage(id: number | null, content: any) {
  //   const requestBody = { content: content };
  //   return this.http.put<any>(`${this.baseUrl}messages/${id}`, requestBody)
  //     .pipe(
  //       tap((response: any) => {
  //         this.messageEditedSubject.next(response);
  //       })
  //     );
  // }

  editMessage(id: number | null, content: any) {
    const requestBody = { content: content };
    return this.http.put<any>(`${this.baseUrl}messages/${id}`, requestBody)
  }

  deleteMessage(id: number){
    return this.http.delete<any>(`${this.baseUrl}messages/${id}`)
  }
} 
