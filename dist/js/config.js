// API Configuration
const API_CONFIG = {
    // Base URL - Update this to match your backend API
    BASE_URL: 'http://localhost:3000/api', // Change this to your actual backend URL
    
    // API Endpoints
    ENDPOINTS: {
        // Agriculture & Labor Charts
        NTP_BULANAN: '/ntp/bulanan',
        NTP_INDEKS_DITERIMA_DIBAYAR: '/ntp/indeks-diterima-dibayar',
        NTP_PER_SUBSEKTOR: '/ntp/per-subsektor',
        TPAK_TAHUNAN: '/ketenagakerjaan/tpak-tahunan',
        TPT_TAHUNAN: '/ketenagakerjaan/tpt-tahunan',
        KOMPOSISI_TENAGA_KERJA: '/ketenagakerjaan/komposisi-sektor',
        
        // Other charts
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
    
    // Request timeout (in milliseconds)
    TIMEOUT: 30000,
    
    // Retry configuration
    RETRY: {
        MAX_ATTEMPTS: 3,
        DELAY: 1000
    }
};

// Chart configuration
const CHART_CONFIG = {
    COLORS: {
        PRIMARY: '#003D7A',
        SECONDARY: '#4FC3F7',
        SUCCESS: '#4CAF50',
        WARNING: '#FF9800',
        DANGER: '#F44336',
        CHART_COLORS: ['#003D7A', '#4FC3F7', '#4CAF50', '#FF9800', '#9C27B0', '#2196F3', '#F44336']
    },
    DIMENSIONS: {
        WIDTH: 800,
        HEIGHT: 400,
        MARGIN: { top: 20, right: 30, bottom: 40, left: 60 }
    }
};

