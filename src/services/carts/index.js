const router = require("express").Router();

const {
  findAll,
  findById,
  createNewEntry,
  findByIdAndUpdate,
  findByIdAndDelete,
  getSingleCart,
  getAllCarts,
} = require("../../utils/dbFuncs.js");

router.get("/", async (req, res, next) => {
  try {
    const response = await findAll("carts");
    res.send(response.rows);
  } catch (err) {
    console.error(err);
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    if (req.params.userId === "summary") {
      const response = await getAllCarts();
      res.send(response.rows);
    } else {
      const response = await getSingleCart(parseInt(req.params.userId));
      if (response.rows.length !== 0) {
        res.send(response.rows);
      } else {
        res.status(404).send(`Carts for user ID "${req.params.userId}" not found.`);
      }
    }
  } catch (err) {
    console.error(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const findUser = await findById("users", req.body.user_id);
    if (findUser.rowCount !== 0) {
      const findProduct = await findById("products", req.body.product_id);
      if (findProduct.rowCount !== 0) {
        const response = await createNewEntry("carts", req.body);
        if (response.rowCount === 1) {
          res.send("Successfully added product to cart.");
        } else {
          throw new Error("Error adding product to cart.");
        }
      } else {
        res.status(404).send("Product with that ID not found.");
      }
    } else {
      res.status(404).send("User with that ID was not found, please enter a valid User ID");
    }
  } catch (err) {
    console.error(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const findCart = await findById("carts", req.params.id);
    if (findCart.rowCount !== 0) {
      const findUser = await findById("users", req.body.user_id);
      if (findUser.rowCount !== 0) {
        const findProduct = await findById("products", req.body.product_id);
        if (findProduct.rowCount !== 0) {
          const response = await findByIdAndUpdate("carts", req.body);
          if (response.rowCount === 1) {
            res.send("Successfully updated product in cart.");
          } else {
            throw new Error("Error adding product to cart.");
          }
        } else {
          res.status(404).send("Product with that ID not found.");
        }
      } else {
        res.status(404).send("User with that ID was not found, please enter a valid User ID");
      }
    } else {
      res.status(404).send("Cart with that ID was not found, please enter a valid Cart ID");
    }
  } catch (err) {
    console.error(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const findCart = await findById("carts", req.params.id);
    if (findCart.rowCount !== 0) {
      const response = await findByIdAndDelete("carts", req.params.id);
      if (response.rowCount === 1) {
        res.send("Product successfully deleted from cart.");
      } else {
        throw new Error("Error removing product from cart.");
      }
    } else {
      res.status(404).send("Cart with that ID not found.");
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
