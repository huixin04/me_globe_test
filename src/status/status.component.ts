import { Component, OnInit } from '@angular/core';
import { StatusServiceService } from './status-service.service';
// import { Observable, timer, of, from } from 'rxjs';
// import { filter, catchError, concatMap } from 'rxjs/operators';
// import { LineNotificationService } from './line-notification.service';
@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})

export class StatusComponent implements OnInit {
  statusService!: string;
  generateStatusService: any;
  constructor(private statusServiceService: StatusServiceService) { }

  ngOnInit(): void {

    this.statusServiceService.setUserScheduledTime(22, 48, 0);
    this.statusServiceService.setUserScheduledTime(22, 49, 0);
    this.statusServiceService.setUserScheduledTime(16, 45, 0);

    this.statusServiceService.getStatusService().subscribe(report => {
      console.log('系統狀態:', report);
    });

  }


  // checkStatus(): void {
  //   // 即時檢查
  //   this.statusServiceService.checkStatus().subscribe(report => {
  //     this.statusService = report;
  //   });
  // }
  //檢查的方法


  // sendNotificationToLine(): void {
  //   const message = 'Hello, this is a Line notification!';
  //   this.lineNotificationService.sendLineNotification(message).subscribe(
  //     (response) => {
  //       console.log('Line Notification Sent:', response);
  //     },
  //     (error) => {
  //       console.error('Error sending Line Notification:', error);
  //     }
  //   );
  // }

  async checkServer() {
    let response; //定義變數存儲伺服器響應
    let error; //定義變數存儲錯誤

    //嘗試發送請求檢查伺服器狀態
    try {
      response = await this.statusServiceService.generateStatusService();
      console.log('訪問的網站正常，狀態碼:', response);
      //如果發生錯誤，捕獲錯誤並記錄在 error 變數中
    } catch (e) {
      error = e instanceof Error ? e : new Error('未知錯誤');
      console.error('訪問的網站發生錯誤:', error.message);
    } finally {

    }
  }


  }





