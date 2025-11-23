const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');
const { verifyProvider, listProviders, incentives } = require('../controllers/adminController');

router.use(auth);
router.post('/verify', allowRoles('ADMIN'), verifyProvider);
router.get('/providers', allowRoles('ADMIN'), listProviders);
router.get('/incentives', allowRoles('ADMIN'), incentives);

module.exports = router;