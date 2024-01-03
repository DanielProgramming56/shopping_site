const Product = require("../models/Product");
const ProductModel = require("../models/Product")
const getAllProducts = async (req, res) => {
    try {
        let query = {};
        let queryControl = false

        //  Query Product by Price
        let priceQueryControl = {}
        if (req.query.price) {
            queryControl = true;
            priceQueryControl = { price: { $lte: Number(req.query.price) } }
        }
        // Query by category
        let categoryQueryControl = {}
        let categoryName = req.params.categoryName || ""
        if (categoryName) {
            queryControl = true;
            let properties = categoryName.replace(",", "/")
            var regExp = new RegExp("^" + properties)
            categoryQueryControl = { category: regExp }
        }

        // Query by Rating
        let ratingQueryControl = {}
        if (req.query.rating) {
            queryControl = true
            ratingQueryControl = { rating: { $in: req.query.rating.split(",") } }
        }

        // Query by attribute

        let attrsQueryCondition = []
        if (req.query.attrs) {
            // attrs=RAM-1TB-2TB-4TB,color-blue-red
            // [ 'RAM-1TB-4TB', 'color-blue', '' ]
            attrsQueryCondition = req.query.attrs.split(",").reduce((acc, item) => {
                if (item) {
                    let a = item.split("-");
                    let values = [...a];
                    values.shift(); // removes first item
                    let a1 = {
                        attrs: { $elemMatch: { key: a[0], value: { $in: values } } },
                    };
                    acc.push(a1);
                    // console.dir(acc, { depth: null })
                    console.log(acc);
                    return acc;
                } else return acc;
            }, []);
            //   console.dir(attrsQueryCondition, { depth: null });
            queryCondition = true;
        }

        if (queryControl) {
            query = {
                $and: [
                    priceQueryControl,
                    categoryQueryControl,
                    ratingQueryControl,
                    attrsQueryCondition,
                ]
            }
        }
        const products = await ProductModel.find(query);
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const createProduct = async (req, res) => {
    try {
        const productData = {};
        Object.keys(req.body).forEach((key) => {
            productData[key] = req.body[key];
        });

        const newProduct = new Product(productData);

        await newProduct.save();
        res.status(201).json({ message: 'successfully created product', newProduct })
    } catch (error) {
        console.log(error.message)
        res.status(500).send('external server error')
    }

}

const getDiscountProducts = async (req, res) => {
    try {
        const discountProducts = await Product.find({ discount })
        res.status(200).json(discountProducts)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

module.exports = { getAllProducts, createProduct, getDiscountProducts }