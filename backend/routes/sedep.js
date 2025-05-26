const express = require('express');
const router = express.Router();
const sedepController = require('../controllers/sedepController');
const apiKeyMiddleware = require('../middleware/apikey');

router.use(apiKeyMiddleware);

router.get('/', sedepController.getMenu);
router.post('/', sedepController.addMenu);
router.put('/:id', sedepController.updateMenu);
router.delete('/:id', sedepController.deleteMenu);

module.exports = router;
