import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  getAllUsersController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";


//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//protected Admin route auth
router.get("/admin-auth",requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// update user profile

router.put('/profile', requireSignIn, updateProfileController);

// get orders- for USER

router.get('/orders', requireSignIn, getOrdersController)

// Get All Users orders for ADMIN

router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);

// Order STATUS update

router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController);

// get all users

router.get('/users', requireSignIn, isAdmin, getAllUsersController);

export default router;
