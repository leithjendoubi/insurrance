const SanteGroupe = (sequelize, DataTypes) => sequelize.define('SanteGroupe', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: "صحي مجموعات",
            allowNull: false
        },
        period: {
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
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        methode_paiement: {
            type: DataTypes.STRING,
            allowNull: false
        },
        capital_societe: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        tranche: {
            type: DataTypes.FLOAT,
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
        tableName: "santegroupes",
    }
)

export default SanteGroupe;