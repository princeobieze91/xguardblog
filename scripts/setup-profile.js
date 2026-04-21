const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://essorqboloappvfwjcbh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzc29ycWJvbG9hcHB2ZndqY2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODg3OTYsImV4cCI6MjA5MjE2NDc5Nn0.Ha3w6lySP5vKbvvzwW0LD6i8eXK2-TBPfEbZ2PYD4aU'
);

async function setupProfile() {
  // Create auth user first
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'prince@xguard.dev',
    password: 'xguard2026',
    email_confirm: true,
    user_metadata: { name: 'Prince F.O', username: 'prince-dev' }
  });

  if (authError) {
    if (authError.message.includes('already been registered')) {
      console.log('User already exists, fetching profile...');
    } else {
      console.log('Auth error:', authError.message);
      return;
    }
  }

  const userId = authData?.user?.id || '00000000-0000-0000-0000-000000000001';

  // Now insert profile
  const { error } = await supabase.from('profiles').insert({
    id: userId,
    email: 'prince@xguard.dev',
    name: 'Prince F.O',
    username: 'prince-dev',
    role: 'author'
  });

  if (error) {
    if (error.message.includes('duplicate')) {
      console.log('✓ Profile already exists');
    } else {
      console.log('Profile error:', error.message);
    }
  } else {
    console.log('✓ Profile created: Prince F.O');
  }
}

setupProfile();