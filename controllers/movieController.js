// NOTE 1. import connection (import database nya dulu)
const db = require('../database')

// NOTE 2. bikin helpers & import helpers
const { generateQuery, asyncQuery } = require('../helpers/queryHelp')

// // NOTE 3. ini untuk encrypt pass
// const cryptojs = require('crypto-js')
// const SECRET_KEY = process.env.SECRET_KEY
// const { createToken } = require('../helpers/jwt')

// NOTE 4. krn pake express validator, dia middleware jd harus di import juga dissini
const { body, validationResult } = require('express-validator')

// NOTE 5. module exports
module.exports = {
    getAllMovies: (req, res) => {
        // NOTE  define query SQL
        const queryAllMovies = `select * from movies
                                left join movie_status
                                on movies.status
                                where movies.status = movie_status.id;`

        db.query(queryAllMovies, (err, result) => {
            // NOTE check errornya
            if (err) return res.status(400).send(err)

            // NOTE kalo berhasil
            res.status(200).send(result)
        })
    }
}