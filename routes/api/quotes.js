const express = require("express");
const router = express.Router();

//get schema from model
const Quote = require("../../models/Quote");
const Author = require("../../models/Author");
const Category = require("../../models/Category");

const getAuthor = require("../../middleware/getAuthor");
const getCategory = require("../../middleware/getCategory");

router.post("/", getAuthor, getCategory, async (req, res) => {
  try {
    const quote = new Quote({
      quote: req.body.quote,
      author_id: res.author_id,
      category_id: res.category_id,
    });

    const newQuote = await quote.save();
    res.status(201).json(newQuote);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

module.exports = router;
