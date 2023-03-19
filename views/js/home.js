function test() {
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
  document.getElementById("datefield").setAttribute("min", today);
}

$(document).ready(function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var address = urlParams.get("input_address");
  var serviceCare = urlParams.get("serviceCare");
  $("#address-edit").attr("value", address);
  $("#serviceCare-edit").attr("value", serviceCare);
});
