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

            const toggle2faBtn = document.getElementById('toggle-2fa-btn');
            if (toggle2faBtn) {
                const update2faButton = () => {
                    const session = JSON.parse(localStorage.getItem('session'));
                    if (session && session.twoFactorEnabled) {
                        toggle2faBtn.textContent = 'Disable 2FA';
                    } else {
                        toggle2faBtn.textContent = 'Enable 2FA';
                    }
                };

                toggle2faBtn.addEventListener('click', () => {
                    const session = JSON.parse(localStorage.getItem('session'));
                    if (!session) return;

                    session.twoFactorEnabled = !session.twoFactorEnabled;
                    localStorage.setItem('session', JSON.stringify(session));

                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const userIndex = users.findIndex(u => u.email === session.email);
                    if (userIndex > -1) {
                        users[userIndex].twoFactorEnabled = session.twoFactorEnabled;
                        localStorage.setItem('users', JSON.stringify(users));
                    }

                    update2faButton();
                    alert(`Two-Factor Authentication has been ${session.twoFactorEnabled ? 'enabled' : 'disabled'}.`);
                });

                update2faButton(); // Set initial button text on page load
            }

            // Blog Management Logic
            const blogModal = document.getElementById('blog-post-modal');
            const blogPostForm = document.getElementById('blog-post-form');
            const blogPostsTable = document.getElementById('blog-posts-table');

            const renderBlogPosts = () => {
                if (!blogPostsTable) return;
                let posts = JSON.parse(localStorage.getItem('blogPosts'));
                if (!posts) {
                    // Seed with some initial data if none exists
                    posts = [
                        { title: 'Cyber Security for Your Business', category: 'Cybersecurity', date: '2022-02-13T00:00:00.000Z', content: 'In today...', imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6' },
                        { title: 'Cloud Computing for IT', category: 'Cloud', date: '2023-11-06T00:00:00.000Z', content: 'Cloud computing has...', imageUrl: 'https://images.unsplash.com/photo-1517694712202-1428bc38aa4a' }
                    ];
                    localStorage.setItem('blogPosts', JSON.stringify(posts));
                }

                blogPostsTable.innerHTML = '';
                posts.forEach((post, index) => {
                    const row = `
                        <tr class="border-b border-gray-200 dark:border-gray-700">
                            <td class="p-3">${post.title}</td>
                            <td class="p-3">${post.category}</td>
                            <td class="p-3">${new Date(post.date).toLocaleDateString()}</td>
                            <td class="p-3">
                                <button class="text-blue-500 hover:underline" onclick="editPost(${index})">Edit</button>
                                <button class="text-red-500 hover:underline ml-2" onclick="deletePost(${index})">Delete</button>
                            </td>
                        </tr>
                    `;
                    blogPostsTable.insertAdjacentHTML('beforeend', row);
                });
            };

            window.editPost = (index) => {
                const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
                const post = posts[index];
                if (post) {
                    document.getElementById('blog-post-id').value = index;
                    document.getElementById('blog-title').value = post.title;
                    document.getElementById('blog-category').value = post.category;
                    document.getElementById('blog-content').value = post.content;
                    document.getElementById('blog-image-url').value = post.imageUrl;
                    blogModal.__x.$data.blogModalOpen = true;
                }
            };

            window.deletePost = (index) => {
                if (confirm('Are you sure you want to delete this post?')) {
                    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
                    posts.splice(index, 1);
                    localStorage.setItem('blogPosts', JSON.stringify(posts));
                    renderBlogPosts();
                }
            };

            if (blogPostForm) {
                blogPostForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const postId = document.getElementById('blog-post-id').value;
                    const post = {
                        title: document.getElementById('blog-title').value,
                        category: document.getElementById('blog-category').value,
                        content: document.getElementById('blog-content').value,
                        imageUrl: document.getElementById('blog-image-url').value,
                        date: new Date().toISOString()
                    };

                    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
                    if (postId !== '') {
                        posts[postId] = post;
                    } else {
                        posts.push(post);
                    }
                    localStorage.setItem('blogPosts', JSON.stringify(posts));
                    renderBlogPosts();
                    blogModal.__x.$data.blogModalOpen = false;
                    blogPostForm.reset();
                    document.getElementById('blog-post-id').value = '';
                });
            }

            // Initial render for blog posts
            renderBlogPosts();

            const createProjectBtn = document.getElementById('create-project-btn');
            if (createProjectBtn) {
                createProjectBtn.addEventListener('click', () => {
                    const projectName = prompt("Enter the new project name:");
                    if (projectName) {
                        const projectsContainer = document.getElementById('projects-container');
                        const newProjectHTML = `
                            <div class="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                <h4 class="font-bold text-lg">${projectName}</h4>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div>
                                        <h5 class="font-semibold mb-2 text-center">To Do</h5>
                                        <div class="space-y-2"></div>
                                        <button class="mt-3 w-full text-sm text-blue-500 hover:underline">Add Task</button>
                                    </div>
                                    <div>
                                        <h5 class="font-semibold mb-2 text-center">In Progress</h5>
                                        <div class="space-y-2"></div>
                                    </div>
                                    <div>
                                        <h5 class="font-semibold mb-2 text-center">Done</h5>
                                        <div class="space-y-2"></div>
                                    </div>
                                </div>
                            </div>
                        `;
                        projectsContainer.insertAdjacentHTML('beforeend', newProjectHTML);
                        alert(`Project "${projectName}" created successfully.`);
                    }
                });
            }

            const fileUploadInput = document.getElementById('file-upload-input');
            const filePreview = document.getElementById('file-preview');

            if (fileUploadInput) {
                fileUploadInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        filePreview.innerHTML = ''; // Clear previous preview
                        const fileReader = new FileReader();

                        fileReader.onload = () => {
                            let previewContent = '';
                            if (file.type.startsWith('image/')) {
                                previewContent = `<img src="${fileReader.result}" alt="${file.name}" class="max-h-48 mx-auto">`;
                            } else {
                                previewContent = `<p class="text-center">${file.name}</p>`;
                            }
                            filePreview.innerHTML = previewContent;
                            alert(`File "${file.name}" selected and ready for upload.`);
                        };

                        fileReader.readAsDataURL(file);
                    }
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