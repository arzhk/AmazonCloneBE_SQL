const router = require("express").Router();

const productsRouter = require("./products");
const reviewsRouter = require("./reviews");
const categoriesRouter = require("./categories");
const cartsRouter = require("./carts");

router.use("/products", productsRouter);
router.use("/reviews", reviewsRouter);
router.use("/categories", categoriesRouter);
router.use("/carts", cartsRouter);

module.exports = router;
