const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAllI9psf8UAYkuPQkqAiOa3upuvDcdHGE",
  authDomain: "rumahsayangbunda-84bfb.firebaseapp.com",
  projectId: "rumahsayangbunda-84bfb",
  storageBucket: "rumahsayangbunda-84bfb.appspot.com",
  messagingSenderId: "104394435950",
  appId: "1:104394435950:web:d642aba91e74d7f3ec657f",
  measurementId: "G-894JBQC0NH"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

module.exports = {
  app,
  firestore
};
