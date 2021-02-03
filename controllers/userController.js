// NOTE 1. import connection (import database nya dulu)
const db = require('../database')

// NOTE 2. bikin helpers & import helpers
const { generateQuery, asyncQuery } = require('../helpers/queryHelp')

// NOTE 3. ini untuk encrypt pass
const cryptojs = require('crypto-js')
const SECRET_KEY = process.env.SECRET_KEY
const { createToken } = require('../helpers/jwt')

// NOTE 4. krn pake express validator, dia middleware jd harus di import juga disini
const { body, validationResult } = require('express-validator')

// NOTE 5. module exports
module.exports = {
    getAllUser: (req, res) => {
        // NOTE  define query SQL
        const queryAllUser = `select * from users;`

        db.query(queryAllUser, (err, result) => {
            // NOTE check errornya
            if (err) return res.status(400).send(err)

            // NOTE kalo berhasil
            res.status(200).send(result)
        })
    },

    register: async (req, res) => {
        const { username, email, password } = req.body

        // NOTE error tertampung di validation result, ditampung krn nanti mau di cek
        // NOTE VALIDATION INPUT FROM USERS 
        const errors = validationResult(req)
        console.log(errors)

        if (!errors.isEmpty()) return res.status(400).send(errors.array()[0].msg)

        // REVIEW
        // NOTE ENCRYPT PASS WITH CRYPTO JS
        // NOTE data yg sudah di encrypt oleh crypto js tidak bisa didecrypt
        const hashpass = cryptojs.HmacMD5(password, SECRET_KEY).toString()

        // NOTE untuk lihat bentuknya hashpass
        // console.log('haspass', hashpass.toString())

        try {
            // NOTE kalau tidak ada error, baru proses penambahan data user baru berjalan
            const queryCheckReg = `select * from users 
                                where username=${db.escape(username)}
                                or email=${db.escape(email)}`

            const resultCheckReg = await asyncQuery(queryCheckReg)

            if (resultCheckReg.length !== 0) return res.status(400).send('USERNAME OR EMAIL ALREADY EXIST')

            const queryReg = `insert into users (uid, username, email, password)
                            values (${Date.now() + "".slice(0, 7)}, ${db.escape(username)}, ${db.escape(email)}, ${db.escape(hashpass)})`

            const resultReg = await asyncQuery(queryReg)

            // NOTE create token kalo berhasil verify
            // NOTE insertId dapet dari postman pas register data baru
            const token = createToken({ id: resultReg.insertId, username: username })

            // NOTE untuk setelah klik reg, kirim result nya yg baru di registerin, ini caranya
            const queryGetUser = `select id, uid, username, email from users
                                where username=${db.escape(username)}`

            const resultGetReg = await asyncQuery(queryGetUser)

            // NOTE input token to result
            resultGetReg[0].token = token

            res.status(200).send(resultGetReg)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },

    login: async (req, res) => {
        // NOTE ini kalo pake headers
        const { username, email, password } = req.headers
        // NOTE kalo pake headers
        console.log(req.headers)

        // REVIEW
        // NOTE ENCRYPT PASS WITH CRYPTO JS
        // NOTE data yg sudah di encrypt oleh crypto js tidak bisa didecrypt
        const hashpass = cryptojs.HmacMD5(password, SECRET_KEY).toString()

        try {
            // NOTE define query SQL
            const queryLogin = `select * from users
                                where username=${db.escape(username)} or email=${db.escape(email)} 
                                and password=${db.escape(hashpass)}`

            const result = await asyncQuery(queryLogin)

            // NOTE check errornya
            if (result.length === 0) return res.status(400).send('USERNAME OR PASSWORD DO NOT MATCH')

            // NOTE ini untuk create token
            let token = createToken({ id: result[0].id, username: result[0].username })

            // NOTE input token to result
            result[0].token = token

            // NOTE KALAU BERHASIL
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },

    deactive: async (req, res) => {
        try {
            // NOTE edit butuh params, untuk yg di edit itu user berapa
            const id = +req.params.id

            // NOTE validation input from user
            const errors = validationResult(req)
            if (!errors.isEmpty()) return res.status(400).send(errors.array()[0].msg)

            const queryCekUser = `select * from users where id=${db.escape(id)}`
            
            const resultCekUser = await asyncQuery(queryCekUser)

            // NOTE ini untuk create token
            let token = createToken({ id: resultCekUser[0].id, username: resultCekUser[0].username })

            // NOTE input token to result
            resultCekUser[0].token = token

            // NOTE kalau id user gaketemu/gak ada, tampilkan
            if (resultCekUser.length === 0) return res.status(200).send(`USER WITH ID: ${id}, IS NOT FOUND`)

            const queryEditStatus = `update users set status=2 where id=${id}`

            const resultEditStatus = await asyncQuery(queryEditStatus)

            // NOTE tampilkan hasil
            const queryNewStatus = `select * from users
                                    left join status
                                    on status.id
                                    where users.status = status.id;`

            const resultNewStatus = await asyncQuery(queryNewStatus)

            res.status(200).send(resultNewStatus)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },

    // activate: async(req, res) => {
    //     try {

    //     }
    //     catch(err) {
    //         console.log(err)
    //         res.status(400).send(err)
    //     }
    // }
}