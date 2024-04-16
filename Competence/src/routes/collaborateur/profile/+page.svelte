<script lang="ts">
	// @ts-nocheck
	import { signOut, retourAccueil, switchAccount } from '../../server/supabase.js';
	import {
		getSalarie,
		getNotesBySalarieID,
		getLinks,
		getCompetenceByID,
		getCompetences,
		getComposers
	} from '../../server/getter.js';

	let memo: Map<string, any> = new Map();
	let competence: any[];
	let notes: Map<string, any>[] = [];
	let links: Map<string, any>[] = [];
	let composers: Map<string, any>[] = [];

	async function computeSuccess(idSalarie: number, idCompetence: number) {
		let total: number = 0;
		let count: number = 0;
		if (memo.has('notes')) {
			notes = memo.get('notes');
		} else {
			notes = await getNotesBySalarieID(idSalarie);
			memo.set('notes', notes);
		}

		if (memo.has('composer')) {
			composers = memo.get('composer');
		} else {
			composers = await getComposers();
			memo.set('composers', composers);
		}

		if (memo.has('links')) {
			links = memo.get('links');
		} else {
			links = await getLinks();
			memo.set('links', links);
		}

		for (const link of links) {
			if (memo.has(`idCompetence${link.idcompetence}`)) {
				competence = memo.get(`idCompetence${link.idcompetence}`);
			} else {
				competence = await getCompetenceByID(link.idcompetence);
				memo.set(`idCompetence${link.idcompetence}`, competence);
			}

			if (competence[0].idcompetence == idCompetence) {
				for (const note of notes) {
					if (note.idcomposer == link.idcomposer) {
						for (const composer of composers) {
							if (composer.idcomposer == note.idcomposer) {
								if (note.note != null) {
									total += note.note / composer.bareme;
									count += 1;
								}
							}
						}
					}
				}
			}
		}

		count = count == 0 ? 1 : count;

		return (total / count) * 100;
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
					<a class="nav-link" href="/collaborateur/evaluationDispo">Evaluations</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#top">Profil</a>
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
		{#await getSalarie()}
			<section class="container d-flex align-items-center justify-content-center vh-100">
				<span class="spinner-border" />
				<span class="text-dark mx-2">Chargement...</span>
			</section>
		{:then id}
			<h1>Mon profil</h1>
			<h4>
				Vous retrouverez ci-dessous toutes les compétences que vous avez acquis et votre pourcentage
				de réussite
			</h4>
			<table class="table table-bordered table-dark table-hover table-sm table-responsive">
				<thead>
					<tr>
						<th scope="col">Titre</th>
						<th scope="col">Pourcentage</th>
					</tr>
				</thead>
				<tbody>
					{#await getCompetences()}
						<section class="container d-flex align-items-center justify-content-center vh-100">
							<span class="spinner-border" />
							<span class="text-dark mx-2">Chargement...</span>
						</section>
					{:then competences}
						{#each competences as competence}
							<tr>
								{#await computeSuccess(id, competence.idcompetence)}
									<td class="bg-dark">{competence.titre} ({competence.idcompetence})</td>
									<td class="bg-dark"> En cours de calcul... </td>
								{:then pourcentage}
									<td
										class="bg-{pourcentage == 0
											? 'dark'
											: pourcentage < 33
											? 'danger'
											: pourcentage > 66
											? 'success'
											: 'warning'}">{competence.titre} ({competence.idcompetence})</td
									>
									<td
										class="bg-{pourcentage == 0
											? 'dark'
											: pourcentage < 33
											? 'danger'
											: pourcentage > 66
											? 'success'
											: 'warning'}"
									>
										{pourcentage == 0 ? 'non évalué' : `${pourcentage}%`}
									</td>
								{/await}
							</tr>
						{/each}
					{/await}
				</tbody>
			</table>
			<script>
				document.title = 'Cafétence | Mon Profil';
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
		&:hover {
			text-align: center;
			color: black;
		}
	}
	h1 {
		margin-top: 3%;
	}
</style>
