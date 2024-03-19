import { Injectable } from '@angular/core';
import { Observable, throwError, timer, of } from 'rxjs';
import { filter, catchError, concatMap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders,HttpErrorResponse,} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StatusServiceService {
  // private apiUrl = 'https://www.youtube.com/';
  private baseUrl: string = 'http://163.18.42.233:4200/';
  // private corsAnywhereUrl: string = 'https://cors-anywhere.herokuapp.com/'; // cors-anywhere 服务地址
  private lineNotifyUrl: string = 'https://notify-api.line.me/api/notify';
  private lineAccessToken: string ='yul9pQ07sl3omxCs8Rt09HwlXsN2EDGgX9qCZtHqieI';
  constructor(private http: HttpClient) {}


  generateStatusService(): Observable<any> {
    console.log('發送 GET 請求至:', this.baseUrl);

// 设置自定义的 HTTP 头部
const headers = new HttpHeaders().set('Accept', 'application/json');

    return this.http.get(this.baseUrl,{headers}).pipe(
      catchError((error) => {
        console.error('在 GET 請求期間發生錯誤:', error);
        // 在这里发送电子邮件通知
        this.sendEmailNotification(error).subscribe(
          (emailResponse) => {
            console.log('郵件發送成功:', emailResponse);
          },
          (emailError) => {
            console.error('郵件發送失敗:', emailError);
          }
        );
        // 發送 Line Notify 消息
        this.sendLineNotifyMessage(`發生錯誤：${error.message}`).subscribe(
          () => console.log('Line Notify 消息發送成功。'),
          (error) => console.error('無法發送 Line Notify 消息：', error)
        );
        return throwError(error);
      })
    );
  }






  //寄送email通知
  private sendEmailNotification(error: any): Observable<any> {
    const errorMessage = `发生错误: ${error.message}`;

    //建構請求的body
    const emailData = {
      to: 'C110118236@nkust.edu.tw', // 收件人電子郵件
      subject: '錯誤通知', // 郵件主题
      body: errorMessage, // 郵件正文
    };
    //發送post請求
    return this.http.post(this.baseUrl, emailData);
  }

  //line
  sendLineNotifyMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      //使用存取權杖進行授權
      Authorization: `Bearer ${this.lineAccessToken}`,
      'Access-Control-Allow-Origin': '*', // 允許跨域請求
      'Access-Control-Allow-Credentials': 'true', // 允許跨域請求包含 Cookie 或其他憑據
    });

    const body = new URLSearchParams();
    body.set('message', message);

    return this.http.post(this.lineNotifyUrl, body.toString(), { headers });
  }





  private shouldGenerateReport(): boolean {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    console.log(`Current Time: ${hours}:${minutes}:${seconds}`);

    // 定義多個定時時間
    const scheduledTimes = [
      { hours: 21, minutes: 46, seconds: 0 },
      { hours: 14, minutes: 40, seconds: 0 },
    ];

    // 檢查是否符合任何一個定時時間
    return scheduledTimes.some(
      (time) =>
        hours === time.hours &&
        minutes === time.minutes &&
        seconds === time.seconds
    );
  }

  getStatusService(): Observable<string> {
    console.log('getStatusService 被呼叫了'); // Debug 訊息

    // 計算距離下一分鐘的秒數
    const secondsUntilNextMinute = 60 - new Date().getSeconds();

    return timer(secondsUntilNextMinute * 1000, 60000).pipe(
      filter(() => this.shouldGenerateReport()),
      concatMap(() => {
        // const currentDate = new Date();
        // console.log('定時檢查時間:', currentDate.getHours(), currentDate.getMinutes(),currentDate.getSeconds());
        return this.generateStatusService().pipe(
          catchError((error) => {
            console.error('在 generateStatusService 中發生錯誤:', error);
            return of('Error occurred'); // 返回一個包含錯誤信息的 Observable
          })
        );
      })
    );
  }

  checkServerStatus(): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.get(url);
  }



  checkStatus(): Observable<string> {
    // 即時檢查
    const currentDate = new Date();
    console.log('即時檢查時間:', currentDate);

    return this.generateStatusService();
  }
}
