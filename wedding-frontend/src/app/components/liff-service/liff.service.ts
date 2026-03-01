import { Injectable, signal } from '@angular/core';
import liff from '@line/liff';

@Injectable({ providedIn: 'root' })
export class LiffService { 
    profile = signal<any>(null);


async initLiff() {
  try {
    // 1. ตรวจสอบว่ามีข้อมูลค้างจาก Session เก่าไหม ถ้ามีให้ล้างทิ้งก่อนเพื่อความปลอดภัย
    if (window.location.search.includes('error=') || window.location.search.includes('code=')) {
      // ป้องกันการแฮ็กแบบ Replay Attack โดยการเช็คว่า URL นี้ถูกใช้ซ้ำหรือไม่
    }

    await liff.init({ liffId: '2009261503' });

    if (liff.isLoggedIn()) {
      const profile = await liff.getProfile();
      this.profile.set(profile);
      sessionStorage.setItem('guestName', profile.displayName);
    }
  } catch (err: any) {
    console.error('LIFF Init Error:', err);
    
    // ✅ ถ้าเจอ "Invalid State" หรือ "ไม่ปลอดภัย" ให้ล้างหน้าจอแล้วลองใหม่ 1 ครั้งอัตโนมัติ
    if (err.toString().includes('Invalid State')) {
      liff.logout(); 
      // บังคับโหลดหน้าเว็บใหม่แบบสะอาดๆ เพื่อล้างค่าพารามิเตอร์ที่ผิดพลาดทิ้ง
      window.location.href = 'https://script.google.com/macros/s/AKfycbwGqeqWfJTFyGxovs8v5yV4hQlbKiTJEvh_UhoC3KDMiL3vl2E2zCcPdLz3E5eaGqUyKA/exec';
    }
  }
}

// แยกฟังก์ชัน Login ออกมาต่างหาก
login() {
  liff.login();
}

}
