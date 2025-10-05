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

// Contact form validation
const contactForm = document.getElementById('contact-form');
const formMessages = document.getElementById('form-messages');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const name = formData.get('fullname');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        if (!name || !email || !subject || !message) {
            formMessages.textContent = 'All fields are required.';
            formMessages.style.color = 'red';
            return;
        }

        // Simulate form submission
        setTimeout(() => {
            formMessages.textContent = 'Your message has been sent successfully!';
            formMessages.style.color = 'green';
            contactForm.reset();
        }, 1000);
    });
}