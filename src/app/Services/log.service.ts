import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private baseUrl: string = "https://localhost:7034/api/"
  constructor(private http: HttpClient) { }
  
  getLogs() {
    return this.http.get<any>(`${this.baseUrl}log`);
  }
}
