import { supabase } from "./supabase";

/** Vérifie si l'utilisateur identifié par son id est bien ce qu'il prétend être
 * @param {number} id IDsalarie de l'utilisateur
 * @param {string} role Rôle de l'utilisateur
 * @return {Promise<boolean>} Vrai si l'utilisateur est ce qu'il est sinon faux
 */
export async function verifSalarieRole(id, role) {
    document.title = 'Vérification de votre status';
    const rolename = role == 'rh' ? 'rh' : 'collaborateur';
    const { data: user, error } = await supabase
        .from(rolename)
        .select()
        .eq('idsalarie', id);
    if (error) {
        console.error(`Une erreur est survenue : ${error}`);
    }
    return (user && user[0].idsalarie != null) ? true : false;
}