const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');
const { getProviders, updateAvailability, getMe } = require('../controllers/providerController');

router.get('/', getProviders);
router.use(auth);
router.get('/me', allowRoles('PROVIDER'), getMe);
router.put('/availability', allowRoles('PROVIDER'), updateAvailability);

module.exports = router;