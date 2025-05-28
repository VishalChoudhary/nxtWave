// routes/user.js (cleaned - admin code removed)
const User = require('../models/User');
const { verifyToken, verifyTokenAndAuthorization } = require('./verifyToken');
const router = require('express').Router();

// UPDATE USER
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true }
        );
        const { password: _, ...userData } = updatedUser._doc;
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json(error);
    }
});

// DELETE USER
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been successfully deleted...");
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET SINGLE USER
router.get("/find/:id", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password: _, ...userData } = user._doc;
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;