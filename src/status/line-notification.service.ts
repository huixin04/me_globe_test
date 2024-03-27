import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})

export class LineNotifyService {
  private readonly LINE_NOTIFY_API = '/api/notify'; //使用 /api 代理https://notify-api.line.me
  private readonly ACCESS_TOKEN = 'yul9pQ07sl3omxCs8Rt09HwlXsN2EDGgX9qCZtHqieI'; // 向line notify申請Access Token
  constructor(private http: HttpClient) { };
  //向LINE Notify發送通知訊息
  async sendLineNotification(message: string): Promise<number> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${this.ACCESS_TOKEN}`
    });
    //設定要傳遞的message
    const body = new URLSearchParams();
    body.set('message', message);
    try { //如果成功收到了回應，檢查回應是否存在（如果存在，則返回回應的狀態碼；若未存在，則拋出一個錯誤）
      const response = await this.http.post(this.LINE_NOTIFY_API, body.toString(), { headers, observe: 'response' }).toPromise();
      if (response) {
        return response.status; // 返回 HTTP 狀態碼
      } else {
        throw new Error('Response is undefined');
      }
    } catch (error) { //捕獲任何錯誤，如果為Error，拋出一個描述HTTP POST的錯誤；否則，拋出未知錯誤
      if (error instanceof Error) {
        throw new Error('There was a problem with the HTTP POST operation: ' + error.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }
}
