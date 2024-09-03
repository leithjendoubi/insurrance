const Travel = (sequelize, Sequelize) =>
    sequelize.define(
        "Travel",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            type: {
                type: Sequelize.STRING,
                defaultValue: "مسافر",
                allowNull: false,
            },
            zone_couver: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            periode: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            direction: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            startDate: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            endDate: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            birthDate: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            nationalite: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            sex: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            numero_passport: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            phone: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            address: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            methode_paiement: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            initial: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            taxe1: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            taxe2: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            taxe3: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            taxe4: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            total: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },

        },
        {
            tableName: "travels",
        }
    );

export default Travel;
