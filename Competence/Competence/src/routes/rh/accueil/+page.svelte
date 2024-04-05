<script lang="ts">

  import { onMount } from 'svelte';
  import { supabase } from '../../server/supabase.js';

  let bloc : any[] = [] ;

  // Fonction pour récupérer les données des compétences depuis Supabase
  async function fetchBloc() {
    const { data, error } = await supabase.from('competence').select('*').is('idcompetence_1', null);
    if (error) {
      console.error('Erreur lors de la récupération des compétences :', error);
    } else {
      //console.log('Compétences récupérées avec succès :', data);
      bloc = data;
    }
  }

  // Fonction pour récupérer les sous compétences depuis supabase
  async function getId(idd: string) {
        const { data, error } = await supabase.from('competence').select('*').eq('idcompetence_1', idd);
        if (error) {
          console.error('Erreur lors de la récupération des compétences :', error);
        } else {
          //console.log('Compétences récupérées avec succès :', data);
          bloc = data;
        }
    }

  // Fonction pour le bouton réinitialiser
  function retour() {
    location.reload();
  }

  // fonction qui autorise ou non un utilisateur à ce connecter celon son rôle ou si il s'est identifié
  async function retourAccueil(){
    const {data:{ user } } = await supabase.auth.getUser();
    if(user){
      const {data : role, error : errorRole} = await supabase.from("salarie").select("identifiant").eq("uuid",user.id);
      if(errorRole){
        console.error("role : ", errorRole);
      }
      if(role){
        if(role[0].identifiant != 'Rh'){
          window.location.href = "/";
        }
      }
    }
    if(!user){
      console.log("Not connected");
      window.location.href = "/";
    }
  }

  // lance les fonction lors du chargement de la page
  onMount(() => {
    fetchBloc();
    retourAccueil();
  });

  // fonction pour se déconnecter
  async function signOut() {
    const { error } = await supabase.auth.signOut()
  }

  </script>

  <style>
    body {
      text-align: center;
      background-color: rgb(105, 107, 107);
    }

    ::placeholder{
      color: rgb(196, 192, 192);
    }

    table, tr, td {
      margin-left:auto;
      margin-right: auto;
      text-align: center;
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

    #retour {
      color: rgb(218, 218, 218);
    }

    #retour:hover {
      color: black;
    }

    p {
      color: rgb(194, 193, 193);
    }

    button {
      background: none;
      color: white;
      border: none;
      padding: 0;
      font: inherit;
      cursor: pointer;
      outline: inherit;
    }

    button:hover {
      color: black;
    }
  </style>

  <body>

    <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
      <div class="container-fluid">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link active" href="#top">Accueil</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/rh/evaluationDispo">Evaluations</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/" on:click={signOut}>Déconnexion</a>
          </li>
        </ul>
      </div>
    </nav>

    <br><br><br><br>

    <h1>Bienvenue dans Compétences</h1>
    
    <br><br>

    <p>Vous retrouverez ci-dessous toutes les compétences que vous devrez faire passer avant la fin de l'année</p>

    <br><br><br>

    <button id="retour" on:click={() => retour()}>~ réinitialisation ~</button><br><br><br>

    <table>
      <tr>
        <th>Tableau des compétences</th><br><br>
      </tr>

        {#each bloc as comp}
        
          {#if comp.idcompetence < 18}

            <tr>
              <td>
                <br><button on:click={() => getId(comp.idcompetence)}>{comp.titre}</button><br>
              </td>
            </tr>

          {:else if comp.idcompetence > 17}
        
          <tr>
            <td>
              <p>{comp.titre}</p>
            </td>
          </tr>

          {/if}
          {:else}

            <p>Il y a eu un problème lors de la requête SQL</p>

          {/each}
    </table>

  </body>