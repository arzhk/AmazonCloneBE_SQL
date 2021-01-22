const router = require("express").Router();

const {
  findAll,
  findById,
  createNewEntry,
  findByIdAndUpdate,
  findByIdAndDelete,
  findProductWithCategory,
  findByNameSearch,
  findByDescriptionSearch,
} = require("../../utils/dbFuncs.js");

router.get("/", async (req, res, next) => {
  try {
    if (req.query.search) {
      if (req.query.by === "name") {
        const response = await findByNameSearch("products", req.query.search);
        res.send(response.rows);
      } else if (req.query.by === "content") {
        const response = await findByDescriptionSearch("products", req.query.search);
        res.send(response.rows);
      }
    } else {
      const response = await findAll("products");
      res.send(response.rows);
    }
  } catch (err) {
    console.error(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (req.query.details === "extra") {
      const response = await findProductWithCategory(req.params.id);
      if (response.rowCount !== 0) {
        res.send(response.rows);
      } else {
        res.status(404).send("No article found with that ID");
      }
    } else {
      const response = await findById("products", req.params.id);
      if (response.rowCount !== 0) {
        res.send(response.rows);
      } else {
        res.status(404).send("No article found with that ID");
      }
    }
  } catch (err) {
    console.error(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const findCategory = await findById("categories", req.body.category_id);
    if (findCategory.rowCount !== 0) {
      const response = await createNewEntry("products", req.body);
      if (response.rowCount === 1) {
        res.send("Successfully added new product");
      } else {
        throw new Error("Error adding new product");
      }
    } else {
      res.status(404).send("Selected category was not found, please enter a valid Category ID");
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
