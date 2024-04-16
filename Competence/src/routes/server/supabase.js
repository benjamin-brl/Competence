import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_KEY,
);

export async function signOut() {
	document.title = 'Déconnexion...';
	const { error } = await supabase.auth.signOut();
	if (error) {
		console.error(`Erreur lors de la déconnexion : ${error}`);
	}
}

export async function retourAccueil() {
	document.title = 'Vérification...';
	const { data: { user } } = await supabase.auth.getUser();
	if (user) {
		const { data: role, error } = await supabase
			.from('salarie')
			.select('identifiant')
			.eq('uuid', user.id);
		if (error) {
			console.error(`Erreur inattendue : ${error}`);
		} else if (role) {
			if (role[0].identifiant === 'rh' && location.pathname.split('/')[1] === 'rh') {
				return;
			} else if (role[0].identifiant !== 'collab' && location.pathname.split('/')[1] !== 'collaborateur') {
				location.href = '/';
			}
		}
		return;
	} else if (!user) {
		console.log('Utilisateur non connecté');
		location.href = '/';
	} else {
		console.warn('Aucune donnée');
		signOut();
		location.href = '/';
	}
}

export async function switchAccount() {
	document.title = 'Switching account...';
	const { data: { user } } = await supabase.auth.getUser();

	if (user) {

		const { data: salarie, error } = await supabase
			.from('salarie')
			.select('identifiant, idsalarie')
			.eq('uuid', user.id)

		if (error) {
			console.error(`Une erreur est survenue : ${error}`)
		} else if (salarie) {
			console.log(salarie)
			const role = salarie[0].identifiant == 'rh' ? { champ: 'collab', nom: 'collaborateur' } : { champ: 'rh', nom: 'rh' };

			const { data: data, error } = await supabase
				.from('salarie')
				.update({ identifiant: role.champ })
				.eq('uuid', user.id)
				.select('identifiant')

			if (error) {
				console.error(`Une erreur est survenue : ${error}`)
			} else if (data) {
				console.log(`Mis à jour : `, data)
				location.href = `/${role.nom}/accueil`
			} else {
				throw new Error(`Échec de la requête`)
			}

		} else {
			throw new Error(`Échec de la requête`)
		}
	}
}