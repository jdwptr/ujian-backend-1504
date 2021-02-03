// NOTE 1. import module express beserta method Router nya
// NOTE method router dari express, berguna untuk membuat router.
const router= require('express').Router()

// NOTE 2. krn pake express validator, dia middleware jd harus di import juga dissini
const { body, validationResult }= require('express-validator')

// NOTE 3. import controller yg dibutuhkan
const {movieController}= require('../controllers')

//NOTE 4. import helpers
const { verifyToken }= require('../helpers/jwt')

// NOTE 5. IMPORT register validation
const registerValidation= [
    body('username')
    .notEmpty()
    .withMessage('Username can\'t be empty')
    .isLength({min: 6})
    .withMessage('Username must have minimum 6 characters'),

    body('password')
    .notEmpty()
    .withMessage('Password can\'t be empty')
    .isLength({min: 6})
    .withMessage('Password must have minimum 6 characters')
    .matches(/[0-9]/)
    .withMessage('Password must have numbers')
    .matches(/[!@#$%^&*]/)
    .withMessage('Password must have symbols'),

    body('email')
    .isEmail()
    .withMessage('Invalid Email')
]

// NOTE 6. create router nya
// NOTE pakai post bisa semua, mau diganti get, post, put, patch, delete bisa juga
router.get('/get', movieController.getAllMovies)

// NOTE 7. export router
module.exports= router