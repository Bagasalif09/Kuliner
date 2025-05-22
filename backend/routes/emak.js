const express = require('express');
const router = express.Router();
const emakController = require('../controllers/emakController');
const apiKeyMiddleware = require('../middleware/apikey');

router.use(apiKeyMiddleware);

router.get('/', emakController.getMenu);
router.post('/', emakController.addMenu);
router.put('/:id', emakController.updateMenu);
router.delete('/:id', emakController.deleteMenu);

module.exports = router;
