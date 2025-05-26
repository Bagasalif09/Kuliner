const express = require('express');
const router = express.Router();
const geprekController = require('../controllers/geprekController');
const apiKeyMiddleware = require('../middleware/apikey');

router.use(apiKeyMiddleware);

router.get('/', geprekController.getMenu);
router.post('/', geprekController.addMenu);
router.put('/:id', geprekController.updateMenu);
router.delete('/:id', geprekController.deleteMenu);

module.exports = router;
