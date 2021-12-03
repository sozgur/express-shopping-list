const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDb");

//List of shopping items
router.get("/", function (req, res) {
    res.json({ items });
});

//Add a data to shopping list
router.post("/", function (req, res, next) {
    try {
        console.log(req.body);
        if (!req.body.name && !req.body.price)
            throw new ExpressError("Name and price is required", 400);

        const newItem = { name: req.body.name, price: req.body.price };
        items.push(newItem);
        return res.status(201).json({ added: newItem });
    } catch (e) {
        next(e);
    }
});

// Display a single item
router.get("/:name", function (req, res, next) {
    try {
        const foundItem = items.find((i) => i.name === req.params.name);
        if (!foundItem) throw new ExpressError("Item not found", 404);
        res.json(foundItem);
    } catch (e) {
        next(e);
    }
});

//Modified single item
router.patch("/:name", function (req, res, next) {
    try {
        const foundItem = items.find((i) => i.name === req.params.name);
        if (!foundItem) throw new ExpressError("Item not found", 404);

        if (req.body.name) foundItem.name = req.body.name;
        if (req.body.price) foundItem.price = req.body.price;

        res.json({ updated: foundItem });
    } catch (e) {
        next(e);
    }
});

// Delete specific item
router.delete("/:name", function (req, res, next) {
    try {
        const foundItemIdx = items.findIndex((i) => i.name === req.params.name);
        if (foundItemIdx === -1) {
            throw new ExpressError("Item not found", 404);
        }
        items.splice(foundItemIdx, 1);
        res.json({ message: "Deleted" });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
