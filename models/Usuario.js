import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Usuario = db.define(
  "usuarios",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
    },
    confirmado: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    scopes: {
      eliminarAt: {
        attributes: {
          exclude: ["password", "token", "confirmado", "createdAt", "updatedAt"],
        },
      },
    },
  }
);

export default Usuario;
