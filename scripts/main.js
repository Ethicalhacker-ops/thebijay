// Real-time clock
function updateClock() {
  const clockElement = document.getElementById('clock');
  if (clockElement) {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    clockElement.textContent = `${day}, ${date} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
  }
}
setInterval(updateClock, 1000);
updateClock();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Blog search and filtering
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('blog-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogContainer = document.getElementById('blog-container');
    const blogItems = Array.from(blogContainer.querySelectorAll('.animate_top[data-category]'));

    function filterBlogs() {
        const searchQuery = searchInput.value.toLowerCase();
        const activeCategory = document.querySelector('.filter-btn.gh').dataset.category;

        blogItems.forEach(item => {
            const title = item.querySelector('h4 a').textContent.toLowerCase();
            const summary = item.querySelector('p').textContent.toLowerCase();
            const category = item.dataset.category;

            const matchesSearch = title.includes(searchQuery) || summary.includes(searchQuery);
            const matchesCategory = activeCategory === 'all' || category === activeCategory;

            if (matchesSearch && matchesCategory) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterBlogs);
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('gh', 'lk'));
            button.classList.add('gh', 'lk');
            filterBlogs();
        });
    });
});

// Formspree form handling with AJAX
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form[action^="https://formspree.io/"]');

    forms.forEach(form => {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'form-status mt-4 text-center';
        form.appendChild(statusDiv);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = form.querySelector('input[name="email"]');
            const message = form.querySelector('textarea[name="message"]');
            const recaptcha = form.querySelector('.g-recaptcha');
            let errors = [];

            // Validation
            if (!email.value || !message.value) {
                errors.push('Please fill out all required fields.');
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value && !emailRegex.test(email.value)) {
                errors.push('Please enter a valid email address.');
            }
            if (recaptcha && grecaptcha.getResponse().length === 0) {
                errors.push('Please complete the reCAPTCHA.');
            }

            if (errors.length > 0) {
                statusDiv.innerHTML = `<p style="color: red;">${errors.join('<br>')}</p>`;
                return;
            }

            const data = new FormData(form);
            statusDiv.innerHTML = '<p>Sending...</p>';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    statusDiv.innerHTML = '<p style="color: green;">✅ Thank you! Your message has been sent successfully.</p>';
                    form.reset();
                    if(recaptcha) grecaptcha.reset();
                } else {
                    const responseData = await response.json();
                    if (Object.hasOwn(responseData, 'errors')) {
                        statusDiv.innerHTML = `<p style="color: red;">${responseData.errors.map(error => error.message).join(', ')}</p>`;
                    } else {
                        statusDiv.innerHTML = '<p style="color: red;">Oops! There was a problem submitting your form.</p>';
                    }
                }
            } catch (error) {
                statusDiv.innerHTML = '<p style="color: red;">Oops! There was a problem submitting your form.</p>';
            }
        });
    });
});