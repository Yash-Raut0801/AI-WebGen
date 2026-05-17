const express = require('express');
const router = express.Router();
const {
  getMobiles,
  getMobileById,
} = require('../controllers/mobileController');

router.get('/', getMobiles);
router.get('/:id', getMobileById);

module.exports = router;