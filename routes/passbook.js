const express = require('express');
const router = express.Router();
const { getPassbook, createPassbook } = require('../controllers/passbookController');

router.get('/:member_id/:financial_year', getPassbook);
router.post('/', createPassbook);

module.exports = router;
