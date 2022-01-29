const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../utils/database')

const User = sequelize.define('user', {

   // Name of Column #1 and its properties defined: id
    user_id:{

      // Integer Datatype
      type:DataTypes.INTEGER,

      // Increment the value automatically
      autoIncrement:true,

      // user_id can not be null.
      allowNull:false,

      // To uniquely identify user
      primaryKey:true
    },

    userName: {
      type: DataTypes.STRING
    },

    hash: {
      type: DataTypes.TEXT
    },

    salt: {
      type: DataTypes.STRING
    }
})
console.log(User === sequelize.models.user); // true
module.exports = User