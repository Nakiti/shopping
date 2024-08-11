import express from "express"
import { addItem, removeItem, getItems } from "../controllers/cartItem.js"

const router = express.Router()

router.post("/add", addItem)
router.post("/remove/:id", removeItem)
router.get("/get/:id", getItems)

export default router