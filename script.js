import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Supabase keys
const SUPABASE_URL = 'https://ssszglrcmlxaiwotvlsc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzc3pnbHJjbWx4YWl3b3R2bHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjU4NDMsImV4cCI6MjA3NjAwMTg0M30.zwWxnFEtvwWNLcNEYHRwJpTUCnrJ8bkZniOwUHJBRYQ'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Allow only emails starting with 'gw' and ending with '@glow.sch.uk'
function allowedEmail(email) {
  return /^gw.*@glow\.sch\.uk$/i.test(email)
}

// --- Sign Up ---
const signupForm = document.querySelector('#signup-form')
signupForm.addEventListener('submit', async e => {
  e.preventDefault()  // stop the default form submission
  const email = e.target.email.value.trim()
  const password = e.target.password.value

  if (!allowedEmail(email)) {
    alert('Email not allowed. Must start with "gw" and end with "@glow.sch.uk"')
    return
  }

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) {
    alert('Sign up error: ' + error.message)
  } else {
    alert('Sign-up successful! Check your email for verification.')
  }
})

// --- Log In ---
const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', async e => {
  e.preventDefault()  // stop the default form submission
  const email = e.target.email.value.trim()
  const password = e.target.password.value

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    alert('Login error: ' + error.message)
  } else {
    alert('Logged in successfully!')
    window.location.href = 'dashboard.html'  // <-- redirect to dashboard after login
  }
})
