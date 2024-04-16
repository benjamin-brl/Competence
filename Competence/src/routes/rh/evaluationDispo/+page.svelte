<script lang="ts">
	import { supabase, signOut, retourAccueil, switchAccount } from '../../server/supabase.js';

	/**
	 * @return {Promise<any[]>}
	 */
	async function getEvaluations() {
		document.title = 'Récupère les évaluations...';
		const { data, error } = await supabase
			.from('evaluation')
			.select('idevaluation, nom, composer(bareme)');

		if (error) {
			console.error('Erreur lors de la construction des évaluations', error);
			throw new Error('Erreur lors de la construction des évaluations');
		} else if (data) {
			console.log('Récupération des données réussie', data);
			return data;
		} else {
			console.warn('Pas de données');
			throw new Error('Erreur lors de la construction des évaluations');
		}
	}

	function computeTotalBareme(composers: { [x: number]: { bareme: number } }) {
		document.title = 'Calcul les barèmes...';
		let total = 0;
		for (const composer in composers) {
			total += composers[composer]?.bareme || 0;
		}
		return total;
	}

	//* ------------------------------------------- SUPPRESSION ------------------------------------------- *//

	async function suppressionPasser(idevaluation: string) {
		try {
			console.log(`Suppression de l'évaluation avec ID passer : ${idevaluation}`);
			const { data, error } = await supabase
				.from('passer')
				.delete()
				.eq('idevaluation', idevaluation);
			if (error) {
				console.error('Erreur lors de la suppression passer :', error);
			} else {
				console.log('Évaluation supprimée avec succès passer ', data);
			}
		} catch (error) {
			console.error('Erreur lors de la suppression passer :', error);
		}
	}

	async function suppressionNote(idevaluation: string) {
		try {
			console.log(`Suppression de l'évaluation avec ID note : ${idevaluation}`);
			const { data, error } = await supabase.from('note').delete().eq('idEvaluation', idevaluation);
			if (error) {
				console.error('Erreur lors de la suppression note :', error);
			} else {
				console.log('Évaluation supprimée avec succès note ', data);
			}
		} catch (error) {
			console.error('Erreur lors de la suppression note :', error);
		}
	}

	async function suppressionComposer(idevaluation: string) {
		try {
			console.log(`Suppression de l'évaluation avec ID composer : ${idevaluation}`);
			const { data, error } = await supabase
				.from('composer')
				.delete()
				.eq('idevaluation', idevaluation);
			if (error) {
				console.error('Erreur lors de la suppression compo :', error);
			} else {
				console.log('Évaluation supprimée avec succès compo', data);
			}
		} catch (error) {
			console.error('Erreur lors de la suppression compo :', error);
		}
	}

	async function suppressionEvaluation(idevaluation: string) {
		try {
			console.log(`Suppression de l'évaluation avec ID Evaluation : ${idevaluation}`);
			const { data, error } = await supabase
				.from('evaluation')
				.delete()
				.eq('idevaluation', idevaluation);
			if (error) {
				console.error('Erreur lors de la suppression eval :', error);
			} else {
				console.log('Évaluation supprimée avec succès eval', data);
			}
		} catch (error) {
			console.error('Erreur lors de la suppression eval :', error);
		}
	}

	async function suppressionLink(idevaluation: string) {
		try {
			const { data: linkData, error: linkError } = await supabase.from('link').select('idcomposer');

			const { data: composerData, error: composerError } = await supabase
				.from('composer')
				.select('idcomposer, idevaluation')
				.eq('idevaluation', idevaluation);

			if (!linkError && !composerError) {
				const composerIds = composerData.map((composer) => composer.idcomposer);

				const linkIdsToDelete = linkData
					.filter((link) => composerIds.includes(link.idcomposer))
					.map((link) => link.idcomposer);

				const { error: deletionError } = await supabase
					.from('link')
					.delete()
					.in('idcomposer', linkIdsToDelete);

				if (!deletionError) {
					console.log('Données supprimées avec succès de la table link', linkIdsToDelete);
				} else {
					console.error(
						'Erreur lors de la suppression des données de la table link :',
						deletionError
					);
				}
			} else {
				console.error(
					'Erreur lors de la récupération des données req1 link:',
					linkError || composerError
				);
			}
		} catch (error) {
			console.error('Erreur lors de la suppression de données de la table link :', error);
		}
	}

	async function suppressionFinale(idevaluation: string) {
		await suppressionNote(idevaluation);
		await suppressionLink(idevaluation);
		await suppressionPasser(idevaluation);
		await suppressionComposer(idevaluation);
		await suppressionEvaluation(idevaluation);

		location.reload();
	}
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
		{#await getEvaluations()}
			<section class="container d-flex align-items-center justify-content-center vh-100">
				<span class="spinner-border" />
				<span class="text-dark mx-2">Chargement...</span>
			</section>
		{:then evaluations}
			<br /><br /><br /><br />

			<h1>Liste des évaluations disponibles</h1>

			<br /><br />

			<a href="/rh/creation_eval">~ Création d'une évaluation ~</a>

			<br /><br /><br />

			{#each evaluations as evaluation}
				<table>
					<thead>
						<tr>
							<th>Intitulé</th>
							<th>Barème</th>
							<th>Gestion</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<a
									href="/rh/noter?idevaluation={evaluation.idevaluation}&bareme={computeTotalBareme(
										evaluation?.composer
									)}"
								>
									{evaluation.nom}
								</a>
							</td>
							<td>
								<p>
									{computeTotalBareme(evaluation?.composer)}
								</p>
							</td>
							<td>
								<a href="./modifEval?idevaluation={evaluation.idevaluation}">modifier</a>
								<button on:click={() => suppressionFinale(evaluation.idevaluation)}
									>supprimer</button
								>
							</td>
						</tr>
					</tbody>
				</table>

				<br /><br />
			{/each}
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
	table {
		padding: 10px;
		margin-left: auto;
		margin-right: auto;
	}

	table th {
		width: 40%;
		font-size: 27px;
		border-width: 10px;
		border-color: rgb(0, 167, 167);
		padding: 10px;
		background: #272626;
		color: #ffffff;
	}

	table td {
		font-size: 25px;
		border-width: 10px;
		border-color: rgb(16, 179, 179);
		text-align: center;
		padding: 25px;
		background: #a3a3a3;
		color: #313030;
		text-align: center;
	}

	a {
		color: white;
		text-decoration: none;
	}

	a:hover {
		text-align: center;
		color: black;
	}

	#manag {
		margin-left: 50px;
		border-style: none;
		background-color: #272626;
	}

	#del {
		background-color: rgb(121, 0, 0);
		border: 0;
		line-height: 2.5;
		padding: 0 20px;
		font-size: 1rem;
		text-align: center;
		color: #fff;
		text-shadow: 1px 1px 1px #000;
		border-radius: 10px;
		margin-left: 10px;
	}

	#del:hover {
		background-color: red;
		color: #000;
	}

	#edit {
		background-color: rgb(131, 131, 0);
		border: 0;
		line-height: 2.5;
		padding: 8px 25px;
		font-size: 1rem;
		text-align: center;
		color: #fff;
		text-shadow: 1px 1px 1px #000;
		border-radius: 10px;
		margin-right: 10px;
	}

	#edit:hover {
		background-color: yellow;
		color: #000;
	}

	#crea {
		background-color: rgb(0, 167, 167);
		border: 0;
		line-height: 2.5;
		padding: 8px 25px;
		font-size: 2rem;
		text-align: center;
		color: #fff;
		text-shadow: 1px 1px 1px #000;
		border-radius: 10px;
		margin-right: 10px;
	}

	#crea:hover {
		color: #000;
		background-color: rgb(3, 224, 224);
	}
</style>
