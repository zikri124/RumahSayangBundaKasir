$(document).ready(function () {
  $("#form").validate({
    rules: {
      wa: {
        number: true,
      },
      no_hp: {
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
      input_dob: {
        required: "Anda harus mengisi form ini",
      },
      input_address: {
        required: "Anda harus mengisi form ini",
      },
      input_name: {
        required: "Anda harus mengisi form ini",
      },
      input_time: {
        required: "Anda harus mengisi form ini",
      },
      keluhan: {
        required: "Anda harus mengisi form ini",
      },
      no_hp: {
        required: "Anda harus mengisi form ini",
      },
    },
  });
});

$(document).ready(function () {
  $("#form-2").validate({
    messages: {
      date: {
        required: "Anda harus mengisi form ini",
      },
      serviceId: {
        required: "Anda harus mengisi form ini",
      },
      serviceCare: {
        required: "Anda harus mengisi form ini",
      },
    },
  });
});
