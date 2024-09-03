const SantePersonne = (sequelize, DataTypes) => sequelize.define('SantePersonne', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        type:{
            type: DataTypes.STRING,
            defaultValue: "صحي فرد",
            allowNull: false
        },
        period: {
            type: DataTypes.STRING,
            allowNull: false
        },
        job: {
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
        birthDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        nationalite: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sex: {
            type: DataTypes.STRING,
            allowNull: false
        },
        numero_passport: {
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
        tableName: "santepersonnes"
    }
)

export default SantePersonne;