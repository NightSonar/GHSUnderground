import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const SUPABASE_URL = 'https://ssszglrcmlxaiwotvlsc.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// --- Sign Up ---
const signupForm = document.querySelector('#signup-form')
signupForm.addEventListener('submit', async e => {
  e.preventDefault()
  const fullName = e.target.full_name.value.trim()
  const email = e.target.email.value.trim()
  const password = e.target.password.value

  if (!/^gw.*@glow\.sch\.uk$/i.test(email)) {
    alert('Email must start with "gw" and end with "@glow.sch.uk"')
    return
  }

  // Sign up user
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email,
    password
  })

  if (signupError) {
    alert('Sign up error: ' + signupError.message)
    return
  }

  // Add to profiles table
  const { error: profileError } = await supabase.from('profiles').insert([
    {
      id: signupData.user.id,   // auth user id
      full_name: fullName,      // THIS IS THE IMPORTANT FIX
      email: email
    }
  ])

  if (profileError) {
    alert('Error saving profile: ' + profileError.message)
    return
  }

  alert('Sign-up successful! Check your email for verification.')
})

// --- Log In ---
const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', async e => {
  e.preventDefault()
  const email = e.target.email.value.trim()
  const password = e.target.password.value

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    alert('Login error: ' + error.message)
  } else {
    window.location.href = 'dashboard.html'
  }
})
