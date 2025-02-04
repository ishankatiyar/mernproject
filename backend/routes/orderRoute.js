const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController.js");
const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser,newOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder);


/*
Placing "/orders/me" before "/orders/:id" ensures that Express matches the specific 
"/orders/me" route first, avoiding the casting error caused by misinterpreting "me" as an ObjectId.
 This route order ensures that specific paths are matched before more general parameterized routes, preventing potential conflicts and errors.
 */


 router
 .route("/admin/orders")
 .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

 router
 .route("/admin/order/:id")
 .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
 .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder)


module.exports = router;