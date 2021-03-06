const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
// router.post("/register", async (req, res) => {
//   const newUser = new User({
//     username: req.body.username,
//     email: req.body.email,
//     password: CryptoJS.AES.encrypt(req.body.password, process.env.CRYPTO_SEC).toString(),
//   });

//   try {
//     const savedUser = await newUser.save();

//     res.status(201).json(savedUser);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

const UserController = require("../controllers/UserController.js");
router.post("/register", UserController.signup);
router.post("/login", UserController.login);
router.get("/verify/:id", UserController.verify);

// //Login
// router.post("/login", async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.body.username });

//     !user && res.status(401).json("Wrong username");

//     const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_SEC);
//     const TruePassword = hashedPassword.toString(CryptoJS.enc.Utf8);

//     TruePassword !== req.body.password && res.status(401).json("Wrong Password");

//     const accessToken = jwt.sign(
//       {
//         id: user._id,
//         isAdmin: user.isAdmin,
//       },
//       process.env.JWT_SEC,
//       { expiresIn: "1d" }
//     );

//     const { password, ...others } = user._doc;

//     res.status(200).json({ ...others, accessToken });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

module.exports = router;
