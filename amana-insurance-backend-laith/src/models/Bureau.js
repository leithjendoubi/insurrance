const Bureau = (sequelize, DataTypes) => sequelize.define('Bureau', {
  id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
  },
  name:{
      type:DataTypes.STRING,
      allowNull:false
  },
  address:{
      type:DataTypes.STRING,
      allowNull:false
  },
  phone:{
      type:DataTypes.DOUBLE,
      allowNull:false
  },
  gain_precentage_oblig:{
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  gain_precentage_travel:{
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  gain_precentage_third:{
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  gain_precentage_sante:{
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  totalDebts:{
    type: DataTypes.FLOAT(20,3),
    allowNull: false,
  },
},
{
  tableName: "bureaux",
}
) 

export default Bureau;