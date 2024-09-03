const PaymentBill = (sequelize, DataTypes) => sequelize.define('PaymentBill', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
  },
  {
    tableName: "payment_bills",
  }
  ) 
  
  export default PaymentBill;