import express from "express"
import { createCart, getCart } from "../controllers/cart.js"

const router = express.Router()

router.post("/create", createCart)
router.get("/get/:id", getCart)

export default router