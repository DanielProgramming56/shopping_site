const Category = require("../models/Category")
const getCategories = async (req, res, next) => {
    try {

        const categories = await Category.find({}).sort({ name: "asc" }).orFail();

        if (!categories) {
            res.status(404).json({ message: "Category Not found" });
            return;
        }

        res.status(200).json(categories);

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const newCategory = async (req, res) => {
    try {
        const { category } = req.body
        if (!category) {
            res.status(400).send("Category input is required")
        }
        const categoryExist = await Category.find({ name: category })
        if (categoryExist) {
            res.status(400).send("Categoty already exists")
        }
        else {
            const categoryCreated = await Category.create({
                name: category
            })
            res.status(201).send("created category")
        }
    } catch (error) {
        next(error)
    }
}

const deleteCategory = async (req, res, next) => {
    try {
        const { category } = req.params

        if (category != "Choose category") {
            const categoryExist = await Category.findOne({
                name: decodeURIComponent(category)
            })
            await
                categoryExist.remove()
            res.status({ message: "category removed" })
        }

    } catch (error) {
        next(error)
    }
}


const saveAttr = async (req, res, next) => {
    try {
        const { key, value, categoryChosen } = req.body;

        if (!key || !value || !categoryChosen) {
            res.status(400).json({ message: "All input are required" })
        }
        const category = categoryChosen.split("/")[0];
        const categoryExist = await Category.findOne({
            name: category
        }).orFail()

        if (categoryExist.attrs.length > 0) {
            const DoesKeyExistInDatabase = false;
            categoryExist.attrs.map((item, idx) => {
                if (key === item.key) {
                    DoesKeyExistInDatabase = true;

                    const getTheValueOfExistingKey = [...categoryExist.attrs[idx].value]
                    // Add the new value to the array of the key values
                    getTheValueOfExistingKey.push(value);
                    const checkIfValuesAreUnique = [... new Set(getTheValueOfExistingKey)]
                    categoryExist.attrs[idx].value = checkIfValuesAreUnique
                }
            })

            if (!DoesKeyExistInDatabase) {
                categoryChosen.attrs.push({
                    key: key, value: [value]
                })
            }

        } else {
            categoryChosen.attrs.push({
                key: key,
                value: [value]
            })
        }
        await categoryExist.save()
        let cat = await Category.find({}).sort({ name: "asc" })
        return res.status(201).json({ categoriesUpdated: cat })
    } catch (error) {
        next(error)
    }

}
module.exports = { newCategory, getCategories, deleteCategory, saveAttr }