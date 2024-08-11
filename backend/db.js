import mysql from "mysql2"
import { configDotenv } from "dotenv"

let config = {
   host: "database-1.cny4ow0oyik0.us-west-1.rds.amazonaws.com",
   user: "admin",
   password: "wZbyYCIs3EOGxpxUEznG",
   database: "shopping",
   port: 3306
}

export const db = new mysql.createPool(config)