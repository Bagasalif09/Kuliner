const express = require('express');
const router = express.Router();
const tempuraController = require('../controllers/tempuraController');
const apiKeyMiddleware = require('../middleware/apikey');

router.use(apiKeyMiddleware);

router.get('/', tempuraController.getMenu);
router.post('/', tempuraController.addMenu);
router.put('/:id', tempuraController.updateMenu);
router.delete('/:id', tempuraController.deleteMenu);

module.exports = router;
