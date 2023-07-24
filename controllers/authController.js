import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import orderModel  from "../models/orderModel.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    if (!name) {
      return res.send({
        message: "name is required in authcontroller.js",
      });
    }
    if (!email) {
      return res.send({
        message: "email is required in authcontroller.js",
      });
    }
    if (!password) {
      return res.send({
        message: "password is required in authcontroller.js",
      });
    }
    if (!phone) {
      return res.send({
        message: "phone is required in authcontroller.js",
      });
    }
    if (!address) {
      return res.send({
        message: "address is required in authcontroller.js",
      });
    }
    if (!answer) {
      return res.send({
        message: "Answer is required in authcontroller.js",
      });
    }
    // Existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered please LOGIN",
      });
    }
    // NEW USER
    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "user Resgistered succesfully",
      user,
    });
  } catch (e) {
    
    res.status(500).send({
      success: "failure",
      Message: "error is",
      e,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        message: "Invalid email or password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        message: "Email not Registered ",
      });
    }
    const matchPassword = await comparePassword(password, user.password);
    if (!matchPassword) {
      return res.status(200).send({
        message: "Invalid Password ",
      });
    }
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login Succesfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
   
    res.status(500).send({
      success: false,
      message: "error is",
      error,
    });
  }
};

// FORGOT PASSWORD

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({
        message: "Email is required",
      });
    }
    if (!answer) {
      res.status(400).send({
        message: "Answer is required",
      });
    }
    if (!newPassword) {
      res.status(400).send({
        message: "NewPassword is required",
      });
    }
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });

    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      message: "Error in ForgotPassword",
      error,
    });
  }
};

// TEST CONTROLLER FOR LOGIN

export const testController = (req, res) => {
  res.send("Protected Route");
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, password, phone, address } = req.body;
    const user = await userModel.findById(req.user._id);
    if (password.length!=0 && !password && password.length < 6) {
      return res.json({
        error: "Password should be 6 character long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        address: address || user.address,
        phone: phone || user.phone,
        password: hashedPassword,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};


export const getOrdersController = async(req, res) => {
  try {
    const orders = await orderModel.find({ buyer: req.user._id })
      .populate('products', '-photo')
      .populate("buyer", "name");
   
    res.json(orders);
    
  } catch (error) {
    
    res.status(500).send({
      success: false,
      message: "Error while getting Orders",
      error,
    });
    
  }
}
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name").sort({ createdAt: "-1" })

    res.json(orders);
  } catch (error) {
   
    res.status(500).send({
      success: false,
      message: "Error while getting Orders",
      error,
    });
  }
};

export const orderStatusController = async(req,res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    res.json(order)

  } catch (error) {
   
     res.status(500).send({
      success: false,
      message: "Error while Updating Orders",
      error,
    });
  }
}

export const getAllUsersController = async(req, res) => {
  try {
    const users = await userModel.find({}).populate("name", "email");
    res.json(users);
    
  } catch (error) {
   
    res.status(500).send({
      success: false,
      message: "Error while getting all users",
      error,
    });
    
  }
}




