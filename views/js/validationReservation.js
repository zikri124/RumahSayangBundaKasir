$(document).ready(function () {
  $("#form").validate({
    rules: {
      wa: {
        number: true,
      },
    },
    messages: {
      name: {
        required: "Anda harus mengisi form ini",
      },
      wa: {
        required: "Anda harus mengisi form ini",
      },
      sex: {
        required: "Anda harus mengisi form ini",
      },
      dateOfBirth: {
        required: "Anda harus mengisi form ini",
      },
    },
  });
});
