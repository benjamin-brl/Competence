## IMPORTANT
- On **ne push pas** dans la branche **main**.
- On **pull** avant une quelconque **modification**. 
- On **pull** avant de **commit**.
## Utiles
### Supabase
BDD : [Supabase](https://supabase.com/dashboard/project/epvariakzuhmmfwtfzmj)
# create-svelte

API :
- mdp : VshIAQDZjiYZrkYc
- Clé client : (On utilisera celle-là dans l'appli)
```txt
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwdmFyaWFrenVobW1md3Rmem1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyODU4NzUsImV4cCI6MjAxNDg2MTg3NX0.0Zku39osPT5KMxvxRlTsuKsChy43LADSrXkhM5Bu_2k
```
- Clé service : (Celle-ci est en mode super admin donc pas safe)
```txt
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwdmFyaWFrenVobW1md3Rmem1qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5OTI4NTg3NSwiZXhwIjoyMDE0ODYxODc1fQ.kYWydrjG2QWvq0Bl-iBsEJwUVii2Lh3nBRs_DWECttM
```
- Lien : [https://epvariakzuhmmfwtfzmj.supabase.co](https://epvariakzuhmmfwtfzmj.supabase.co)
- Connexion à la BDD :
```js
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://epvariakzuhmmfwtfzmj.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
```
[Voir ici pour installer supabase](#installation)
## Installation
- Svelte :
```sh
npm create svelte@latest competences
cd competences
npm i
```
- Supabase :
```sh
npm i @supabase/supabase-js
```
- jQuerry :
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
```
- Bootstrap :
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
```
- Bootstrap Icons :
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
```

## Lancement Serveur
```sh
npm run dev -- --host 10.0.52.44
```

## Documentation
- Bootstrap : [W3C](https://www.w3schools.com/bootstrap5/index.php) || [Bootstrap Doc](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- jQuery : [W3C](https://www.w3schools.com/jquery/default.asp) || [jQuery Doc](https://api.jquery.com/)
- Svelte : [Svelte Doc](https://svelte.dev/docs/introduction)