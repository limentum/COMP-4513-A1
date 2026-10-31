const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// SUPABASE URL & KEY (from .env file)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Create client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;