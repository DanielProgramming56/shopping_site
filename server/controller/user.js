const Review = require("../models/Review");
const Product = require("../models/Product")
const mongoose = require("mongoose");
const User = require("../models/User")
const bcrypt = require("bcrypt")
const getUsers = async (req, res, next) => {
    try {
        const { id } = req.params
        if (id) {
            const getUserById = await User.findById(id).select("-password")
            return res.json(getUserById)
        }
        const allUsers = await User.find({}).select("-password");
        return res.json(allUsers)
    } catch (error) {
        next(error)
    }
}

const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).orFail();
        user.name = req.body.name || user.name;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.phoneNumber = req.body.phoneNumber;
        user.address = req.body.address;
        user.country = req.body.country;
        user.zipCode = req.body.zipCode;
        user.city = req.body.city;
        user.state = req.body.state;

        if (req.body.password !== user.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }
        await user.save();

        res.json({
            success: "user updated",
            userUpdated: {
                _id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        });
    } catch (err) {
        next(err);
    }
};

const getUpdatedUserProfile = async (req, res, next) => {
    try {
        console.log(req.user.id);
        const user = await User.findById(req.user.id).orFail();
        res.json({
            success: "found User",
            user: user
        });
    } catch (err) {
        next(err);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params

        if (id) {
            const user = await User.findById(id).orFail()
            user.name = req.body.name || user.name;
            user.lastName = req.body.lastName || user.lastName;
            user.email = req.body.email || user.email;
            user.isAdmin = req.body.isAdmin || user.isAdmin;

            await user.save();

            res.send("user updated");
        }
        return res.status(400).json('user undefine')
    } catch (error) {
        next(error)
    }
}


const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params

        if (id) {
            const user = await User.findByIdAndDelete(id).orFail()

            return res.send("delete successfully");
        }
        res.status(400).json('user undefine')
    } catch (error) {
        next(error)
    }
}

const writeReview = async (req, res, next) => {
    try {
        const session = Review.startSession();
        const { comment, rating } = req.body;
        const { productId } = req.params
        if (!(comment && rating)) {
            return res.status(400).send("comment and rating are required")
        }

        // create an ID manually 
        const ObjectId = mongoose.Types.ObjectId;
        let reviewId = new ObjectId();

        session.startTransaction();
        const review = await Review.create(
            {
                _id: reviewId,
                comment: comment,
                rating: Number(rating),
                user: {
                    _id: req.user.id,
                    name: req.user.name
                }
            }, { session: session }
        )

        const getProduct = await Product.findById(productId).populate("reviews").session(session);

        const alreadyReviewed = getProduct.reviews.find((r) => String(r.user._id) === String(req.user.id));


        if (alreadyReviewed) {
            await session.abortTransaction()
            session.endSession()
            return res.status(400).send("product already reviewed")
        }

        let productCpy = [...getProduct.reviews];
        productCpy.push({ rating: rating })
        getProduct.reviews.push(review)

        if (getProduct.reviews.length === 1) {
            getProduct.rating = Number(rating);
            getProduct.reviewsNumber = 1;
        } else {
            getProduct.reviewsNumber = getProduct.reviews.length;
            getProduct.rating = productCpy.map((item) => Number(item.rating)).reduce((sum, item) => sum + item, 0)
        }
        await getProduct.save()

        await session.commitTransaction()
        session.endSession()
        res.send("Review Successfully created")

    } catch (error) {
        await session.abortTransaction();
        next(error)
    }
}


module.exports = { writeReview, getUsers, updateUser, deleteUser, updateUserProfile, getUpdatedUserProfile }