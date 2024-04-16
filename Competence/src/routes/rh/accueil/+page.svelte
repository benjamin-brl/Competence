<script lang="ts">
	import { signOut, retourAccueil, switchAccount } from '../../server/supabase.js';
	import { getCompetenceByID } from '../../server/getter.js';
</script>

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
		{#await getCompetenceByID()}
			<section class="container d-flex align-items-center justify-content-center vh-100">
				<span class="spinner-border" />
				<span class="text-dark mx-2">Chargement...</span>
			</section>
		{:then res}
			<section class="container-fluid m-auto pt-xxl-5">
				<br><br>
				<p>Vous retrouverez ci-dessous toutes les compétences</p>
				<br><br><br>

				<button on:click={() => location.reload()}>~ réinitialisation ~</button>
				<br><br><br>

				<table>
					<tr>
						<th>Tableau des compétences</th><br><br>
					</tr>

					{#each res as comp}
						{#if comp.idcompetence < 18}
							<tr>
								<table>
									<tr>
										<th>
											Bloc
										</th>
									</tr>
									<tr>
										<td>
											<br>
											<button on:click={() => getCompetenceByID(comp.idcompetence)}>{comp.titre}</button>
											<br>
										</td>
									</tr>
								</table>
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
			</section>
			<script>
				document.title = 'Cafétence | RH Accueil';
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
	table, tr, td {
		margin-left: auto;
		margin-right: auto;
		text-align: center;
	}

	a {
		color: white;
		text-decoration: none;
		&:hover {
			text-align: center;
			color: black;
		}
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
		&:hover {
			color: black;
		}
	}
</style>
