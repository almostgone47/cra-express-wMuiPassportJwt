const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");

// Load input validations
const validateRegisterInput = require("../validation/register");
const validateEditUserInput = require("../validation/editUser");
const validateLoginInput = require("../validation/login");
const validatePasswordInput = require("../validation/password");

// Load User model
const User = require("../models/User");

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// ////////////////////////////////////
// @route   GET api/users/test
// @desc    Tests users route
// @access  Private
router.get("/test", (req, res) => res.json({ msg: "Users works" }));

// ////////////////////////////////////
// @route   POST api/users/register
// @desc    Register user
// @access  Private
router.post("/register", (req, res) => {
  // Only admin register a new user account
  // if (req.user.userType !== "admin") {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }

  // Validate registration
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json("server validation errors", errors);
  }

  User.findOne({ email: req.body.email.toLowerCase() }).then((user) => {
    // Check to see if the email already exists in the database
    if (user) {
      return res.status(400).json({ msg: "Username already exists" });
    } else {
      // Create new user of model User
      const newUser = new User({
        firstName: capitalizeFirstLetter(req.body.firstName.trim()),
        lastName: capitalizeFirstLetter(req.body.lastName.trim()),
        businessName: capitalizeFirstLetter(req.body.businessName.trim()),
        email: req.body.email.trim().toLowerCase(),
        password: req.body.password, // This will be a hash
      });

      // Generate hash for password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              const payload = {
                id: user.id,
                email: user.email,
                userType: user.userType,
                firstName: user.firstName,
                lastName: user.lastName,
                businessName: user.businessName,
                date: user.date,
              };

              jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: 3600 },
                (err, token) => {
                  res.status(200).json({
                    jwtToken: "Bearer " + token,
                    user: payload,
                  });
                }
              );
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// ////////////////////////////////////
// @route   POST api/users/edit
// @desc    Edit user
// @access  Private
router.post(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Only admin can access
    if (req.user.userType !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Validate registration
    const { errors, isValid } = validateEditUserInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const userEdits = {};

    userEdits.userType = req.body.userType;
    userEdits.firstName = req.body.firstName;
    userEdits.lastName = req.body.lastName;
    userEdits.email = req.body.email.toLowerCase();
    userEdits.contact = req.body.contact;
    userEdits.isActive = req.body.isActive;

    User.findOneAndUpdate(
      { username: req.body.username },
      { $set: userEdits },
      { new: true }
    ).then((user) => {
      res.json(user);
    });
  }
);

// ////////////////////////////////////
// @route   POST api/users/password
// @desc    Change user password
// @access  Private
router.post(
  "/password",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Only admin can access
    if (req.user.userType !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Validate registration
    const { errors, isValid } = validatePasswordInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    User.findOne({ userName_lower: req.body.username.toLowerCase() }).then(
      (user) => {
        if (!user) {
          return res.status(400).json({ userNotFound: "User not found" });
        }

        const userEdits = {};
        userEdits.password = req.body.password;

        // Generate hash for password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(userEdits.password, salt, (err, hash) => {
            if (err) throw err;
            userEdits.password = hash;

            User.findOneAndUpdate(
              { username: req.body.username },
              { $set: userEdits },
              { new: true }
            ).then((log) => {
              res.json({ reply: "Change password success" });
            });
          });
        });
      }
    );
  }
);

// ////////////////////////////////////
// @route   POST api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Valid login
  const { errors, isValid } = validateLoginInput(req.body);
  console.log("login - validateLoginInput: ", errors, isValid);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Find user by username
  User.findOne({ email: email })
    .then((user) => {
      // Check for user
      if (!user || user.isActive === false) {
        errors.email = "Email not found";
        return res.status(404).json(errors);
      }

      // Check password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // User matched, create JWT Payload
          const payload = {
            id: user.id,
            email: user.email,
            userType: user.userType,
            firstName: user.firstName,
            lastName: user.lastName,
            businessName: user.businessName,
            date: user.date,
          };

          // Sign token (expires in 1 hour or 3600 seconds)
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                jwtToken: "Bearer " + token,
                user: payload,
              });
            }
          );
        } else {
          errors.password = "Incorrect login information";
          return res.status(400).json(errors);
        }
      });
    })
    .catch((err) => {
      errors.password = "Network error";

      res.status(404).json(errors);
    });
});

// ////////////////////////////////////
// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      username: req.user.username,
      userType: req.user.userType,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      date: req.user.date,
    });
  }
);

// ////////////////////////////////////
// @route   GET api/users/all
// @desc    Get all users
// @access  Private (admin)
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Only admin register a new user account
    if (req.user.userType !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const errors = {};

    User.find()
      .select("-password")
      .where("username")
      .nin(["pfesadmin"])
      .sort({ date: -1 })
      .then((users) => {
        if (!users) {
          errors.noUsers = "There are no users";

          return res.status(404).json(errors);
        }
        res.json(users);
      })
      .catch((err) => res.status(404).json({ profile: "There are no users" }));
  }
);

module.exports = router;
