<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { supabase, signOut, retourAccueil, switchAccount } from '../../server/supabase.js';

	export const selectedId = writable('');

	//permets de n'écrire que des chiffre dans les input concernant les notes de l'élève
	function filterNumbers(event: Event) {
		const input = event.target as HTMLInputElement | null;

		if (input) {
			// Remplace tous les caractères non numériques par une chaîne vide
			input.value = input.value.replace(/\D/g, '');
			//appel de la fonction de calcul de la note finale
			calculateTotal();
		}
	}

	//variable de la note finale
	let totalNotes = 0;

	//additionne les notes obtenu aux critères pour pouvoir en faire une note finale
	function calculateTotal() {
		totalNotes = Array.from(
			document.querySelectorAll<HTMLInputElement>('input[id^="noteEleveCrit"]')
		)
			.map((input) => parseFloat(input.value) || 0)
			.reduce((acc, note) => acc + note, 0);
	}

	let idevaluation = null;

	// variable lié a la table evaluation (intitulé, remarque)
	let intitul: any[] = [];

	//récupération de l'id de l'évaluation cliquée pour en avoir tout les détails
	async function fetchEvaluationDetails(idevaluationValue: string) {
		const { data, error } = await supabase
			.from('evaluation')
			.select('*')
			.eq('idevaluation', idevaluationValue);

		if (error) {
			console.error('Erreur lors de la récupération des notes :', error);
		} else {
			//console.log('évaluations récupérées avec succès');
			intitul = data;
		}
	}

	// Initialisation de la variable pour contenir la note
	let noteContent = '';

	//variable contenant les informations liées à la table composer
	let criteres: any[] = [];

	//récupérer toute les données d'une évaluation dont on à récupéré l'idevaluation
	async function getCritere(idevaluationValue: string) {
		const { data, error } = await supabase
			.from('composer')
			.select('*')
			.eq('idevaluation', idevaluationValue);
		if (error) {
			console.error('Erreur lors de la récupération des notes :', error);
		} else {
			//console.log('évaluations récupérées avec succès');
			criteres = data;
		}
	}

	//variable contenant les information d'un élève
	let eleves: any[] = [];

	//liste tout les collaborateurs
	async function elevesDispo() {
		const { data: salarieData, error: salarieError } = await supabase
			.from('salarie')
			.select('idsalarie, nom, prenom');

		const { data: collaborateurData, error: collaborateurError } = await supabase
			.from('collaborateur')
			.select('idsalarie');

		// Effectuer une jointure équivalente à INNER JOIN localement
		if (!salarieError && !collaborateurError) {
			eleves = salarieData.filter((salarie) => {
				return collaborateurData.some(
					(collaborateur) => collaborateur.idsalarie === salarie.idsalarie
				);
			});
			//console.log('les eleves : ', eleves);
		} else {
			console.error(
				'Erreur lors de la récupération des données :',
				salarieError || collaborateurError
			);
		}
	}

	//change la valeur dès que la selection change
	function handleSelectChange(event: Event) {
		selectedId.set((event.target as HTMLSelectElement).value);
		//console.log('ID sélectionné :', $selectedId);
	}

	// ------------------------------------------------ validation ------------------------------------------------

	//variable contenant les remarques des critères
	let remarqueCrit = '';
	//variable contenant les notes liées aux critères
	let noteCrit = '';

	//insert dans supabase les données necessaires à la notation de l'élève en fonction de ce qui est écrit dans les input
	async function pullCriteres(idevaluationValue: string) {
		try {
			const compoElements = document.querySelectorAll<HTMLInputElement>('p[id^="compo"]');
			const remarqueElements = document.querySelectorAll<HTMLInputElement>(
				'input[id^="remarqueEleveCrit"]'
			);
			const noteElements = document.querySelectorAll<HTMLInputElement>(
				'input[id^="noteEleveCrit"]'
			);

			for (let i = 0; i < compoElements.length; i++) {
				const contenuCompo = compoElements[i].textContent || compoElements[i].innerText;
				const noteValue = noteElements[i].value;
				const remarqueValue = remarqueElements[i].value;

				// Vérification si la valeur de note est un nombre valide
				if (!isNaN(parseFloat(noteValue))) {
					noteCrit = noteValue;
					remarqueCrit = remarqueValue;

					const { data, error } = await supabase.from('note').insert([
						{
							id_salarie: $selectedId,
							note: parseFloat(noteCrit),
							remarque: remarqueCrit,
							idcomposer: contenuCompo,
							idEvaluation: idevaluationValue
						}
					]);

					if (error) {
						console.error("Erreur lors de l'insertion des données :", error);
					} else {
						//console.log('Données insérées avec succès:', data);
						// Réinitialisation des valeurs après l'insertion réussie si nécessaire
						noteElements[i].value = '';
						remarqueElements[i].value = '';
					}
				} else {
					console.error("La valeur de la note n'est pas un nombre valide.");
				}
			}
		} catch (error: any) {
			console.error('Erreur:', error.message);
		}
	}

	//variable contenant les informations liées à la table composer
	let remarqueEval: any;

	//récupérer toute les données d'une évaluation dont on à récupéré l'idevaluation
	async function pullEval() {
		try {
			const remarqueEvalElement = document.getElementById('remEval') as HTMLInputElement;
			const IdEvaluElement = document.getElementById('idEval');

			if (remarqueEvalElement && IdEvaluElement) {
				const remarqueEvalValue = remarqueEvalElement.value;
				const IdEvaluValue = IdEvaluElement.textContent || IdEvaluElement.innerText;

				remarqueEval = remarqueEvalValue;
				const { data, error } = await supabase.from('passer').insert([
					{
						idsalarie: $selectedId,
						remarque: remarqueEval,
						idevaluation: IdEvaluValue
					}
				]);

				if (error) {
					console.error("Erreur lors de l'insertion des données :", error);
				} else {
					//console.log('Données insérées avec succès:', data);
					// Réinitialisez les valeurs après l'insertion réussie si nécessaire
					remarqueEvalElement.value = '';
				}
			} else {
				console.log('L\'élément avec id "compo" ou "noteEleveCrit" n\'existe pas.');
			}
		} catch (error: any) {
			console.error('Erreur:', error.message);
		}
	}

	//fonctions lancées après appuis sur le bouton (inserer les valeurs dans supabase)
	function construct() {
		const urlParams = new URLSearchParams(location.search);
		idevaluation = urlParams.get('idevaluation');

		//si il y a une idevaluation lancer ces fonction qui en dépandent
		if (idevaluation) {
			pullCriteres(idevaluation);
			pullEval();

			history.back();
		}
	}

	onMount(() => {
		const urlParams = new URLSearchParams(location.search);
		idevaluation = urlParams.get('idevaluation');

		//si il y a une idevaluation lancer ces fonction qui en dépandent
		if (idevaluation) {
			fetchEvaluationDetails(idevaluation);
			getCritere(idevaluation);
		}

		const urlParamss = new URLSearchParams(location.search);
		noteContent = urlParamss.get('bareme') || ''; // Récupération de la valeur du paramètre 'note'
	});
</script>

<body>
	<nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
		<div class="container-fluid">
			<ul class="navbar-nav">
				<li class="nav-item">
					<a class="nav-link active" href="/rh/accueil">Accueil</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/rh/evaluationDispo">Evaluations</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/" on:click|preventDefault={switchAccount}>SwitchAccount</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/" on:click={signOut}>Déconnexion</a>
				</li>
			</ul>
		</div>
	</nav>

	{#await retourAccueil()}
		<section class="container d-flex align-items-center justify-content-center vh-100">
			<span class="spinner-border" />
			<span class="text-dark mx-2">Chargement...</span>
		</section>
	{:then}
		{#await elevesDispo()}
			<section class="container d-flex align-items-center justify-content-center vh-100">
				<span class="spinner-border" />
				<span class="text-dark mx-2">Chargement...</span>
			</section>
		{:then}
			<br /><br /><br /><br />

			<h1>Détails de l'évaluation</h1>

			<br /><br />

			<a id="retour" href="../rh/evaluationDispo">⟸ retour</a>

			<br /><br />

			<select on:change={handleSelectChange}>
				<option> -- Choisissez un élève -- </option>

				{#each eleves as eleve}
					<option id="elev" value={eleve.idsalarie}>
						{eleve.nom}
						{eleve.prenom}
					</option>
				{/each}
			</select>

			<br /><br />

			<h3>Intitulé</h3>

			{#each intitul as int}
				<h4>{int.nom}</h4>
				<p id="idEval">{int.idevaluation}</p>
			{/each}

			<h3>Critères</h3>

			<!--Liste des critère (remarque, note, titre)-->
			{#each criteres as crit}
				<p id={`compo`}>{crit.idcomposer}</p>

				<table>
					<th>
						<h4>Nom</h4>
					</th>
					<th>
						<h4>Remarque</h4>
					</th>
					<th>
						<h4>Barème</h4>
					</th>
					<tr>
						<td>
							<h4>{crit.nom}</h4>
						</td>
						<td>
							<h4><input id={`remarqueEleveCrit`} /></h4>
						</td>
						<td>
							<h4><input id={`noteEleveCrit`} on:input={filterNumbers} />{crit.bareme}</h4>
						</td>
					</tr>
				</table>

				<br />
			{/each}

			<br />

			<h3>Note</h3>
			<h4>{totalNotes} / {noteContent}</h4>

			<br />

			<h3>Remarque</h3>

			<h4>
				<input type="text" id="remEval" />
			</h4>

			<br /><br />

			<button on:click={() => construct()}>Valider</button>
			<script>
				document.title = 'Cafétence | Noter';
			</script>
		{:catch error}
			<section class="container d-flex align-items-center justify-content-center vh-100">
				<span class="text-dark mx-2">Une erreur est survenue : {error}</span>
			</section>
			<script>
				document.title = 'Erreur...';
			</script>
		{/await}
	{/await}
</body>

<style>
	a {
		color: white;
		text-decoration: none;
	}

	a:hover {
		text-align: center;
		color: black;
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
		border-style: double;
		border-width: 12px;
		border-color: aqua;
		padding: 10px;
		margin-left: auto;
		margin-right: auto;
	}

	table th {
		padding: 10px;
		background: #272626;
		color: #ffffff;
	}

	table td {
		border-style: dashed;
		border-width: 5px;
		border-color: aqua;
		text-align: center;
		padding: 10px;
		background: #a3a3a3;
		color: #313030;
		text-align: center;
	}

	#noteEleveCrit {
		width: 60px;
		color: white;
		border-radius: 30px;
		border-style: none;
	}

	#noteEleveCrit:hover {
		background-color: aqua;
		color: #313030;
	}

	button {
		background-color: rgb(4, 99, 78);
		padding: 10px;
		border-radius: 20%;
		color: white;
	}

	button:hover {
		background-color: aqua;
		color: black;
	}

	input {
		width: 1000px;
		height: 20%;
		color: white;
		border-radius: 15px;
		border-style: none;
	}

	input:hover {
		background-color: aqua;
		color: #313030;
		width: 1000px;
		height: 20%;

		border-style: none;
	}

	select {
		border-radius: 30px;
	}

	#compo,
	#idEval {
		visibility: hidden;
	}
</style>
