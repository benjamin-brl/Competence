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
	() => import('./nodes/11')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/collaborateurs/accueil": [3],
		"/collaborateurs/detailsEvaluation": [4],
		"/collaborateurs/evaluationDispo": [5],
		"/collaborateurs/profile": [6],
		"/rh/accueil": [7],
		"/rh/creation_eval": [8],
		"/rh/evaluationDispo": [9],
		"/rh/modifEval": [10],
		"/rh/noter": [11]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';