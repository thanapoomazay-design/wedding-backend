import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router'; // รวมเป็นอันเดียว
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // เรียกใช้ฟังก์ชันที่มีอยู่แล้วใน Angular Router
    provideRouter(routes, withHashLocation()) 
  ]
};