const Payment = (sequelize, DataTypes) => {
    const Payment = sequelize.define("payment", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            state: {
                type:DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            amount: {
                type: DataTypes.FLOAT(20,3),
                allowNull: false,
            },
            totalDebts: {
                type: DataTypes.FLOAT(20,3),
                allowNull: false,
            },
        },
        {
            tableName: "payments"
        }
    );
    return Payment;
}

export default Payment;