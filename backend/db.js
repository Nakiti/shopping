import mysql from "mysql2"
import { configDotenv } from "dotenv"

let config = {
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB,
   port: process.env.DB_PORT
}

export const db = new mysql.createPool(config)