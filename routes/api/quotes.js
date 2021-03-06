const express = require("express");
const router = express.Router();

//get schema from model
const Quote = require("../../models/Quote");
const Author = require("../../models/Author");
const Category = require("../../models/Category");

const getAuthor = require("../../middleware/getAuthor");
const getCategory = require("../../middleware/getCategory");
const { route } = require("./authors");

//Create new Quote
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

//Read all quotes
router.get("/", async (req, res) => {
  try {
    const allQuotes = [];
    const quotes = await Quote.find();
    for (quote of quotes) {
      const author = await Author.findById(quote.author_id);
      const category = await Category.findById(quote.category_id);
      allQuotes.push({ quote, author, category });
    }
    res.json(allQuotes);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//Read quote by ID

router.get("/:id", async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: "Quote not found." });
    const myQuote = [];
    const author = await Author.findById(quote.author_id);
    const category = await Category.findById(quote.category_id);
    myQuote.push({ quote, author, category });
    res.json(myQuote);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//Update quote by Id.
router.put("/:id", getAuthor, getCategory, async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: "Quote not found." });
    if (req.body.quote) quote.quote = req.body.quote;
    quote.author_id = res.author_id;
    quote.category_id = res.category_id;
    const updatedQuote = await quote.save();
    res.status(201).json(updatedQuote);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//Delete quote by Id:

router.delete("/:id", async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: "Quote not found" });
    await quote.remove();
    res.json({ message: "Quote remove." });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
