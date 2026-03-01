const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // เปลี่ยนจาก user/pass เป็นตัวแปรนี้ตัวเดียว
  ssl: { rejectUnauthorized: false } // สำคัญมากสำหรับการเชื่อมต่อ Cloud Database
});







app.post('/api/save-booking', async (req, res) => {
  const { contactName, adults, children, selectedSeats } = req.body;

  // ตรวจสอบข้อมูลเบื้องต้นเพื่อป้องกัน Error .join() หรือ .length
    if (!selectedSeats || !Array.isArray(selectedSeats)) {
        return res.status(400).json({ error: "ข้อมูลที่นั่งไม่ถูกต้อง" });
    }
  
  // สร้าง ID เช่น A1A3 (รวมเลขที่นั่ง)
  const bookingRef = selectedSeats.join(''); 
  const totalGuests = (adults?.length || 0) + (children?.length || 0);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    
    // 1. บันทึกลงตารางหลัก (bookings)
    const bookingRes = await client.query(
      'INSERT INTO bookings (booking_ref, contact_name, adults_count, children_count, total_guests) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [bookingRef, contactName, adults?.length || 0, children?.length || 0, totalGuests]
      
    );
    const bookingId = bookingRes.rows[0].id;

    // 3. รวมรายชื่อแขกทั้งหมดเพื่อวนลูปลงตารางที่นั่ง
    const allGuests = [...(adults || []), ...(children || [])];
        
    for (let i = 0; i < allGuests.length; i++) {


            await client.query(
                'INSERT INTO booking_seats (booking_id, seat_number, guest_name) VALUES ($1, $2, $3)',
                [
                    bookingId, 
                    selectedSeats[i], // มั่นใจว่า i ไม่เกินจำนวนที่นั่งแน่นอน
                    allGuests[i]
                ]
            );
    }

    await client.query('COMMIT');
        res.status(200).json({ message: 'บันทึกสำเร็จ' });
  
  } catch (err) {
   await client.query('ROLLBACK');
        console.error('DB Error:', err.message);
        // ส่งข้อความ Error กลับไปให้ละเอียดขึ้นเพื่อการ Debug
        res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});


// ดึงข้อมูลที่นั่งที่ถูกจองไปแล้วทั้งหมด
app.get('/api/get-booked-seats', async (req, res) => {
  try {
    const guestName = req.query.name; 
    

    const query = `
      SELECT bs.seat_number, bs.guest_name, b.contact_name, b.adults_count, b.children_count 
      FROM booking_seats bs
      JOIN bookings b ON bs.booking_id = b.id
    `;
    const result = await pool.query(query);
    
    let userBooking = null;
    if (guestName) {
      userBooking = result.rows.find(s => s.contact_name === guestName);
    }

    // ต้องส่ง Object กลับไปให้ตรงตามที่ Frontend จะใช้เช็ค
    res.status(200).json({
      bookedSeats: result.rows, // ส่ง Object Array
      userBooking: userBooking
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message }); // จุดนี้คือที่มาของ Error 500 ถ้า Query ผิด
  }
});

app.listen(3000, () => console.log('🚀 Backend Server วิ่งที่พอร์ต 3000'));