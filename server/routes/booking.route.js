const express = require("express")
const {CancelBooking ,bookseats ,getUserbooking , getSeat} = require("../controllers/booking.controller")
const auth = require("../middleware/auth.middileware")


const router = express.Router()


router.get("/seats" , getSeat)
router.get("/user" ,auth , getUserbooking )
router.post("/book" , auth , bookseats)

router.post("/cancel/:bookingId" , auth ,CancelBooking)

module.exports = router 