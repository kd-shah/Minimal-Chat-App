import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private baseUrl: string = "https://localhost:7034/api/"
  constructor(private http: HttpClient) { }
  
  getLogs(selectedTimeframe: string, startTime : string, endTime : string) {
    
    let params = new HttpParams();

    if (selectedTimeframe === 'custom') {
      params = params.set('timeframe', selectedTimeframe);
      params = params.set('startTime', startTime);
      params = params.set('endTime', endTime);
    } else {
      params = params.set('timeframe', selectedTimeframe);
    }

    return this.http.get<any[]>(`${this.baseUrl}log`, { params });

    
  }
}
