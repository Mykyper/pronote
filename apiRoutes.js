const express = require('express');
const { User, Eleve, Parent, Classe, Module, Presence, TauxPresence, Graph, EmploiDuTemps } = require('./models');
const router = express.Router();

// Routes pour les utilisateurs
router.get('/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

router.post('/api/users', async (req, res) => {
    try {
        const { nom, prenom, email, password, role } = req.body;
        const user = await User.create({ nom, prenom, email, password, role });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Routes pour les parents
router.get('/parents', async (req, res) => {
    const { nom } = req.query;
    if (nom) {
        try {
            const parents = await Parent.findAll({
                where: {
                    nom: {
                        [Op.like]: `%${nom}%`
                    }
                }
            });
            res.json(parents);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la recherche des parents.' });
        }
    } else {
        try {
            const parents = await Parent.findAll();
            res.json(parents);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération des parents.' });
        }
    }
});

router.post('/api/parents', async (req, res) => {
    try {
        const { nom, prenom, email, password } = req.body;
        const parent = await Parent.create({ nom, prenom, email, password });
        res.status(201).json(parent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Routes pour les élèves
router.get('/eleves', async (req, res) => {
    const eleves = await Eleve.findAll();
    res.json(eleves);
});

router.post('/api/students', async (req, res) => {
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
            parent_id: parent,
            classe_id: classe
        });

        res.status(201).json(eleve);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'élève:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'élève.' });
    }
});

// Routes pour les classes
router.get('/classes', async (req, res) => {
    const classes = await Classe.findAll();
    res.json(classes);
});

// Routes pour les modules
router.get('/modules', async (req, res) => {
    const modules = await Module.findAll();
    res.json(modules);
});

// Routes pour les présences
router.get('/presences', async (req, res) => {
    const presences = await Presence.findAll();
    res.json(presences);
});

// Routes pour les taux de présence
router.get('/taux-presences', async (req, res) => {
    const tauxPresences = await TauxPresence.findAll();
    res.json(tauxPresences);
});

// Routes pour les graphiques
router.get('/graphs', async (req, res) => {
    const graphs = await Graph.findAll();
    res.json(graphs);
});

// Routes pour les emplois du temps
router.get('/emploi-du-temps', async (req, res) => {
    const emploisDuTemps = await EmploiDuTemps.findAll();
    res.json(emploisDuTemps);
});

module.exports = router;
