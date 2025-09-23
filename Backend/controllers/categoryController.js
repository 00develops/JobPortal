const Category = require('../models/Category');

// @desc    Add new category
// @route   POST /api/categories
// @access  Public
const addCategory = async (req, res) => {
  try {
    const { categoryName, categorySKU, categoryStatus } = req.body;
    const categoryImage = req.file ? `/uploads/${req.file.filename}` : null;

    const category = new Category({
      categoryName,
      categorySKU: categorySKU || '',
      categoryStatus: categoryStatus || 0,
      categoryImage,
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Public
const updateCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update fields if provided
    if (req.body.categoryName) category.categoryName = req.body.categoryName;
    if (req.body.categorySKU !== undefined) category.categorySKU = req.body.categorySKU;
    if (req.body.categoryStatus !== undefined) category.categoryStatus = req.body.categoryStatus;
    if (req.file) category.categoryImage = `/uploads/${req.file.filename}`;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addCategory, getCategories, updateCategory };
