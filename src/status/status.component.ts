import { Component, OnInit } from '@angular/core';
import { StatusServiceService } from './status-service.service';
// import { Observable, timer, of, from } from 'rxjs';
// import { filter, catchError, concatMap } from 'rxjs/operators';
import{LineNotifyService}from'./line-notification.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})

export class StatusComponent implements OnInit {
  statusService!: string;
  generateStatusService: any;

  constructor(private statusServiceService: StatusServiceService,private LineNotifyService:LineNotifyService
    ) { }

  ngOnInit(): void {

    this.statusServiceService.setUserScheduledTime(11, 53, 0);
    this.statusServiceService.setUserScheduledTime(9, 17, 0);
    this.statusServiceService.setUserScheduledTime(8, 10, 0);

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


 //LINE告警
 sendLineNotification(message: string) {this.LineNotifyService.sendLineNotification(message)
  .then(status => {
    console.log('發送通知的狀態碼:', status);
    // 在這裡可以根據 HTTP 狀態碼執行相應的操作
    console.log('系統檢查結果已由Line Notify發送通知');
  })
  .catch(error => {
    console.error('系統檢查結果通知失敗:', error);
    // 處理發送通知失敗的情況
    if (error instanceof Error) {
      console.error('發送 Line Notify 通知時發生錯誤:', error.message);
    } else {
      console.error('未知的錯誤:', error);
    }
  });
}

// //檢查系統狀態
// checkSystemStatus() {
//   this.http.checkSystemStatus().then(status => {
//     console.log('系統正常運行：' + 'current time:' + new Date());
//     console.log('System status:', status);
//     //LINE告警
//     this.sendLineNotification('MeGlobe系統運行成功');
// }).catch(error => {
//     console.error('系統出現問題:', error);
//     console.log('current time:' + new Date());
//     //LINE告警
//     this.sendLineNotification('MeGlobe系統運行失敗');
//   });
// }



  async checkServer() {
    let response; //定義變數存儲伺服器響應
    let error; //定義變數存儲錯誤

    //嘗試發送請求檢查伺服器狀態
    try {
      response = await this.statusServiceService.generateStatusService();
      console.log('訪問的網站正常，狀態碼:', response);
      console.log('System status:', status);
    //LINE告警
      this.sendLineNotification('MeGlobe系統運行成功');

      //如果發生錯誤，捕獲錯誤並記錄在 error 變數中
    } catch (e) {
      error = e instanceof Error ? e : new Error('未知錯誤');
      console.error('訪問的網站發生錯誤:', error.message);
      console.log('current time:' + new Date());
     //LINE告警
      this.sendLineNotification('MeGlobe系統運行失敗');
    }
  }


  }





