// Authentication Management
class Auth {
    static STORAGE_KEYS = {
        USERS: 'users',
        CURRENT_USER: 'currentUser',
        REMEMBER_ME: 'rememberMe'
    };

    // Check if user is logged in
    static isLoggedIn() {
        return Storage.get(this.STORAGE_KEYS.CURRENT_USER) !== null;
    }

    // Get current logged in user
    static getCurrentUser() {
        return Storage.get(this.STORAGE_KEYS.CURRENT_USER);
    }

    // Register new user
    static register(userData) {
        try {
            const users = Storage.get(this.STORAGE_KEYS.USERS) || [];
            
            // Check if email already exists
            if (users.some(user => user.email === userData.email)) {
                return false;
            }

            // Create new user object
            const newUser = {
                id: this.generateUserId(),
                name: userData.name,
                email: userData.email,
                phone: userData.phone || '',
                password: this.hashPassword(userData.password),
                createdAt: new Date().toLocaleDateString('fa-IR'),
                isActive: true,
                loginMethod: 'email',
                profile_image: userData.profile_image || null
            };

            // Add to users array
            users.push(newUser);
            Storage.set(this.STORAGE_KEYS.USERS, users);

            // Log in the user
            return this.loginUser(newUser);
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    }

    // Register with Google
    static registerWithGoogle(googleData) {
        try {
            const users = Storage.get(this.STORAGE_KEYS.USERS) || [];
            
            // Check if email already exists
            if (users.some(user => user.email === googleData.email)) {
                // User exists, log them in
                return this.loginWithGoogle(googleData);
            }

            // Create new Google user
            const newUser = {
                id: this.generateUserId(),
                name: googleData.name,
                email: googleData.email,
                phone: googleData.phone || '',
                password: null, // No password for Google users
                createdAt: new Date().toLocaleDateString('fa-IR'),
                isActive: true,
                loginMethod: 'google',
                profile_image: googleData.profile_image || null
            };

            users.push(newUser);
            Storage.set(this.STORAGE_KEYS.USERS, users);

            return this.loginUser(newUser);
        } catch (error) {
            console.error('Google registration error:', error);
            return false;
        }
    }

    // Login with email and password
    static login(email, password) {
        try {
            const users = Storage.get(this.STORAGE_KEYS.USERS) || [];
            const user = users.find(u => 
                u.email === email && 
                u.isActive && 
                this.verifyPassword(password, u.password)
            );

            if (user) {
                return this.loginUser(user);
            }

            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }

    // Login with Google
    static loginWithGoogle(googleData) {
        try {
            const users = Storage.get(this.STORAGE_KEYS.USERS) || [];
            const user = users.find(u => 
                u.email === googleData.email && 
                u.isActive
            );

            if (user) {
                // Update user info from Google if needed
                user.name = googleData.name;
                if (googleData.profile_image) {
                    user.profile_image = googleData.profile_image;
                }
                
                // Update users array
                Storage.updateInArray(this.STORAGE_KEYS.USERS, 
                    u => u.id === user.id, 
                    () => user
                );

                return this.loginUser(user);
            }

            return false;
        } catch (error) {
            console.error('Google login error:', error);
            return false;
        }
    }

    // Internal method to set current user
    static loginUser(user) {
        try {
            // Remove password from session data
            const sessionUser = { ...user };
            delete sessionUser.password;

            Storage.set(this.STORAGE_KEYS.CURRENT_USER, sessionUser);
            
            // Update last login
            this.updateLastLogin(user.id);

            return true;
        } catch (error) {
            console.error('Login user error:', error);
            return false;
        }
    }

    // Logout current user
    static logout() {
        try {
            Storage.remove(this.STORAGE_KEYS.CURRENT_USER);
            Storage.remove(this.STORAGE_KEYS.REMEMBER_ME);
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            return false;
        }
    }

    // Update user information
    static updateUser(updatedUser) {
        try {
            // Update in users array
            Storage.updateInArray(this.STORAGE_KEYS.USERS, 
                u => u.id === updatedUser.id,
                u => ({ ...u, ...updatedUser })
            );

            // Update current user session
            const sessionUser = { ...updatedUser };
            delete sessionUser.password;
            Storage.set(this.STORAGE_KEYS.CURRENT_USER, sessionUser);

            return true;
        } catch (error) {
            console.error('Update user error:', error);
            return false;
        }
    }

    // Change password
    static changePassword(currentPassword, newPassword) {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser) return false;

            const users = Storage.get(this.STORAGE_KEYS.USERS) || [];
            const user = users.find(u => u.id === currentUser.id);
            
            if (!user || !this.verifyPassword(currentPassword, user.password)) {
                return false;
            }

            // Update password
            user.password = this.hashPassword(newPassword);
            Storage.set(this.STORAGE_KEYS.USERS, users);

            return true;
        } catch (error) {
            console.error('Change password error:', error);
            return false;
        }
    }

    // Reset password (simplified - in real app would involve email)
    static resetPassword(email, newPassword) {
        try {
            const users = Storage.get(this.STORAGE_KEYS.USERS) || [];
            const userIndex = users.findIndex(u => u.email === email);
            
            if (userIndex === -1) return false;

            users[userIndex].password = this.hashPassword(newPassword);
            Storage.set(this.STORAGE_KEYS.USERS, users);

            return true;
        } catch (error) {
            console.error('Reset password error:', error);
            return false;
        }
    }

    // Get user by email
    static getUserByEmail(email) {
        const users = Storage.get(this.STORAGE_KEYS.USERS) || [];
        return users.find(u => u.email === email);
    }

    // Get user by ID
    static getUserById(id) {
        const users = Storage.get(this.STORAGE_KEYS.USERS) || [];
        return users.find(u => u.id === id);
    }

    // Deactivate user account
    static deactivateAccount() {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser) return false;

            Storage.updateInArray(this.STORAGE_KEYS.USERS,
                u => u.id === currentUser.id,
                u => ({ ...u, isActive: false })
            );

            this.logout();
            return true;
        } catch (error) {
            console.error('Deactivate account error:', error);
            return false;
        }
    }

    // Utility methods
    static generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    static hashPassword(password) {
        // Simple hash - in production use proper hashing like bcrypt
        return btoa(password + 'business_panel_salt');
    }

    static verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    static updateLastLogin(userId) {
        try {
            Storage.updateInArray(this.STORAGE_KEYS.USERS,
                u => u.id === userId,
                u => ({ ...u, lastLogin: new Date().toLocaleString('fa-IR') })
            );
        } catch (error) {
            console.error('Update last login error:', error);
        }
    }

    // Validation methods
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isValidPassword(password) {
        return password && password.length >= 6;
    }

    static isValidPhone(phone) {
        const phoneRegex = /^(\+98|0)?9\d{9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // Session management
    static setRememberMe(value) {
        Storage.set(this.STORAGE_KEYS.REMEMBER_ME, value);
    }

    static getRememberMe() {
        return Storage.get(this.STORAGE_KEYS.REMEMBER_ME) || false;
    }

    // Check session validity (could implement token expiration)
    static isSessionValid() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return false;

        // In a real app, you might check token expiration here
        return true;
    }

    // Get user stats
    static getUserStats() {
        const users = Storage.get(this.STORAGE_KEYS.USERS) || [];
        return {
            totalUsers: users.length,
            activeUsers: users.filter(u => u.isActive).length,
            googleUsers: users.filter(u => u.loginMethod === 'google').length,
            emailUsers: users.filter(u => u.loginMethod === 'email').length
        };
    }

    // Initialize demo users (for testing)
    static initializeDemoUsers() {
        const users = Storage.get(this.STORAGE_KEYS.USERS) || [];
        
        if (users.length === 0) {
            const demoUsers = [
                {
                    id: this.generateUserId(),
                    name: 'کاربر نمونه',
                    email: 'demo@example.com',
                    phone: '09123456789',
                    password: this.hashPassword('123456'),
                    createdAt: new Date().toLocaleDateString('fa-IR'),
                    isActive: true,
                    loginMethod: 'email',
                    profile_image: null
                }
            ];
            
            Storage.set(this.STORAGE_KEYS.USERS, demoUsers);
        }
    }
}

// Initialize demo users when script loads
document.addEventListener('DOMContentLoaded', function() {
    Auth.initializeDemoUsers();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}
