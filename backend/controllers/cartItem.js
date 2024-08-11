import { db } from "../db.js";

export const addItem = (req, res) => {
    const checkQuery = "SELECT * FROM cartitems WHERE cart_id = ? AND product_id = ?"
    console.log("cartItem", req.body)

    const values = [req.body.cart_id, req.body.product_id];

    db.query(checkQuery, values, (err, data) => {
        if (err) return res.status(500).json(err)

        if (data.length > 0) {
            return res.status(400).json({ message: "Item already exists in the cart" });
        }

        const q = "INSERT INTO cartitems(`cart_id`, `product_id`, `image`, `name`, `price`, `brand`, `link`, `timestamp`) VALUES (?)"

        const timestamp = new Date()
    
        const insertValues = [req.body.cart_id, req.body.product_id, req.body.image, req.body.name, req.body.price, req.body.brand, req.body.link, timestamp];
    
        db.query(q, [insertValues], (insertErr, insertData) => {
            // console.log(insertErr)

            if (insertErr) return res.status(500).json(insertErr)
            return res.status(200).json(insertData)
        })
    })
}

export const removeItem = (req, res) => {
    const q = "DELETE FROM cartitems WHERE cartitem_id = ?"

    const value = req.params.id

    db.query(q, [value], (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })

}

export const getItems = (req, res) => {
    const q = "SELECT * FROM cartitems WHERE cart_id = ?"

    const value = req.params.id

    console.log(value)

    db.query(q, [value], (err, data) => {
        if (err) return res.json(err)
        // console.log(data)
        return res.json(data)
    })
}