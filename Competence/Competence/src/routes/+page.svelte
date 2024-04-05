<script lang='ts'>
  import { supabase } from './server/supabase.js';

  async function recuperate(){
    const identifiant = document.getElementById("identifiant") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    if(identifiant !== null && password !== null){
      connexion(identifiant, password);
    }
  }

  async function connexion(identifiant : HTMLInputElement,password : HTMLInputElement){
    let { data, error } = await supabase.auth.signInWithPassword({
      email: identifiant.value,
      password: password.value
    })
    if (error) {
      console.error("Error connexion : ", error.message);
    }
    else {
      console.log("Autentification reussi");
      if(!data.session){
        console.error("Erreur de connexion");
      }
      if(data.user){
        let uuid = data.user.id;
        let { data: salarie, error } = await supabase
          .from('salarie')
          .select('idsalarie')
          .eq('uuid', uuid);
        if(error){
          console.error("Error salarie : ",error.message);
        }
        if(salarie){
          let {data: rh, error } = await supabase
            .from('rh')
            .select('idsalarie')
            .eq('idsalarie',salarie[0].idsalarie)
          if(error){
            console.error("Error rh : ",error.message);
          }
          
          if(rh){
            if(rh[0]?.idsalarie != null){
              document.location.href = "/rh/accueil";
            }
            else{
              let {data: collaborateur, error } = await supabase
                .from('collaborateur')
                .select('idsalarie')
                .eq('idsalarie',salarie[0]?.idsalarie)
              if(error){
                console.error("Error collaborateur : ",error.message);
              }
              if(collaborateur){
                if(collaborateur[0]?.idsalarie != null){
                  document.location.href = "/collaborateurs/accueil";
                }
              }
            }
          }
        }
      }
    }
  }
  async function signOut() {
    const { error } = await supabase.auth.signOut()
  }
</script>

<style>
  body {
      text-align: center;
      background-color: rgb(105, 107, 107);
  }

  input {
    background-color: rgb(56, 57, 58);
    color: white;
  }
  h2{
    margin-top : 2%;
  }
  input {
    margin-left: 40%;
    width: 20%;
    background-color: rgb(56, 57, 58);
    color: rgb(196, 192, 192);
    text-align: center;
    margin-top : 1%;
    margin-bottom : 1%;
  }
  ::placeholder{
    color: rgb(196, 192, 192);
  }
</style>

<body>
  <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
    <div class="container-fluid">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" href="#top">Accueil</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/collaborateurs/accueil">Collaborateurs</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#top" on:click={signOut}>Déconnexion</a>
        </li>
      </ul>
    </div>
  </nav>

  <br><br><br><br>
        
  <h1>Bienvenue dans Compétences</h1>
  <form method="POST" id="login">
    <h2>Identifiants</h2>
    <input type="text" name="nom" class="form-control" id="identifiant" placeholder="Ton Nom" />
    <h2>Mot de passe</h2>
    <input type="password" name="password" class="form-control" id="password" placeholder="Ton mot de passe"/>
    <button type="button" class="btn btn-dark" on:click={recuperate}>Valider</button>
  </form>
</body>