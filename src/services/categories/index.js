const router = require("express").Router();

const {
  findAll,
  findById,
  createNewEntry,
  findByIdAndUpdate,
  findByIdAndDelete,
  getProductCountByCategory,
} = require("../../utils/dbFuncs.js");

router.get("/", async (req, res, next) => {
  try {
    const response = await findAll("categories");
    res.send(response.rows);
  } catch (err) {
    console.error(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (req.params.id === "summary") {
      const response = await getProductCountByCategory();
      res.send(response.rows);
    } else {
      const response = await findById("categories", req.params.id);
      if (response) {
        if (response.rowCount !== 0) {
          res.send(response.rows);
        } else {
          res.status(404).send("Category with that ID not found.");
        }
      } else {
        res.status(404).send("Error retrieving category data.");
      }
    }
  } catch (err) {
    console.error(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const response = await createNewEntry("categories", req.body);
    if (response.rowCount === 1) {
      res.send("Successfully added new category");
    } else {
      throw new Error("Error adding new category");
    }
  } catch (err) {
    console.error(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const findCategory = await findById("categories", req.params.id);
    if (findCategory.rowCount !== 0) {
      const response = await findByIdAndUpdate("categories", req.params.id, req.body);
      if (response.rowCount === 1) {
        res.send("Successfully updated category data.");
      } else {
        res.status(400).send("Error updating category data.");
      }
    } else {
      res.status(404).send("Category with that ID not found.");
    }
  } catch (err) {
    console.error(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const findCategory = await findById("categories", req.params.id);
    if (findCategory.rowCount !== 0) {
      const response = await findByIdAndDelete("categories", req.params.id);
      if (response.rowCount === 1) {
        res.send("Category successfully deleted.");
      } else {
        throw new Error("Error deleting category");
      }
    } else {
      res.status(404).send("Category with that ID not found.");
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
