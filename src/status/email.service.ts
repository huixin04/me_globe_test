import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) {}

  async sendEmail(subject: string, body: string): Promise<void> {
    const emailData = {
      to: 'C110118236@nkust.edu.tw', // 將此處的電子郵件地址替換為收件人的實際地址
      subject: subject,
      body: body,
    };

    try {
      const response = await this.http.post('YOUR_EMAIL_API_ENDPOINT', emailData).toPromise();
      console.log('電子郵件發送成功：', response);
    } catch (error) {
      console.error('發送電子郵件失敗：', error);
      throw error; // 將錯誤再次拋出，以便調用者進行處理（如果需要的話）
    }
  }
}
