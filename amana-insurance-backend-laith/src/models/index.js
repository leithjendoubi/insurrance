import {Sequelize, DataTypes} from 'sequelize'
import User from './User.js'
import AssuranceObligatoire from "./AssuranceObligatoire.js";
import Travel from "./Travel.js";
import Bureau from "./Bureau.js";
import Payment from "./Payment.js";
import SantePersonne from "./SantePersonne.js";
import SanteGroupe from "./SanteGroupe.js";
import ThirdInstance from "./ThirdInsurance.js";
import PaymentBill from './PaymentBill.js';

const env = process.env.NODE_ENV;
import Config from "../config/config.js";

let config= Config["development"];
if(env === "production"){
    config= Config[process.env.NODE_ENV];
}
else if(env === "test"){
    config= Config["test"];
}
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    /* pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    } */
})


const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

//connecting to model
db.user = User(sequelize, DataTypes)
db.assuranceOblig = AssuranceObligatoire(sequelize, DataTypes)
db.travel = Travel(sequelize, DataTypes)
db.bureau = Bureau(sequelize, DataTypes)
db.santeGroupe = SanteGroupe(sequelize, DataTypes)
db.santePersonne = SantePersonne(sequelize, DataTypes)
db.payment = Payment(sequelize, DataTypes)
db.thirdInsurance=ThirdInstance(sequelize, DataTypes)
db.paymentBill = PaymentBill(sequelize, DataTypes)

//un directeur a plusieurs utilisateurs et un administrateur a plusieurs directeurs
db.user.hasMany(db.user, {
    foreignKey: "hypervisorId",
    as: "users"
});
db.user.belongsTo(db.user, {
    foreignKey: "hypervisorId",
    as: "hypervisor"
});

//un bureau a plusieurs utilisateurs
db.bureau.hasMany(db.user, {
    foreignKey: "bureauId",
    as: "users"
});
db.user.belongsTo(db.bureau, {
    foreignKey: "bureauId",
    as: "bureau"
});

//un voyage est crée par un seul utilisateur
db.user.hasMany(db.travel, {
    foreignKey: "userId",
    as: "travelInsurances"
});
db.travel.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user"
});

//un assurance de type personne est crée par un seul utilisateur
db.user.hasMany(db.santePersonne, {
    foreignKey: "userId",
    as: "personHealthInsurances"
});
db.santePersonne.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user"
});

//un assurance de type groupe est crée par un seul utilisateur
db.user.hasMany(db.santeGroupe, {
    foreignKey: "userId",
    as: "groupHealthInsurances"
});
db.santeGroupe.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user"
});

//un bureau a un seul directeur
db.user.hasOne(db.bureau, {
    foreignKey: "directorId",
    as: "directorOffice"
});
db.bureau.belongsTo(db.user, {
    foreignKey: "directorId",
    as: "director"
});

//assurance obligatoire est crée par un utilisateur et un
db.user.hasMany(db.assuranceOblig, {
    foreignKey: "userId",
    as: "obligatoryInsurances"
});
db.assuranceOblig.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user"
});

//un voyage est crée par un seul utilisateur
db.user.hasMany(db.thirdInsurance, {
    foreignKey: "userId",
    as: "thirdPartyInsurances"
});
db.thirdInsurance.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user"
});


//un bureau a plusieurs paiements
db.bureau.hasMany(db.payment, {
    foreignKey: "bureauId",
    as: "payments"
});
//un paiement est crée par un seul bureau
db.payment.belongsTo(db.bureau, {
    foreignKey: "bureauId",
    as: "bureau"
});

//un paiement a un seul facture
db.paymentBill.hasOne(db.payment, {
    foreignKey: "paymentBillId",
    as: "payment"
});
//un facture a un seul paiement
db.payment.belongsTo(db.paymentBill, {
    foreignKey: "paymentBillId",
    as: "bill"
});




//exporting the module
export default db