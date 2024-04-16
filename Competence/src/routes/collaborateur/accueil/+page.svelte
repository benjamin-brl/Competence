<script lang="ts">
	import { signOut, retourAccueil, switchAccount } from '../../server/supabase.js';
	import { getCompetenceByLvl, getLengthOfCompetence } from '../../server/getter.js';
</script>

<body>
	<nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
		<div class="container-fluid">
			<ul class="navbar-nav">
				<li class="nav-item">
					<a class="nav-link active" href="#top">Accueil</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/collaborateur/evaluationDispo">Evaluations</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/collaborateur/profile">Profil</a>
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
		{#await getLengthOfCompetence()}
			<section class="container d-flex align-items-center justify-content-center vh-100">
				<span class="spinner-border" />
				<span class="text-dark mx-2">Chargement...</span>
			</section>
		{:then niveaux}
			<section class="container-fluid m-auto pt-xxl-5">
				<br /><br />

				<p>Vous retrouverez ci-dessous toutes les compétences</p>

				<br />
			</section>
			<table>
				<tbody>
					{#each niveaux as niveau}
						{#if niveau === 0}
							<th scope="col">Blocs</th>
						{:else if niveau === 1}
							<th scope="col">Domaines</th>
						{:else if niveau === 2}
							<th scope="col">Compétences</th>
						{:else}
							<th scope="col">Sous-Compétences</th>
						{/if}
						{#await getCompetenceByLvl(niveau)}
							<section class="container d-flex align-items-center justify-content-center vh-100">
								<span class="spinner-border" />
								<span class="text-dark mx-2">Chargement...</span>
							</section>
						{:then res}
							<tr>
								{#each res as comp}
									<td>
										{comp.titre}
									</td>
								{:else}
									<p>Il y a eu un problème lors de la requête SQL</p>
								{/each}
							</tr>
						{:catch error}
							<section class="container d-flex align-items-center justify-content-center vh-100">
								<span class="text-dark mx-2">Une erreur est survenue : {error}</span>
							</section>
							<script>
								document.title = 'Erreur...';
							</script>
						{/await}
					{/each}
				</tbody>
			</table>
		{/await}
		<script>
			document.title = 'Cafétence | Collab Accueil';
		</script>
	{/await}
</body>

<style>
	table,
	tr,
	td {
		margin-left: auto;
		margin-right: auto;
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
