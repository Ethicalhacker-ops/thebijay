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
            // Populate dashboard fields
            document.getElementById('welcome-message').textContent = `Welcome, ${session.fullName}!`;
            document.getElementById('username-display').textContent = session.fullName;
            document.getElementById('profile-name').textContent = session.fullName;
            document.getElementById('profile-email').textContent = session.email;
            // Mock data for new fields
            document.getElementById('profile-phone').textContent = session.phone || '123-456-7890';
            document.getElementById('profile-address').textContent = session.address || '123 Main St, Anytown, USA';

            // Add mock functionality for buttons
            const editProfileBtn = document.getElementById('edit-profile-btn');
            const editProfileForm = document.getElementById('edit-profile-form');
            const editModal = document.getElementById('edit-profile-modal');

            const openEditModal = () => {
                const session = JSON.parse(localStorage.getItem('session'));
                document.getElementById('edit-fullname').value = session.fullName || '';
                document.getElementById('edit-phone').value = session.phone || '';
                document.getElementById('edit-address').value = session.address || '';
                document.getElementById('edit-pic-url').value = session.profilePic || '';
                editModal.__x.$data.editModalOpen = true;
            };

            if (editProfileBtn) {
                editProfileBtn.addEventListener('click', openEditModal);
            }

            const uploadPicBtn = document.getElementById('upload-pic-btn');
            if (uploadPicBtn) {
                uploadPicBtn.addEventListener('click', openEditModal);
            }

            if (editProfileForm) {
                editProfileForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const session = JSON.parse(localStorage.getItem('session'));
                    if (!session) return;

                    session.fullName = document.getElementById('edit-fullname').value;
                    session.phone = document.getElementById('edit-phone').value;
                    session.address = document.getElementById('edit-address').value;
                    session.profilePic = document.getElementById('edit-pic-url').value;

                    localStorage.setItem('session', JSON.stringify(session));

                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const userIndex = users.findIndex(u => u.email === session.email);
                    if (userIndex > -1) {
                        users[userIndex] = { ...users[userIndex], ...session };
                        localStorage.setItem('users', JSON.stringify(users));
                    }

                    document.getElementById('welcome-message').textContent = `Welcome, ${session.fullName}!`;
                    document.getElementById('username-display').textContent = session.fullName;
                    document.getElementById('profile-name').textContent = session.fullName;
                    document.getElementById('profile-phone').textContent = session.phone || 'N/A';
                    document.getElementById('profile-address').textContent = session.address || 'N/A';
                    if (session.profilePic) {
                        document.getElementById('profile-pic').src = session.profilePic;
                        document.getElementById('top-bar-profile-pic').src = session.profilePic;
                    }

                    editModal.__x.$data.editModalOpen = false;
                    alert('Profile updated!');
                });
            }

            const resetPasswordLink = document.getElementById('reset-password-link');
            const passwordResetModal = document.getElementById('password-reset-modal');
            const passwordResetForm = document.getElementById('password-reset-form');

            if (resetPasswordLink) {
                resetPasswordLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    passwordResetModal.__x.$data.passwordModalOpen = true;
                });
            }

            if (passwordResetForm) {
                passwordResetForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const newPassword = document.getElementById('new-password').value;
                    const confirmPassword = document.getElementById('confirm-password').value;

                    if (!newPassword || !confirmPassword) {
                        alert('Both password fields are required.');
                        return;
                    }
                    if (newPassword !== confirmPassword) {
                        alert('Passwords do not match.');
                        return;
                    }
                    if (newPassword.length < 8 || !/\d/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
                        alert('Password must be at least 8 characters long and contain a number and a special character.');
                        return;
                    }

                    const session = JSON.parse(localStorage.getItem('session'));
                    if (!session) return;

                    session.password = hashPassword(newPassword);
                    localStorage.setItem('session', JSON.stringify(session));

                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const userIndex = users.findIndex(u => u.email === session.email);
                    if (userIndex > -1) {
                        users[userIndex].password = session.password;
                        localStorage.setItem('users', JSON.stringify(users));
                    }

                    passwordResetModal.__x.$data.passwordModalOpen = false;
                    alert('Password has been reset successfully.');
                });
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