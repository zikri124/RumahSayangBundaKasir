const firebase = require("../firebase");
const db = firebase.firestore;
const {
  doc,
  getDoc,
  Timestamp
} = require("firebase/firestore");

function checkEmpty(json) {
  let contains = false;
  let keyValue = ""
  Object.keys(json).some(key => {
    if (typeof json[key] === 'object') {
      let returnData = checkEmpty(json[key])
      contains = returnData.contains
      if (contains) {
        keyValue = returnData.value
      }
    } else {
      contains = json[key] === undefined || json[key] === ""
      if (contains) {
        keyValue = key
      }
    }

    if (contains) {
      const returnValue = {
        contains: contains,
        value: keyValue
      }
      return returnValue;
    }
  });
  
  const returnValue = {
    contains: contains,
    value: keyValue
  }
  return returnValue;
}

module.exports = {
  getACustomerData: async (customerId) => {
    const customerRef = doc(db, "customers", customerId);
    const customerSnap = await getDoc(customerRef);

    if (!customerSnap.exists()) {
      return "No Document Found";
    }

    return customerSnap.data();
  },

  getCurrentDate: () => {
    const dateClass = Timestamp.now().toDate()
    dateClass.setTime(dateClass.getTime() + (07 * 60 * 60 * 1000))
    let month = dateClass.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let date = dateClass.getDate();
    if (date < 10) {
      date = "0" + date;
    }

    const dateNow = dateClass.getFullYear() + "-" + month + "-" + date;

    console.log(dateNow)
    console.log((dateClass.getHours()) + ":" + dateClass.getMinutes() + ":" + dateClass.getSeconds())

    return {
      string: dateNow,
      year: dateClass.getFullYear(),
      month: month,
      date: date,
      hour: dateClass.getHours(),
      minute: dateClass.getMinutes(),
      second: dateClass.getSeconds(),
      class: dateClass
    }
  },

  getAge: (customerDOB) => {
    const date = Timestamp.now().toDate()
    date.setTime(date.getTime() + (07 * 60 * 60 * 1000))
    const dateToCalculate = new Date(customerDOB);

    var month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let d1 = dateToCalculate.getDate();
    let d2 = date.getDate();
    let m1 = dateToCalculate.getMonth();
    let m2 = date.getMonth();
    let y1 = dateToCalculate.getFullYear();
    let y2 = date.getFullYear();

    if (d1 > d2) {
      d2 = d2 + month[m2 - 1];
      m2 = m2 - 1;
    }
    if (m1 > m2) {
      m2 = m2 + 12;
      y2 = y2 - 1;
    }
    const d = d2 - d1;
    const m = m2 - m1;
    const y = y2 - y1;

    let age = "";

    if (y > 0) {
      age += y + " tahun";
    }
    if (m > 0) {
      if (age == "") {
        age += m + " bulan";
      } else {
        age += ", " + m + " bulan";
      }
    }
    if (d > 0) {
      if (age == "") {
        age += d + " hari";
      } else {
        age += ", " + d + " hari";
      }
    }
    if (age == "") {
      age = "0 hari"
    }

    return age;
  },

  checkFormatNumWa: (numberWa) => {
    let numWa

    if (numberWa.startsWith("08")) {
      numWa = "62" + numberWa.slice(1, numberWa.length)
      return numWa
    } else {
      return numberWa
    }
  },

  checkEmpty
};