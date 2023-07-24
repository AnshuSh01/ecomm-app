import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";
import categoryModel from "../models/categoryModel.js";
import braintree from "braintree";
import dotenv from "dotenv";
import orderModel from "../models/orderModel.js";

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // validation
    switch (true) {
      case !name:
        return res.status(500).send({
          error: "Name is required in productcontroller",
        });
      case !description:
        return res.status(500).send({
          error: "description is required in productcontroller",
        });
      case !price:
        return res.status(500).send({
          error: "price is required in productcontroller",
        });
      case !category:
        return res.status(500).send({
          error: "category is required in productcontroller",
        });
      case !quantity:
        return res.status(500).send({
          error: "quantity is required in productcontroller",
        });
      case photo && photo.size > 1000000:
        return res.status(500).send({
          error:
            "Photo is required and should be less than 1 MB in productcontroller",
        });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Succesfully",
      products,
    });
  } catch (error) {
  
    res.status(500).send({
      success: false,
      message: "Error in createproductcontroller",
      error,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      Totol_Products: products.length,
      message: "All Products ",
      products,
    });
  } catch (error) {
   
    res.status(500).send({
      success: false,
      message: "Error in getting Products",
      error,
    });
  }
};
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Getting Single Product Successfully ",
      product,
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      message: "Error in getting Single Products in ProductController",
      error,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
 
    res.status(500).send({
      success: false,
      message: "Error in getting Product Photo in ProductController",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel
      .findByIdAndDelete(req.params.pid)
      .select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
      product,
    });
  } catch (error) {
  
    res.status(500).send({
      success: false,
      message: "Error in deleting Product Photo in ProductController",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // validation
    switch (true) {
      case !name:
        return res.status(500).send({
          error: "Name is required in productcontroller",
        });
      case !description:
        return res.status(500).send({
          error: "description is required in productcontroller",
        });
      case !price:
        return res.status(500).send({
          error: "price is required in productcontroller",
        });
      case !category:
        return res.status(500).send({
          error: "category is required in productcontroller",
        });
      case !quantity:
        return res.status(500).send({
          error: "quantity is required in productcontroller",
        });
      case photo && photo.size > 1000000:
        return res.status(500).send({
          error:
            "Photo is required and should be less than 1 MB in productcontroller",
        });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Succesfully",
      products,
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      message: "Error in Updating Product in ProductController",
      error,
    });
  }
};

export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
   
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// count products

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      message: "Successfully getting Product Count",
      total,
    });
  } catch (error) {
  
    res.status(400).send({
      success: false,
      message: "Error in count product controller",
    });
  }
};

export const productListController = async (req, res) => {
  try {
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;

    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
   
    res.status(400).send({
      success: false,
      message: "Error in Per Page controller",
    });
  }
};

// search prod

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } }, // i means case sensitive handling
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
   
    res.status(400).send({
      success: false,
      message: "Error while Searching Product",
    });
  }
};

export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid }, //  not include pid if we already show that product
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
   
    res.status(400).send({
      success: false,
      message: "Error while getting relating Product",
    });
  }
};


// get product by category

export const productCategoryController = async(req,res) => {
  try {
    const category = await categoryModel.findOne({slug:req.params.slug});
    const product = await productModel.find({ category }).populate("category")
    res.status(200).send({
      success: true,
      category,
      product
    })

  } catch (error) {
   
    res.status(400).send({
      success: false,
      message: "Error while getting Product by category ",
    });
  }
}


//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
     res.status(400).send({
       success: false,
       message: "Error while payment braintree token   ",
     });
  }
};

//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
     res.status(400).send({
       success: false,
       message: "Error while braintree payment ",
     });
  }
};
