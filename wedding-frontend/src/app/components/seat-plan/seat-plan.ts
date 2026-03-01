import { Component, OnInit, OnDestroy, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // สำหรับส่งข้อมูลไป Render


const API_URL = 'https://wedding-backend-wtbd.onrender.com/api/save-booking';

@Component({
  selector: 'app-seat-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-plan.html',
  styleUrl: './seat-plan.css'
})



export class SeatPlan implements OnInit {

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}
  
  
  totalToSelect = Number(sessionStorage.getItem('totalGuests')); 
  selectedSeats = signal<string[]>([]);

  bookedSeats: any[] = []; // เก็บชื่อที่นั่งจาก DB
  currentUserName: string = sessionStorage.getItem('guestName') || '';

ngOnInit() {
  this.loadBookedSeats(); // ดึงครั้งแรกทันที

}

loadBookedSeats() 
  {this.http.get<any>('https://wedding-backend-wtbd.onrender.com/api/get-booked-seats')
    .subscribe({
      next: (res) => {
        // เก็บเฉพาะเลขที่นั่ง (seat_number) ลงใน array
        this.bookedSeats = res.bookedSeats.map((s: any) => s.seat_number);
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error fetching seats', err)
    });
  }

isOccupied(seatId: string): boolean {
  return this.bookedSeats.includes(seatId);
}

  // 1. โต๊ะประธาน (VIP)
  vipSeatman = [{id: 'V1'}];
  vipSeatwomen = [{id: 'V2'}];
  
  // 1. โต๊ะฝั่งซ้าย (A1 - A36) 
  // ปรับเป็น: แถวนอก 15, แถวใน 15 (เท่ากับโต๊ะ 6 คน x 5 ตัว) และ ฐาน 6
  leftOuter = Array.from({length: 15}, (_, i) => ({id: 'A' + (i + 1)}));
  leftInner = Array.from({length: 15}, (_, i) => ({id: 'A' + (i + 16)}));
  leftBottom = Array.from({length: 6}, (_, i) => ({id: 'A' + (i + 31)}));

  // 2. โต๊ะกลาง (B1 - B30)
  // ปรับเป็น: แถวซ้าย 15, แถวขวา 15 (เท่ากับโต๊ะ 6 คน x 5 ตัว)
  centerLeft = Array.from({length: 15}, (_, i) => ({id: 'B' + (i + 1)}));
  centerRight = Array.from({length: 15}, (_, i) => ({id: 'B' + (i + 16)}));

  // 3. โต๊ะฝั่งขวา (C1 - C36)
  // ปรับเป็น: แถวใน 15, แถวนอก 15 (เท่ากับโต๊ะ 6 คน x 5 ตัว) และ ฐาน 6
  rightInner = Array.from({length: 15}, (_, i) => ({id: 'C' + (i + 1)}));
  rightOuter = Array.from({length: 15}, (_, i) => ({id: 'C' + (i + 16)}));
  rightBottom = Array.from({length: 6}, (_, i) => ({id: 'C' + (i + 31)}));

  
  goBack() {
    this.router.navigate(['/guest-count']);
  }

  toggleSeat(seatId: string) {
    const current = this.selectedSeats();
    if (current.includes(seatId)) {
      this.selectedSeats.set(current.filter(id => id !== seatId));
      
    } else if (current.length < this.totalToSelect) {
      this.selectedSeats.set([...current, seatId]);
    }
  }

  confirmBooking() {
  const seats = this.selectedSeats();
  const rawData = sessionStorage.getItem('guestDetails');
  const guestData = rawData ? JSON.parse(rawData) : { adults: [], children: [] };
  const result = seats.join('');
  

  const allGuestNames = [
  ...(guestData.adults || []).map((g: any) => g.fullName), // ดึงเอาเฉพาะชื่อออกมา
  ...(guestData.children || []).map((g: any) => g.fullName)
    ];

  const name = allGuestNames.join('');

  const payload = {
    contactName: sessionStorage.getItem('guestName'), // สะกดตัว N ใหญ่ตาม server.js
    adults: guestData.adults || [], 
    children: guestData.children || [],
    selectedSeats: this.selectedSeats() // ส่งเป็น Array ตรงๆ
  };

console.log('------------------------------------------------- ');
  console.log('ข้อมูลที่จะส่งไป:', payload);
console.log('------------------------------------------------- ');

  this.http.post(API_URL, payload).subscribe({

    next: (res) => {

      alert('จองที่นั่งสำเร็จ!');
      this.router.navigate(['/summary'], {
        state: { 
        selectedSeats: seats,
        totalSeats: this.totalToSelect
      }
    });
    },

    error: (err) => {
      
      if (err.status === 500) {
      alert('ขออภัย! ที่นั่งนี้เพิ่งถูกจองไปเมื่อครู่ กรุณาเลือกที่นั่งใหม่');
      this.loadBookedSeats(); // อัปเดตสีแดงทันทีเพื่อให้เห็นว่าที่นั่งไหนหายไป
      }
    }
  });
    
}
}