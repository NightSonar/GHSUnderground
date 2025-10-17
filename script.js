import { createClient } from 'https://esm.sh/@supabase/supabase-js'

// Supabase keys
const SUPABASE_URL = 'https://ssszglrcmlxaiwotvlsc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzc3pnbHJjbWx4YWl3b3R2bHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjU4NDMsImV4cCI6MjA3NjAwMTg0M30.zwWxnFEtvwWNLcNEYHRwJpTUCnrJ8bkZniOwUHJBRYQ'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// --- Allow only emails starting with 'gw' and ending with '@glow.sch.uk' ---
function allowedEmail(email) {
  return /^gw.*@glow\.sch\.uk$/i.test(email)
}

// --- Sign Up ---
const signupForm = document.querySelector('#signup-form')
signupForm.addEventListener('submit', async e => {
  e.preventDefault()
  const fullName = e.target.full_name.value.trim()
  const email = e.target.email.value.trim()
  const password = e.target.password.value

  if (!allowedEmail(email)) {
    alert('Email not allowed. Must start with "gw" and end with "@glow.sch.uk"')
    return
  }

  // Sign up user
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) {
    alert('Sign up error: ' + error.message)
    return
  }

  // Insert profile row
  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ user_id: data.user.id, full_name: fullName, email }])
    if (profileError) console.error("Error saving profile:", profileError)
  } catch (err) {
    console.error("Error inserting profile:", err)
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
    alert('Logged in successfully!')
    window.location.href = 'dashboard.html'
  }
})

// --- Chatroom message send function ---
// This part is usually used in dashboard.html, but if you plan to handle chat in script.js, it goes here.
const chatForm = document.querySelector('#chat-form')
const chatInput = document.querySelector('#chat-input')
if (chatForm && chatInput) {
  const { data: { user } } = await supabase.auth.getUser()
  chatForm.addEventListener('submit', async e => {
    e.preventDefault()
    const content = chatInput.value.trim()
    if (!content) return

    // Fetch full name from profiles
    let fullName = user.email
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single()
      if (!error && profileData?.full_name) fullName = profileData.full_name
    } catch (err) {
      console.warn("Using email as fallback:", err)
    }

    const { error } = await supabase.from('messages').insert([{
      user_id: user.id,
      full_name: fullName,
      content
    }])
    if (error) console.error("Insert failed:", error)
    chatInput.value = ''
  })
}
