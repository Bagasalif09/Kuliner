const express = require('express');
const router = express.Router();
const dapursedepController = require('../controllers/dapursedepController');
const apiKeyMiddleware = require('../middleware/apikey');

router.use(apiKeyMiddleware);

router.get('/', dapursedepController.getMenu);
router.post('/', dapursedepController.addMenu);
router.put('/:id', dapursedepController.updateMenu);
router.delete('/:id', dapursedepController.deleteMenu);

module.exports = router;
