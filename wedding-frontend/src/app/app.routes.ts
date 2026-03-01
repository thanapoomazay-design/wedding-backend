import { Routes } from '@angular/router';
import { Login } from './components/login/login'; // ตรวจสอบชื่อ class และ path ให้ตรง
import { GuestCount } from './components/guest-count/guest-count';
import { SeatPlan } from './components/seat-plan/seat-plan';
import { Summary } from './components/summary/summary';
import { GuestNames } from './components/guest-names/guest-names';

export const routes: Routes = [
  { path: '', component: Login },                 // หน้าแรกสุดให้โชว์ Login
  { path: 'login', component: Login },
  { path: 'guest-count', component: GuestCount }, // ถ้าไปที่ /guest-count ให้โชว์หน้านับคน
  { path: 'guest-names', component: GuestNames },
  { path: 'seat-plan', component: SeatPlan },
  { path: 'summary', component: Summary }
];