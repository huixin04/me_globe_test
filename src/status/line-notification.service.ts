import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LineBotService {
  private lineMessagingApiUrl = 'https://api.line.me/v2/bot/message/push';
  private channelAccessToken = 'b9480bc13c0daec71a435effaf90c792'; // 你的 Channel Access Token

  constructor(private http: HttpClient) {}

  sendLineMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.channelAccessToken}`,
    });

    const body = {
      to: '2004316661', // 接收消息的用户的 Line 用户 ID
      messages: [
        {
          type: 'text',
          text: message,
        },
      ],
    };

    return this.http.post(this.lineMessagingApiUrl, body, { headers }).pipe(
      catchError((error) => {
        console.error('Error sending Line Message:', error);
        return throwError('Failed to send Line Message');
      })
    );
  }
}
