# TNS Solar SLD Generator ☀️⚡

ระบบเว็บแอปพลิเคชันสร้างแบบ **Single Line Diagram (SLD)** พลังงานแสงอาทิตย์ (3 kW - 200 kW) ตามมาตรฐาน **TNS Network Solutions Co.,Ltd.** สำหรับยื่นขออนุญาตการไฟฟ้าส่วนภูมิภาค (กฟภ. / PEA) และการไฟฟ้านครหลวง (กฟน. / MEA)

---

## 🌟 ฟีเจอร์หลัก (Key Features)

- **⚡ รองรับ 2 สถาปัตยกรรมหลัก:**
  - **Microinverter System:** Enphase (IQ7A, IQ8P), ATMOCE (1-Phase / 3-Phase) พร้อมระบบ Q-Cable, Solar Combiner Box, Envoy/ECU Gateway, Production & Consumption CTs, Phase Coupler, RCBO/MCB/SPD
  - **String Inverter System:** Huawei SUN2000 Series (3 kW - 200 kW) พร้อม DC Combiner Box, DC Fuse 15A/20A gPV, DC Isolator Switch, DC SPD Type II, AC Breakers, Smart Power Sensor DTSU666-H
- **🔢 ปรับแต่งขนาดแผงและจำนวนแผงได้อิสระ:**
  - กำหนดขนาดแผง เช่น `650` Wp, `630` Wp, `550` Wp
  - กำหนดจำนวนแผง เช่น `8` แผงสำหรับระบบ 5kW, `15` แผง, `21` แผง
  - คำนวณกำลังติดตั้ง DC (kWp) และกำลังผลิต AC (kW, kVA) อัตโนมัติ
- **⚡ จำนวน Microinverter:** ระบุจำนวนเครื่อง เช่น `8` เครื่องสำหรับระบบ 8 แผง (1-in-1) หรือ `4` เครื่อง (2-in-1)
- **📐 Title Block & กรอบลงนามมาตรฐาน TNS:**
  - ข้อมูลโครงการ: Project Owner, Project Name, Customer Name, ที่อยู่ (เชียงใหม่และทั่วประเทศ), พิกัด GPS, Job No., Drawing No., Rev., Date
  - เลือกลายมือชื่อวิศวกร กว. ในตัว (นาย จุฑา พรพนมชัย, นาย ภมร ตาคำ, นาย ศรัณยวัฒ เปรมจิตต์)
- **🛡️ ตาราง Relay Protection & PEA Notes:**
  - ตาราง IEEE C37.2 Protection Relay Table (50, 50N, 51, 51N, 27, 59, 81O, 81U)
  - ข้อความระบบป้องกันไฟย้อน (Zero Export / EXL)
  - ข้อความระบบป้องกันด้านเฟสและกราวด์
  - ระบบสายดิน Ground Rod $5/8" \times 2.4\text{ m}$ / 10' ความต้านทานดิน $\le 5\,\Omega$
- **📄 Export PDF (A3 / A4 แนวนอน):** คมชัดระดับ Vector สำหรับนำไปพิมพ์หรือแนบยื่นขออนุญาตออนไลน์ (PEA PPIM) ได้ทันที
- **💾 Save / Load Project (JSON):** บันทึกโปรเจกต์เก็บไว้ในเครื่องเพื่อนำมาแก้ไขหรือเปลี่ยนชื่อลูกค้าในงานถัดไปได้ใน 30 วินาที

---

## 🚀 การติดตั้งและใช้งาน (Getting Started)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รันโหมดพัฒนา (Development Mode)
```bash
npm run dev
```
เปิดเว็บเบราว์เซอร์ไปที่: `http://localhost:5173/`

### 3. สร้างไฟล์สำหรับ Production (Build)
```bash
npm run build
```

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + Google Fonts (Prompt, Sarabun, Inter)
- **Icons:** Lucide React
- **PDF Engine:** jsPDF + High-resolution SVG Vector Rendering + CSS Print `@page`

---

## 🏢 เกี่ยวกับผู้พัฒนา

**TNS Network Solutions Co.,Ltd.**  
จังหวัดเชียงใหม่ ประเทศไทย
