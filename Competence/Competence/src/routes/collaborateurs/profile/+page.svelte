<script lang="ts">

  import { onMount } from 'svelte';
  import { supabase } from '../../server/supabase.js';

  let userId;
  let idsalarie: number | null = null;

  async function fetchUserId() {
    try {  
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        userId = user.id;
        // Exécution de la requête SQL pour récupérer idsalarie
        const { data, error } = await supabase
          .from('salarie')
          .select('idsalarie')
          .eq('uuid', userId);
        if (error) {
          console.error('Erreur lors de la récupération de idsalarie:', error);
        } 
        else {
          if (data.length > 0) {
            idsalarie = data[0].idsalarie;
          }
          else {
            console.warn('Aucun enregistrement trouvé pour l\'UUID spécifié.');
          }
        }
        // Appel de la fonction d'insertion avec l'idsalarie récupéré
      }
      else{
        console.warn('Aucun utilisateur trouvé.');
      }
    }
    catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:');
    }
  }

  // Fonction pour récupérer les données des compétences depuis Supabase
  type competenceAveragesing = {
    id: number;
    titre: string;
    total: number;
  };
  let competenceAverages: competenceAveragesing[] = [];

  async function fetchCompetenceAverage() {
    try {
      const { data: dataNote, error: errorNote } = await supabase.from('note').select('note, idcomposer').eq('id_salarie', idsalarie);
      const { data: dataComposer, error: errorComposer } = await supabase.from('composer').select('idcomposer, bareme');
      const { data: dataLink, error: errorLink } = await supabase.from('link').select('idcomposer, idcompetence');
      const { data: dataCompetence, error: errorCompetence } = await supabase.from('competence').select('idcompetence, titre');

      if (errorNote || errorComposer || errorLink || errorCompetence) {
        console.error('Error fetching data:', errorNote || errorComposer || errorLink || errorCompetence);
        return;
      }

      competenceAverages = dataCompetence.map((competence) => {
        let total = 0;
        let count = 0;

        for (const link of dataLink) {
          if (competence.idcompetence == link.idcompetence) {
            for (const note of dataNote) {
              if (note.idcomposer == link.idcomposer) {
                for (const composer of dataComposer) {
                  if (composer.idcomposer == note.idcomposer) {
                    total += note.note / composer.bareme;
                    count += 1;
                  }
                }
              }
            }
          }
        }
        total = (total / count) * 100;
        return { id: competence.idcompetence, titre: competence.titre, total };
      });
    } 
    catch (error) {
      console.error('Error fetching competence averages:', error);
    }
  }

  async function retourAccueil(){
    const {data:{ user } } = await supabase.auth.getUser();
    if(user){
      const {data : role, error : errorRole} = await supabase.from("salarie").select("identifiant").eq("uuid",user.id);
      if(errorRole){
        console.error("role : ", errorRole);
      }
      if(role){
        if(role[0].identifiant != 'Collabo'){
          window.location.href = "/";
        }
      }
    }
    if(!user){
      console.log("Not connected");
      window.location.href = "/";
    }
  }
  
  async function signOut() {
    const { error } = await supabase.auth.signOut()
  }

  onMount(async () => {
    await fetchUserId();
    retourAccueil();
    fetchCompetenceAverage();
  });
</script>

<style>
  body {
    text-align: center;
    background-color: rgb(105, 107, 107);
  }
  a {
    color: white;
    text-decoration: none;
  }
  a:hover {
    text-align: center;
    color:black;
    cursor:url(http://diablol.n2o.free.fr/didisurvol.cur),auto;
  }
  p{
    margin-top : 5%;
  }
  h1{
    margin-top: 3%;
  }
</style>

<body>
  <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
    <div class="container-fluid">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" href="/collaborateurs/accueil">Accueil</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/collaborateurs/evaluationDispo">Evaluations</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#top">Profil</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/" on:click={signOut}>Déconnexion</a>
        </li>
      </ul>
    </div>
  </nav>
  <h1>Mon profil</h1>
  <h4>Vous retrouverez ci-dessous toutes les compétences que vous avez acquéri et votre pourcentage de réussite</h4>
  {#if competenceAverages.length === 0}
    <p>Loading...</p>
  {:else}
    <!-- Render the table only when data is available -->
    <table class="table table-bordered table-dark table-hover table-sm table-responsive">
      <thead>
        <tr>
          <th scope="col">Titre</th>
          <th scope="col">Pourcentage</th>
        </tr>
      </thead>
      <tbody>
        {#each competenceAverages as competence}
          {#if competence.id >= 18}
            <tr>
              {#if competence.total > 66}
                <td class = "bg-success">{competence.titre}</td>
                <td class = "bg-success">{#if competence.total !== null}{competence.total.toFixed(2)}{:else}N/A{/if}</td>
              {/if}
              {#if competence.total < 66 && competence.total > 33}
                <td class = "bg-warning">{competence.titre}</td>
                <td class = "bg-warning">{#if competence.total !== null}{competence.total.toFixed(2)}{:else}N/A{/if}</td>
              {/if}
              {#if competence.total < 33}
                <td class = "bg-danger">{competence.titre}</td>
                <td class = "bg-danger">{#if competence.total !== null}{competence.total.toFixed(2)}{:else}N/A{/if}</td>
              {/if}
              {#if !competence.total && competence.total != 0}
                <td>{competence.titre}</td>
                <td>{#if competence.total !== null}{competence.total}{:else}N/A{/if}</td>
              {/if}
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  {/if}
</body>