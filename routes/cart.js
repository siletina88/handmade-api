const router = require("express").Router();
const { tokenVerifyAndAdmin, tokenVerify, tokenVerifyAndAuthorized } = require("./tokenVerify");

const Cart = require("../models/Cart");

//create

router.post("/", tokenVerify, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

//add product to cart

router.put("/add/:id", tokenVerify, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.body.cartId,
      {
        $push: { products: req.body.item },
        $inc: { quantity: 1, total: req.body.item.product.price * req.body.item.quantity },
      },
      { new: true }
    );

    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

//clear cart

router.put("/clear/:id", tokenVerify, async (req, res) => {
  try {
    const clearedCart = await Cart.findByIdAndUpdate(
      req.body.cartId,
      {
        products: [],
        quantity: 0,
        total: 0,
      },
      { new: true }
    );

    res.status(200).json(clearedCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// remove product from cart

router.put("/remove/:cartId/:productId", tokenVerify, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.cartId,

      {
        $inc: { quantity: -1, total: -req.body.cartPrice },
        $pull: { products: { product: req.params.productId } },
      },
      { new: true }
    );

    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete cart

router.delete("/:id", tokenVerifyAndAuthorized, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

//get user cart

router.get("/find/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// //get all carts

router.get("/", tokenVerifyAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
