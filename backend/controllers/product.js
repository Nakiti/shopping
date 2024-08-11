import { db } from "../db.js"
import { exec } from 'child_process';

export const scrape = (req, res) => {
    const stores = req.body.stores
    const gender = req.body.gender
    const clothing = req.body.clothing
    const price = req.body.price
    const page = 1
    const limit = 60

    console.log(stores[0] + gender)
    // console.log(JSON.stringify(stores))

    const env = {
        ...process.env,
        STORES: JSON.stringify(stores),
        GENDER: JSON.stringify(gender),
        CLOTHING: JSON.stringify(clothing),
        PRICE: JSON.stringify(price)
    }

    exec(`python ../script/generic_scraper.py`, {env}, 
        (err, stdout, stderr) => {
        if (err) {
            console.error(`Error: ${err.message}`);
            res.status(500).send('Server Error');
            return;
        }
        if (stderr) {
        console.error(`Stderr: ${stderr}`);
        res.status(500).send('Script Error');
        return;
        }


      //   const reset = () => {
      //       return new Promise((resolve, reject) => {
      //           db.query("DELETE FROM products WHERE item_id > 0", (err) => {
      //               if (err) return reject(err);

      //               db.query("ALTER TABLE products AUTO_INCREMENT = 1", (err) => {
      //                   if (err) return reject(err);
      //                   resolve();
      //               });
      //           });
      //       });
      //   };
      
        const data = JSON.parse(stdout);

        res.json(data)

      //   const insertData = () => {
      //       const insertPromises = data.map((item) => {
      //           const query = "INSERT INTO products(`brand`, `image`, `id`, `link`, `price`, `name`) VALUES (?)";
      //           const values = [item.brand, item.image, item.id, item.link, item.price, item.name];
      //           return new Promise((resolve, reject) => {
      //               db.query(query, [values], (err, result) => {
      //                   if (err) {
      //                       console.error(`Database insert error: ${err}`);
      //                       return reject(err);
      //                   }
      //                   resolve(result);
      //               });
      //           });
      //       });

      //       return Promise.all(insertPromises)
      //   }

      //   reset()
      //       .then(insertData)
      //       .then(() => {
      //           console.log(data.length)

      //           const pages = Math.ceil(data.length / limit)
      //           const start = (page - 1) * limit
      //           const end = limit
      //           const paginatedProducts = data.slice(start, end)
        
      //           res.json({products: paginatedProducts, total: pages});
      //       })
      //       .catch((e) => {
      //           console.log(e)
      //       })
    })
}

export const page = (req, res) => {
    const limit = 60;
    const page = req.params.page
    const start = (page - 1) * limit
    const query = "SELECT * FROM products LIMIT ? OFFSET ?"

    db.query(query, [limit, start], (err, data) => {
        if (err) return res.status(500).json(err)

        const q = "SELECT COUNT(*) AS total FROM products"
        console.log(data)

        db.query(q, (countErr, countRes) => {
            if (countErr) return res.status(500).json(countErr)

            const total = Math.ceil(countRes[0].total / limit)

            res.json({products: data, total: total});
        })
    })
}