import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://cjjyrcdasvkchicimbjv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqanlyY2Rhc3ZrY2hpY2ltYmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NDU5MDksImV4cCI6MjA3MzIyMTkwOX0.tGIxu-P9gI0odnbmkboorlP9kgJ6HdWBc4CKavuA1SQ'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase