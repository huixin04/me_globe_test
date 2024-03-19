import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule,HttpClientJsonpModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StatusComponent } from 'src/status/status.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { EmailComponent } from './email/email.component';
import { SharedModule } from 'src/share/share.module';

const routes: Routes = [
  { path: 'status', component: StatusComponent },
  // 其他路由配置
];
@NgModule({
  declarations: [
    AppComponent,
    StatusComponent,
    // EmailComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    // BrowserAnimationsModule,
    HttpClientJsonpModule,
    SharedModule,

  ],
  providers: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
