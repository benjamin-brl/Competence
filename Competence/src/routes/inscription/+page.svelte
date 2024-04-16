<script lang="ts">
	import { supabase, signOut, switchAccount } from '../server/supabase.js';

    let login = {
        email: '',
        psw: ''
    }

    async function inscription() {
        const { data, error } = await supabase.auth.signUp({
            email: login.email,
            password: login.psw
        })
        if (error) {
            console.error(`Une erreur est survenue : ${error}`)
        } else if (data) {
            console.log('Utilisateur créer')
            location.href = '/'
        } else {
            throw new Error("Erreur inconnue");
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
					<a class="nav-link" href="/" on:click|preventDefault={switchAccount}>SwitchAccount</a>
				</li>
				<li class="nav-item">
					<button class="nav-link" on:click={signOut}>Déconnexion</button>
				</li>
			</ul>
		</div>
	</nav>
	<section class="container-fluid m-auto pt-xxl-5">
		<br />
		<h1>Bienvenue dans Cafétence</h1>
		<form on:submit|preventDefault={inscription}>
			<h2>Identifiants</h2>
			<input
				type="text"
				class="form-control"
				placeholder="example@gmail.com"
                required
				bind:value={login.email}
			/>
			<h2>Mot de passe</h2>
			<input
				type="password"
                min="6"
                minlength="6"
				class="form-control"
				placeholder="Votre mot de passe"
                required
				bind:value={login.psw}
			/>
			<input type="submit" class="form-control btn btn-dark" value="S'inscrire" />
		</form>
	</section>
    <script>
        document.title = 'Cafétence | Inscription';
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