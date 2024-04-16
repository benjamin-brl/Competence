<script lang="ts">
	// @ts-nocheck
	import { supabase, signOut } from '../../server/supabase.js';
	import { getCompetences } from '../../server/getter.js';

	function getIdEval() {
		const URL = new URLSearchParams(location.search);
		const idEval = URL.get('idevaluation');
		return idEval;
	}

	let idTest;

	async function addCriterion() {
		// Créer l'élément div pour le critère, son barème, et ses compétences
		const divCriterion = document.createElement('div');
		divCriterion.classList.add('insertCriterion');
		divCriterion.classList.add('mb-3'); // Ajoute une marge inférieure de 3 unités Bootstrap

		// Créer l'élément label pour le critère
		const labelCritere = document.createElement('label');
		labelCritere.classList.add('form-label');
		labelCritere.classList.add('fw-bold'); // Ajoute une graisse au texte
		labelCritere.innerHTML = '<h4>Critère : </h4>';

		// Créer l'élément input pour le critère
		const inputCritere = document.createElement('input');
		inputCritere.classList.add('form-control');
		inputCritere.setAttribute('name', 'newCritere');

		// Ajouter l'élément input à l'élément label
		labelCritere.appendChild(inputCritere);

		// Créer l'élément label pour le barème
		const labelBareme = document.createElement('label');
		labelBareme.classList.add('form-label');
		labelBareme.classList.add('fw-bold'); // Ajoute une graisse au texte
		labelBareme.innerHTML = '<h4>Barème : </h4>';

		// Créer l'élément input pour le barème
		const inputBareme = document.createElement('input');
		inputBareme.classList.add('form-control');
		inputBareme.setAttribute('name', 'newBareme');

		// Ajouter l'élément input à l'élément label
		labelBareme.appendChild(inputBareme);

		// Ajouter les éléments labels à l'élément div
		divCriterion.appendChild(labelCritere);
		divCriterion.appendChild(labelBareme);
		divCriterion.appendChild(await addCompetence(idTest));

		// Sélectionner l'élément parent où vous souhaitez ajouter ces éléments
		const parentElement = document.getElementById('insertSection');

		// Ajouter les éléments label et input au parent
		parentElement.appendChild(divCriterion);

		idTest++;
	}

	async function addCompetence(idTest) {
		// Créer l'élément <ul> avec l'ID spécifié
		const ulElement = document.createElement('ul');
		ulElement.classList.add('insertListeCompetences');

		const responseComp = await getCompetences();
		// Parcourir les éléments responseComp
		responseComp.forEach((comp) => {
			// Créer l'élément <li> pour chaque compétence
			const liElement = document.createElement('li');
			liElement.classList.add('form-check');

			// Créer l'élément <input> pour la case à cocher
			const inputElement = document.createElement('input');
			inputElement.classList.add('form-check-input');
			inputElement.type = 'checkbox';
			inputElement.name = 'insertCompetences';
			inputElement.value = comp.idcompetence;
			inputElement.id = `${idTest}-${comp.idcompetence}`;

			// Créer l'élément <label> pour le titre de la compétence
			const labelElement = document.createElement('label');
			labelElement.classList.add('form-check-label');
			labelElement.textContent = comp.titre;
			labelElement.htmlFor = `${idTest}-${comp.idcompetence}`;

			// Ajouter l'input et le label à l'élément <li>
			liElement.appendChild(inputElement);
			liElement.appendChild(labelElement);

			// Ajouter l'élément <li> à l'élément <ul>
			ulElement.appendChild(liElement);
		});

		return ulElement;
	}

	async function getEvalById(id: Number) {
		try {
			let { data: evaluation, error } = await supabase
				.from('evaluation')
				.select()
				.eq('idevaluation', id);

			if (error) {
				console.error('Erreur : ' + error.message);
			} else {
				return evaluation;
			}
		} catch (error: any) {
			console.error('Erreur : ' + error.message);
		}
	}

	async function getCriteresByIdEval(idEval: Number) {
		try {
			let { data: criteres, error } = await supabase
				.from('composer')
				.select()
				.eq('idevaluation', idEval);

			if (error) {
				console.error('Erreur : ' + error.message);
			} else {
				return criteres;
			}
		} catch (error: any) {
			console.error('Erreur : ' + error.message);
		}
	}

	async function getCompetencesByIdCrit(idCrit: Number) {
		try {
			let { data: competences, error } = await supabase
				.from('link')
				.select('competence(*)')
				.eq('idcomposer', idCrit);

			if (error) {
				console.error('Erreur : ' + error.message);
			} else {
				return competences;
			}
		} catch (error: any) {
			console.error('Erreur : ' + error.message);
		}
	}

	// Fonctionne
	async function updateTitreEval(idEval: Number, titre: String) {
		try {
			const { data, error } = await supabase
				.from('evaluation')
				.update({ nom: titre })
				.eq('idevaluation', idEval)
				.select();
			if (error) {
				console.error('Erreur : ' + error.message);
			} else {
				console.log(data);
				return data;
			}
		} catch (e: any) {
			console.error('Erreur : ' + e.message);
		}
	}

	// Fonctionne
	async function updateCritereAndBareme(idCompo: Number, nom: String, bareme: Number) {
		try {
			const { data, error } = await supabase
				.from('composer')
				.update({
					nom: nom,
					bareme: bareme
				})
				.eq('idcomposer', idCompo)
				.select();
			if (error) {
				console.error('Erreur : ' + error.message);
			} else {
				console.log(data);
				return data;
			}
		} catch (e: any) {
			console.error('Erreur : ' + e.message);
		}
	}

	// Fonctionne
	async function deleteLinkByIdEval(idEval: Number) {
		try {
			const { data, error } = await supabase.rpc('deletelinkbyideval', {
				idevaluation_param: idEval
			});
			if (error) {
				console.error('Erreur : ' + error.message);
			}
		} catch (e: any) {
			console.error('Erreur : ' + e.message);
		}
	}

	// Fonctionne
	async function insertLink(idCompe: Number, idCompo: Number) {
		try {
			const { data, error } = await supabase
				.from('link')
				.insert([{ idcompetence: idCompe, idcomposer: idCompo }])
				.select();
			if (error) {
				console.error('Erreur : ' + error.message);
			} else {
				return data;
			}
		} catch (e: any) {
			console.error('Erreur : ' + e.message);
		}
	}

	async function insertCritereAndBareme(idEval: Number, nom: String, bareme: Number) {
		try {
			const { data, error } = await supabase
				.from('composer')
				.insert([
					{
						idevaluation: idEval,
						nom: nom,
						bareme: bareme
					}
				])
				.select();
			if (error) {
				console.error('Erreur : ' + error.message);
			} else {
				return data;
			}
		} catch (e: any) {
			console.error('Erreur : ' + e.message);
		}
	}

	async function getLastIdComposer() {
		try {
			let { data: composer, error } = await supabase
				.from('composer')
				.select('idcomposer')
				.order('idcomposer', { ascending: false })
				.limit(1);

			if (error) {
				console.error('Erreur : ' + error.message);
			} else {
				if (composer?.length > 0) {
					console.log(composer);
					idTest = composer[0].idcomposer + 1;
					return composer[0].idcomposer;
				} else {
					console.log('No data');
					idTest = 0;
				}
			}
		} catch (error: any) {
			console.error('Erreur : ' + error.message);
		}
	}
	getLastIdComposer();

	async function deleteCritByIdCompo(idCompo: Number) {
		try {
			const { error } = await supabase.from('composer').delete().eq('idcomposer', idCompo);
			if (error) {
				console.error('Erreur : ' + error.message);
			}
		} catch (error: any) {
			console.error('Erreur : ' + error.message);
		}
	}

	async function handleSubmit() {
		/*
		 *** Permet la modification des élémments déjà présents initialement | Fonctionne ***
		 */
		// Récupérer l'ID de l'évaluation | Fonctionne
		const idEval: Number = getIdEval();
		// console.log(idEval);

		// Récupérer le nouveau Titre de l'évaluation | Fonctionne
		const updateTitre: String = document.getElementById('updateTitre').value;
		// console.log(updateTitre);
		await updateTitreEval(idEval, updateTitre);

		const listeCompo: HTMLCollection = document.getElementsByClassName('idCompo');
		for (const elt of listeCompo) {
			const idCompo: Number = parseInt(elt.id);
			const updateCritere: String = elt.querySelector('input[name="updateCritere"]').value;
			const updateBareme: Number = parseInt(elt.querySelector('input[name="updateBareme"]').value);
			// console.log(idCompo, updateCritere, updateBareme);
			await updateCritereAndBareme(idCompo, updateCritere, updateBareme);
		}

		// Récupérer pour chaque ul, les checkboxes cochées | Fonctionne
		const listeUl: HTMLCollection = document.getElementsByClassName('updateListeCompetences');
		await deleteLinkByIdEval(idEval);
		for (const ul of listeUl) {
			const idCompo: Number = parseInt(ul.id);
			const checkboxes: HTMLCollection = ul.querySelectorAll('input[type="checkbox"]:checked');
			checkboxes.forEach(async (checkbox) => {
				// console.log(parseInt(checkbox.value));
				await insertLink(parseInt(checkbox.value), idCompo);
			});
		}

		/*
		 *** Permet de gérer l'ajout de critères ***
		 */
		const listeInsertDiv = document.getElementsByClassName('insertCriterion');
		Array.from(listeInsertDiv).forEach(async (div) => {
			const newCritere: String = div.querySelector('input[name="newCritere"').value;
			const newBareme: Number = parseInt(div.querySelector('input[name="newBareme"').value);
			// console.log(idEval, newCritere, newBareme);
			await insertCritereAndBareme(idEval, newCritere, newBareme);

			const insertUl: HTMLElement = div.querySelector('ul');
			const checkboxes: HTMLCollection = insertUl.querySelectorAll(
				'input[type="checkbox"]:checked'
			);
			const lastIdCompo: Number = await getLastIdComposer();
			checkboxes.forEach(async (checkbox) => {
				// console.log(parseInt(checkbox.value));
				await insertLink(parseInt(checkbox.value), lastIdCompo);
			});
		});
	}
</script>

<nav class="navbar navbar-expand-sm bg-dark navbar-dark sticky-top">
	<div class="container-fluid">
		<ul class="navbar-nav">
			<li class="nav-item">
				<a class="nav-link active" href="/rh/accueil">Accueil</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/rh/evaluationDispo">Evaluations</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/" on:click={signOut}>Déconnexion</a>
			</li>
		</ul>
	</div>
</nav>
<main class="container-fluid">
	<form id="formUpdate" action="" on:submit={handleSubmit}>
		<h1 class="text-center">Modification d'une évaluation :</h1>
		{#await getEvalById(getIdEval())}
			<div class="spinner-border" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		{:then responseEval}
			<label class="form-label">
				<h4>Titre :</h4>
				<input
					class="form-control"
					id="updateTitre"
					name="updateTitre"
					value={responseEval[0].nom}
				/>
			</label><br />
			<!-- Pour avoir les critères et leur barème associé -->
			{#await getCriteresByIdEval(getIdEval())}
				<div class="spinner-border" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			{:then responseCrit}
				{#each responseCrit as crit}
					<div id={crit.idcomposer} class="idCompo">
						<label class="form-label">
							<h4>Critère :</h4>
							<input class="form-control" name="updateCritere" value={crit.nom} />
						</label><br />
						<label class="form-label">
							<h4>Barème :</h4>
							<input class="form-control" name="updateBareme" value={crit.bareme} />
						</label><br />
					</div>
					<!-- Pour avoir les compétences liées à un critère -->
					<h4>Liste des compétences initialement cochées :</h4>
					{#await getCompetencesByIdCrit(crit.idcomposer)}
						<div class="spinner-border" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					{:then responseCompByIdCrit}
						<ul>
							{#each responseCompByIdCrit as comp}
								<li>{comp.competence.titre}</li>
							{/each}
						</ul>
						<button
							class="btn btn-danger supprCrit"
							id={crit.idcomposer}
							on:click={(event) => deleteCritByIdCompo(event.target.id)}>Supprimer</button
						>
						<h4>Liste des compétences que vous pouvez cocher pour ce critère :</h4>
						{#await getCompetences()}
							<div class="spinner-border" role="status">
								<span class="visually-hidden">Loading...</span>
							</div>
						{:then responseComp}
							<ul id={crit.idcomposer} class="updateListeCompetences">
								{#each responseComp as comp}
									<li class="form-check" id="DefaultComp">
										<input
											class="form-check-input"
											type="checkbox"
											name="updateCompetences"
											value={comp.idcompetence}
											id="{crit.idcomposer}-{comp.idcompetence}"
										/>
										<label class="form-check-label" for="{crit.idcomposer}-{comp.idcompetence}">
											{comp.titre}
										</label>
									</li>
								{/each}
							</ul>
						{:catch error}
							<p>Une erreur est survenue, {error}</p>
						{/await}
					{:catch error}
						<p>Une erreur est survenue, {error}</p>
					{/await}
				{/each}
			{:catch error}
				<p>Une erreur est survenue, {error}</p>
			{/await}
		{:catch error}
			<p>Une erreur est survenue, {error}</p>
		{/await}
		<section id="insertSection">
			<h4>Rajouter des critères :</h4>
		</section>
		<input
			type="button"
			class="btn btn-info"
			value="Rajouter des critères"
			on:click={() => {
				addCriterion(idTest);
			}}
		/>
		<div class="row">
			<input type="submit" class="btn btn-success w-25 mx-auto" value="Valider" />
		</div>
	</form>
</main>