/**
 * Utility Functions for UI States (Loading, Error, etc.)
 */

/**
 * Show loading state in a container
 * @param {HTMLElement} container - Container element
 * @param {string} message - Loading message
 */
function showLoading(container, message = 'Memuat data...') {
    if (!container) return;
    
    container.innerHTML = `
        <div class="loading-container" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            min-height: 300px;
            color: #666;
        ">
            <div class="loading-spinner" style="
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #003D7A;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 15px;
            "></div>
            <p style="font-size: 14px; margin: 0;">${message}</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
}

/**
 * Show error state in a container
 * @param {HTMLElement} container - Container element
 * @param {string} message - Error message
 * @param {Function} retryCallback - Optional retry callback function
 */
function showError(container, message = 'Terjadi kesalahan saat memuat data', retryCallback = null) {
    if (!container) return;
    
    const retryButton = retryCallback ? `
        <button onclick="retryCallback()" style="
            margin-top: 15px;
            padding: 8px 20px;
            background: #003D7A;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
        ">Coba Lagi</button>
    ` : '';
    
    container.innerHTML = `
        <div class="error-container" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            min-height: 300px;
            color: #F44336;
            padding: 20px;
            text-align: center;
        ">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 15px;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p style="font-size: 14px; margin: 0; color: #666;">${message}</p>
            ${retryButton}
        </div>
    `;
    
    if (retryCallback) {
        // Store retry callback in container for button onclick
        container._retryCallback = retryCallback;
        const button = container.querySelector('button');
        if (button) {
            button.onclick = () => {
                container._retryCallback();
            };
        }
    }
}

/**
 * Show empty state in a container
 * @param {HTMLElement} container - Container element
 * @param {string} message - Empty state message
 */
function showEmpty(container, message = 'Tidak ada data tersedia') {
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-container" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            min-height: 300px;
            color: #999;
            padding: 20px;
            text-align: center;
        ">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 15px; opacity: 0.5;">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <p style="font-size: 14px; margin: 0;">${message}</p>
        </div>
    `;
}

/**
 * Show success message
 * @param {HTMLElement} container - Container element
 * @param {string} message - Success message
 * @param {number} duration - Duration in milliseconds before auto-hide
 */
function showSuccess(container, message, duration = 3000) {
    if (!container) return;
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    if (duration > 0) {
        setTimeout(() => {
            successDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 300);
        }, duration);
    }
    
    // Add animation styles if not already added
    if (!document.getElementById('success-animations')) {
        const style = document.createElement('style');
        style.id = 'success-animations';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Get selected filters from the page
 * @returns {object} - Selected filters
 */
function getSelectedFilters() {
    const filters = {
        years: [],
        regions: []
    };
    
    // Get selected years
    document.querySelectorAll('input[type="checkbox"][value*="20"]:checked').forEach(checkbox => {
        if (/^\d{4}$/.test(checkbox.value)) {
            filters.years.push(checkbox.value);
        }
    });
    
    // Get selected regions
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        if (!/^\d{4}$/.test(checkbox.value)) {
            filters.regions.push(checkbox.value);
        }
    });
    
    return filters;
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date
 */
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

/**
 * Format number with Indonesian locale
 * @param {number} number - Number to format
 * @param {number} decimals - Number of decimals
 * @returns {string} - Formatted number
 */
function formatNumber(number, decimals = 2) {
    if (number === null || number === undefined) return '-';
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


