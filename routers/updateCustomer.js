//can use this router to handle all customer updating besides just tags
const express = require("express");
const router = express.Router();
const {checkRequest} = require('../tools/configTools');

router('/',checkRequest,(req,res) => {

});

module.exports = {router};