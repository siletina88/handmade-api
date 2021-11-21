const router = require("express").Router();
const { tokenVerifyAndAdmin, tokenVerify, tokenVerifyAndAuthorized } = require("./tokenVerify");

const Cart = require("../models/Cart");

//create

router.post("/", tokenVerify, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    return res.status(200).json(savedCart);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//add product to cart

router.put("/add/:id", async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.body.cartId,
      {
        $push: { products: req.body.item },
        $inc: { quantity: 1, total: req.body.item.product.price * req.body.item.quantity },
      },
      { new: true }
    );
    return res.status(200).send(updatedCart);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//clear cart

router.put("/clear/:id", async (req, res) => {
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

    return res.status(200).json(clearedCart);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// remove product from cart

router.put("/remove/:cartId/:productId", async (req, res) => {
  try {
    console.log(req.params);
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.cartId,

      {
        $inc: { quantity: -1 },
        $pull: { products: { product: req.params.productId } },
      },
      { new: true }
    );

    return res.status(200).json(updatedCart);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//delete cart

router.delete("/:id", tokenVerifyAndAuthorized, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    return res.status(200).json("Cart has been deleted");
  } catch (error) {
    return res.status(500).json(error);
  }
});

//get user cart

router.get("/find/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// //get all carts

router.get("/", tokenVerifyAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    return res.status(200).json(carts);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
