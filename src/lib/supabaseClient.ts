
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rhupuikoqlzsitmtcdaz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodXB1aWtvcWx6c2l0bXRjZGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTc5NTksImV4cCI6MjA2NjI3Mzk1OX0.Jjd_i2UUn4PG6fud-CyEEV_dFF9pR27u46R6FAomk5w'
const supabase = createClient(supabaseUrl, supabaseKey)