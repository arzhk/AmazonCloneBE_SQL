const router = require("express").Router();

const {
  findAll,
  findById,
  createNewEntry,
  findByIdAndUpdate,
  findByIdAndDelete,
  getReviewsCountByProduct,
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
    const findProduct = await findById("products", req.params.id);
    if (findProduct.rowCount !== 0) {
      const response = await findByIdAndUpdate("products", req.params.id, req.body);
      if (response.rowCount === 1) {
        res.send("Successfully updated product data.");
      } else {
        res.status(400).send("Error updating product data.");
      }
    } else {
      res.status(404).send("Product with that ID not found.");
    }
  } catch (err) {
    console.error(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const findProduct = await findById("products", req.params.id);
    if (findProduct.rowCount !== 0) {
      const response = await findByIdAndDelete("products", req.params.id);
      if (response.rowCount === 1) {
        res.send("Product successfully deleted.");
      } else {
        throw new Error("Error deleting product");
      }
    } else {
      res.status(404).send("Product with that ID not found.");
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
