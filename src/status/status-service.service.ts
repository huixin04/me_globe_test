import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable,  timer, of,forkJoin  } from 'rxjs';
import { filter, catchError, concatMap, map } from 'rxjs/operators';
import { HttpClient} from '@angular/common/http';
import{LineNotifyService}from'./line-notification.service';
import { EmailService } from './email.service';

@Injectable({
  providedIn: 'root',
})
export class StatusServiceService {

  // private apiUrl = 'https://www.youtube.com/';
  private baseUrl: string = 'http://163.18.42.233:4200/';
  private userScheduledTimesKey = 'userScheduledTimes';


  constructor(private http: HttpClient,
    private LineNotifyService:LineNotifyService,
    // private emailService: EmailService
    ) {}

 // 將使用者指定的時間儲存到本地存儲中
 saveUserScheduledTimes(scheduledTimes: { hours: number; minutes: number; seconds: number }[]): void {
  localStorage.setItem(this.userScheduledTimesKey, JSON.stringify(scheduledTimes));
}

// 從本地存儲中檢索使用者指定的時間
getUserScheduledTimes(): { hours: number; minutes: number; seconds: number }[] {
  const storedData = localStorage.getItem(this.userScheduledTimesKey);
  return storedData ? JSON.parse(storedData) : [];
}

// 自訂特定時間
setUserScheduledTime(hour: number, minute: number, second: number): void {
  const scheduledTimes = this.getUserScheduledTimes();
  scheduledTimes.push({ hours: hour, minutes: minute, seconds: second });
  this.saveUserScheduledTimes(scheduledTimes);

}



  //取得特定URL的HTTP狀態碼
async generateStatusService():Promise<number>{
  const url=`${this.baseUrl}`// 設定要訪問的 URL，這裡使用了類中的 baseUrl 屬性
  try{
    // 發送 HEAD 請求以獲取伺服器回應，並使用 toPromise() 將 Observable 轉換為 Promise
    const response = await this.http.head(url,{observe:'response'}).toPromise();
    if(response){// 如果有回應
      return response.status; // 返回回應的狀態碼
    }else{
      throw new Error('Response is undefined');// 拋出錯誤，指示回應為 undefined
    }
  }catch(error:unknown){ // 捕獲可能的錯誤
    if(error instanceof Error){// 如果是 Error 類型的錯誤
      throw new Error('There was a problem with the fetch operaion'+error.message);// 拋出一般錯誤，包含錯誤訊息
    }else{// 如果是其他類型的錯誤
      throw new Error('An unknown error occurred');// 拋出未知錯誤
    }
  }


}


  // StatusService(): Observable<any> {
  //   console.log('發送 GET 請求至:', this.baseUrl);

  //   return this.http.get(this.baseUrl).pipe(
  //     catchError((error) => {
  //       console.error('在 GET 請求期間發生錯誤:', error);
  //       // 在这里发送电子邮件通知
  //       // this.sendEmailNotification(error).subscribe(
  //       //   (emailResponse) => {
  //       //     console.log('郵件發送成功:', emailResponse);
  //       //   },
  //       //   (emailError) => {
  //       //     console.error('郵件發送失敗:', emailError);
  //       //   }
  //       // );
  //       // 發送 Line Notify 消息
  //       // this.sendLineNotifyMessage(`發生錯誤：${error.message}`).subscribe(
  //       //   () => console.log('Line Notify 消息發送成功。'),
  //       //   (error) => console.error('無法發送 Line Notify 消息：', error)
  //       // );
  //       return throwError(error);
  //     })
  //   );
  // }



  private shouldGenerateReport(): boolean {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    console.log(`Current Time: ${hours}:${minutes}:${seconds}`);
    // 從本地存儲中獲取使用者指定的時間
    const scheduledTimes = this.getUserScheduledTimes();

    // 檢查當前時間是否與任何一個使用者指定的時間匹配
    return scheduledTimes.some(
      (time) => hours === time.hours && minutes === time.minutes && seconds === time.seconds
    );
  }




  // private shouldGenerateReport(): boolean {
  //   const currentDate = new Date();
  //   const hours = currentDate.getHours();
  //   const minutes = currentDate.getMinutes();
  //   const seconds = currentDate.getSeconds();

  //   console.log(`Current Time: ${hours}:${minutes}:${seconds}`);


  //   // 定義多個定時時間
  //   const scheduledTimes = [
  //     { hours: 13, minutes: 53, seconds: 0 },
  //     { hours: 14, minutes: 40, seconds: 0 },
  //   ];

  //   // 檢查是否符合任何一個定時時間
  //   return scheduledTimes.some(
  //     (time) =>
  //       hours === time.hours &&
  //       minutes === time.minutes &&
  //       seconds === time.seconds
  //   );
  // }

//  getStatusService(): Observable<any> {
//     console.log('getStatusService 被呼叫了'); // Debug 訊息

//     // 計算距離下一分鐘的秒數
//     const secondsUntilNextMinute = 60 - new Date().getSeconds();

//     return timer(secondsUntilNextMinute * 1000, 60000).pipe(
//       filter(() => this.shouldGenerateReport()),
//       concatMap(() => {
//         return this.generateStatusService().pipe(
//           catchError((error) => {
//             console.error('在 generateStatusService 中發生錯誤:', error);
//             return of('Error occurred');
//           })
//         );
//       })
//     );
//   }



getStatusService(): Observable<any> {
  console.log('getStatusService 被呼叫了'); // Debug 訊息

  // 計算距離下一分鐘的秒數
  const secondsUntilNextMinute = 60 - new Date().getSeconds();
  // 創建一個 Observable，在下一分鐘開始時發出一個值，然後每分鐘發出一個值
  const timerObservable = timer(secondsUntilNextMinute * 1000, 60000);

  return timerObservable.pipe(
    filter(() => this.shouldGenerateReport()),// 過濾器：檢查是否應該生成報告
    // concatMap(() => {
  //     return from(this.generateStatusService()).pipe(
  //       catchError((error) => {
  //         console.error('在 generateStatusService 中發生錯誤:', error);
  //         return of('Error occurred');


  //       })
  //     );
  //   })
  // );

    // 合併操作符：同時調用 generateStatusService() 和 checkServer() 方法
  concatMap(() => {
    return forkJoin({
      status: this.generateStatusService(), // 調用生成狀態服務方法
      serverCheck: this.checkServer()// 調用檢查伺服器方法
    }).pipe(
      catchError((error) => {// 捕獲錯誤，並返回一個 Observable
        console.error('在 generateStatusService 或 checkServer 中發生錯誤:', error); // 輸出錯誤訊息到控制台
        return of('Error occurred');// 返回一個包含錯誤訊息的 Observable
      })
    );
  })
);
}



  // 方法：檢查伺服器狀態
  checkServerStatus(): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.get(url);
  }

  async checkServer() {
    let response; //定義變數存儲伺服器響應
    let error; //定義變數存儲錯誤

    //嘗試發送請求檢查伺服器狀態
    try {
      response = await this.generateStatusService();
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
       // Sending email notification
      // const errorMessage = 'MeGlobe系統運行失敗'; // You can customize this message
      // this.emailService.sendEmail('System Alert', errorMessage);
    }
  }

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


  // checkStatus(): Observable<any> {
  //   const currentDate = new Date();
  //   console.log('即時檢查時間:', currentDate);

  //   return this.generateStatusService().pipe(
  //     catchError((error) => {
  //       console.error('在 generateStatusService 中發生錯誤:', error);
  //       return of('Error occurred');
  //     })
  //   );
  // }
}
