<script lang="ts">
	import { supabase, signOut, retourAccueil, switchAccount } from '../../server/supabase.js';
	import { getSalarie } from '../../server/getter.js';
	import { navigate } from 'svelte-routing';

	/**
	 * @return {Promise<any[any[] | number]>}
	 */
	async function getEvaluations() {
		const idsalarie = await getSalarie();
		const { data: data, error: error } = await supabase
			.from('evaluation')
			.select('*, composer(idcomposer, nom, bareme), note(id_note, note, remarque)')
			.eq('idsalarie', idsalarie);

		if (error) {
			console.error('Erreur lors de la construction des évaluations', error);
			throw new Error('Erreur lors de la construction des évaluations');
		} else if (data) {
			console.log('Récupération des données réussie', data)
			return data;
		} else {
			console.warn('Pas de données');
			throw new Error('Erreur lors de la construction des évaluations');
		}
	}

	function computeTotalBareme(composers: { [x: number]: { bareme: number; }; }) {
		let total = 0;
		for (const composer in composers) {
			total += composers[composer]?.bareme || 0
		}
		return total
	}

	function computeTotalNote(notes: { [x: number]: { note: number; }; }) {
		let total = 0;
		for (const note in notes) {
			total += notes[note]?.note || 0
		}
		return total
	}
</script>

<body>
	<nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
		<div class="container-fluid">
			<ul class="navbar-nav">
				<li class="nav-item">
					<a class="nav-link active" href="/collaborateur/accueil">Accueil</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#top">Evaluations</a>
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
		{#await getEvaluations()}
			<section class="container d-flex align-items-center justify-content-center vh-100">
				<span class="spinner-border" />
				<span class="text-dark mx-2">Chargement...</span>
			</section>
		{:then result}
			<br /><br /><br />

			<h1>Liste des évaluations disponibles</h1>

			<br /><br /><br />

			{#each result as evaluation}
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
								<a href="/collaborateur/detailsEvaluation/?idevaluation={evaluation.idevaluation}&bareme={computeTotalBareme(evaluation?.composer)}&note={computeTotalNote(evaluation?.note)}">
									{evaluation.nom}
								</a>
							</td>
							<td>
								<p id="notation">
									{computeTotalNote(evaluation?.note)}/{computeTotalBareme(evaluation?.composer)}
								</p>
							</td>
						</tr>
					</tbody>
				</table>

				<br /><br />
			{/each}
			<script>
				document.title = 'Cafétence | Mes Evaluations';
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
	a {
		color: black;
		text-decoration: none;
	}
	a:hover {
		text-align: center;
		color: white;
	}
</style>
