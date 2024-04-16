import { supabase } from "./supabase";

/** Récupère toute les informations concernant un salarié identifié par son uuid
 * @return {Promise<number>} Toutes les informations concernant le salarié
 */
export async function getSalarie() {
    document.title = 'Récupération de votre identifiant';
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data: data, error } = await supabase
            .from('salarie')
            .select()
            .eq('uuid', user.id);
        if (error) {
            console.error(`Une erreur est survenue :`, error);
            throw new Error('Erreur lors de la récupération du salarié');
        } else if (data) {
            console.log('Récupération du salarié réussie', data)
            return data[0]?.idsalarie
        } else {
            console.warn("Pas d’utilisateur sous l'UUID spécifié.");
            throw new Error('Erreur lors de la récupération du salarié');
        }
    } else {
        console.warn('Aucun utilisateur trouvé.');
        throw new Error('Aucun utilisateur trouvé.');
    }
}

/** Récupère l'IDsalarie concernant un salarié identifié par son uuid
 * @param {string} uuid UUID de l'utilisateur retourné par getUser() de supabase
 * @return {Promise<number>} Id du salarié
 */
export async function getSalarieByUUID(uuid) {
    document.title = 'Voyons qui vous êtes';
    const { data, error } = await supabase
        .from('salarie')
        .select('idsalarie')
        .eq('uuid', uuid);
    if (error) {
        console.error('Erreur lors de la récupération de idsalarie:', error);
        throw new Error('Erreur lors de la récupération de l\'identifiant');
    } else if (data) {
        console.log('ID récupérer avec succès');
        return data[0]?.idsalarie
    } else {
        console.warn("Aucun enregistrement trouvé pour l'UUID spécifié.");
        throw new Error('Erreur lors de la récupération de l\'identifiant');
    }
}

/** Récupère le rôle concernant un salarié identifié par son id
 * @param {number} id IDsalarié de l'utilisateur
 * @return {Promise<string>} Rôle du salarié
 */
export async function getSalarieRole(id) {
    document.title = 'Détermination de votre status';
    const { data, error } = await supabase
        .from('salarie')
        .select('identifiant')
        .eq('idsalarie', id);
    if (error) {
        console.error('Erreur lors de la récupération de idsalarie:', error);
        throw new Error('Erreur lors de la récupération de l\'identifiant');
    } else if (data) {
        console.log('Rôle récupérer avec succès');
        return data[0]?.identifiant
    } else {
        console.warn("Aucun enregistrement trouvé pour l'UUID spécifié.");
        throw new Error('Erreur lors de la récupération de l\'identifiant');
    }
}

/** Récupère les compétences par ID de son parent
 * @param {number | null} id ID de la compétence parent
 * @return {Promise<any[]>} Tableau de compétences
 */
export async function getCompetenceByID(id = null) {
    if (id == null) {
        const { data, error } = await supabase.from('competence').select().is('idcompetence', id);
        if (error) {
            console.error('Erreur lors de la récupération des compétences : ', error);
            throw new Error('Erreur lors de la récupération des compétences');
        } else if (data) {
            console.log('Récupération des compétences', data);
            return data;
        } else {
            console.warn('Pas de compétences : ', error);
            throw new Error('Erreur lors de la récupération des compétences');
        }
    } else {
        const { data, error } = await supabase.from('competence').select().eq('idcompetence', id);
        if (error) {
            console.error('Erreur lors de la récupération des compétences : ', error);
            throw new Error('Erreur lors de la récupération des compétences');
        } else if (data) {
            console.log('Récupération des compétences', data);
            return data;
        } else {
            console.warn('Pas de compétences : ', error);
            throw new Error('Erreur lors de la récupération des compétences');
        }
    }
}

/** Récupère les compétences par ID de son parent
 * @param {number | null} id ID de la compétence parent
 * @return {Promise<any[]>} Tableau de compétences
 */
export async function getCompetenceByIDParent(id = null) {
    if (id == null) {
        const { data, error } = await supabase.from('competence').select().is('idcompetence_1', id);
        if (error) {
            console.error('Erreur lors de la récupération des compétences : ', error);
            throw new Error('Erreur lors de la récupération des compétences');
        } else if (data) {
            console.log('Récupération des compétences', data);
            return data;
        } else {
            console.warn('Pas de compétences : ', error);
            throw new Error('Erreur lors de la récupération des compétences');
        }
    } else {
        const { data, error } = await supabase.from('competence').select().eq('idcompetence_1', id);
        if (error) {
            console.error('Erreur lors de la récupération des compétences : ', error);
            throw new Error('Erreur lors de la récupération des compétences');
        } else if (data) {
            console.log('Récupération des compétences', data);
            return data;
        } else {
            console.warn('Pas de compétences : ', error);
            throw new Error('Erreur lors de la récupération des compétences');
        }
    }
}


/** Récupère les compétences par niveau
 * @param {number | null} lvl ID de la compétence parent
 * @return {Promise<any[]>} Tableau de compétences
 */
export async function getCompetenceByLvl(lvl = null) {
    if (lvl == null) {
        const { data, error } = await supabase.from('competence').select().is('niveau', lvl);
        if (error) {
            console.error('Erreur lors de la récupération des compétences : ', error);
            throw new Error('Erreur lors de la récupération des compétences');
        } else if (data) {
            console.log('Récupération des compétences', data);
            return data;
        } else {
            console.warn('Pas de compétences : ', error);
            throw new Error('Erreur lors de la récupération des compétences');
        }
    } else {
        const { data, error } = await supabase.from('competence').select().eq('niveau', lvl);
        if (error) {
            console.error('Erreur lors de la récupération des compétences : ', error);
            throw new Error('Erreur lors de la récupération des compétences');
        } else if (data) {
            console.log('Récupération des compétences', data);
            return data;
        } else {
            console.warn('Pas de compétences : ', error);
            throw new Error('Erreur lors de la récupération des compétences');
        }
    }
}

/** Récupère le plus grand enfant hiérarchique des compétences
 * @return {Promise<Array<number>>} Valeur du plus grand enfant hiérarchique
 */
export async function getLengthOfCompetence() {
    const { data, error } = await supabase
        .from('competence')
        .select('niveau');
    if (error) {
        console.error('Erreur lors de la récupération du plus grand enfant hiérarchique des compétences : ', error);
        throw new Error('Erreur lors de la récupération des compétences');
    } else if (data) {
        console.log('Récupération des compétences', data);
        const tab = [];
        const unique = new Set()
        data.forEach(item => {
            console.log(item.niveau)
            unique.add(item.niveau)
        });
        for (let i = 0; i < unique.size; i++) {
            tab.push(i);
        };
        console.log(tab);
        return tab;
    } else {
        console.warn('Pas de plus grand enfant hiérarchique des compétences : ', error);
        throw new Error('Erreur lors de la récupération des compétences');
    }
}

/**
 * @param {number} id 
 * @return {Promise<Map<string, any>[]>}
 */
export async function getNotesBySalarieID(id) {
    const { data, error } = await supabase
        .from('note')
        .select()
        .eq('id_salarie', id);

    if (error) {
        console.error('Erreur lors de la récupération des notes : ', error);
        throw new Error('Erreur lors de la récupération des notes');
    } else if (data) {
        console.log('Récupération des notes réussies : ', data);
        return data
    } else {
        console.warn('Erreur lors de la récupération des notes : ', error);
        throw new Error('Erreur lors de la récupération des notes');
    }
}

/**
 * @param {number} id 
 * @return {Promise<Map<string, any>[]>}
 */
export async function getLinkByComposeID(id) {
    const { data, error } = await supabase
        .from('link')
        .select()
        .eq('idcomposer', id);

    if (error) {
        console.error('Erreur lors de la récupération des liaisons : ', error);
        throw new Error('Erreur lors de la récupération des liaisons');
    } else if (data) {
        console.log('Récupération des liaisons réussies : ', data);
        return data
    } else {
        console.warn('Erreur lors de la récupération des liaisons : ', error);
        throw new Error('Erreur lors de la récupération des liaisons');
    }
}

/**
 * @return {Promise<Array<any>>}
 */
export async function getCompetences() {
    const { data, error } = await supabase
        .from('competence')
        .select()

    if (error) {
        console.error('Erreur lors de la récupération des compétences : ', error);
        throw new Error('Erreur lors de la récupération des compétences');
    } else if (data) {
        console.log('Récupération des compétences réussies : ', data);
        return data
    } else {
        console.warn('Erreur lors de la récupération des compétences : ', error);
        throw new Error('Erreur lors de la récupération des compétences');
    }
}

/**
 * @return {Promise<Map<string, any>[]>}
 */
export async function getComposers() {
    const { data, error } = await supabase
        .from('composer')
        .select()

    if (error) {
        console.error('Erreur lors de la récupération des composers : ', error);
        throw new Error('Erreur lors de la récupération des composers');
    } else if (data) {
        console.log('Récupération des composers réussies : ', data);
        return data
    } else {
        console.warn('Erreur lors de la récupération des composers : ', error);
        throw new Error('Erreur lors de la récupération des composers');
    }
}

/**
 * @return {Promise<Map<string, any>[]>}
 */
export async function getLinks() {
    const { data, error } = await supabase
        .from('link')
        .select()

    if (error) {
        console.error('Erreur lors de la récupération des liaisons : ', error);
        throw new Error('Erreur lors de la récupération des liaisons');
    } else if (data) {
        console.log('Récupération des liaisons réussies : ', data);
        return data
    } else {
        console.warn('Erreur lors de la récupération des liaisons : ', error);
        throw new Error('Erreur lors de la récupération des liaisons');
    }
}