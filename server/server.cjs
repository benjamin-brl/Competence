const { MongoClient } = require('mongodb');
const { ParseServer } = require('parse-server');

// URL de connexion à la base de données MongoDB
const url = 'mongodb://localhost:27017/competence';

// Création d'une instance du client MongoDB
const client = new MongoClient(url);

// Connexion à la base de données
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connecté à la base de données MongoDB');
    return client.db(); // Retourne une instance de la base de données
  } catch (error) {
    console.error('Erreur de connexion à la base de données MongoDB:', error);
    throw error;
  }
}

// Fonction pour fermer la connexion à la base de données
function closeDatabase() {
  client.close();
  console.log('Déconnexion de la base de données MongoDB');
}

// Ajout d'un message personnalisé pour indiquer le lancement du serveur
const express = require('express');
const app = express();

// Configuration de votre Parse Server
const parseServer = new ParseServer({
  // Votre configuration Parse Server ici
});

app.use('/parse', parseServer);

// Démarrez le serveur
const port = 1337;
app.listen(port, (error) => {
  if (error) {
    console.error('Erreur lors du démarrage du serveur Parse:', error);
  } else {
    console.log(`Serveur Parse en cours d'exécution sur le port ${port}`);
  }
});
