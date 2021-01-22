const router = require("express").Router();

const productsRouter = require("./products");
const reviewsRouter = require("./reviews");
const categoriesRouter = require("./categories");
const cartRouter = require("./cart");

router.use("/products", productsRouter);
router.use("/reviews", reviewsRouter);
router.use("/categories", categoriesRouter);
router.use("/cart", cartRouter);

module.exports = router;
