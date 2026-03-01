import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  guestName: string = '';
  pictureUrl: string = '';
  isStarted: boolean = false;

  constructor(private router: Router, 
              private http: HttpClient){}


  ngOnInit(): void {}


  // ฟังก์ชันสำหรับปุ่มกด (ตามที่คุณออกแบบไว้)
  confirmAndGo() {
  const name = this.guestName;
  console.log('name is ...   ',name);
  // ส่งชื่อไปเช็คพร้อมกับการดึงข้อมูลที่นั่ง
  this.http.get<any>(`https://wedding-backend-wtbd.onrender.com/api/get-booked-seats?name=${name}`)
    .subscribe({
      next: (res) => {
        sessionStorage.setItem('guestName', name);
        
        // เช็คจาก userBooking ที่ Backend ส่งมาให้
        if (res.userBooking) {

          const allMySeats = res.bookedSeats
            .filter((s: any) => s.contact_name === name)
            .map((s: any) => s.seat_number)
            .join(', ');

          alert(`สวัสดีคุณ ${name} คุณจองที่นั่ง ${allMySeats} ไว้แล้ว`);
          this.router.navigate(['/summary']);
        } else {
          this.router.navigate(['/guest-count']);
        }
      },
      error: (err) => {
        console.error('Login error', err);
        // หาก Server พัง (500) ให้ส่งไปหน้าเริ่มจองใหม่เป็นทางออกสำรอง
        this.router.navigate(['/guest-count']);
      }
  });
}
  
}

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';

// // หากคุณใช้ @line/liff ให้ import มาด้วย

// declare var liff: any; // ใช้บรรทัดนี้ถ้าคุณฝังสคริปต์ liff ไว้ใน index.html

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './login.html',
//   styleUrl: './login.css'
// })
// export class Login implements OnInit {
//   userName: string = ''; // สำหรับรับค่าจากช่อง input ชื่อ-นามสกุล
  
//   // กำหนดค่าตัวแปรสำหรับ LIFF
//   private readonly liffId: string = '2009261503-KaNDTLA9';
//   private readonly redirectUri: string = 'https://tereasa-nonseparating-barefacedly.ngrok-free.dev/guest-count';

//   constructor(private router: Router) {}

//   async ngOnInit() {
//     try {
//       // 1. Initialize LIFF เมื่อเปิดหน้าเว็บ
//       await liff.init({ liffId: this.liffId });
//       console.log('LIFF Initialized');
//     } catch (err) {
//       console.error('LIFF Init Error:', err);
//     }
//   }

//   // ผูกฟังก์ชันนี้เข้ากับปุ่ม "ยืนยันการจอง" ในหน้า HTML (เช่น (click)="confirmAndGo()")
//   async confirmAndGo() {
//     // เก็บชื่อที่พิมพ์ในช่อง Input ไว้ใน sessionStorage เผื่อนำไปใช้แสดงผลหน้าถัดไป
//     if (this.userName) {
//       sessionStorage.setItem('customUserName', this.userName);
//     }

//     if (!liff.isLoggedIn()) {
//       // 2. ถ้ายังไม่ได้ล็อกอิน LINE
//       console.log('User not logged in, redirecting to LINE Login...');
//       liff.login({
//         redirectUri: this.redirectUri // ล็อกอินเสร็จ LINE จะพาเด้งไปหน้านี้อัตโนมัติ
//       });
//     } else {
//       // 3. ถ้าล็อกอิน LINE อยู่แล้ว
//       try {
//         const profile = await liff.getProfile();
        
//         // เก็บข้อมูลจาก LINE profile ไว้ใช้งานต่อ
//         sessionStorage.setItem('lineDisplayName', profile.displayName);
//         sessionStorage.setItem('linePictureUrl', profile.pictureUrl || '');
        
//         console.log('ยืนยันแล้ว กำลังไปหน้าเลือกจำนวนแขก...', profile.displayName);
        
//         // ให้ Angular Router พาไปหน้า guest-count แบบไม่ต้องรีเฟรชหน้า
//         this.router.navigate(['/guest-count']);
//       } catch (err) {
//         console.error('Error getting LINE profile:', err);
//       }
//     }
//   }
// }