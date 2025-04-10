const express = require("express");
const { GetUserDetails } = require("../../controllers/common/userDetails");
const router = express.Router();

router.get("/getUserInfo/:id", GetUserDetails)

module.exports = router;
