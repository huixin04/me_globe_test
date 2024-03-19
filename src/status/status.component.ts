import { Component, OnInit } from '@angular/core';
import { StatusServiceService } from './status-service.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})

export class StatusComponent implements OnInit {
  statusService!: string;
  constructor(private statusServiceService: StatusServiceService) { }

  ngOnInit(): void {
    this.statusServiceService.getStatusService().subscribe(report => {
      console.log('系統狀態:', report);
    });
  }


  checkStatus(): void {
    // 即時檢查
    this.statusServiceService.checkStatus().subscribe(report => {
      this.statusService = report;
    });
  }

}
