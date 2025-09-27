document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (!form) return;

  // Check if it's the signin form by looking for the #username input
  if (form.querySelector('#username')) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Signin form submitted');
      const username = form.querySelector('#username').value;
      const password = form.querySelector('#password').value;

      if (username && password) {
        // Simulate a successful login
        window.location.href = 'index.html';
      } else {
        alert('Please fill in all fields.');
      }
    });
  }
  // Check if it's the signup form by looking for the #fullname input
  else if (form.querySelector('#fullname')) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Signup form submitted');
      const fullname = form.querySelector('#fullname').value;
      const email = form.querySelector('#email').value;
      const password = form.querySelector('#password').value;

      if (fullname && email && password) {
        // Simulate a successful signup
        window.location.href = 'index.html';
      } else {
        alert('Please fill in all fields.');
      }
    });
  }
});