document.addEventListener('DOMContentLoaded', () => {
  // Check if already logged in
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = '/index.html';
  }

  const loginCard = document.getElementById('loginCard');
  const signupCard = document.getElementById('signupCard');
  const showSignupBtn = document.getElementById('showSignup');
  const showLoginBtn = document.getElementById('showLogin');

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  const loginAlert = document.getElementById('loginAlert');
  const signupAlert = document.getElementById('signupAlert');

  // Toggle Forms
  showSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginCard.style.display = 'none';
    signupCard.style.display = 'block';
  });

  showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signupCard.style.display = 'none';
    loginCard.style.display = 'block';
  });

  const showAlert = (element, message) => {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
      element.style.display = 'none';
    }, 5000);
  };

  // Login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = '/index.html';
      } else {
        showAlert(loginAlert, data.message || 'Login failed');
      }
    } catch (err) {
      showAlert(loginAlert, 'An error occurred. Please try again.');
    }
  });

  // Signup
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = '/index.html';
      } else {
        showAlert(signupAlert, data.message || 'Signup failed');
      }
    } catch (err) {
      showAlert(signupAlert, 'An error occurred. Please try again.');
    }
  });
});
