// NOTE 1. IMPORT CONTROLLER YG DIBUTUHKAN
const userController= require('./userController')
const movieController= require('./movieController')

// NOTE 2. EXPORT controllernya
module.exports= {
    userController,
    movieController
}