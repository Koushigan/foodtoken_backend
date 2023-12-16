const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const joi = require("joi");

const { signInSchema, signUpSchema, validate } = require("../shared/schema");
const db = require("../shared/mongo");

module.exports = {
  async signUp(req, res) {
    try {
      // Request body validation
      const isError = await validate(signUpSchema, req.body);
      if (isError) return res.status(400).json({ message: isError });

      // Check if the user already exists
      let user = await db.users.findOne({ email: req.body.email });
      if (user) return res.status(400).json({ message: "User already exists" });

      // Check if the password and confirm password match
      if (req.body.password !== req.body.cpassword)
        return res.status(400).json({ message: "Password mismatch" });

      // Encrypt the password
      const salt = await bcrypt.genSalt();
      req.body.password = await bcrypt.hash(req.body.password, salt);

      // Remove confirm password before insertion
      delete req.body.cpassword;

      // Insert into users collection
      user = await db.users.insertOne({
        ...req.body,
        active: true,
        createdOn: new Date(),
      });

      res.json({ message: "User signed up successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error in sign up" });
    }
  },

  async signIn(req, res) {
    try {
      // Request body validation
      const isError = await validate(signInSchema, req.body);
      if (isError) return res.status(400).json({ message: isError });

      // Check if the user exists
      let user = await db.users.findOne({ email: req.body.email });

      if (!user) return res.status(401).json({ message: "User does not exist" });
      if (!user.active) return res.status(401).json({ message: "User is inactive" });

      // Check Password
      const isValid = await bcrypt.compare(req.body.password, user.password);

      if (isValid) {
        // Remove password from the response
        delete user.password;

        // Instead of user, we can give only _id: user._id to display to the user
        // Third parameter is token expiry timings
        // const authToken = jwt.sign({_id: user._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        // res.json({ message: "User signed in successfully", authToken });
        res.json({ message: "User signed in successfully" });
      } else {
        res.status(401).json({ message: "Username or password does not match" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error in sign in" });
    }
  },
};
