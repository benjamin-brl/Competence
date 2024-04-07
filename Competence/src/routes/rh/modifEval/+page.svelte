<script>
  // @ts-nocheck
    import { onMount } from 'svelte';
    import { supabase } from '../../server/supabase.js';

    let idevaluation;
    let inputValueSalarie = "";
    let inputValueTitre = "";
    let inputValueTitrecrit = "";
    let inputValueNote = "";
    let addCriteria = false;
    let criteriaList = [];
    let newCriterion = { titre: "", note: "", competences: [] };
    /**
     * @type {string | any[]}
     */
     let bloc2 = [];
    /**
     * @type {string | any[]}
     */
    let bloc = [];
    /**
     * @type {string | any[]}
     */
    let selectedCompetences = [];
    let userId;
    let idsalarie = null;

    const extractEvaluationId = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  idevaluation = parseInt(urlParams.get('idevaluation'), 10);

  // Log pour déboguer
  console.log('ID d\'évaluation extrait de l\'URL:', idevaluation);

  // Vérifier si idevaluation est un nombre valide

  if (!isNaN(idevaluation) && idevaluation > 0) {
    // Récupérer les données existantes depuis la base de données pour l'évaluation
    const { data: evaluationData, error: evaluationError } = await supabase
      .from('evaluation')
      .select('nom')
      .eq('idevaluation', idevaluation)
      .single();

    if (evaluationError) {
      console.error('Erreur lors de la récupération des données existantes pour l\'évaluation:', evaluationError);
    } else {
      // Pré-remplir les champs avec les données existantes
      inputValueTitre = evaluationData.nom || "";
    }

    // Récupérer les données existantes pour les critères
    const { data: criteriaData, error: criteriaError } = await supabase
      .from('composer')
      .select('*')
      .eq('idevaluation', idevaluation);

    if (criteriaError) {
      console.error('Erreur lors de la récupération des données existantes pour les critères:', criteriaError);
    } else {
      // Pré-remplir les champs pour chaque critère
      criteriaList = criteriaData.map(criterion => {
        return {
          titre: criterion.nom || "",
          note: criterion.bareme || "",
          selectedCompetences: [], // Ajoutez d'autres propriétés si nécessaire
          availableCompetences: [], // Ajoutez d'autres propriétés si nécessaire
        };
      });
    }
  }
};

  onMount(() => {
    // Appeler la fonction pour extraire l'ID de l'évaluation lors du montage du composant
    extractEvaluationId();
  });
  const addCriterion = () => {
  const newCriterionCompetences = criteriaList.reduce((allCompetences, criterion) => {
    return allCompetences.concat(criterion.selectedCompetences);
  }, []);

  // Vérifiez si le titre est déjà présent dans la liste
  if (!criteriaList.some(criterion => criterion.titre === newCriterion.titre)) {
    criteriaList.push({
      titre: newCriterion.titre,
      note: newCriterion.note,
      selectedCompetences: [],
      availableCompetences: bloc2.filter(competence => !newCriterionCompetences.includes(competence.titre)),
    });
  }
};
const removeCriterion = (index) => {
  criteriaList = criteriaList.filter((_, i) => i !== index);
};
const addCompetence2 = (event, index) => {
  const selectedValue = event.target.value;
  if (selectedValue) {
    const competenceData = criteriaList[index].availableCompetences.find(c => c.titre === selectedValue);

    if (competenceData) {
      criteriaList[index].selectedCompetences = [...criteriaList[index].selectedCompetences, selectedValue];
      criteriaList[index].availableCompetences = getAvailableCompetences(bloc2, criteriaList[index].selectedCompetences);
    } else {
      console.error('Compétence non trouvée dans availableCompetences:', selectedValue, criteriaList[index].availableCompetences);
    }
  }
};

// Fonction pour récupérer l'ID de l'utilisateur depuis Supabase
async function fetchUserId() {
    try {
     
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        userId = user.id;
        console.log('ID de l\'utilisateur:', userId);

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
            console.log('idsalarie correspondant à l\'UUID:', idsalarie);
          } else {
            console.warn('Aucun enregistrement trouvé pour l\'UUID spécifié.');
          }
        }

        // Appel de la fonction d'insertion avec l'idsalarie récupéré
 
      } else {
        console.warn('Aucun utilisateur trouvé.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error.message);
    }
  }

  const insertData = async () => {
  // Avant d'insérer les données, assurez-vous que idevaluation est correctement défini
  if (!idevaluation) {
    console.error("L'idevaluation n'a pas été récupérée avec succès.");
    return;
  }

  try {
    // Insertion dans la table "evaluation"
    const { data: evaluationData, error: evaluationError } = await supabase
      .from('evaluation')
      .update({ nom: inputValueTitre })
      .eq('idevaluation', idevaluation);

    if (evaluationError) {
      console.error('Erreur lors de l\'insertion des données dans la table "evaluation":', evaluationError);
      return;
    }

    // Insertion dans la table "composer"
    const { data: composerData, error: composerError } = await supabase
      .from('composer')
      .update({
        nom: inputValueTitrecrit,
        bareme: inputValueNote  
      })
      .eq('idevaluation', idevaluation);

    if (composerError) {
      console.error('Erreur lors de l\'insertion des données dans la table "composer":', composerError);
      return;
    }

    // Récupération de l'ID du dernier composer créé
    const { data: lastcomposer, error: lastError } = await supabase
      .from('composer')
      .select('idcomposer')
      .order('idcomposer', { ascending: false })
      .limit(1);

    if (lastError) {
      console.error('Erreur lors de la récupération de l\'idevaluation:', lastError);
      return;
    }

    // Obtention de l'idcomposer créé lors de l'insertion
    const idComposer = lastcomposer[0]?.idcomposer;

    // Insertion des liens dans la table "link" pour chaque compétence sélectionnée
    for (const competence of selectedCompetences) {
      const competenceData = bloc2.find(c => c.titre === competence);
      if (!competenceData) {
        console.error('Compétence non trouvée:', competence);
        continue;
      }

      const idCompetence = competenceData.idcompetence;
      const { data: linkData, error: linkError } = await supabase
        .from('link')
        .insert([{ 
          idcomposer: idComposer,
          idcompetence: idCompetence
        }]);
      
      if (linkError) {
        console.error('Erreur lors de l\'insertion des données dans la table "link":', linkError);
        continue; // Passe à la prochaine itération en cas d'erreur
      } else {
        console.log('Lien inséré dans la table "link":', linkData);
      }
    }

    // Mise à jour des critères dans la table "composer"
    for (const criterion of criteriaList) {
      const { data, error } = await supabase
        .from('composer')
        .update({
          nom: criterion.titre,
          bareme: criterion.note,
        })
        .eq('idevaluation', idevaluation)
        .eq('nom', criterion.titre);

      if (error) {
        console.error('Erreur lors de la mise à jour des données dans la table "composer":', error);
        return;
      } else {
        console.log('Données mises à jour dans la table "composer":', data);
      }

      // Obtention de l'idcomposer créé lors de la mise à jour pour le critère actuel
      const currentComposerId = data[0]?.idcomposer;

      console.log('L\'idcomposer créé pour le critère actuel est:', currentComposerId);

      // Insertion des liens dans la table "link" pour chaque compétence sélectionnée
      for (const selectedCompetence of criterion.selectedCompetences) {
        // Recherche de la compétence dans bloc2
        const competenceData = bloc2.find(c => c.titre === selectedCompetence);

        if (competenceData) {
          const idCompetence = competenceData.idcompetence;
          const { data: linkData, error: linkError } = await supabase
            .from('link')
            .update([{ 
              idcomposer: currentComposerId,
              idcompetence: idCompetence
            }]);

          if (linkError) {
            console.error('Erreur lors de l\'insertion des données dans la table "link":', linkError);
          } else {
            console.log('Lien inséré dans la table "link":', linkData);
          }
        } else {
          console.error('Compétence non trouvée:', selectedCompetence);
        }
      }

      // Filtrer les compétences utilisées
      bloc2 = bloc2.filter(c => !criterion.selectedCompetences.includes(c.titre));
    }
  } catch (error) {
    console.error('Erreur inattendue:', error);
  }
};


    /**
     * @param {{ target: { value: any; }; }} event
     */
   
  
    onMount(() => {
      // Vous pouvez effectuer des actions supplémentaires lors du montage du composant
      readData();
      fetchUserId();
    });
    const removeCompetence = (competence) => {
    selectedCompetences = selectedCompetences.filter(item => item !== competence);
    const competenceData = bloc.find(c => c.titre === competence);
    if (competenceData) {
      bloc = [...bloc, competenceData];
      
    }
  };
  const addCompetence = (event) => {
  const selectedValue = event.target.value;
  if (selectedValue) {

    const competenceData = bloc2.find(c => c.titre === selectedValue);

    if (competenceData) {
      selectedCompetences = [...selectedCompetences, selectedValue];
      bloc = bloc.filter(c => c.titre !== selectedValue);
      
    }
  }

};
async function signOut() {
  const { error } = await supabase.auth.signOut()
}
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
const readData = async () => {
      try {
        const { data: competenceData, error: error3 } = await supabase
          .from('competence')
          .select("*")
          .gt('idcompetence_1', 3)
          .not('idcompetence_1', 'is', null);
  
        if (error3) {
          console.error('Erreur lors de la lecture des données dans la table "competence":', error3);
        } else {
          bloc = competenceData;
          bloc2 = competenceData;

        }
      } catch (error) {
        console.error('Erreur inattendue:', error);
      }
    };
onMount(() => {
  readData();
  retourAccueil();
});
  </script>
  
  <body>
    <a id="retour" href="/rh/evaluationDispo">⟸ retour</a>
    <h1>Création d'une évaluation :</h1>
    <label>
      <h3>Valeur à insérer:</h3><br><br>
      <h4>titre: </h4><input class="form-control" bind:value={inputValueTitre} /><br>
      <h4>titre critère:</h4> <input class="form-control" bind:value={inputValueTitrecrit}/><br>
      <h4>barème: </h4><input class="form-control" bind:value={inputValueNote} /><br>
    </label>
    <div>
      <label for="mainDropdown"><h6> une ou plusieurs compétences :</h6></label>
      <select class="form-select" aria-label="Default select example" id="mainDropdown" on:change={addCompetence}>
        {#if bloc.length > 0}
          <option value="">Sélectionnez une compétence</option>
          {#each bloc as competence, index (index)}
            <option value={competence.titre} key={index}>
              {competence.titre}
            </option>
          {/each}
        {:else}
          <option value="" disabled>Aucune compétence disponible</option>
        {/if}
      </select>
  
      <h2>Compétences sélectionnées :</h2>
      <ul>
        {#if selectedCompetences.length > 0}
          {#each selectedCompetences as competence }
            <li>
              <h6>{competence}</h6>
              <button class="btn btn-danger" on:click={() => removeCompetence(competence)}>Supprimer</button>
            </li>
          {/each}
        {:else}
          <li><h6>Aucune compétence choisie</h6></li>
        {/if}
      </ul>
      <label>
        <input type="checkbox" bind:checked={addCriteria} /> Ajouter des critères et une note
      </label>
  
      {#if addCriteria}
      <!-- Show input fields for criteria and note when the checkbox is checked -->
      {#each criteriaList as criterion, index (index)}
        <div>
          <label>
            <h4>Titre critère:</h4>
            <input class="form-control" bind:value={criteriaList[index].titre} /><br>
          </label>
          <label>
            <h4>Barème: </h4>
            <input class="form-control" bind:value={criteriaList[index].note} /><br>
          </label>
          <button class="btn btn-danger" on:click={() => removeCriterion(index)}>Supprimer</button>
          <label for={"competenceDropdown" + index}><h4>Compétences :</h4></label>
  <select class="form-select" aria-label="Default select example" id={"competenceDropdown" + index} on:change={(event) => addCompetence2(event, index)}>
    {#if bloc2.length > 0}
      <option value="">Sélectionnez une compétence</option>
      {#each bloc2 as competence, competenceIndex (competenceIndex)}
        <option value={competence.titre} key={competenceIndex}>
          {competence.titre}
        </option>
      {/each}
    {:else}
      <option value="" disabled>Aucune compétence disponible</option>
    {/if}
  </select>
  <h5>Compétences sélectionnées :</h5>
  <ul>
    {#each criterion.selectedCompetences as selectedCompetence, selectedIndex (selectedIndex)}
      <li>{selectedCompetence}</li>
    {/each}
  </ul>
        </div>
      {/each}
      <button class="btn btn-success" on:click={addCriterion}>Ajouter un critère</button>
    {/if}
  
      <button class="btn btn-danger" on:click={insertData}>Insérer</button>
    </div>
  </body>
  
  <style>
    ul {
      list-style-type: none;
      padding: 0; /* Pour éviter l'espacement par défaut du navigateur */
    }

    #retour {
    color: rgb(218, 218, 218);
    margin-right: 80%;
  }

  #retour:hover {
    color: black;
  }
  
  </style>