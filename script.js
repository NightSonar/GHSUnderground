const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');
const loginMessage = document.getElementById('loginMessage');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  const res = await fetch('/signup', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });

  const result = await res.json();
  message.textContent = result.message;
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    email: document.getElementById('loginEmail').value,
    password: document.getElementById('loginPassword').value
  };

  const res = await fetch('/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });

  const result = await res.json();
  loginMessage.textContent = result.message;

  if(result.success) {
    // Redirect to dashboard
    window.location.href = '/dashboard';
  }
});
