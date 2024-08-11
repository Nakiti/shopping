import express from "express"
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser"
import cartRoutes from "./routes/cartRoutes.js"
import cartItemRoutes from "./routes/cartItemRoutes.js"
import { exec } from 'child_process';
import { db } from "./db.js"
import bodyParser from "body-parser"
import productRoutes from "./routes/productRoutes.js"


const app = express()

const corsOptions ={
    origin: true,
    credentials: true
  }

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use("/user", userRoutes)
app.use("/cart", cartRoutes)
app.use("/cartItem", cartItemRoutes)
app.use("/product", productRoutes)

const port = 4000

const testConnection = () => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error("Error connecting to the database:", err);
            return;
        }
        console.log("Connected to the MySQL database.");
        connection.release(); 
    });
};

app.listen(port, (req, res) => {
    console.log("runninnnnnnnnnnnn")
    testConnection()
})