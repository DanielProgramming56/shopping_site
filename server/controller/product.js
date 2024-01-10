const path = require("path")
const Product = require("../models/Product");
const recordPerPage = require("../config/pagination");
const { log } = require("util");
const imageValidate = require("../utils/imageValidate");
const { error } = require("console");
const fs = require('fs')
const { v4: uuidv4 } = require("uuid")
const getAllProducts = async (req, res, next) => {
    try {

        // Flittering 
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
            let properties = categoryName.replaceAll(",", "/")
            var regExp = new RegExp("^" + properties)
            categoryQueryControl = { category: regExp }
        }

        if (req.query.category) {
            queryCondition = true;
            let a = req.query.category.split(",").map((item) => {
                if (item) return new RegExp("^" + item);
            });
            categoryQueryControl = {
                category: { $in: a },
            };
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
            attrsQueryCondition = req.query.attrs.split(",").reduce((acc, item) => {
                if (item) {
                    let a = item.split("-");
                    let values = [...a];
                    values.shift();
                    let a1 = {
                        attrs: { $elemMatch: { key: a[0], value: { $in: values } } },
                    };
                    acc.push(a1);
                    return acc;
                } else return acc;
            }, []);

            queryCondition = true;
        }

        let searchQueryControl = {}
        let searchQuery = req.params.searchQuery
        let select = {}
        if (searchQuery) {
            queryControl = true
            searchQueryControl = {
                $text: { $search: '"' + searchQuery + '"' }
            }

            select = {
                score: { $meta: "textScore" }
            }
        }

        if (queryControl) {
            query = {
                $and: [
                    priceQueryControl,
                    categoryQueryControl,
                    searchQueryControl,
                    ratingQueryControl,
                    ...attrsQueryCondition,

                ]
            }
        }

        const productTotalNumber = await Product.countDocuments({})

        const pageNum = Number(req.query.pageNum) || 1;

        let sort = {}
        const sortOptions = req.query.sort || "";

        if (sortOptions) {
            let sortOpt = sortOptions.split("_");
            sort = { [sortOpt[0]]: Number(sortOpt[1]) }
        }
        const products = await Product.find(query).skip(recordPerPage * (pageNum - 1)).sort(sort).limit(recordPerPage).select(select)

        res.status(200).json({ products, pageNum, paginationLinksNumber: Math.ceil(productTotalNumber / recordPerPage) });
    } catch (error) {
        next(error)
    }
}


const createProduct = async (req, res, next) => {
    try {
        const {
            name, description, category, count, price, discount, attributeTable
        } = req.body;
        const product = new Product()

        product.name = name
        product.description = description
        product.category = category
        product.count = count
        product.price = price
        product.discount = discount

        if (attributeTable.length > 0) {
            attributeTable.map((item) => {
                product.attrs.push(item)
            })
        }
        await product.save()

        res.status(201).json({ message: 'Successfully created product' });
    } catch (error) {
        next(error)
    }
};


const getDiscountProducts = async (req, res) => {
    try {
        const discountProducts = await Product.find({ discount })
        res.status(200).json(discountProducts)
    } catch (error) {
        next(error)
    }

}

const getProductsById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const productWithThatIdExist = await Product.findById(id);

        if (productWithThatIdExist) {
            res.status(200).json({
                message: productWithThatIdExist
            })
        } else {
            res.status(400).json({
                message: "There was an error, check Id"
            })
            throw Error()
        }
    } catch (error) {
        next(error)
    }

}

const getBestSellers = async (req, res, next) => {
    try {
        const products = await Product.aggregate([
            { $sort: { category: 1, sales: -1 } },
            { $group: { _id: "$category", doc_with_max_sales: { $first: "$$ROOT" } } },
            { $replaceWith: "$doc_with_max_sales" },
            { $match: { sale: { $gt: 0 } } },
            { $project: { _id: 1, name: 1, images: 1, category: 1, description: 1 } },
            { $limit: 3 }
        ])

        res.json(products)
    } catch (error) {
        next(error)
    }
}

const getProductForAdmin = async (req, res, next) => {
    try {
        const products = await Product.find({}).sort({ category: 1 }).select("name price category")

        return res.json(products)
    } catch (error) {
        next(error)
    }
}

const deleteProductByAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const productExist = await Product.findById(id)

        if (productExist) {
            await Product.findByIdAndDelete(id)
            res.json({
                message: "Delete Products"
            })
        }
        res.json({ message: 'Unknown Product' })

    } catch (error) {
        next(error)
    }
}


const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params
        const {
            name, description, category, count, price, discount, attributeTable
        } = req.body;

        const productExist = await Product.findById(id)

        if (productExist) {
            productExist.name = name || productExist.name
            productExist.description = description || productExist.description
            productExist.category = category || productExist.category
            productExist.count = count || productExist.count
            productExist.price = price || productExist.price
            productExist.discount = discount || productExist.discount

            if (attributeTable.length > 0) {
                productExist.attrs = []
                attributeTable.map((item) => {
                    productExist.attrs.push(item)
                })
            }

            await productExist.save()
            res.status(201).json({ message: "updated products" })
        } else {
            res.status(404).json({ message: 'Unknown Product' })
        }
    } catch (error) {
        next(error)
    }
}

const uploadImage = async (req, res, next) => {
    let imageTable = []
    try {
        if (!req.files || !!req.files.images == false) {
            res.status(400).json({ message: "No file was found" })
        }

        const validateImage = imageValidate(req.files.images)



        if (validateImage.error) {
            res.status(400).send(validateImage, error)
        }

        if (Array.isArray(req.files.images)) {
            imageTable = req.files.images;

        } else {
            imageTable.push(req.files.images)
        }
        const uploadDictionary = path.resolve(__dirname, "../../client", "public", "products", "images")

        const productId = await Product.findById(req.params.productId)

        for (let img of imageTable) {
            const fileName = uuidv4() + path.extname(img.name)
            const uploadPath = uploadDictionary + "/" + fileName
            productId.images.push({ path: "/products/images/" + fileName })

            img.mv(uploadPath, (err) => {
                if (err) {
                    res.status(500).send(err.message)
                }
            })
        }

        await productId.save()
        res.status(201).send("file uploaded successfully")

    } catch (error) {
        next(error)
    }
}

const deleteProductImage = async (req, res, next) => {
    try {
        const imagePath = decodeURIComponent(req.params.imagePath)
        const finalPath = path.resolve("../client/public") + imagePath
        console.log(finalPath);
        fs.unlink(finalPath, (err) => {
            if (err) {
                res.status(500).send(err.message)
            }
        })


        await Product.findOneAndUpdate(
            { _id: req.params.productId },
            { $pull: { images: { path: imagePath } } }
        ).orFail();
        return res.end();
    } catch (error) {
        next(error)
    }

}


module.exports = { getAllProducts, createProduct, getDiscountProducts, getProductsById, getBestSellers, getProductForAdmin, deleteProductByAdmin, updateProduct, uploadImage, deleteProductImage }

// '' 