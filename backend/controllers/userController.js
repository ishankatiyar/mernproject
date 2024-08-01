const ErrorHandler = require("../utils/errorhandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const User = require("../models/userModel.js");
const sendToken = require("../utils/jwtToken.js");
const sendEmail = require("../utils/sendEmail.js")
const crypto =require("crypto")
const cloudinary = require("cloudinary")


// Register a User
exports.registerUser = catchAsyncErrors(async(req,res,next) => {
    const {name,email,password} = req.body;
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    })

    sendToken(user, 201 , res);
}) 



//Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Checking if user has given password and email both
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
});




// Logout User
exports.logout = catchAsyncErrors( async(req,res,next) => {

    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200)
    .json({
        success:true,
        message: "Logged Out",
    });
})


// Forgot Password
exports.forgotPassword =  catchAsyncErrors( async (req,res,next) => {
    const user = await User.findOne({email : req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found", 404));
    }

    //Get ResetPassword Token
   const resetToken =  user.getResetPasswordToken();

   await user.save({validateBeforeSave: false}); // to save the resetPasswordToken created


   const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`


   const message = 'Your password reset token is :- \n\n ${resetPasswordUrl} If You have not requested this email then, please ignore it';

   try {

    await sendEmail({
        email : user.email,
        subject: 'Ecoomerce Password Recovery',
        message
    });

    res
    .status(200)
    .json({
        success: true,
        message: `Email sent to ${user.email} successfully`
    })
    
   } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save({validateBeforeSave: false});

    return next(new ErrorHandler(error.message, 500));
   } 

})


exports.resetPassword = catchAsyncErrors( async (req,res,next) => {

    // creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : {$gt: Date.now() },
    });

    if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 400)
        )
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 400))
    }


    user.password = req.body.password;

    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    sendToken(user,200,res);
})



// Get User Detail 
exports.getUserDetails = catchAsyncErrors(async(req,res,next) => {

    const user = await User.findById(req.user.id);

    res
    .status(200)
    .json({
        success: true,
        user,
    })
})




// Get User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    // Find user by ID and include password in the selection
    const user = await User.findById(req.user.id).select("+password");

    // Check if the old password matches the current password
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    // Check if new password and confirm password match
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password doesn't match", 400));
    }

    // Update password
    user.password = req.body.newPassword;
    await user.save();

    // Send token
    sendToken(user, 200, res);
});






// Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };


    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
    
        const imageId = user.avatar.public_id;
    
        await cloudinary.v2.uploader.destroy(imageId);
    
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
    
        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

    const user = await User.findByIdAndUpdate(req.user.id,
         newUserData,
          {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })


    res.status(200)
    .json({
    success: true,     
    })

});



// Get all Users(admin)
exports.getAllUser = catchAsyncErrors ( async (req,res,next) => {
    const users = await User.find();

    
    res.status(200)
    .json({
        success: true,
        users,
    });
})


// Get single user (admin)
exports.getSingleUser = catchAsyncErrors ( async (req,res,next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(
            new ErrorHandler(`User does not exist with id: ${req.params.id}`)
        );
    }

    res.status(200)
    .json({
        success: true,
        user,
    });
})




// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };
    

    const user = await User.findByIdAndUpdate(req.user.id,
         newUserData,
          {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })


    res.status(200)
    .json({
    success: true,     
    })

});


// Delete User -- Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});
