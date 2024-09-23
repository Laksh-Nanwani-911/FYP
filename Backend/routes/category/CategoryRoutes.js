const express = require("express");
const router = express.Router();

const {
  createNewCategory,
  getAllActiveCategories,
  getAllCategories,
  deleteCategory,
  updateCategory,
} = require("../../controllers/category/CategoryController");

router.post("/create-new-category", createNewCategory);

router.get("/get-all-active-categories", getAllActiveCategories);

router.get("/get-all-categories", getAllCategories);

router.put("/update-category/:categoryId", updateCategory);

router.delete("/delete-category/:categoryId", deleteCategory);

module.exports = router;
