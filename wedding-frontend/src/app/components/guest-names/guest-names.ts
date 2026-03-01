import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guest-names',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guest-names.html',
  styleUrls: ['./guest-names.css']
})
export class GuestNames implements OnInit {

  constructor(private router: Router) {}

  adults: { fullName: string }[] = [];
  children: { fullName: string }[] = [];

  

  ngOnInit() {
    // ดึงค่าจำนวนที่เลือกไว้จากหน้า guest-count
    const adultCount = Number(sessionStorage.getItem('adultsCount')) || 0;
    const childCount = Number(sessionStorage.getItem('childrenCount')) || 0;

    // สร้างรายการช่องกรอกตามจำนวน
    for (let i = 0; i < adultCount; i++) {
      this.adults.push({ fullName: '' });
    }
    for (let i = 0; i < childCount; i++) {
      this.children.push({ fullName: '' });
    }
  }

  goBack() {
    this.router.navigate(['/guest-count']);
  }

  goToSelectSeat() {

  const allGuests = {
      adults: this.adults,
      children: this.children
    };
  console.log('--- เริ่มการย้ายหน้า allGuests --- ',JSON.stringify(allGuests));
  sessionStorage.setItem('guestDetails', JSON.stringify(allGuests)); 
  console.log('--- เริ่มการย้ายหน้า --- ',sessionStorage.getItem('guestDetails'));
  this.router.navigate(['/seat-plan']).then(success => {
    console.log('ผลการนำทาง:', success);
  });
  }

}