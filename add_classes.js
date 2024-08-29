const { sequelize, Classe } = require('./models');

const addClasses = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Liste des classes à ajouter
    const classes = [
      { niveau: 'PREPA', specialité: 'DEV' },
      { niveau: 'PREPA', specialité: 'CREA' },
      { niveau: 'PREPA', specialité: 'COMM' },
      { niveau: 'B2', specialité: 'DEV' },
      { niveau: 'B2', specialité: 'CREA' },
      { niveau: 'B2', specialité: 'COMM' },
      { niveau: 'B3', specialité: 'COMM' },
      { niveau: 'B3', specialité: 'DEV' },
      { niveau: 'B3', specialité: 'CREA' },
      // Ajoutez d'autres classes ici
    ];

    // Ajouter les classes à la base de données
    for (const classe of classes) {
      await Classe.create(classe);
      console.log(`Class ${classe.niveau} added successfully.`);
    }

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
};

addClasses();
