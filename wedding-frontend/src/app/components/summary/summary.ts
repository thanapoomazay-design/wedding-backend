import { Component, OnInit , ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.html',
  styleUrl: './summary.css'
})
export class Summary implements OnInit{
  // ข้อมูลจำลองสำหรับแสดงผล (อนาคตสามารถดึงจากหน้าก่อนๆ ได้)
  userName: string = '';
  guestList: any[] = [];
  adultsCount = 0;
  childrenCount = 0;
  totalSeats = 0;
  selectedSeats: string[] = []; // เลขที่นั่งที่เลือกมา

  constructor(
    private router: Router, 
    private http: HttpClient,
    private cdr: ChangeDetectorRef 
  ) {}


 ngOnInit(): void {
  const state = history.state as any;
  this.userName = sessionStorage.getItem('guestName') || 'Guest';

  // ✅ เงื่อนไขรองรับคนจองใหม่
  if (state && state.selectedSeats) {
    // 1. รับเลขที่นั่งจากหน้า Seat Plan
    this.selectedSeats = state.selectedSeats;
    
    // 2. รับจำนวนแขกจาก Session (ที่เพิ่งกรอกมา)
    this.adultsCount = Number(sessionStorage.getItem('adultsCount')) || 0;
    this.childrenCount = Number(sessionStorage.getItem('childrenCount')) || 0;
    this.totalSeats = this.adultsCount + this.childrenCount;

    // 3. ดึงรายชื่อแขกจาก Session เพื่อโชว์ใน class="guest-item"
    const savedDetails = sessionStorage.getItem('guestDetails');
    if (savedDetails) {
      const details = JSON.parse(savedDetails);
      const allGuests = [...(details.adults || []), ...(details.children || [])];
      this.guestList = allGuests.map((g: any) => ({ fullName: g.fullName }));
    }
  } 
  // ✅ เงื่อนไขรองรับคนจองเก่า (Login ใหม่)
  else {
    this.fetchMyBooking(); // วิ่งไปดึง guest_name และจำนวนคนจาก DB
  }
}

  fetchMyBooking() {
    this.http.get<any>(`${environment.apiUrl}/api/get-booked-seats?name=${this.userName}`)
      .subscribe({
        next: (res) => {
          if (res.userBooking) {
          
            this.adultsCount = res.userBooking.adults_count || 0;
            this.childrenCount = res.userBooking.children_count || 0;
            this.totalSeats = this.adultsCount + this.childrenCount;

        
            const myData = res.bookedSeats.filter((s: any) => s.contact_name === this.userName);
            this.selectedSeats = myData.map((s: any) => s.seat_number);

            this.guestList = myData.map((s: any) => {
            try {
              // พยายามแปลง String "{"fullName":"พหก"}" ให้เป็น Object
              const parsedGuest = JSON.parse(s.guest_name);
              return { fullName: parsedGuest.fullName || s.guest_name };
            } catch (e) {
              // ถ้าข้อมูลใน DB ไม่ใช่ JSON (เป็นชื่อปกติ) ให้ใช้ค่านั้นตรงๆ
              return { fullName: s.guest_name };
            }
          });

          console.log('adultsCount-------------------------------------  ',this.adultsCount);
          console.log('childrenCount-----------------------------------  ',this.childrenCount);
          console.log('totalSeats--------------------------------------  ',this.totalSeats);
          console.log('selectedSeats--------------------------------------  ',this.selectedSeats);
          console.log('guestList--------------------------------------  ',this.guestList);
          
            //  ✅ สั่งอัปเดตหน้าจอ Realtime
            this.cdr.detectChanges(); 
          }
        },
        error: (err) => console.error('Error:', err)
      });
    }

  bookAgain() {
    this.router.navigate(['/']); // กลับไปหน้าแรกเริ่มกระบวนการใหม่
  }

  printTicket() {
    window.print(); // คำสั่งเปิดหน้าต่าง Print ของ Browser
  }
}