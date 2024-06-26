export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/collaborateur/accueil": [3],
		"/collaborateur/detailsEvaluation": [4],
		"/collaborateur/evaluationDispo": [5],
		"/collaborateur/profile": [6],
		"/inscription": [7],
		"/rh/accueil": [8],
		"/rh/creation_eval": [9],
		"/rh/evaluationDispo": [10],
		"/rh/modifEval": [11],
		"/rh/noter": [12]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';