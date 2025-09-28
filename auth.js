document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('#signup-form');
    const signinForm = document.querySelector('#signin-form');
    const logoutBtn = document.querySelector('#logout-btn');
    const welcomeMessage = document.querySelector('#welcome-message');

    // Utility to "hash" password (for simulation purposes)
    const hashPassword = (password) => `hashed_${password}`;

    // --- Sign Up Logic ---
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Validation
            if (!fullName || !email || !password || !confirmPassword) {
                alert('All fields are required.');
                return;
            }
            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }
            if (password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
                alert('Password must be at least 8 characters long and contain a number and a special character.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(user => user.email === email)) {
                alert('Email is already registered.');
                return;
            }

            const newUser = {
                fullName,
                email,
                password: hashPassword(password)
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('session', JSON.stringify(newUser));
            window.location.href = 'dashboard.html';
        });
    }

    // --- Sign In Logic ---
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                alert('Both email and password are required.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === hashPassword(password));

            if (user) {
                localStorage.setItem('session', JSON.stringify(user));
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid credentials.');
            }
        });
    }

    // --- Dashboard and Logout Logic ---
    if (window.location.pathname.endsWith('dashboard.html')) {
        const session = JSON.parse(localStorage.getItem('session'));
        if (!session) {
            window.location.href = 'signin.html';
        } else {
            if (welcomeMessage) {
                welcomeMessage.textContent = `Welcome, ${session.fullName}!`;
            }
        }
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('session');
            window.location.href = 'signin.html';
        });
    }
});