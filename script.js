import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const SUPABASE_URL = 'https://ssszglrcmlxaiwotvlsc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzc3pnbHJjbWx4YWl3b3R2bHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjU4NDMsImV4cCI6MjA3NjAwMTg0M30.zwWxnFEtvwWNLcNEYHRwJpTUCnrJ8bkZniOwUHJBRYQ'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// --- Helper: allowed emails ---
function allowedEmail(email) {
  return /^gw.*@glow\.sch\.uk$/i.test(email)
}

// --- SIGNUP ---
const signupForm = document.querySelector('#signup-form')
signupForm.addEventListener('submit', async e => {
  e.preventDefault()
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
    // Insert row into custom users table
    const { error: insertError } = await supabase.from('users').insert([{
      id: data.user.id,
      full_name: ''  // empty, will prompt on first login
    }])
    if (insertError) console.error('Error creating user row:', insertError)

    alert('Sign-up successful! Check your email for verification.')
  }
})

// --- LOGIN ---
const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', async e => {
  e.preventDefault()
  const email = e.target.email.value.trim()
  const password = e.target.password.value

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    alert('Login error: ' + error.message)
  } else {
    // Go to dashboard after login
    window.location.href = 'dashboard.html'
  }
})
