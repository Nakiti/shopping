import { db } from "../db.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export const register = (req, res) => {
    const q = "SELECT * FROM users WHERE email = ?"

    db.query(q, [req.body.email], (err, data) => {
      if (err) return res.status(500).json(err)
      if (data.length > 0) {return res.status(409).json("User already exists")}
  
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
  
      const timestamp = new Date()
      const date = `${timestamp.getMonth() + 1}/${timestamp.getDate()}/${timestamp.getFullYear()}`
  
      const q = "INSERT INTO users(`username`,`email`,`password`, `created_at`) VALUES (?)";
      const values = [req.body.username, req.body.email, hash, date]
      console.log(values)
  
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(data)
      })
    })
}

export const login = (req, res) => {
    const query = "SELECT * FROM users WHERE email = ?"

    db.query(query, [req.body.email], (err, data) => {
      if (err) return res.status(500).json(err)
      if (data.length === 0) return res.status(404).json("User not found")
  
      const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        data[0].password
      )
  
      if (!isPasswordCorrect) {
        return res.status(400).json("Password is incorrect")
      }
  
      const token = jwt.sign({id: data[0].id}, "jwtkey")
      const {password, ...other} = data[0]
  
      res.cookie("access_token", token, {
        httpOnly: true
      }).status(200).json(other)
      console.log("cookie sent")
    })
}

export const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
      }).status(200).json("User has been logged out")
      console.log("cookie cleared")
}