const express = require('express');
const router = express.Router();
const warmindoController = require('../controllers/warmindoController');
const apiKeyMiddleware = require('../middleware/apikey');

router.use(apiKeyMiddleware);

router.get('/', warmindoController.getMenu);
router.post('/', warmindoController.addMenu);
router.put('/:id', warmindoController.updateMenu);
router.delete('/:id', warmindoController.deleteMenu);

module.exports = router;
