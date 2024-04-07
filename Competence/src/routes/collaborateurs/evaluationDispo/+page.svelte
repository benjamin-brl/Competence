<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { supabase } from '../../server/supabase.js';
  
  // Variable pour stocker les compétences 
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
        } else {
          if (data.length > 0) {
            idsalarie = data[0].idsalarie;
          } else {
            console.warn('Aucun enregistrement trouvé pour l\'UUID spécifié.');
          }
        }
        // Appel de la fonction d'insertion avec l'idsalarie récupéré
      } else {
        console.warn('Aucun utilisateur trouvé.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:');
    }
  }

  // Déclaration des types
  type Evaluation = {
    idevaluation: string;
    nom: string;
  };

  type Composer = {
    bareme: number;
    idevaluation: string;
    idcomposer: number;
  };

  type Note = {
    id_salarie: number;
    note: number;
    idcomposer: number;
    idEvaluation: string;
  };

  type EvaluationDetail = {
    idevaluation: string;
    nom: string;
    totalBareme: number;
    totalNote: number;
  };

  let evaluationDetails: EvaluationDetail[] = [];

  async function tableauLo () {
    try {
      const { data: dataEvaluation, error: errorEvaluation } = await supabase
        .from('evaluation')
        .select('idevaluation, nom');

      const { data: dataComposer, error: errorComposer } = await supabase
        .from('composer')
        .select('bareme, idevaluation, idcomposer');

      const { data: dataNote, error: errorNote } = await supabase
        .from('note')
        .select('id_salarie, note, idcomposer, idEvaluation');

      if (errorEvaluation) {
        console.error('Problème avec la récupération des données de la table évaluation : ', errorEvaluation);
      }

      if (errorComposer) {
        console.error('Problème avec la récupération des données de la table composer : ', errorComposer);
      }

      if (errorNote) {
        console.error('Problème avec la récupération des données de la table note : ', errorNote)
      }

      const evaluations: Evaluation[] = dataEvaluation || [];
      const composer: Composer[] = dataComposer || [];
      const note: Note[] = dataNote || [];
      
      evaluationDetails = evaluations.map((evalua) => {
        let bareme = 0;
        let noti = 0;
        let count = 0;
        for (const compos of composer) {
          if (evalua.idevaluation === compos.idevaluation) {
            bareme += compos.bareme;

            for (const notes of note) {
              if (notes.idcomposer === compos.idcomposer) {
                if (idsalarie == notes.id_salarie){
                  noti += notes.note;
                  count = count + 1;
                }
              }
            }
            if(count == 0){
              noti = -1;
            }
          }
        }
        return { idevaluation: evalua.idevaluation, nom: evalua.nom, totalBareme: bareme, totalNote: noti };
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
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
      window.location.href = "/";
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
  }
  onMount(async () => {
    fetchUserId();
    retourAccueil();
    tableauLo();
  });

  onDestroy(() => {
    // Nettoyage des ressources si nécessaire
  });

</script>

<style>
  body {
    text-align: center;
    background-color: rgb(105, 107, 107);
  }
  ::placeholder{
    color: rgb(196, 192, 192);
  }
  table {
		border:3px ridge #8f8f8f;
		border-collapse:collapse;
		padding:10px;
    margin-left: auto;
    margin-right: auto;
	}
	table th {
		border:3px ridge #8f8f8f;
		padding:10px;
		background: #726e6e;
		color: #ffffff;
	}
	table td {
		border:3px ridge #8f8f8f;
		text-align:center;
		padding:10px;
		background: #c5c4c4;
		color: #313030;
    text-align: center;
	}
  a {
    color: black;
    text-decoration: none;
  }
  a:hover {
    text-align: center;
    color:white;
    cursor:url(http://diablol.n2o.free.fr/didisurvol.cur),auto;
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
          <a class="nav-link" href="#top">Evaluations</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/collaborateurs/profile">Profile</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/" on:click={signOut}>Déconnexion</a>
        </li>
      </ul>
    </div>
  </nav>

  <br><br><br>

  <h1>Liste des évaluations disponibles</h1>

  <br><br><br>

  {#each evaluationDetails as evalua}
    {#if evalua.totalNote != -1}
      <table>
        <thead>
          <tr>
            <th>Intitulé</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <a href="../collaborateurs/detailsEvaluation?idevaluation={evalua.idevaluation}&bareme={evalua.totalBareme}&note={evalua.totalNote}">
                {evalua.nom}
              </a>
            </td>
            <td>
              <p id='notation'> 
                {evalua.totalNote}/{evalua.totalBareme}
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <br><br>

    {/if}
  {/each}
</body>