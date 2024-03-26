import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, throwError, timer, of, from } from 'rxjs';
import { filter, catchError, concatMap, map } from 'rxjs/operators';
import { HttpClient} from '@angular/common/http';
import { LineBotService } from './line-notification.service';

@Injectable({
  providedIn: 'root',
})
export class StatusServiceService {

  // private apiUrl = 'https://www.youtube.com/';
  private baseUrl: string = 'http://163.18.42.233:4200/';
  private userScheduledTimesKey = 'userScheduledTimes';


  constructor(private http: HttpClient,
    private LineBotService:LineBotService) {}

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
  const url=`${this.baseUrl}`
  try{
    const response = await this.http.head(url,{observe:'response'}).toPromise();
    if(response){
      return response.status;
    }else{
      throw new Error('Response is undefined');
    }
  }catch(error:unknown){
    if(error instanceof Error){
      throw new Error('There was a problem with the fetch operaion'+error.message);
    }else{
      throw new Error('An unknown error occurred');
    }
  }

}





  // StatusService(): Observable<any> {
  //   console.log('發送 GET 請求至:', this.baseUrl);

  //   return this.http.get(this.baseUrl).pipe(
  //     catchError((error) => {
  //       console.error('在 GET 請求期間發生錯誤:', error);
  //       // 在这里发送电子邮件通知
  //       this.sendEmailNotification(error).subscribe(
  //         (emailResponse) => {
  //           console.log('郵件發送成功:', emailResponse);
  //         },
  //         (emailError) => {
  //           console.error('郵件發送失敗:', emailError);
  //         }
  //       );
  //       // 發送 Line Notify 消息
  //       // this.sendLineNotifyMessage(`發生錯誤：${error.message}`).subscribe(
  //       //   () => console.log('Line Notify 消息發送成功。'),
  //       //   (error) => console.error('無法發送 Line Notify 消息：', error)
  //       // );
  //       return throwError(error);
  //     })
  //   );
  // }




  // //寄送email通知
  // private sendEmailNotification(error: any): Observable<any> {
  //   const errorMessage = `發生錯誤: ${error.message}`;

  //   //建構請求的body
  //   const emailData = {
  //     to: 'C110118236@nkust.edu.tw', // 收件人電子郵件
  //     subject: '錯誤通知', // 郵件主题
  //     body: errorMessage, // 郵件正文
  //   };
  //   //發送post請求
  //   return this.http.post(this.baseUrl, emailData);
  // }

  // //line
  // sendLineNotifyMessage(message: string): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //     //使用存取權杖進行授權
  //     Authorization: `Bearer ${this.lineAccessToken}`,
  //     'Access-Control-Allow-Origin': '*', // 允許跨域請求
  //     'Access-Control-Allow-Credentials': 'true', // 允許跨域請求包含 Cookie 或其他憑據
  //   });

  //   const body = new URLSearchParams();
  //   body.set('message', message);

  //   return this.http.post(this.lineNotifyUrl, body.toString(), { headers });
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
  const timerObservable = timer(secondsUntilNextMinute * 1000, 60000);

  return timerObservable.pipe(
    filter(() => this.shouldGenerateReport()),
    concatMap(() => {
      return from(this.generateStatusService()).pipe(
        catchError((error) => {
          console.error('在 generateStatusService 中發生錯誤:', error);
          return of('Error occurred');


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
