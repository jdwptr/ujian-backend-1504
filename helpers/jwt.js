const jwt= require('jsonwebtoken')
const TOKEN_KEY= process.env.TOKEN_KEY

module.exports= {
    createToken: (data) => {
        return jwt.sign(data, TOKEN_KEY)
    },
    verifyToken: (req, res, next) => {
        const token= req.body.token
        // console.log('token: ', token)

        // NOTE cek kalau tokennya exist atau nggak
        if (!token) return res.status(400).send('No Token')

        // NOTE kalau tokennya ada, kita verify pakai try catch lg
        try {
            // NOTE verify token
            const result= jwt.verify(token, TOKEN_KEY)

            // NOTE add token to req.user
            req.user= result

            // NOTE lanjut ke proses  berikutnya, krn dia middle ware jd butuh next() untuk ke rposes selanjutnya
            next()
        }
        catch(err) {
            console.log(err)
            res.status(400).send(err)
        }

    }
}