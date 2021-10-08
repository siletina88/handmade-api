const User = require('../models/User')
const {
  tokenVerifyAndAdmin,
  tokenVerifyAndAuthorized,
} = require('./tokenVerify')
const CryptoJS = require('crypto-js')

const router = require('express').Router()

//Update user
router.put('/:id', tokenVerifyAndAuthorized, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.CRYPTO_SEC,
    ).toString()
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    )
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json(error)
  }
})

//delete

router.delete('/:id', tokenVerifyAndAuthorized, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json('User has been deleted')
  } catch (error) {
    res.status(500).json(error)
  }
})

//get user

router.get('/find/:id', tokenVerifyAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...others } = user._doc
    res.status(200).json(others)
  } catch (error) {
    res.status(500).json(error)
  }
})

//get all users

router.get('/', tokenVerifyAndAdmin, async (req, res) => {
  const query = req.query.new
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find()

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json(error)
  }
})

//get user stats - registers by months

router.get('/stats', tokenVerifyAndAdmin, async (req, res) => {
  const date = new Date()
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 },
        },
      },
    ])
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
