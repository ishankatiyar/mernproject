const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/errorhandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const ApiFeatures = require("../utils/apifeatures.js");
const Order = require("../models/orderModel.js")

// Create new Order
exports.newOrder = catchAsyncErrors( async(req,res,next) => {

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    })

    res.status(201)
    .json({
        success: true,
        order
    })
})


// get Single Order
exports.getSingleOrder = catchAsyncErrors( async(req,res,next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if(!order){
        return next( new ErrorHandler("Order not found with this Id",404));
    }

    res.status(200)
    .json({
        success: true,
        order,
    })
})


// get logged in user Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    
    if (!req.user._id) {
        return next(new ErrorHandler("User not found in request", 400));
    }

    const orders = await Order.find({ user: req.user._id });

    if (!orders) {
        return next(new ErrorHandler("No orders found for this user", 404));
    }

    res.status(200).json({
        success: true,
        orders,
    });
});




// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {

  
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success: true,
        orders,
        totalAmount
    });
});


// update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {

  
    const order = await Order.findById(req.params.id);

    if(!order){
        return next( new ErrorHandler("Order not found with this Id",404));
    }

    if(order.orderStatus === "Delivered"){
        return next( new ErrorHandler("You have already delivered this order"),400);
    }

    if(req.body.status === "Shipped")
    {
        order.orderItems.forEach(async (order) => {
            await updateStock(order.product, order.quantity)
            })
    }
    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({
        validateBeforeSave: false
    })
    res.status(200).json({
        success: true,
    });
});

async function updateStock( id, quantity ) {

     const product = await Product.findById(id);

     product.Stock -= quantity;

     await product.save( {
        validateBeforeSave: false
     });
}


// delete Order -- Admin

// update Order Status -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {

  
    const order = await Order.findById(req.params.id);

    if(!order){
        return next( new ErrorHandler("Order not found with this Id",404));
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
    });
});

