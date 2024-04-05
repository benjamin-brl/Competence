<script>
    import supabase from './supabase.js';
  
    async function fetchUserData() {
      const { data, error } = await supabase.from('test').select('*');
      if (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } else {
        console.log('Données récupérées avec succès:', data);
      }
    }
  </script>
  
