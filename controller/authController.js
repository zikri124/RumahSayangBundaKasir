const firebase = require("../firebase");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getDoc, doc } = require("firebase/firestore");
const db = firebase.firestore;

module.exports = {
  viewLoginAdmin: (req, res) => {
    return res.render("admin/login");
  },

  processLoginAdmin: async (req, res) => {
    // var auth = getAuth(firebase.app);
    // const email = req.body.email;
    // const password = req.body.password;

    // var uid = "";

    // await signInWithEmailAndPassword(auth, email, password)
    //   .then(async (userCredential) => {
    //     // Signed in
    //     uid = userCredential.user.uid;

    //     const userRef = doc(db, "users", uid);
    //     const userSnap = await getDoc(userRef);

    //     const payload = {
    //       uid: uid,
    //       name: userSnap.data().name
    //     };

    //     const token = await jwt.sign(payload, process.env.JWT_KEY);

    //     return res.cookie("access_token", token).redirect("/");
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     var message = errorMessage;
    //     console.log(errorCode);
    //     if (errorMessage == "Firebase: Error (auth/user-not-found).") {
    //       message = "Email yang dimasukkan salah";
    //     } else if (errorMessage == "Firebase: Error (auth/wrong-password).") {
    //       message = "Password yang dimasukkan salah";
    //     }
    //     return res.status(401).render("admin/login", {
    //       error: true,
    //       message: message
    //     });
    //   });

    const email = req.body.email;
    const password = req.body.password;

    const data = {
      email: email,
      password: password
    };
    const token = "";

    await fetch("https://s8mii5.sse.codesandbox.io/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.text())
      .then((body) => {
        return res.json(body);
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  processLogout: async (req, res) => {
    return res.clearCookie("access_token").status(200).redirect("/signin");
  }
};
