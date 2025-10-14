const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// For Replit DB
const Database = require('@replit/database');
const db = new Database();

app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve HTML, CSS, JS

// Sign-up route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await db.get(email);
  if(existingUser) return res.json({message: 'Email already registered'});

  // New user stored with "approved" false
  await db.set(email, { username, password, approved: false, points: 0 });
  res.json({message: 'Sign-up successful! Waiting for admin approval.'});
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.get(email);

  if(!user) return res.json({message: 'User not found', success: false});
  if(user.password !== password) return res.json({message: 'Wrong password', success: false});
  if(!user.approved) return res.json({message: 'Waiting for admin approval', success: false});

  res.json({message: 'Login successful!', success: true});
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
