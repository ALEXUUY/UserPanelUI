// Local Storage Management
class Storage {
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    static get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }

    static exists(key) {
        return localStorage.getItem(key) !== null;
    }

    static size() {
        return localStorage.length;
    }

    static keys() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            keys.push(localStorage.key(i));
        }
        return keys;
    }

    // Utility methods for common data operations
    static addToArray(key, item) {
        const array = this.get(key) || [];
        array.push(item);
        return this.set(key, array);
    }

    static removeFromArray(key, predicate) {
        const array = this.get(key) || [];
        const filteredArray = array.filter(predicate);
        return this.set(key, filteredArray);
    }

    static updateInArray(key, predicate, updateFn) {
        const array = this.get(key) || [];
        const updatedArray = array.map(item => 
            predicate(item) ? updateFn(item) : item
        );
        return this.set(key, updatedArray);
    }

    // Session-specific storage
    static setSession(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to sessionStorage:', error);
            return false;
        }
    }

    static getSession(key) {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from sessionStorage:', error);
            return null;
        }
    }

    static removeSession(key) {
        try {
            sessionStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from sessionStorage:', error);
            return false;
        }
    }

    // Data backup and restore
    static backup() {
        const backup = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            backup[key] = localStorage.getItem(key);
        }
        return backup;
    }

    static restore(backup) {
        try {
            this.clear();
            for (const [key, value] of Object.entries(backup)) {
                localStorage.setItem(key, value);
            }
            return true;
        } catch (error) {
            console.error('Error restoring backup:', error);
            return false;
        }
    }

    // Data validation
    static isValidJson(str) {
        try {
            JSON.parse(str);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Storage size calculation
    static getStorageSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return total;
    }

    static formatStorageSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    // Initialize default data structure
    static initializeDefaults() {
        const defaults = {
            users: [],
            currentUser: null,
            userProfile: {},
            userWebsites: [],
            userCampaigns: [],
            marketingCampaigns: [],
            userBooks: [],
            userTickets: [],
            userAffiliates: [],
            affiliateStats: {
                totalAffiliates: 0,
                activeAffiliates: 0,
                totalCommission: 0,
                affiliateSales: 0
            },
            affiliateEarnings: [],
            userStats: {
                totalOrders: 0,
                totalAffiliates: 0,
                totalEarnings: 0,
                pendingRequests: 0
            },
            marketingStats: {
                totalViews: 1250,
                totalClicks: 89,
                conversionRate: 7.1,
                totalShares: 45
            },
            recentActivities: [],
            notificationSettings: {
                emailOrders: true,
                emailMarketing: true,
                emailNews: false,
                smsImportant: true,
                smsPayments: true
            }
        };

        // Only set defaults if they don't exist
        for (const [key, value] of Object.entries(defaults)) {
            if (!this.exists(key)) {
                this.set(key, value);
            }
        }
    }
}

// Initialize storage when the script loads
document.addEventListener('DOMContentLoaded', function() {
    Storage.initializeDefaults();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
