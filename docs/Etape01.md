# Analyse
## Solutions existantes 
- [BTS SIO](https://btssio.org) : Gratuit
- [Skills Base](https://www.skills-base.com/) : Payant
- [Trello](https://trello.com/fr) : Gratuit
- [Asana](https://asana.com/fr) : Gratuit
- [Google Sheets](https://docs.google.com/spreadsheets) : Gratuit
## Etude de faisabilité
### L'évaluation des besoins du projet.
1. De matériel
	- De PCs
	- D'une connexion internet
	- D'un serveur
2. De compétences
	- GIT
	- Svelte
	- JS / jQuery
3. D'outils
	- IDE
	- Figma
	- Looping
	- Supabase
	- Gitea
	- Obsidian
4. De supports de communication
	- Discord
5. D'une équipe
	- (Jules, Benjamin)
### **Analyser l'environnement du projet**
### **Définir ses objectifs**
Modèle SMART :
1. **Objectif Spécifique** 
	- Concevoir une solution logicielle qui permet de mettre en relief le portefeuille de compétences de l'entreprise en mettant l'accent sur les compétences réellement acquises par ses collaborateurs.
2. **Objectif Mesurable** :
	- Mesurer le degré de maîtrise de chaque compétence en fonction de la moyenne des points obtenus dans chaque critère des évaluations où elle était associée, avec des seuils clairs (0-33% non acquise, 33-66% partiellement acquise, 66-100% acquise).
3. **Objectif Atteignable** :
	- Concevoir une interface pour les administrateurs RH où ils pourront créer des évaluations avec différents critères, gérer les évaluations et les compétences mobilisées.
4. **Objectif Réaliste** :
	- La solution doit fonctionner sur un serveur Ubuntu avec un backend-as-a-service et un SGBD, optimisé pour une consultation bureautique et mobile avec l'utilisation d'un Framework JS. Les licences de toutes les technologies utilisées doivent être libres de droits et gratuites.
5. **Objectif Temporel** :
	- Le projet doit être réalisé en suivant la méthode Agile, en groupe de 3 personnes. Le temps imparti pour chaque étape du projet sera défini en fonction de la méthode Agile, avec des jalons et des sprints clairement définis.
## BaaS
### Solutions existantes
1. SGBD
	- Supabase
	- Postgrest / swagger
2. NoSql
	- Appwrite
3. Sqlite
	- Pocketbase
4. Autre CMS
	- Strapie
	- Directus
### Solution garder
Nous avons garder Supabase car il est simple d'utilisation, est gratuit et open source. Il a également une interface API Rest et est un SGBD ce qui est un critère demandé.