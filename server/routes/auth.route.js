const express = require("express")
 const {Register , login } = require("../controllers/auth.controller")


 const router = express.Router()



router.post("/register" , Register)
router.post("/login" , login)

module.exports = router