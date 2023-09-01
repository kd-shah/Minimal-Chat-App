import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/Services/log.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit{
  
  selectedTimeframe: string = '5';
  customTimeRange: any[] = []; // Custom time range [startDate, endDate]
  columns: string[] = ['timestamp', 'message', 'level']; // Define your columns here
  selectedColumns: { [key: string]: boolean } = {};
  
  
  logs: any[] | null = null;
  
  constructor(private log : LogService) {  }

  ngOnInit(): void {
    this.log.getLogs()
    .subscribe(response => {
      this.logs= response;
    })
  }
}
