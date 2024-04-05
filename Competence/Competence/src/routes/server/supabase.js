import { createClient } from '@supabase/supabase-js';
  
// Configurez le client Supabase
const supabase = createClient('https://hktgtibzxnfeykxibxga.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrdGd0aWJ6eG5mZXlreGlieGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkzNzE0NzQsImV4cCI6MjAxNDk0NzQ3NH0.rDcbgdT2udXKjym3wwxL413eo94VZ8uInETtioUUmcs');

export { supabase };