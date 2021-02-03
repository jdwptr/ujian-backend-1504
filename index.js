// NOTE 1. NPM INIT
// NOTE 2. npm i body-parser cors express dotenv mysql express-validator jsonwebtoken crypto-js
// NOTE 3. import module yg dibutuhkan
// NOTE 4. setup API & dotenv
// NOTE 5. apply middleware
// NOTE 6. bikin app ke home route nya
// NOTE 7. port listen nya kemana
// NOTE 8. setup folder database (bikin index.js didlm database) & setup di mysql
// NOTE 9. Bikin file .env (mysql pilih server -> users & priv, klik user) & Masukkan di index.js nya database
// NOTE 10. masukkan index.js database ke index.js utama
// NOTE 11. Import si routernya

// NOTE fungsi express ini adalah untuk pengganti HTTP Module
const express = require('express')

// NOTE body parser ini u/mengambil data body dari request (gaperlu papke req.on dl lg)
// NOTE ngambil pake body parser udah lgsg diubah gaperlu lg input= chunk.toString() sama let obj= JSON.parse(input)
// NOTE yg menghandle request ke dlm req.body
const bodyParser = require('body-parser')

// NOTE untuk izin akses data (sharing data)
const cors = require('cors')

// NOTE untuk setup.env
const dotenv = require('dotenv')

// NOTE import module mysql untuk menyambungkan API dengan MySQL
const mysql= require('mysql')

// NOTE create app // BAHAN UTAMA UNTUK BUAT APP KITA
const app = express()

// NOTE config .env
dotenv.config()

// apply middleware
app.use(cors())
app.use(bodyParser.json())

// NOTE Create Home Route nya
app.get('/', (req, res) => {
    res.status(200).send(`<h1>THIS IS MY HOMEPAGE API REVIEW</h1>`)
})

// NOTE setup database mysql (no. 10)
const db= require('./database')

// NOTE import router (n0 11)
// NOTE ngambilnya object krn di exportnya object
const {userRouter, movieRouter}= require('./routers')
app.use('/user', userRouter)
app.use('/movies', movieRouter)

db.connect((err) => {
    if(err) return console.log(`ERROR CONNECTING: ${err.stack}`)
    console.log(`CONNECTED TO MYSQL AS ID: ${db.threadId}`)
})

// NOTE kasih port listen nya kemana
const port = 2000
app.listen(port, () => console.log(`Server is Connected at PORT: ${port}`))