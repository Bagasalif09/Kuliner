const express = require('express');
const router = express.Router();
const minumanController = require('../controllers/minumanController');
const apiKeyMiddleware = require('../middleware/apikey');

router.use(apiKeyMiddleware);

router.get('/', minumanController.getMenu);
router.post('/', minumanController.addMenu);
router.put('/:id', minumanController.updateMenu);
router.delete('/:id', minumanController.deleteMenu);

module.exports = router;
