const firebase = require("../firebase");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getDoc, doc } = require("firebase/firestore");
const db = firebase.firestore;

const apiUrl = process.env.apiURL

module.exports = {
  viewLoginAdmin: (req, res) => {
    return res.render("admin/login");
  },

  processLoginAdmin: async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const data = {
      email: email,
      password: password
    };

    await fetch(apiUrl + "/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((body) => {
        if(body.success == true) {
          const token = body.token
          return res.cookie("access_token", token).redirect("/");
        } else {
          res.redirect("/auth/signin")
        }
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  processLogout: async (req, res) => {
    return res.clearCookie("access_token").status(200).redirect("/auth/signin");
  }
};
