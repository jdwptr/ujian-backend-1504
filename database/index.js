// NOTE import module mysql unutk menyambungkan API dengan MySQL
const mysql= require('mysql')

// NOTE SETUP MYSQL
const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DBNAME
  })

  module.exports= connection