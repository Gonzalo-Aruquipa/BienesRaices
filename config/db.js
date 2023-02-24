import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({path: ".env"})

const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST} = process.env

const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD,{
  host: DB_HOST,
  port: 3306,
  dialect: "mysql",
  define: {
    timestamps: true
  },
  pool:{
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default db
