const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'  // Change this to your database file path
});

// Définir les modèles
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: DataTypes.STRING,
  prenom: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  role: DataTypes.ENUM('coordinateur', 'enseignant')
}, { tableName: 'users' });

const Eleve = sequelize.define('Eleve', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: DataTypes.STRING,
  prenom: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  parent_id: DataTypes.INTEGER,  // Clé étrangère pour Parent
  classe_id: DataTypes.INTEGER   // Clé étrangère pour Classe
}, { tableName: 'eleves' });

const Parent = sequelize.define('Parent', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: DataTypes.STRING,
  prenom: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING
}, { tableName: 'parents' });

const Classe = sequelize.define('Classe', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  niveau: DataTypes.STRING,
  specialité: DataTypes.STRING
}, { tableName: 'classes' });

const Module = sequelize.define('Module', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: DataTypes.STRING
}, { tableName: 'modules' });

const Presence = sequelize.define('Presence', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  emploi_id: DataTypes.INTEGER,
  eleve_id: DataTypes.INTEGER,
  status: DataTypes.STRING,
  justification: DataTypes.STRING
}, { tableName: 'présence' });

const TauxPresence = sequelize.define('TauxPresence', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  eleve_id: DataTypes.INTEGER,
  module_id: DataTypes.INTEGER,
  taux_presence: DataTypes.FLOAT,
  note_presence: DataTypes.FLOAT
}, { tableName: 'Taux_présence' });

const Graph = sequelize.define('Graph', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type_graph: DataTypes.STRING,
  donnée: DataTypes.BLOB
}, { tableName: 'graphs' });

// Definir table emploi du temps
const EmploiDuTemps = sequelize.define('EmploiDuTemps', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  class_id: DataTypes.INTEGER,
  lundi_id: DataTypes.INTEGER,
  mardi_id: DataTypes.INTEGER,
  mercredi_id: DataTypes.INTEGER,
  jeudi_id: DataTypes.INTEGER,
  vendredi_id: DataTypes.INTEGER
}, { tableName: 'emploi_du_temps' });


const Lundi = sequelize.define('Lundi', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  module_id_morning: DataTypes.INTEGER,
  enseignant_id_morning: DataTypes.INTEGER,
  module_id_evening: DataTypes.INTEGER,
  enseignant_id_evening: DataTypes.INTEGER
}, { tableName: 'lundi' });

const Mardi = sequelize.define('Mardi', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  module_id_morning: DataTypes.INTEGER,
  enseignant_id_morning: DataTypes.INTEGER,
  module_id_evening: DataTypes.INTEGER,
  enseignant_id_evening: DataTypes.INTEGER
}, { tableName: 'mardi' });

const Mercredi = sequelize.define('Mercredi', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  module_id_morning: DataTypes.INTEGER,
  enseignant_id_morning: DataTypes.INTEGER,
  module_id_evening: DataTypes.INTEGER,
  enseignant_id_evening: DataTypes.INTEGER
}, { tableName: 'mercredi' });

const Jeudi = sequelize.define('Jeudi', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  module_id_morning: DataTypes.INTEGER,
  enseignant_id_morning: DataTypes.INTEGER,
  module_id_evening: DataTypes.INTEGER,
  enseignant_id_evening: DataTypes.INTEGER
}, { tableName: 'jeudi' });

const Vendredi = sequelize.define('Vendredi', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  module_id_morning: DataTypes.INTEGER,
  enseignant_id_morning: DataTypes.INTEGER,
  module_id_evening: DataTypes.INTEGER,
  enseignant_id_evening: DataTypes.INTEGER
}, { tableName: 'vendredi' });

// Define the relationships
User.hasMany(EmploiDuTemps, { foreignKey: 'enseignant_id' });
EmploiDuTemps.belongsTo(User, { foreignKey: 'enseignant_id' });

Classe.hasMany(Eleve, { foreignKey: 'classe_id' });
Eleve.belongsTo(Classe, { foreignKey: 'classe_id' });

Eleve.belongsTo(Parent, { foreignKey: 'parent_id' });
Parent.hasMany(Eleve, { foreignKey: 'parent_id' });

Module.hasMany(EmploiDuTemps, { foreignKey: 'module_id' });
EmploiDuTemps.belongsTo(Module, { foreignKey: 'module_id' });

Classe.hasMany(EmploiDuTemps, { foreignKey: 'class_id' });
EmploiDuTemps.belongsTo(Classe, { foreignKey: 'class_id' });

Eleve.hasMany(Presence, { foreignKey: 'eleve_id' });
Presence.belongsTo(Eleve, { foreignKey: 'eleve_id' });

Module.hasMany(TauxPresence, { foreignKey: 'module_id' });
TauxPresence.belongsTo(Module, { foreignKey: 'module_id' });

Eleve.hasMany(TauxPresence, { foreignKey: 'eleve_id' });
TauxPresence.belongsTo(Eleve, { foreignKey: 'eleve_id' });

// Define relationships for daily schedules
Lundi.belongsTo(Module, { foreignKey: 'module_id_morning', as: 'moduleMorning' });
Lundi.belongsTo(User, { foreignKey: 'enseignant_id_morning', as: 'enseignantMorning' });
Lundi.belongsTo(Module, { foreignKey: 'module_id_evening', as: 'moduleEvening' });
Lundi.belongsTo(User, { foreignKey: 'enseignant_id_evening', as: 'enseignantEvening' });

Mardi.belongsTo(Module, { foreignKey: 'module_id_morning', as: 'moduleMorning' });
Mardi.belongsTo(User, { foreignKey: 'enseignant_id_morning', as: 'enseignantMorning' });
Mardi.belongsTo(Module, { foreignKey: 'module_id_evening', as: 'moduleEvening' });
Mardi.belongsTo(User, { foreignKey: 'enseignant_id_evening', as: 'enseignantEvening' });

Mercredi.belongsTo(Module, { foreignKey: 'module_id_morning', as: 'moduleMorning' });
Mercredi.belongsTo(User, { foreignKey: 'enseignant_id_morning', as: 'enseignantMorning' });
Mercredi.belongsTo(Module, { foreignKey: 'module_id_evening', as: 'moduleEvening' });
Mercredi.belongsTo(User, { foreignKey: 'enseignant_id_evening', as: 'enseignantEvening' });

Jeudi.belongsTo(Module, { foreignKey: 'module_id_morning', as: 'moduleMorning' });
Jeudi.belongsTo(User, { foreignKey: 'enseignant_id_morning', as: 'enseignantMorning' });
Jeudi.belongsTo(Module, { foreignKey: 'module_id_evening', as: 'moduleEvening' });
Jeudi.belongsTo(User, { foreignKey: 'enseignant_id_evening', as: 'enseignantEvening' });

Vendredi.belongsTo(Module, { foreignKey: 'module_id_morning', as: 'moduleMorning' });
Vendredi.belongsTo(User, { foreignKey: 'enseignant_id_morning', as: 'enseignantMorning' });
Vendredi.belongsTo(Module, { foreignKey: 'module_id_evening', as: 'moduleEvening' });
Vendredi.belongsTo(User, { foreignKey: 'enseignant_id_evening', as: 'enseignantEvening' });

module.exports = { sequelize, User, Eleve, Parent, Classe, Module, Presence, TauxPresence, Graph, EmploiDuTemps, Lundi, Mardi, Mercredi, Jeudi, Vendredi };
