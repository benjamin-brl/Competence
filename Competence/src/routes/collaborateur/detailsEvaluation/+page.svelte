<script lang="ts">
	import { supabase, signOut, retourAccueil, switchAccount } from '../../server/supabase.js';
	import { onMount } from 'svelte';

	let idsalarie: number | null = null;

	const urlParams = new URLSearchParams(location.search);
	const idevaluationValue = urlParams.get('idevaluation');
	let idevaluation = null;
	let intitul: any[] = [];

	async function fetchEvaluationDetails(idevaluationValue: string) {
		// Utilisez idevaluationValue pour récupérer les détails de l'évaluation depuis la base de données
		// Vous pouvez implémenter la logique pour récupérer les détails spécifiques en utilisant idevaluationValue
		// par exemple :
		const { data, error } = await supabase
			.from('evaluation')
			.select('*')
			.eq('idevaluation', idevaluationValue);
		if (error) {
			console.error('Erreur lors de la récupération des notes :', error);
		} else {
			intitul = data;
		}
	}
	let noteContent = ''; // Initialisation de la variable pour contenir la note
	let baremeContent = '';

	async function go() {
		const urlParams = new URLSearchParams(location.search);
		idevaluation = urlParams.get('idevaluation');
		if (idevaluation) {
			await fetchEvaluationDetails(idevaluation);
			await getCritere(idevaluation);
			await getRemarqueCriteres(); // Appel à cette fonction pour récupérer les remarques
			await getRemarqueEval();
		}
	}

	// Récupération des valeurs idevaluation et note depuis les paramètres d'URL
	let criteres: any[] = [];

	async function getCritere(idevaluationValue: string) {
		// Utilisez idevaluationValue pour récupérer les détails de l'évaluation depuis la base de données
		// Vous pouvez implémenter la logique pour récupérer les détails spécifiques en utilisant idevaluationValue
		// par exemple :
		const { data, error } = await supabase
			.from('composer')
			.select('*')
			.eq('idevaluation', idevaluationValue);
		if (error) {
			console.error('Erreur lors de la récupération des notes :', error);
		} else {
			criteres = data;
		}
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
			const composerIds = composerData.map((composer) => composer.idcomposer);

			// Filtrer les remarques en fonction des idcomposer présents dans la table "composer"
			remarqueCrit = noteData.filter((note) => composerIds.includes(note.idcomposer));
		} else {
			console.error(
				'Erreur lors de la récupération des données req1 :',
				noteError || composerError
			);
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
			const evaluationIds = evaluationData.map((evaluation) => evaluation.idevaluation);

			// Filtrer les remarques en fonction des idevaluation présents dans la table "evaluation"
			remarqueEval = passerData.filter((passer) => evaluationIds.includes(passer.idevaluation));
		} else {
			console.error('Erreur lors de la récupération des données :', passerError || evaluationError);
		}
	}

	onMount(() => {
		const urlParams = new URLSearchParams(location.search);
		baremeContent = urlParams.get('bareme') || '';
		noteContent = urlParams.get('note') || '';
	});
</script>

<body>
	<nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
		<div class="container-fluid">
			<ul class="navbar-nav">
				<li class="nav-item">
					<a class="nav-link active" href="/collaborateur/accueil">Accueil</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/collaborateur/evaluationDispo">Evaluations</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/collaborateur/profile">Profile</a>
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
		{#await go()}
			<section class="container d-flex align-items-center justify-content-center vh-100">
				<span class="spinner-border" />
				<span class="text-dark mx-2">Chargement...</span>
			</section>
		{:then}
			<section class="container-fluid m-auto pt-xxl-5">
				<h1>Détails de l'évaluation</h1>

				<br /><br />

				<a id="retour" href="/collaborateur/evaluationDispo">⟸ retour</a>

				<br />

				<h3>Intitulé</h3>
				{#each intitul as int}
					<h4>{int.nom}</h4>
				{/each}

				<br />

				<h3>Critères</h3>

				<br />

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

					<br /><br />
				{/each}

				<br />

				<h3>Note</h3>
				<div>
					<h4 id="ici">
						{noteContent} / {baremeContent}
					</h4>
				</div>

				<br />

				<h3>Remarque</h3>

				<br />
				{#each remarqueEval as rmqeval}
					{#if idevaluationValue == rmqeval.idevaluation}
						<h4>{rmqeval.remarque}</h4>
					{/if}
				{/each}

				<br /><br /><br />
			</section>
			<script>
				document.title = 'Cafétence | Evaluation';
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
		border: 3px ridge #8f8f8f;
		border-collapse: collapse;
		padding: 10px;
		margin-left: auto;
		margin-right: auto;
	}
	table th {
		border: 3px ridge #8f8f8f;
		padding: 10px;
		background: #726e6e;
		color: #ffffff;
	}
	table td {
		border: 3px ridge #8f8f8f;
		text-align: center;
		padding: 10px;
		background: #c5c4c4;
		color: #313030;
		text-align: center;
	}
</style>
