// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vrzhnifbmqddvrvaxdxa.supabase.co' // Replace this
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyemhuaWZibXFkZHZydmF4ZHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNTM3OTcsImV4cCI6MjA2NjkyOTc5N30.hLhzsAVOzbs9lOWT_Yioz8mXUB4mdI0X-CUVOmPAPwU' // Replace this

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
