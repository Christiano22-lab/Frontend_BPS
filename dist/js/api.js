/**
 * API Helper Functions
 * Handles all API requests with error handling, loading states, and retry logic
 */

class APIError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

/**
 * Fetch data from API with error handling and retry logic
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @param {number} retryCount - Current retry attempt
 * @returns {Promise} - API response
 */
async function fetchData(endpoint, options = {}, retryCount = 0) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        ...options
    };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
        
        const response = await fetch(url, {
            ...defaultOptions,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new APIError(
                errorData.message || `HTTP error! status: ${response.status}`,
                response.status,
                errorData
            );
        }

        const data = await response.json();
        return { success: true, data };

    } catch (error) {
        // Retry logic for network errors
        if (retryCount < API_CONFIG.RETRY.MAX_ATTEMPTS && 
            (error.name === 'AbortError' || error.name === 'TypeError')) {
            await new Promise(resolve => 
                setTimeout(resolve, API_CONFIG.RETRY.DELAY * (retryCount + 1))
            );
            return fetchData(endpoint, options, retryCount + 1);
        }

        // Return error response
        return {
            success: false,
            error: {
                message: error.message || 'An unexpected error occurred',
                status: error.status || 0,
                data: error.data || null
            }
        };
    }
}

/**
 * Get NTP Bulanan data
 * @param {object} filters - Filter parameters (year, region, etc.)
 * @returns {Promise} - NTP Bulanan data
 */
async function getNTPBulanan(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.NTP_BULANAN}${queryParams ? `?${queryParams}` : ''}`;
    return await fetchData(endpoint);
}

/**
 * Get Indeks Diterima vs Dibayar data
 * @param {object} filters - Filter parameters
 * @returns {Promise} - Indeks data
 */
async function getIndeksDiterimaDibayar(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.NTP_INDEKS_DITERIMA_DIBAYAR}${queryParams ? `?${queryParams}` : ''}`;
    return await fetchData(endpoint);
}

/**
 * Get NTP per Subsektor data
 * @param {object} filters - Filter parameters
 * @returns {Promise} - NTP per Subsektor data
 */
async function getNTPPerSubsektor(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.NTP_PER_SUBSEKTOR}${queryParams ? `?${queryParams}` : ''}`;
    return await fetchData(endpoint);
}

/**
 * Get TPAK Tahunan data
 * @param {object} filters - Filter parameters
 * @returns {Promise} - TPAK data
 */
async function getTPAKTahunan(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.TPAK_TAHUNAN}${queryParams ? `?${queryParams}` : ''}`;
    return await fetchData(endpoint);
}

/**
 * Get TPT Tahunan data
 * @param {object} filters - Filter parameters
 * @returns {Promise} - TPT data
 */
async function getTPTTahunan(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.TPT_TAHUNAN}${queryParams ? `?${queryParams}` : ''}`;
    return await fetchData(endpoint);
}

/**
 * Get Komposisi Tenaga Kerja data
 * @param {object} filters - Filter parameters
 * @returns {Promise} - Komposisi data
 */
async function getKomposisiTenagaKerja(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.KOMPOSISI_TENAGA_KERJA}${queryParams ? `?${queryParams}` : ''}`;
    return await fetchData(endpoint);
}

/**
 * Submit feedback form
 * @param {object} feedbackData - Feedback data
 * @returns {Promise} - Submit response
 */
async function submitFeedback(feedbackData) {
    return await fetchData(API_CONFIG.ENDPOINTS.FEEDBACK, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData)
    });
}

/**
 * Get KPI data
 * @returns {Promise} - KPI data
 */
async function getKPIData() {
    // Mock data for testing (remove this when backend API is ready)
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return {
            success: true,
            data: [
                {
                    title: 'Indeks Kedalaman Kemiskinan (P1)',
                    value: 3.352,
                    decimals: 3,
                    unit: 'Persen',
                    period: 'Maret 2025',
                    iconColor: 'linear-gradient(135deg, #003D7A, #0059B8)',
                    icon: 'shield'
                },
                {
                    title: 'Pengeluaran PerKapita Perempuan',
                    value: 7666,
                    decimals: 0,
                    unit: 'Ribu Rupiah',
                    period: '2023',
                    iconColor: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
                    icon: 'wallet'
                },
                {
                    title: 'Rata-rata Lama Sekolah 2024',
                    value: 8.02,
                    decimals: 2,
                    unit: 'Tahun',
                    period: 'Maret 2025',
                    iconColor: 'linear-gradient(135deg, #2196F3, #42A5F5)',
                    icon: 'education'
                },
                {
                    title: 'Gini Rasio',
                    value: 0.315,
                    decimals: 3,
                    unit: '',
                    period: 'Maret 2025',
                    iconColor: 'linear-gradient(135deg, #FF9800, #FFA726)',
                    icon: 'house'
                },
                {
                    title: 'Angka Harapan Hidup',
                    value: 71.2,
                    decimals: 1,
                    unit: 'Tahun',
                    period: '2024',
                    iconColor: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
                    icon: 'health'
                },
                {
                    title: 'Tingkat Partisipasi Angkatan Kerja',
                    value: 70.5,
                    decimals: 1,
                    unit: 'Persen',
                    period: '2024',
                    iconColor: 'linear-gradient(135deg, #F44336, #EF5350)',
                    icon: 'work'
                },
                {
                    title: 'Tingkat Pengangguran Terbuka',
                    value: 4.5,
                    decimals: 1,
                    unit: 'Persen',
                    period: '2024',
                    iconColor: 'linear-gradient(135deg, #00BCD4, #26C6DA)',
                    icon: 'unemployment'
                },
                {
                    title: 'Indeks Pembangunan Manusia',
                    value: 67.8,
                    decimals: 1,
                    unit: '',
                    period: '2024',
                    iconColor: 'linear-gradient(135deg, #FF5722, #FF7043)',
                    icon: 'development'
                }
            ]
        };
    }
    
    return await fetchData(API_CONFIG.ENDPOINTS.KPI);
}

/**
 * Get chart data based on visualization type
 * @param {string} visualizationType - Type of visualization
 * @param {object} filters - Filter parameters
 * @returns {Promise} - Chart data
 */
// Mock data mode - Set to false when backend API is ready
const USE_MOCK_DATA = true; // Set to false when backend API is ready

async function getChartData(visualizationType, filters = {}) {
    // Mock data for testing (remove this when backend API is ready)
    if (USE_MOCK_DATA) {
        // Return mock data with delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        return getMockChartData(visualizationType, filters);
    }
    
    const endpointMap = {
        'ntp-bulanan': API_CONFIG.ENDPOINTS.NTP_BULANAN,
        'ntp-indeks': API_CONFIG.ENDPOINTS.NTP_INDEKS_DITERIMA_DIBAYAR,
        'ntp-subsektor': API_CONFIG.ENDPOINTS.NTP_PER_SUBSEKTOR,
        'tpak': API_CONFIG.ENDPOINTS.TPAK_TAHUNAN,
        'tpt': API_CONFIG.ENDPOINTS.TPT_TAHUNAN,
        'komposisi-tenaga-kerja': API_CONFIG.ENDPOINTS.KOMPOSISI_TENAGA_KERJA,
        'inflasi': API_CONFIG.ENDPOINTS.INFLASI,
        'pengeluaran': API_CONFIG.ENDPOINTS.PENGELUARAN,
        'kemiskinan': API_CONFIG.ENDPOINTS.KEMISKINAN,
        'ipm': API_CONFIG.ENDPOINTS.IPM,
        'ketenagakerjaan': API_CONFIG.ENDPOINTS.KETENAGAKERJAAN
    };

    const endpoint = endpointMap[visualizationType];
    if (!endpoint) {
        return {
            success: false,
            error: { message: `Unknown visualization type: ${visualizationType}` }
        };
    }

    const queryParams = new URLSearchParams(filters).toString();
    const fullEndpoint = `${endpoint}${queryParams ? `?${queryParams}` : ''}`;
    return await fetchData(fullEndpoint);
}

/**
 * Get mock chart data for testing
 * Remove this function when backend API is ready
 */
function getMockChartData(visualizationType, filters = {}) {
    const mockData = {
        'ntp-bulanan': {
            success: true,
            data: {
                title: 'NTP Bulanan (Nilai Tukar Petani)',
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                values: [105.2, 104.8, 105.5, 105.1, 104.9, 105.3, 105.7, 105.4, 105.6, 105.8, 105.9, 106.1],
                period: 'Januari - Desember 2024'
            }
        },
        'ntp-indeks': {
            success: true,
            data: {
                title: 'Indeks Diterima vs Dibayar Petani',
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                datasets: [
                    {
                        label: 'Indeks Diterima (It)',
                        values: [105.2, 105.5, 106.0, 105.8, 105.6, 105.9, 106.2, 106.0, 106.3, 106.5, 106.7, 107.0],
                        color: '#003D7A'
                    },
                    {
                        label: 'Indeks Dibayar (Ib)',
                        values: [100.0, 100.2, 100.5, 100.3, 100.1, 100.4, 100.6, 100.4, 100.7, 100.9, 101.1, 101.3],
                        color: '#4FC3F7'
                    }
                ],
                period: 'Januari - Desember 2024'
            }
        },
        'ntp-subsektor': {
            success: true,
            data: {
                title: 'NTP per Subsektor',
                labels: ['Tanaman Pangan', 'Hortikultura', 'Perkebunan', 'Peternakan', 'Perikanan'],
                values: [105.2, 104.8, 105.5, 105.1, 104.9],
                period: '2024'
            }
        },
        'tpak': {
            success: true,
            data: {
                title: 'TPAK Tahunan (Tingkat Partisipasi Angkatan Kerja)',
                labels: ['2020', '2021', '2022', '2023', '2024'],
                values: [68.5, 69.2, 69.8, 70.1, 70.5],
                period: '2020-2024'
            }
        },
        'tpt': {
            success: true,
            data: {
                title: 'TPT Tahunan (Tingkat Pengangguran Terbuka)',
                labels: ['2020', '2021', '2022', '2023', '2024'],
                values: [4.2, 4.8, 5.1, 4.9, 4.5],
                period: '2020-2024'
            }
        },
        'komposisi-tenaga-kerja': {
            success: true,
            data: {
                title: 'Komposisi Tenaga Kerja per Sektor',
                labels: ['2020', '2021', '2022', '2023', '2024'],
                datasets: [
                    {
                        label: 'Pertanian',
                        values: [35, 34, 33, 32, 31],
                        color: '#4CAF50'
                    },
                    {
                        label: 'Industri',
                        values: [15, 16, 17, 18, 19],
                        color: '#2196F3'
                    },
                    {
                        label: 'Jasa',
                        values: [25, 26, 27, 28, 29],
                        color: '#FF9800'
                    },
                    {
                        label: 'Konstruksi',
                        values: [10, 11, 12, 13, 14],
                        color: '#9C27B0'
                    },
                    {
                        label: 'Lainnya',
                        values: [15, 13, 11, 9, 7],
                        color: '#F44336'
                    }
                ],
                period: '2020-2024'
            }
        },
        'inflasi': {
            success: true,
            data: {
                title: 'Inflasi (IHK 2022=100) Bulanan',
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
                values: [2.1, 2.3, 2.0, 2.4, 2.2, 2.5],
                period: 'Januari - Juni 2024'
            }
        },
        'pengeluaran': {
            success: true,
            data: {
                title: 'Komposisi Pengeluaran',
                labels: ['Makanan', 'Perumahan', 'Transportasi', 'Lainnya'],
                values: [45, 25, 20, 10],
                period: '2024'
            }
        },
        'kemiskinan': {
            success: true,
            data: {
                title: 'Persentase Penduduk Miskin',
                labels: ['Maret 2020', 'Sept 2020', 'Maret 2021', 'Sept 2021', 'Maret 2022', 'Sept 2022'],
                values: [20.5, 19.8, 19.2, 18.9, 18.5, 18.1],
                period: '2020-2022'
            }
        },
        'ipm': {
            success: true,
            data: {
                title: 'Indeks Pembangunan Manusia (IPM)',
                labels: ['2020', '2021', '2022', '2023', '2024'],
                values: [65.2, 65.8, 66.4, 67.1, 67.8],
                period: '2020-2024'
            }
        },
        'ketenagakerjaan': {
            success: true,
            data: {
                title: 'Tingkat Pengangguran Terbuka (TPT)',
                labels: ['2020', '2021', '2022', '2023', '2024'],
                values: [4.2, 4.8, 5.1, 4.9, 4.5],
                period: '2020-2024'
            }
        }
    };
    
    return mockData[visualizationType] || {
        success: false,
        error: { message: `Mock data not found for: ${visualizationType}` }
    };
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchData,
        getNTPBulanan,
        getIndeksDiterimaDibayar,
        getNTPPerSubsektor,
        getTPAKTahunan,
        getTPTTahunan,
        getKomposisiTenagaKerja,
        submitFeedback,
        getKPIData,
        getChartData,
        APIError
    };
}

