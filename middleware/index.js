require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;
//const firebase = require("../firebase");
//const db = firebase.firestore;
//const { collection, query, getDocs } = require("firebase/firestore");

module.exports = {
  checkAuth: async (req, res, next) => {
    let cookies = {};
    let cookiesArray;

    try {
      cookiesArray = req.headers.cookie.split(";");
    } catch (error) {
      return res.status(403).redirect("/auth/signin");
    }

    cookiesArray.forEach((cookie) => {
      const [key, value] = cookie.trim().split("=");
      cookies[key] = value;
    });

    if (!cookies["access_token"]) {
      const err = new Error("Login first");
      console.log(err);
      return res.status(403).redirect("/auth/signin");
    }
    const token = cookies["access_token"];
    try {
      const payload = await jwt.verify(token, JWT_KEY);
      if (payload) {
        req.user = payload;
        req.token = token;
        next();
      } else {
        return res.status(403).redirect("/auth/signin");
      }
    } catch (err) {
      res.status(500);
      next(err);
    }
  }
};

//https://codesandbox.io/s/web-sandi-yang-berhasil-1-dblxn9?file=/views/admin/login.pug:390-394
