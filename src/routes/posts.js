const { Router } = require('express');
const { generate } = require('../controllers/postsController');

const router = Router();

// POST /api/generate
router.post('/generate', generate);

module.exports = router;