const express = require('express');
const path = require('path');
const router = express.Router();

// Route pour servir le formulaire de création d'utilisateur
router.get('/add-teacher', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add_teacher.html'));
});

// Route pour servir le formulaire de création de parent
router.get('/add-parent', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add_parents.html'));
});

// Route pour servir le formulaire d'ajout d'élève
router.get('/add-student', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add_eleves.html'));
});

module.exports = router;
