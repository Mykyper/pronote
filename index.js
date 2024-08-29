const express = require('express');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cors = require('cors'); // Import du middleware CORS
 // Connexion de la session à Sequelize

const { sequelize, User, Eleve, Parent, Classe, Module, EmploiDuTemps, Lundi, Mardi, Mercredi, Jeudi, Vendredi } = require('./models');

// Initialisation de l'application Express
const app = express();

// Configuration des en-têtes CORS
app.use(cors({
  origin: '*', // Autorise toutes les origines. Tu peux spécifier une ou plusieurs origines spécifiques.
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
}));
// Configuration du stockage des sessions avec Sequelize
const sessionStore = new SequelizeStore({ db: sequelize });
app.use(session({
  secret: 'votre-clé-secrète',
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));

sessionStore.sync(); // Synchronisation du stockage des sessions

// Middleware pour analyser les JSON
app.use(express.json());

// --------------------
// Routes pour les Pages
// --------------------

// Servir des fichiers statiques depuis le dossier 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Accueil.html'));
});

// Route pour la page de connexion des élèves
app.get('/student-log', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route pour la création d'utilisateur
app.get('/add-teacher', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add_teacher.html'));
});

// Route pour la création de parent
app.get('/add-parent', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add_parents.html'));
});

// Route pour la création d'eleves
app.get('/add-student', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add_eleves.html'));
});
// --------------------
// Routes d'API
// --------------------

// Route pour récupérer tous les utilisateurs
app.get('/api/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// Route pour la création d'un utilisateur
app.post('/api/users', async (req, res) => {
  try {
    const { nom, prenom, email, password, role } = req.body;
    const user = await User.create({ nom, prenom, email, password, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//ajouter coordinateur/enseignant
app.post('/api/users', async (req, res) => {
  try {
    const { nom, prenom, email, password, role } = req.body;
    const user = await User.create({ nom, prenom, email, password, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Connexion pour les enseignants
app.post('/api/teacher-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const enseignant = await User.findOne({ where: { email, password, role: 'enseignant' } });

    if (!enseignant) {
      return res.status(401).json({ message: 'Enseignant non trouvé ou rôle incorrect' });
    }

    res.json({ message: 'Connexion réussie!' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});
//connexion des coordinateur
app.post('/api/coordinator-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const coordinator = await User.findOne({ where: { email } });

    if (!coordinator) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    if (password !== coordinator.password) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    if (coordinator.role !== 'coordinateur') {
      return res.status(403).json({ message: 'Accès refusé: non coordinateur' });
    }

    res.json({ message: 'Connexion réussie' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { nom, prenom, email, password, parent, classe } = req.body;

    if (!nom || !prenom || !email || !password || !parent || !classe) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const eleve = await Eleve.create({
      nom,
      prenom,
      email,
      password,
      parent_id: parent,  // Use parent_id
      classe_id: classe   // Use classe_id
    });

    res.status(201).json(eleve);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'élève:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'élève.' });
  }
});
//ajouter parents
app.post('/api/parents', async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;
    const parent = await Parent.create({ nom, prenom, email, password });
    res.status(201).json(parent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Connexion pour les élèves
app.post('/api/student-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const eleve = await Eleve.findOne({ where: { email } });

    if (!eleve) {
      return res.status(401).json({ message: 'Élève non trouvé' });
    }

    if (password !== eleve.password) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Stocker l'ID de l'élève dans la session
    req.session.studentId = eleve.id;

    res.status(200).json({ message: 'Connexion réussie', redirectUrl: '/student-dashboard' });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

// Route pour obtenir les informations de l'élève connecté
app.get('/api/student-info', async (req, res) => {
  if (!req.session.studentId) {
    return res.status(401).json({ message: 'Non autorisé' });
  }
  try {
    const eleve = await Eleve.findByPk(req.session.studentId);

    if (!eleve) {
      return res.status(404).json({ message: 'Élève non trouvé' });
    }

    res.status(200).json({ nom: eleve.nom, prenom: eleve.prenom });
  } catch (error) {
    console.error('Erreur lors de la récupération des informations de l\'élève:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des informations' });
  }
});


// route pour modules
app.get('/api/modules', async (req, res) => {
  const modules = await Module.findAll();
  res.json(modules);
});

// Creér un module
app.post('/api/modules', async (req, res) => {
  try {
    const { nom } = req.body;

    if (!nom) {
      return res.status(400).json({ message: 'Le nom du module est requis.' });
    }

    const module = await Module.create({ nom });
    res.status(201).json(module);
  } catch (error) {
    console.error('Erreur lors de la création du module:', error);
    res.status(500).json({ message: 'Erreur lors de la création du module.' });
  }
});

// Routes pour emploi du temps
app.get('/api/emploi-du-temps', async (req, res) => {
  const emploiDuTemps = await EmploiDuTemps.findAll();
  res.json(emploiDuTemps);
});

//ajout d'emploi du temps
app.post('/api/emploi-du-temps/add', async (req, res) => {
  try {
      const {
          class_id, 
          lundi, mardi, mercredi, jeudi, vendredi
      } = req.body;

      // supprimer les donnée si l'emploi de la classe existe
      await EmploiDuTemps.destroy({
          where: {
              class_id,
              
          }
      });

      // créer les donnée pour chaque jour
      const createDayEntry = async (day, data) => {
          const { module_id_morning, enseignant_id_morning, module_id_evening, enseignant_id_evening } = data;

          return await sequelize.models[day].create({
              module_id_morning,
              enseignant_id_morning,
              module_id_evening,
              enseignant_id_evening
          });
      };

      const lundiEntry = await createDayEntry('Lundi', lundi);
      const mardiEntry = await createDayEntry('Mardi', mardi);
      const mercrediEntry = await createDayEntry('Mercredi', mercredi);
      const jeudiEntry = await createDayEntry('Jeudi', jeudi);
      const vendrediEntry = await createDayEntry('Vendredi', vendredi);

      // Créer les donnée pour l'emploi du temps
      await EmploiDuTemps.create({
          class_id,
          lundi_id: lundiEntry.id,
          mardi_id: mardiEntry.id,
          mercredi_id: mercrediEntry.id,
          jeudi_id: jeudiEntry.id,
          vendredi_id: vendrediEntry.id,
          
      });

      res.status(201).json({ message: 'Emploi du temps enregistré avec succès.' });
  } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'emploi du temps:', error);
      res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'emploi du temps.' });
  }
});
// routes pour les classes
app.get('/api/classes', async (req, res) => {
  const classes = await Classe.findAll();
  res.json(classes);
});

// Route pour récupérer l'emploi du temps d'un élève
app.get('/api/student-timetable', async (req, res) => {
  const studentId = req.session.studentId;

  try {
    const student = await Eleve.findByPk(studentId, { attributes: ['classe_id'] });

    if (!student) {
      return res.status(404).json({ message: 'Élève non trouvé' });
    }

    const emploiDuTemps = await EmploiDuTemps.findOne({
      where: { class_id: student.classe_id },
      attributes: ['lundi_id', 'mardi_id', 'mercredi_id', 'jeudi_id', 'vendredi_id'],
    });

    if (!emploiDuTemps) {
      return res.status(404).json({ message: 'Emploi du temps non trouvé pour cette classe' });
    }

    const [lundi, mardi, mercredi, jeudi, vendredi] = await Promise.all([
      Lundi.findByPk(emploiDuTemps.lundi_id, {
        include: [
          { model: Module, as: 'moduleMorning', attributes: ['nom'] },
          { model: Module, as: 'moduleEvening', attributes: ['nom'] }
        ]
      }),
      Mardi.findByPk(emploiDuTemps.mardi_id, {
        include: [
          { model: Module, as: 'moduleMorning', attributes: ['nom'] },
          { model: Module, as: 'moduleEvening', attributes: ['nom'] }
        ]
      }),
      Mercredi.findByPk(emploiDuTemps.mercredi_id, {
        include: [
          { model: Module, as: 'moduleMorning', attributes: ['nom'] },
          { model: Module, as: 'moduleEvening', attributes: ['nom'] }
        ]
      }),
      Jeudi.findByPk(emploiDuTemps.jeudi_id, {
        include: [
          { model: Module, as: 'moduleMorning', attributes: ['nom'] },
          { model: Module, as: 'moduleEvening', attributes: ['nom'] }
        ]
      }),
      Vendredi.findByPk(emploiDuTemps.vendredi_id, {
        include: [
          { model: Module, as: 'moduleMorning', attributes: ['nom'] },
          { model: Module, as: 'moduleEvening', attributes: ['nom'] }
        ]
      })
    ]);

    res.json({
      lundi: formatDayData(lundi),
      mardi: formatDayData(mardi),
      mercredi: formatDayData(mercredi),
      jeudi: formatDayData(jeudi),
      vendredi: formatDayData(vendredi)
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'emploi du temps:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'emploi du temps' });
  }
});

// Fonction pour formater les données d'un jour
function formatDayData(day) {
  if (!day) return {};
  
  return {
    moduleMorning: day.moduleMorning ? day.moduleMorning.nom : 'N/A',
    moduleEvening: day.moduleEvening ? day.moduleEvening.nom : 'N/A'
  };
}

// Démarrage du serveur
sequelize.sync({ force: false })
  .then(() => {
    app.listen(3000, () => {
      console.log('le serveur tourne sur le port 3000');
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = app;
