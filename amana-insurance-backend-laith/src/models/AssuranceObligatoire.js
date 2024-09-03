const AssuranceObligatoire = (sequelize, DataTypes) => sequelize.define('AssurancesObligatoires', {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: "إجباري",
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        insurance_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        license_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        assurance_specifications: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type_car: {
            type: DataTypes.STRING,
            allowNull: false
        },
        numero_serie: {
            type: DataTypes.STRING,
            allowNull: false
        },
        numero_structure: {
            type: DataTypes.STRING,
            allowNull: false
        },
        numero_moteur: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Charge: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nb_passager: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        annee_de_fabrication: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        couleur: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Pays_de_fabrication: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Orga_de_delivr: {
            type: DataTypes.STRING,
            allowNull: false
        },
        initial: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        taxe1: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        taxe2: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        taxe3: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        taxe4: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
    },
    {
        tableName: 'assurancesobligatoires',
    }
);


export default AssuranceObligatoire;