import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guest-count',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guest-count.html',
  styleUrl: './guest-count.css'
})
export class GuestCount {
  // ใช้ Signal สำหรับจัดการสถานะจำนวนคน
  adults = signal(0);
  children = signal(0);
  userName = '';

  // คำนวณยอดรวมอัตโนมัติ
  totalGuests = computed(() => this.adults() + this.children());

  constructor(private router: Router) {}

  goBack() {
    console.log('ปุ่มย้อนกลับถูกกดแล้ว!'); // ใส่บรรทัดนี้เพื่อเช็คใน Console (F12) ว่าฟังก์ชันทำงานไหม
    this.router.navigate(['/']); 
  }

  updateCount(type: 'adult' | 'child', delta: number) {

    // 1. คำนวณยอดรวมปัจจุบันก่อนบวกเพิ่ม
  const currentTotal = this.totalGuests();

  // 2. เช็คเงื่อนไข: ถ้าจะ "เพิ่ม (+)" และยอดรวมเท่ากับหรือเกิน 6 แล้ว ให้หยุดการทำงานทันที
  if (delta > 0 && currentTotal >= 6) {
    alert('จองได้สูงสุด 6 ที่นั่งต่อ 1 account ครับ/ค่ะ');
    return; 
  }

    if (type === 'adult') {const newValue = this.adults() + delta;
    // อย่างน้อยต้องมีผู้ใหญ่ 1 คน และห้ามลดจนติดลบ
    if (newValue >= 1) this.adults.set(newValue);
  } else {
    const newValue = this.children() + delta;
    // เด็กห้ามลดจนติดลบ
    if (newValue >= 0) this.children.set(newValue);
  }
  }
  
  goToSeatPlan() {
   
    
    if (this.totalGuests() > 0) {
       console.log('จำนวนคนทั้งหมด:', this.totalGuests());
      sessionStorage.setItem('adultsCount', this.adults().toString());
      sessionStorage.setItem('childrenCount', this.children().toString());
      sessionStorage.setItem('totalGuests', this.totalGuests().toString());

     this.router.navigate(['/guest-names'], {
     state: { count: this.totalGuests() }
    });
  }
  else {
    alert('กรุณาระบุจำนวนผู้เข้าร่วมอย่างน้อย 1 ท่าน');
  }
    // ส่งข้อมูลจำนวนคนไปหน้า Seat Plan ต่อไป
  }
}