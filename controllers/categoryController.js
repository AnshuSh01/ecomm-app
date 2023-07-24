import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        message: "Name is required in category controller",
      });
    }
    
      const existingCategory = await categoryModel.findOne({ name });
      
    if (existingCategory) {
      return res.status(401).send({
        message: "Category is already Exist in category controller",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
      res.status(201).send({
          success: true,
          message: "Category Created Successfully",
          category
      })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in category controller",
      error,
    });
  }
};
export const updateCategoryController = async(req,res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category= await categoryModel.findByIdAndUpdate(id, {name, slug:slugify(name)}, {new:true})
    res.status(200).send({
      success: true,
      message:"Category Updated Succesfully",category
    })
  } catch (error) {
   
    res.status(500).send({
      success: false,
      message:"Error in update Category", error
    })
    
  }
  
}

// get all category
export const categoryController =  async( req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message:"All Categories",category
    })

  } catch (error) {
    
    res.status(500).send({
      success: false,
      message:"Error in getting all category",error
    })
    
  }
}

// Single cat

export const singleCategoryController = async (req,res) => {
  try {
    const { slug } = req.params;
    const category = await categoryModel.findOne({ slug: slug })
    res.status(200).send({
      success: true,
      message:"Successfully get single Category",category
    })
  } catch (error) {
  
    res.status(500).send({
      success: false,
      message:"Error in SingleCategory",error
    })
    
  }
}

// delte cat

export const deleteCategoryController = async (req,res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
      category,
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      message: "Error in deleteCategory",
      error,
    });
    
  }
}