$(document).ready(function () {
  var submit_button = $(".submit_button");
  var check = true;
  var wrapper = $(".back_fields_wrap");

  $(submit_button).click(function () {
    if (check) {
      $(wrapper).append(
        `<a href="/" class="">
         <button class="btn btn-outline border-pink-500 w-[17.4rem] hover:bg-pink-500 hover:border-none">kembali ke dashboard </button>
       </a>`
      );
      check = false;
    }
  });
});
