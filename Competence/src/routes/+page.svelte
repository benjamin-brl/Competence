<script lang="ts">
	import { supabase } from './server/supabase.js';

	var login = {
		user: '',
		password: ''
	};

	async function connexion() {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: login.user,
			password: login.password
		});
		if (error) {
			console.error('Erreur de connexion : ', error.message);
		} else if (!data.session) {
			console.error('Erreur de connexion');
		} else if (data.user) {
			console.log('Authentification réussi');
			let uuid = data.user.id;
			let { data: salarie, error } = await supabase
				.from('salarie')
				.select('idsalarie')
				.eq('uuid', uuid);
			if (error) {
				console.error('Error salarie : ', error.message);
			}
			if (salarie) {
				let { data: rh, error } = await supabase
					.from('rh')
					.select('idsalarie')
					.eq('idsalarie', salarie[0].idsalarie);
				if (error) {
					console.error('Error rh : ', error.message);
				}

				if (rh) {
					if (rh[0]?.idsalarie != null) {
						document.location.href = '/rh/accueil';
					} else {
						let { data: collaborateur, error } = await supabase
							.from('collaborateur')
							.select('idsalarie')
							.eq('idsalarie', salarie[0]?.idsalarie);
						if (error) {
							console.error('Error collaborateur : ', error.message);
						}
						if (collaborateur) {
							if (collaborateur[0]?.idsalarie != null) {
								document.location.href = '/collaborateurs/accueil';
							}
						}
					}
				}
			}
		}
	}
	async function signOut() {
		const { error } = await supabase.auth.signOut();
	}
</script>

<body>
	<nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
		<div class="container-fluid">
			<ul class="navbar-nav">
				<li class="nav-item">
					<a class="nav-link active" href="/">Accueil</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/collaborateurs/accueil">Collaborateurs</a>
				</li>
				<li class="nav-item">
					<button class="nav-link" on:click={signOut}>Déconnexion</button>
				</li>
			</ul>
		</div>
	</nav>

	<br /><br /><br /><br />

	<h1>Bienvenue dans Cafétences</h1>
	<form on:submit|preventDefault={connexion}>
		<h2>Identifiants</h2>
		<input
			type="text"
			class="form-control"
			placeholder="Ton Nom"
			bind:value={login.user}
		/>
		<h2>Mot de passe</h2>
		<input
			type="password"
			class="form-control"
			placeholder="Ton mot de passe"
			bind:value={login.password}
		/>
		<input
			type="submit"
			class="btn btn-dark"
			value="Se connecter"
		/>
	</form>
</body>

<style>
	h2 {
		margin-top: 2%;
	}
	input {
		margin-left: 40%;
		width: 20%;
		background-color: rgb(56, 57, 58);
		color: rgb(196, 192, 192);
		text-align: center;
		margin-top: 1%;
		margin-bottom: 1%;
	}
</style>