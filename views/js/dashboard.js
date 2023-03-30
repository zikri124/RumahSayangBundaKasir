$("document").ready(function () {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  today = yyyy + "-" + mm + "-" + dd;
  document.getElementById("date-reservasi").setAttribute("value", today);
});

function getval(value, data) {
  console.log(value.value);
  console.log(data[0].id);
  // const data1 = {
  //   data: [
  //     {
  //       id: "One",
  //       name: "ZZ",
  //     },
  //     {
  //       id: "Two",
  //       name: "ZZ2",
  //     },
  //   ],
  // };

  // data1.data.forEach((element) => {
  //   if (element.id === sel.value) {
  //     const item = document.getElementById("name");
  //     item.value = element.name;
  //   }
  // });
}
