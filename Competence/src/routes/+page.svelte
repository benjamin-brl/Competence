<script lang="ts">
	import { getSalarieID, getSalarieRole } from './server/getter.js';
	import { verifSalarieRole } from './server/veriffer.js';
	import { supabase, signOut, switchAccount } from './server/supabase.js';

	let login = {
		user: '',
		password: ''
	};

	async function connexion(): Promise<void> {
		document.title = 'En cours de connexion';
		const { data, error } = await supabase.auth.signInWithPassword({
			email: login.user,
			password: login.password
		});

		if (error) {
			console.error('Erreur de connexion : ', error.message);
		} else if (!data.session) {
			console.error('Erreur de connexion');
		} else if (data.user) {
			const idsalarie = await getSalarieID(data.user.id);
			const role = await getSalarieRole(idsalarie)
			if (await verifSalarieRole(idsalarie, role)) {
				const rolename = role == 'rh' ? 'rh' : 'collaborateur';
				location.href = `/${rolename}/accueil`
			} else {
				console.warn(`Le salarié (${idsalarie}) n'est pas dans enregistré en tant que "${role}"`)
			}
		}
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
					<a class="nav-link" href="/inscription">Inscription</a>
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
	<section class="container-fluid m-auto pt-xxl-5">
		<br />
		<h1>Bienvenue dans Cafétence</h1>
		<form on:submit|preventDefault={connexion}>
			<h2>Identifiants</h2>
			<input
				type="text"
				class="form-control"
				placeholder="example@gmail.com"
				bind:value={login.user}
			/>
			<h2>Mot de passe</h2>
			<input
				type="password"
				class="form-control"
				placeholder="Votre mot de passe"
				bind:value={login.password}
			/>
			<input type="submit" class="form-control btn btn-dark" value="Se connecter" />
		</form>
	</section>
	<script>
		document.title = 'Cafétence | Connexion';
	</script>
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