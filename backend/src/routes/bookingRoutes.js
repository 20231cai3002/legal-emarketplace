const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');
const { createBooking, myBookings, respondBooking, completeBooking } = require('../controllers/bookingController');

router.use(auth);
router.post('/', allowRoles('CITIZEN'), createBooking);
router.get('/mine', allowRoles('CITIZEN','PROVIDER'), myBookings);
router.post('/respond', allowRoles('PROVIDER'), respondBooking);
router.post('/complete', allowRoles('PROVIDER'), completeBooking);

module.exports = router;