// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     cartData: { type: Object, default: {} }
// }, { minimize: false })

// // minimize false isliya kara cartdata default hum ny empty obj kara hai _  jab new user create hoga tou empty ki waja sy cartdata nhi ata false kar diya ab ajaya ga 

// const userModel = mongoose.models.user || mongoose.model('user',userSchema);

// export default userModel


import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
        "Please provide a valid email address"
      ]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      validate: {
        validator: function (value) {
          return /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
        },
        message: "Password must include at least one uppercase letter, one lowercase letter, and one number"
      }
    },
    cartData: {
      type: Object,
      default: {}
    }
  },
  { minimize: false }
);

// minimize false ensures that empty objects are not removed from the cartData field.

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;