const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview, getAdminProducts } = require("../controllers/productController.js");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth.js");
const { getAdminProduct } = require("../controllers/productController.js");

const router = express.Router();

router.route("/products").get(getAllProducts)

router.route("/admin/products").get(isAuthenticatedUser, authorizeRoles("admin"),getAdminProducts)
router.route("/admin/product/new").post(  isAuthenticatedUser, authorizeRoles("admin"),createProduct)

router.route("/admin/products/:id")
.put( isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
.delete( isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)


router.route("/products/:id")
.get(getProductDetails)


router.route("/review").put(isAuthenticatedUser, createProductReview)

router.route("/reviews")
    .get(isAuthenticatedUser,getProductReviews)
    .delete(isAuthenticatedUser, deleteReview);





module.exports = router