import express from "express"
import { scrape, page } from "../controllers/product.js"

const router = express.Router()

router.post("/scrape", scrape)
router.get("/fetch/:page", page)

export default router