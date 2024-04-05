<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../../server/supabase.js';

  let userId;
  let idsalarie: number | null = null;;

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
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
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

  const urlParams = new URLSearchParams(window.location.search);
  const idevaluationValue = urlParams.get('idevaluation');
  let idevaluation = null;
  let intitul : any[] = [] ;

  async function fetchEvaluationDetails(idevaluationValue: string) {
    // Utilisez idevaluationValue pour récupérer les détails de l'évaluation depuis la base de données
    // Vous pouvez implémenter la logique pour récupérer les détails spécifiques en utilisant idevaluationValue
    // par exemple : 
    const { data, error } = await supabase.from('evaluation').select('*').eq('idevaluation', idevaluationValue);
    if (error) {
      console.error('Erreur lors de la récupération des notes :', error);
    } else {
      intitul = data;
    }
  }
  let noteContent = ''; // Initialisation de la variable pour contenir la note
  let baremeContent = '';

  async function go(){
    const urlParams = new URLSearchParams(window.location.search);
    idevaluation = urlParams.get('idevaluation');
    if (idevaluation) {
      await fetchEvaluationDetails(idevaluation);
      await getCritere(idevaluation);
      await getRemarqueCriteres(); // Appel à cette fonction pour récupérer les remarques
      await getRemarqueEval(); 
    }
  }

  // Récupération des valeurs idevaluation et note depuis les paramètres d'URL
  let criteres : any[] = [] ;

  async function getCritere(idevaluationValue: string) {
    // Utilisez idevaluationValue pour récupérer les détails de l'évaluation depuis la base de données
    // Vous pouvez implémenter la logique pour récupérer les détails spécifiques en utilisant idevaluationValue
    // par exemple : 
    const { data, error } = await supabase.from('composer').select('*').eq('idevaluation', idevaluationValue);
    if (error) {
      console.error('Erreur lors de la récupération des notes :', error);
    } else {
      criteres = data;
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
  }

  let remarqueCrit: any[] = [];

  async function getRemarqueCriteres() {
    const { data: noteData, error: noteError } = await supabase
      .from('note')
      .select('idcomposer, remarque, note')
      .eq('id_salarie', idsalarie);

    const { data: composerData, error: composerError } = await supabase
      .from('composer')
      .select('idcomposer');

    // Vérifier qu'il n'y a pas d'erreurs lors de la récupération des données
    if (!noteError && !composerError) {
      // Map pour créer un tableau avec uniquement les idcomposer
      const composerIds = composerData.map(composer => composer.idcomposer);

      // Filtrer les remarques en fonction des idcomposer présents dans la table "composer"
      remarqueCrit = noteData.filter(note => composerIds.includes(note.idcomposer));
    } else {
      console.error('Erreur lors de la récupération des données req1 :', noteError || composerError);
    }
  }

  let remarqueEval: any[] = [];

  async function getRemarqueEval() {
    const { data: passerData, error: passerError } = await supabase
      .from('passer')
      .select('idevaluation, remarque')
      .eq('idsalarie', idsalarie);

    const { data: evaluationData, error: evaluationError } = await supabase
      .from('evaluation')
      .select('idevaluation');

    // Vérifier qu'il n'y a pas d'erreurs lors de la récupération des données
    if (!passerError && !evaluationError) {
      // Map pour créer un tableau avec uniquement les idevaluation
      const evaluationIds = evaluationData.map(evaluation => evaluation.idevaluation);

      // Filtrer les remarques en fonction des idevaluation présents dans la table "evaluation"
      remarqueEval = passerData.filter(passer => evaluationIds.includes(passer.idevaluation));
    } else {
      console.error('Erreur lors de la récupération des données :', passerError || evaluationError);
    }
  }
  
  onMount(() => {
    fetchUserId();
    retourAccueil();
    go();

    const urlParams = new URLSearchParams(window.location.search);
    baremeContent = urlParams.get('bareme') || '';
    noteContent = urlParams.get('note') || ''; 
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
    margin-right: 80%;
  }

  #retour:hover {
    color: black;
  }

  h4 {
    color: white;
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
          <a class="nav-link" href="/collaborateurs/profile">Profile</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/" on:click={signOut}>Déconnexion</a>
        </li>
      </ul>
    </div>
  </nav>

  <br><br><br><br>

  <h1>Détails de l'évaluation</h1>
  
  <br><br>
  
  <a id="retour" href="/collaborateurs/evaluationDispo">⟸ retour</a>
  
  <br>

  <h3>Intitulé</h3>
  {#each intitul as int}
    <h4>{int.nom}</h4>
  {/each}

  <br>

  <h3>Critères</h3>
  
  <br>

  <!--Liste des critère (remarque, note, titre)-->
  {#each criteres as crit}
    <table>
      <th>
        <h4>Nom</h4>
      </th>
      <th>
        <h4>Remarque</h4>
      </th>
      <th>
        <h4>Note</h4>
      </th>
      <tr>
        <td>
          <h4>{crit.nom}</h4>
        </td>
        <td>
          {#each remarqueCrit as rmqcrit}
            {#if crit.idcomposer === rmqcrit.idcomposer}
              <h4>{rmqcrit.remarque}</h4>
            {/if}
          {/each}
        </td>
        <td>
          {#each remarqueCrit as rmqcrit}
            {#if crit.idcomposer === rmqcrit.idcomposer}
              <h4>{rmqcrit.note} / {crit.bareme}</h4>
            {/if}
          {/each}
        </td>
      </tr>
    </table>

    <br><br>
  {/each}

  <br>

  <h3>Note</h3>
  <div>
    <h4 id="ici">
      {noteContent} / {baremeContent}
    </h4>
  </div>

  <br>

  <h3>Remarque</h3>
 
  <br>
  {#each remarqueEval as rmqeval}
    {#if idevaluationValue == rmqeval.idevaluation}
      <h4>{rmqeval.remarque}</h4>
    {/if}
  {/each}

  <br><br><br>
  
</body>