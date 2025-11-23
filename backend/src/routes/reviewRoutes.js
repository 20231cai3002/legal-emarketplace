const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');
const { createReview } = require('../controllers/reviewController');

router.use(auth);
router.post('/', allowRoles('CITIZEN'), createReview);

module.exports = router;