# Frontend BPS Provinsi Nusa Tenggara Timur

Aplikasi web frontend untuk visualisasi data statistik Badan Pusat Statistik (BPS) Provinsi Nusa Tenggara Timur. Aplikasi ini menampilkan berbagai chart dan visualisasi data statistik dengan integrasi API backend.

## 📋 Daftar Isi

- [Fitur](#fitur)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Proses Instalasi dan Setup](#proses-instalasi-dan-setup)
- [Struktur Project](#struktur-project)
- [Proses Integrasi API](#proses-integrasi-api)
- [6 Chart Pertanian & Ketenagakerjaan](#6-chart-pertanian--ketenagakerjaan)
- [Penggunaan](#penggunaan)
- [Troubleshooting](#troubleshooting)

## ✨ Fitur

### 1. Dashboard Beranda
- **KPI Cards**: Menampilkan indikator utama dengan data real-time dari API (8 cards dengan horizontal scroll)
- **Chart Preview**: Preview mini chart untuk setiap visualisasi
- **Search Functionality**: Pencarian chart berdasarkan judul atau sub judul
- **Horizontal Scroll**: KPI cards dapat di-scroll horizontal
- **Animasi Modern**: Animasi fade-in dan hover effects

### 2. Halaman Detail Visualisasi
- **Multiple Chart Types**: Line, Bar, Pie, Multi-Line, Stacked Bar charts
- **Interactive Tooltips**: Tooltip yang menyesuaikan posisi agar tidak keluar layar
- **Filter**: Filter berdasarkan tahun dan wilayah
- **Legend**: Legend untuk chart multi-dataset
- **Download Data**: Unduh data dalam format CSV atau Excel

### 3. Admin Dashboard
- **Kelola Data**: Tambah, edit, hapus data strategis
- **Update dari API**: Sinkronisasi data dari backend API untuk semua chart
- **Kelola Akun**: Manajemen admin dengan role-based access
- **Layout Responsif**: Action buttons dalam satu baris

### 4. Feedback Form
- **Submit Feedback**: Kirim feedback ke backend API
- **Loading States**: Indikator loading saat submit
- **Success/Error Handling**: Notifikasi sukses atau error

## 🛠 Teknologi yang Digunakan

- **HTML5**: Struktur halaman
- **CSS3**: Styling dengan animasi modern
- **JavaScript (ES6+)**: Logika aplikasi
- **D3.js v7**: Library untuk rendering chart interaktif
- **Tailwind CSS**: Utility-first CSS framework (untuk build CSS)
- **Local Storage**: Penyimpanan data sementara

## 📦 Proses Instalasi dan Setup

### Langkah 1: Prasyarat

Pastikan sudah terinstall:
- **Node.js** (versi 14 atau lebih baru)
- **npm** (biasanya sudah termasuk dengan Node.js)

Cek versi:
```bash
node --version
npm --version
```

### Langkah 2: Clone atau Download Project

```bash
cd Frontend_BPS
```

### Langkah 3: Install Dependencies

```bash
npm install
```

Perintah ini akan menginstall:
- `tailwindcss` - CSS framework utility-first
- `autoprefixer` & `postcss` - Tools untuk CSS processing
- `http-server` (opsional) - HTTP server untuk development

### Langkah 4: Build CSS (Opsional)

Jika menggunakan Tailwind CSS:
```bash
npm run build
```

Perintah ini akan mengcompile Tailwind CSS dari `src/input.css` menjadi `dist/output.css`.

### Langkah 5: Menjalankan Aplikasi

**Metode 1: Menggunakan http-server (Recommended)**
```bash
npx http-server dist -p 8000 -o
```

Server akan berjalan di `http://localhost:8000` dan browser akan otomatis terbuka.

**Metode 2: Menggunakan Python**
```bash
cd dist
python -m http.server 8000
```

**Metode 3: Menggunakan VS Code Live Server**
1. Install extension **Live Server** di VS Code
2. Klik kanan pada file `dist/beranda.html`
3. Pilih **"Open with Live Server"**

## 📁 Struktur Project

```
Frontend_BPS/
├── dist/                      # Folder output (file yang di-serve)
│   ├── js/
│   │   ├── config.js         # Konfigurasi API dan Chart
│   │   ├── api.js            # Helper functions untuk API calls
│   │   ├── utils.js          # Utility functions (loading, error, etc.)
│   │   └── charts.js         # D3.js chart rendering functions
│   ├── beranda.html          # Halaman beranda
│   ├── visualisasi-detail.html  # Halaman detail chart
│   ├── admin.html            # Admin dashboard
│   ├── feedback.html         # Form feedback
│   ├── masuk.html            # Halaman login
│   ├── output.css            # Compiled Tailwind CSS
│   └── logo bps.png          # Logo BPS
├── src/
│   └── input.css             # Tailwind CSS source
├── package.json              # Dependencies dan scripts
├── tailwind.config.js        # Konfigurasi Tailwind
├── postcss.config.js         # Konfigurasi PostCSS
└── README.md                 # Dokumentasi ini
```

## 🔌 Proses Integrasi API

### Step 1: Setup API Configuration

File `dist/js/config.js` berisi konfigurasi API:

```javascript
const API_CONFIG = {
    // Base URL - Update ini sesuai dengan backend API Anda
    BASE_URL: 'http://localhost:3000/api',
    
    // API Endpoints untuk semua chart
    ENDPOINTS: {
        // Chart Pertanian & Ketenagakerjaan (6 chart)
        NTP_BULANAN: '/ntp/bulanan',
        NTP_INDEKS_DITERIMA_DIBAYAR: '/ntp/indeks-diterima-dibayar',
        NTP_PER_SUBSEKTOR: '/ntp/per-subsektor',
        TPAK_TAHUNAN: '/ketenagakerjaan/tpak-tahunan',
        TPT_TAHUNAN: '/ketenagakerjaan/tpt-tahunan',
        KOMPOSISI_TENAGA_KERJA: '/ketenagakerjaan/komposisi-sektor',
        
        // Chart lainnya
        INFLASI: '/inflasi',
        PENGELUARAN: '/pengeluaran',
        KEMISKINAN: '/kemiskinan',
        IPM: '/ipm',
        KETENAGAKERJAAN: '/ketenagakerjaan',
        
        // Feedback
        FEEDBACK: '/feedback',
        
        // KPI Data
        KPI: '/kpi'
    },
    
    // Request timeout (30 detik)
    TIMEOUT: 30000,
    
    // Retry configuration
    RETRY: {
        MAX_ATTEMPTS: 3,
        DELAY: 1000
    }
};
```

**Cara Update Base URL:**
1. Buka `dist/js/config.js`
2. Ubah `BASE_URL` sesuai dengan URL backend API BPS Anda
3. Contoh: `BASE_URL: 'https://api.bps.go.id/api'`

### Step 2: Helper Function untuk Fetch Data

File `dist/js/api.js` berisi helper functions untuk semua API calls:

#### 2.1. Core Fetch Function

```javascript
async function fetchData(endpoint, options = {}, retryCount = 0)
```

**Fitur:**
- ✅ Error handling otomatis
- ✅ Retry logic (3x attempts)
- ✅ Timeout handling (30 detik)
- ✅ JSON parsing otomatis
- ✅ Response format standar

**Contoh penggunaan:**
```javascript
const response = await fetchData('/ntp/bulanan');
if (response.success) {
    console.log(response.data);
} else {
    console.error(response.error);
}
```

#### 2.2. Specific Functions untuk 6 Chart Pertanian & Ketenagakerjaan

```javascript
// 1. NTP Bulanan (Line Chart)
async function getNTPBulanan(filters = {})

// 2. Indeks Diterima vs Dibayar (Multi-Line Chart)
async function getIndeksDiterimaDibayar(filters = {})

// 3. NTP per Subsektor (Bar Chart)
async function getNTPPerSubsektor(filters = {})

// 4. TPAK Tahunan (Line Chart)
async function getTPAKTahunan(filters = {})

// 5. TPT Tahunan (Line Chart)
async function getTPTTahunan(filters = {})

// 6. Komposisi Tenaga Kerja (Stacked Bar Chart)
async function getKomposisiTenagaKerja(filters = {})
```

#### 2.3. Generic Function untuk Semua Chart

```javascript
async function getChartData(visualizationType, filters = {})
```

**Mapping visualization type ke endpoint:**
- `'ntp-bulanan'` → `/ntp/bulanan`
- `'ntp-indeks'` → `/ntp/indeks-diterima-dibayar`
- `'ntp-subsektor'` → `/ntp/per-subsektor`
- `'tpak'` → `/ketenagakerjaan/tpak-tahunan`
- `'tpt'` → `/ketenagakerjaan/tpt-tahunan`
- `'komposisi-tenaga-kerja'` → `/ketenagakerjaan/komposisi-sektor`

### Step 3: Error Handling & Loading States

File `dist/js/utils.js` berisi utility functions untuk UI states:

#### 3.1. Loading State
```javascript
showLoading(container, 'Memuat data chart...');
```

#### 3.2. Error State
```javascript
showError(container, 'Terjadi kesalahan saat memuat data', retryCallback);
```

#### 3.3. Empty State
```javascript
showEmpty(container, 'Tidak ada data tersedia');
```

#### 3.4. Success Message
```javascript
showSuccess(container, 'Data berhasil diunduh!', 3000);
```

**Contoh implementasi di halaman:**
```javascript
async function updateChart(type) {
    const chartWrapper = document.getElementById('chartWrapper');
    
    // Show loading
    showLoading(chartWrapper, 'Memuat data chart...');
    
    try {
        const response = await getChartData(visualizationType, filters);
        
        if (response.success && response.data) {
            // Render chart
            createLineChart(chartWrapper, response.data);
        } else {
            // Show error
            showError(chartWrapper, response.error.message, () => updateChart(type));
        }
    } catch (error) {
        showError(chartWrapper, 'Terjadi kesalahan saat memuat data');
    }
}
```

### Step 4: Integrasi Chart dengan Backend API

#### 4.1. Di Halaman Beranda (`dist/beranda.html`)

**Load KPI Data:**
```javascript
async function loadKPIData() {
    const response = await getKPIData();
    if (response.success && response.data) {
        // Render KPI cards
        kpiData.forEach(kpi => {
            const cardHTML = createKPICard(kpi);
            kpiGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
    }
}
```

**Load Chart Previews:**
```javascript
async function loadChartPreviews() {
    const chartPreviews = document.querySelectorAll('.chart-preview');
    
    for (const preview of chartPreviews) {
        const chartType = preview.getAttribute('data-chart');
        const response = await getChartData(chartType, {});
        
        if (response.success && response.data) {
            createMiniChart(preview, response.data, chartTypeAttr);
        }
    }
}
```

#### 4.2. Di Halaman Detail (`dist/visualisasi-detail.html`)

**Update Chart dengan Filter:**
```javascript
async function updateChart(type) {
    const chartWrapper = document.getElementById('chartWrapper');
    showLoading(chartWrapper, 'Memuat data chart...');
    
    try {
        // Get filters from UI
        const filters = getSelectedFilters();
        
        // Fetch data from API
        const response = await getChartData(selectedVisualization, filters);
        
        if (response.success && response.data) {
            const apiData = response.data;
            
            // Determine chart type
            const chartType = chartTypeMap[selectedVisualization].defaultType;
            
            // Render chart based on type
            if (chartType === 'line') {
                createLineChart(chartWrapper, apiData);
            } else if (chartType === 'multiline') {
                createMultiLineChart(chartWrapper, apiData);
            } else if (chartType === 'bar') {
                createBarChart(chartWrapper, apiData);
            } else if (chartType === 'stacked') {
                createStackedBarChart(chartWrapper, apiData);
            }
        }
    } catch (error) {
        showError(chartWrapper, 'Terjadi kesalahan saat memuat data');
    }
}
```

### Step 5: Form Feedback Submit

File `dist/feedback.html`:

```javascript
async function submitFeedback(formData) {
    const response = await submitFeedback(formData);
    
    if (response.success) {
        showSuccess(document.body, 'Feedback berhasil dikirim!');
        form.reset();
    } else {
        showError(document.body, response.error.message);
    }
}
```

**Function di `api.js`:**
```javascript
async function submitFeedback(feedbackData) {
    return await fetchData(API_CONFIG.ENDPOINTS.FEEDBACK, {
        method: 'POST',
        body: JSON.stringify(feedbackData)
    });
}
```

### Step 6: Mock Data Mode vs Real API

#### Menggunakan Mock Data (Development/Testing)

File `dist/js/api.js`:
```javascript
const USE_MOCK_DATA = true; // Set ke true untuk mock data
```

**Keuntungan:**
- ✅ Testing tanpa backend
- ✅ Development lebih cepat
- ✅ Tidak perlu koneksi internet

#### Beralih ke Real API (Production)

1. Buka `dist/js/api.js`
2. Ubah `const USE_MOCK_DATA = true;` menjadi `const USE_MOCK_DATA = false;`
3. Pastikan backend API berjalan
4. Update `BASE_URL` di `dist/js/config.js` sesuai dengan backend API BPS

## 📊 6 Chart Pertanian & Ketenagakerjaan

### 1. NTP Bulanan (Line Chart)
- **Endpoint**: `GET /ntp/bulanan`
- **Chart Type**: Line Chart
- **Data Format**: `{ labels: [], values: [] }`
- **Function**: `getNTPBulanan(filters)`

### 2. Indeks Diterima vs Dibayar (Multi-Line Chart)
- **Endpoint**: `GET /ntp/indeks-diterima-dibayar`
- **Chart Type**: Multi-Line Chart
- **Data Format**: `{ labels: [], datasets: [{ label, values, color }] }`
- **Function**: `getIndeksDiterimaDibayar(filters)`

### 3. NTP per Subsektor (Bar Chart)
- **Endpoint**: `GET /ntp/per-subsektor`
- **Chart Type**: Bar Chart
- **Data Format**: `{ labels: [], values: [] }`
- **Function**: `getNTPPerSubsektor(filters)`

### 4. TPAK Tahunan (Line Chart)
- **Endpoint**: `GET /ketenagakerjaan/tpak-tahunan`
- **Chart Type**: Line Chart
- **Data Format**: `{ labels: [], values: [] }`
- **Function**: `getTPAKTahunan(filters)`

### 5. TPT Tahunan (Line Chart)
- **Endpoint**: `GET /ketenagakerjaan/tpt-tahunan`
- **Chart Type**: Line Chart
- **Data Format**: `{ labels: [], values: [] }`
- **Function**: `getTPTTahunan(filters)`

### 6. Komposisi Tenaga Kerja per Sektor (Stacked Bar Chart)
- **Endpoint**: `GET /ketenagakerjaan/komposisi-sektor`
- **Chart Type**: Stacked Bar Chart
- **Data Format**: `{ labels: [], datasets: [{ label, values, color }] }`
- **Function**: `getKomposisiTenagaKerja(filters)`

## 📖 Format Response API

### Success Response (Single Dataset)
```json
{
  "success": true,
  "data": {
    "title": "NTP Bulanan",
    "labels": ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
    "values": [105.2, 104.8, 105.5, 105.1, 104.9, 105.3],
    "period": "Januari - Juni 2024"
  }
}
```

### Success Response (Multi-Dataset)
```json
{
  "success": true,
  "data": {
    "title": "Indeks Diterima vs Dibayar",
    "labels": ["Jan", "Feb", "Mar"],
    "datasets": [
      {
        "label": "Indeks Diterima (It)",
        "values": [105.2, 105.5, 106.0],
        "color": "#003D7A"
      },
      {
        "label": "Indeks Dibayar (Ib)",
        "values": [100.0, 100.2, 100.5],
        "color": "#4FC3F7"
      }
    ],
    "period": "Januari - Maret 2024"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "status": 500
  }
}
```

## 📖 Penggunaan

### 1. Mengakses Beranda
1. Buka http://localhost:8000/beranda.html
2. Scroll ke bagian "Visualisasi Data"
3. Gunakan search box untuk mencari chart
4. Klik chart card untuk melihat detail

### 2. Melihat Detail Chart
1. Klik salah satu chart card di beranda
2. Akan redirect ke halaman detail
3. Gunakan filter di sidebar untuk memfilter data (tahun & wilayah)
4. Klik tombol "Unduh CSV" atau "Unduh Excel" untuk download data

### 3. Login ke Admin Dashboard
1. Buka http://localhost:8000/masuk.html
2. Masukkan:
   - Username: `admin`
   - Password: `admin123`
3. Klik "Masuk"

### 4. Update Data dari API (Admin)
1. Login ke admin dashboard
2. Pilih menu "Kelola Data"
3. Klik tombol "Update Data dari API"
4. Sistem akan:
   - Fetch data untuk semua 11 chart types
   - Store data di localStorage
   - Update tampilan dashboard
5. Tunggu proses selesai (akan ada notifikasi)

### 5. Submit Feedback
1. Buka http://localhost:8000/feedback.html
2. Isi form feedback (nama, email, pesan)
3. Klik "Kirim Feedback"
4. Data akan dikirim ke backend API
5. Tunggu konfirmasi sukses

## 🐛 Troubleshooting

### Problem: Port 8000 sudah digunakan
```bash
# Gunakan port lain
npx http-server dist -p 8080
```

### Problem: Chart tidak muncul
- Buka Browser Console (F12) untuk cek error
- Pastikan file `js/config.js`, `js/api.js`, `js/utils.js`, `js/charts.js` sudah ada
- Pastikan D3.js library ter-load (cek Network tab)
- Pastikan `CHART_CONFIG` terdefinisi (cek Console)

### Problem: API tidak connect
- Pastikan `USE_MOCK_DATA = true` untuk testing tanpa backend
- Atau pastikan backend API sudah running jika `USE_MOCK_DATA = false`
- Cek `BASE_URL` di `dist/js/config.js` sesuai dengan backend
- Cek CORS settings di backend

### Problem: CORS Error
- Pastikan backend sudah enable CORS
- Atau gunakan browser dengan CORS disabled (untuk development)
- Atau gunakan proxy server

### Problem: Chart preview tidak muncul di beranda
- Pastikan D3.js library sudah ter-load
- Cek Browser Console untuk error
- Pastikan `createMiniChart` function ada di `js/charts.js`
- Pastikan `getChartData` function tersedia

### Problem: Download tidak berfungsi
- Pastikan browser mendukung Blob API
- Cek Browser Console untuk error
- Pastikan data sudah ter-load sebelum download

### Problem: Filter tidak bekerja
- Pastikan `getSelectedFilters()` function ada di `utils.js`
- Cek format filter yang dikirim ke API
- Pastikan backend API menerima filter parameters

## 📝 Catatan Penting

1. **Mock Data Mode**: Default menggunakan mock data untuk testing tanpa backend
2. **Local Storage**: Beberapa data disimpan di browser local storage
3. **Browser Compatibility**: Aplikasi menggunakan ES6+ features, gunakan browser modern
4. **API Endpoints**: Pastikan backend API sesuai dengan endpoint yang didefinisikan di `config.js`
5. **Error Handling**: Semua API calls memiliki error handling dan retry logic
6. **Loading States**: Semua data fetching menampilkan loading indicator

## 🔗 Link Eksternal

- **Metadata**: https://sirusa.web.bps.go.id/metadata/
- **Tentang Kami**: https://ppid.bps.go.id/app/konten/5300/Profil-BPS.html

## 📄 License

Proyek ini dibuat untuk Badan Pusat Statistik Provinsi Nusa Tenggara Timur.

## 👥 Kontributor

- Frontend Development Team

---

**Selamat menggunakan aplikasi Frontend BPS Provinsi Nusa Tenggara Timur! 🎉**
