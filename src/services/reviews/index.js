const router = require("express").Router();

const {
  findAll,
  findById,
  createNewEntry,
  findByIdAndUpdate,
  findByIdAndDelete,
  getReviewsCountByProduct,
  findReviewsByProductId,
} = require("../../utils/dbFuncs.js");

router.get("/", async (req, res, next) => {
  try {
    const response = await findAll("reviews");
    if (response.rows.length !== 0) {
      res.send(response.rows);
    } else {
      res.send("No reviews currently submitted.");
    }
  } catch (err) {
    console.error(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (req.params.id === "summary") {
      const response = await getReviewsCountByProduct();
      res.send(response.rows);
    } else {
      const response = await findById("reviews", req.params.id);
      if (response) {
        if (response.rowCount !== 0) {
          res.send(response.rows);
        } else {
          res.status(404).send("No review found with that ID");
        }
      } else {
        res.status(404).send("No review found with that ID");
      }
    }
  } catch (err) {
    console.error(err);
  }
});

router.get("/product/:productId", async (req, res, next) => {
  try {
    const findProduct = await findById("products", req.params.productId);
    if (findProduct.rowCount !== 0) {
      const response = await findReviewsByProductId(req.params.productId);
      res.send(response.rows);
    }
  } catch (err) {
    console.error(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const findProduct = await findById("products", req.body.product_id);
    if (findProduct.rowCount !== 0) {
      const response = await createNewEntry("reviews", req.body);
      if (response.rowCount === 1) {
        res.send("Successfully added new review");
      } else {
        throw new Error("Error adding new review");
      }
    } else {
      res.status(404).send("Selected review was not found, please enter a valid review ID");
    }
  } catch (err) {
    console.error(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const findReview = await findById("reviews", req.params.id);
    const findProductId = await findById("products", req.body.product_id);
    if (findProductId.rowCount !== 0) {
      if (findReview.rowCount !== 0) {
        const response = await findByIdAndUpdate("reviews", req.params.id, req.body);
        if (response.rowCount === 1) {
          res.send("Successfully updated review data.");
        } else {
          res.status(400).send("Error updating review data.");
        }
      } else {
        res.status(404).send("Review with that ID not found.");
      }
    } else {
      res.status(404).send("You have entered an invalid Product ID.");
    }
  } catch (err) {
    console.error(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const findReview = await findById("reviews", req.params.id);
    if (findReview.rowCount !== 0) {
      const response = await findByIdAndDelete("reviews", req.params.id);
      if (response.rowCount === 1) {
        res.send("Review successfully deleted.");
      } else {
        throw new Error("Error deleting product");
      }
    } else {
      res.status(404).send("Review with that ID not found.");
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
