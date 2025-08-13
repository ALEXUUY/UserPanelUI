// Main Application Helper Functions
class App {
    static TOAST_DURATION = 3000;
    static ACTIVITY_LIMIT = 50;

    // Initialize application
    static init() {
        this.setupEventListeners();
        this.loadTheme();
        this.setupTooltips();
    }

    // Setup global event listeners
    static setupEventListeners() {
        // Handle mobile menu
        document.addEventListener('click', function(e) {
            if (e.target.closest('.mobile-menu-trigger')) {
                App.toggleMobileMenu();
            }
        });

        // Handle file uploads
        document.addEventListener('change', function(e) {
            if (e.target.type === 'file') {
                App.handleFileUpload(e.target);
            }
        });

        // Handle form submissions
        document.addEventListener('submit', function(e) {
            if (e.target.classList.contains('validate-form')) {
                if (!App.validateForm(e.target)) {
                    e.preventDefault();
                }
            }
        });

        // Handle escape key for modals
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                App.closeModals();
            }
        });

        // Handle click outside dropdowns
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                App.closeDropdowns();
            }
        });
    }

    // Toast notification system
    static showToast(message, type = 'info', duration = this.TOAST_DURATION) {
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        
        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            <div class="toast-content">
                <i class="${icon}"></i>
                <span>${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles if not already present
        if (!document.getElementById('toast-styles')) {
            this.addToastStyles();
        }

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('toast-show'), 100);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => toast.remove(), 300);
        }, duration);

        return toast;
    }

    static getToastIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    static addToastStyles() {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast-notification {
                position: fixed;
                top: 20px;
                left: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 9999;
                min-width: 300px;
                transform: translateX(-100%);
                opacity: 0;
                transition: all 0.3s ease;
            }
            .toast-notification.toast-show {
                transform: translateX(0);
                opacity: 1;
            }
            .toast-content {
                display: flex;
                align-items: center;
                padding: 15px;
                gap: 10px;
            }
            .toast-success { border-right: 4px solid #28a745; }
            .toast-error { border-right: 4px solid #dc3545; }
            .toast-warning { border-right: 4px solid #ffc107; }
            .toast-info { border-right: 4px solid #17a2b8; }
            .toast-success i { color: #28a745; }
            .toast-error i { color: #dc3545; }
            .toast-warning i { color: #ffc107; }
            .toast-info i { color: #17a2b8; }
            .toast-close {
                background: none;
                border: none;
                margin-right: auto;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .toast-close:hover {
                color: #333;
            }
        `;
        document.head.appendChild(style);
    }

    // Activity tracking system
    static addActivity(icon, text, timestamp = null) {
        const activities = Storage.get('recentActivities') || [];
        
        const activity = {
            id: Date.now(),
            icon: icon,
            text: text,
            time: timestamp || new Date().toLocaleString('fa-IR')
        };

        activities.unshift(activity);

        // Limit activities
        if (activities.length > this.ACTIVITY_LIMIT) {
            activities.splice(this.ACTIVITY_LIMIT);
        }

        Storage.set('recentActivities', activities);
        
        // Update UI if on dashboard
        this.updateActivityUI();
    }

    static updateActivityUI() {
        const container = document.getElementById('recentActivity');
        if (!container) return;

        const activities = Storage.get('recentActivities') || [];
        
        if (activities.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">هیچ فعالیتی ثبت نشده است</p>';
            return;
        }

        container.innerHTML = activities.slice(0, 10).map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p class="activity-text">${activity.text}</p>
                    <small class="activity-time">${activity.time}</small>
                </div>
            </div>
        `).join('');
    }

    // Form validation
    static validateForm(form) {
        let isValid = true;
        const errors = [];

        // Clear previous errors
        form.querySelectorAll('.error-message').forEach(el => el.remove());
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        // Validate required fields
        form.querySelectorAll('[required]').forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'این فیلد الزامی است');
                isValid = false;
            }
        });

        // Validate email fields
        form.querySelectorAll('input[type="email"]').forEach(field => {
            if (field.value && !this.isValidEmail(field.value)) {
                this.showFieldError(field, 'فرمت ایمیل معتبر نیست');
                isValid = false;
            }
        });

        // Validate phone fields
        form.querySelectorAll('input[type="tel"]').forEach(field => {
            if (field.value && !this.isValidPhone(field.value)) {
                this.showFieldError(field, 'شماره تلفن معتبر نیست');
                isValid = false;
            }
        });

        // Validate URL fields
        form.querySelectorAll('input[type="url"]').forEach(field => {
            if (field.value && !this.isValidUrl(field.value)) {
                this.showFieldError(field, 'آدرس وب معتبر نیست');
                isValid = false;
            }
        });

        // Validate number fields
        form.querySelectorAll('input[type="number"]').forEach(field => {
            const min = field.getAttribute('min');
            const max = field.getAttribute('max');
            const value = parseFloat(field.value);

            if (field.value && isNaN(value)) {
                this.showFieldError(field, 'عدد معتبری وارد کنید');
                isValid = false;
            } else if (min && value < parseFloat(min)) {
                this.showFieldError(field, `حداقل مقدار ${min} است`);
                isValid = false;
            } else if (max && value > parseFloat(max)) {
                this.showFieldError(field, `حداکثر مقدار ${max} است`);
                isValid = false;
            }
        });

        // Validate password confirmation
        const password = form.querySelector('input[type="password"]');
        const confirmPassword = form.querySelector('input[name="confirmPassword"], input[id*="confirm"]');
        
        if (password && confirmPassword && password.value !== confirmPassword.value) {
            this.showFieldError(confirmPassword, 'رمز عبور و تکرار آن یکسان نیستند');
            isValid = false;
        }

        if (!isValid) {
            this.showToast('لطفاً خطاهای فرم را بررسی کنید', 'error');
        }

        return isValid;
    }

    static showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-danger small mt-1';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    // File upload handling
    static handleFileUpload(input) {
        const files = Array.from(input.files);
        const maxSize = parseInt(input.dataset.maxSize) || 10 * 1024 * 1024; // 10MB default
        const allowedTypes = input.dataset.allowedTypes ? input.dataset.allowedTypes.split(',') : [];

        for (const file of files) {
            // Check file size
            if (file.size > maxSize) {
                this.showToast(`فایل ${file.name} بیش از حد مجاز بزرگ است`, 'error');
                input.value = '';
                return false;
            }

            // Check file type
            if (allowedTypes.length > 0 && !allowedTypes.some(type => file.type.includes(type))) {
                this.showToast(`نوع فایل ${file.name} مجاز نیست`, 'error');
                input.value = '';
                return false;
            }
        }

        // Show upload progress if multiple files
        if (files.length > 1) {
            this.showToast(`${files.length} فایل انتخاب شد`, 'success');
        }

        return true;
    }

    // Utility functions
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isValidPhone(phone) {
        const phoneRegex = /^(\+98|0)?9\d{9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // Date and time utilities
    static formatDate(date, locale = 'fa-IR') {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        return date.toLocaleDateString(locale);
    }

    static formatDateTime(date, locale = 'fa-IR') {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        return date.toLocaleString(locale);
    }

    static timeAgo(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'همین الان';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} دقیقه پیش`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ساعت پیش`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} روز پیش`;
        
        return this.formatDate(date);
    }

    // Number formatting
    static formatNumber(number, locale = 'fa-IR') {
        return new Intl.NumberFormat(locale).format(number);
    }

    static formatCurrency(amount, currency = 'IRR', locale = 'fa-IR') {
        if (currency === 'IRR') {
            return `${this.formatNumber(amount)} تومان`;
        }
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    // String utilities
    static truncateText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    static slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // UI utilities
    static scrollToTop(smooth = true) {
        window.scrollTo({
            top: 0,
            behavior: smooth ? 'smooth' : 'auto'
        });
    }

    static scrollToElement(element, offset = 0) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element) {
            const top = element.offsetTop - offset;
            window.scrollTo({
                top: top,
                behavior: 'smooth'
            });
        }
    }

    static toggleClass(element, className) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element) {
            element.classList.toggle(className);
        }
    }

    // Modal utilities
    static closeModals() {
        document.querySelectorAll('.modal.show').forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
    }

    static closeDropdowns() {
        document.querySelectorAll('.dropdown-menu.show').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }

    // Theme management
    static setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        Storage.set('userTheme', theme);
    }

    static getTheme() {
        return Storage.get('userTheme') || 'light';
    }

    static loadTheme() {
        const theme = this.getTheme();
        this.setTheme(theme);
    }

    static toggleTheme() {
        const currentTheme = this.getTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        this.showToast(`تم ${newTheme === 'dark' ? 'تیره' : 'روشن'} فعال شد`, 'success');
    }

    // Mobile menu handling
    static toggleMobileMenu() {
        const menu = document.querySelector('.mobile-menu-overlay');
        if (menu) {
            menu.classList.toggle('show');
        }
    }

    // Tooltip setup
    static setupTooltips() {
        // Initialize Bootstrap tooltips if available
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => 
                new bootstrap.Tooltip(tooltipTriggerEl)
            );
        }
    }

    // Loading state management
    static showLoading(element, text = 'در حال بارگذاری...') {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element) {
            element.innerHTML = `
                <div class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">${text}</span>
                    </div>
                    <div class="mt-2">${text}</div>
                </div>
            `;
        }
    }

    static hideLoading(element, originalContent = '') {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element) {
            element.innerHTML = originalContent;
        }
    }

    // Local storage helpers
    static exportData() {
        const data = Storage.backup();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `business-panel-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.showToast('پشتیبان‌گیری کامل شد', 'success');
    }

    static importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                Storage.restore(data);
                this.showToast('بازیابی اطلاعات کامل شد', 'success');
                setTimeout(() => window.location.reload(), 1000);
            } catch (error) {
                this.showToast('خطا در بازیابی اطلاعات', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Debug utilities
    static log(message, data = null) {
        if (process.env.NODE_ENV === 'development' || localStorage.getItem('debug') === 'true') {
            console.log(`[App] ${message}`, data);
        }
    }

    static enableDebug() {
        localStorage.setItem('debug', 'true');
        this.showToast('حالت دیباگ فعال شد', 'info');
    }

    static disableDebug() {
        localStorage.removeItem('debug');
        this.showToast('حالت دیباگ غیرفعال شد', 'info');
    }

    // Performance monitoring
    static measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        this.log(`Performance: ${name} took ${end - start} milliseconds`);
        return result;
    }

    // Error handling
    static handleError(error, context = 'Unknown') {
        this.log(`Error in ${context}:`, error);
        this.showToast('خطایی رخ داده است. لطفاً دوباره تلاش کنید', 'error');
        
        // Send error to monitoring service (if available)
        if (window.errorTracker) {
            window.errorTracker.report(error, context);
        }
    }

    // Initialize app when DOM is ready
    static ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }
}

// Initialize app when DOM is ready
App.ready(() => {
    App.init();
});

// Global error handler
window.addEventListener('error', (event) => {
    App.handleError(event.error, 'Global');
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    App.handleError(event.reason, 'Promise Rejection');
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}

// Make App globally available
window.App = App;
