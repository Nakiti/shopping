import { db } from "../db.js";

export const createCart = (req, res) => {
    const q = "INSERT INTO carts(`user_id`, `timestamp`) VALUE(?)"

    const timestamp = new Date()
    const values = [req.body.user_id, timestamp]

    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(data)
    })
}

export const getCart = (req, res) => {
    const q = "SELECT * FROM carts WHERE user_id = ?" 

    db.query(q, [req.params.id], (err, data) => {
        if (err) console.log(err)
        return res.json(data)
    })
}