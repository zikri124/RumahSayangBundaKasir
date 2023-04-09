var max_fields = 100;
var wrapper = $(".input_fields_wrap");
var doneWrapper = $(".done_fields");
var add_button = $(".add_field_button");
var done_button = $(".done_button");
let i = 0;
let check = true;
let isDeleted = false;
let totalHarga = Number($(".hargaService").val());
let addCharge = 0;
let previousAddCharge = 0;

$(add_button).click(function (e) {
  e.preventDefault();
  var total_fields = wrapper[0].childNodes.length;
  i++;
  if (check && total_fields < max_fields) {
    $(wrapper).append(
      `<div class="card lg:w-96 bg-base-100 shadow-2xl mb-4 w-72" id=${"row" + i}>
         <div class="card-body">
           <div class="card-actions justify-end -mt-6 -mb-8">
             <button class="btn btn-square btn-sm remove_field_button  bg-pink-500 border-none hover:bg-pink-900" onclick=remove(${i}) type="button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             </div>
             <label class="label w-24"> Deskripsi </label>
             <input name=${"chargeDesc" + i} id=${"chargeDesc" + i} type="text" placeholder="Ketik Disini" class="input input-bordered w-full max-w-xs"/>
             <label class="label"> Biaya </label>
             <input name=${"addCharge" + i} id=${"addCharge" + i} type="number" placeholder="Ketik Disini" class="input input-bordered w-full max-w-xs amount"/>
             </div>
      </div>`
    );
  }
});

$(done_button).click(function (e) {
  e.preventDefault();
  var total_fields_done = doneWrapper[0].childNodes.length;
  var sum = Number($(".amount").val());
  let arrTemp = [];
  let totalAddCharge = 0;
  let tempIndex = [];

  if (total_fields_done < 1) {
    $(doneWrapper).append(
      `<input value=${i} name="nCharge" type="text" placeholder="Ketik Disini" class="input hidden input-bordered w-full max-w-xs"/>`,
      `<button class="btn btn-md max-w-md btn-wide mt-4 mr-4 bg-pink-500 border-none hover:bg-pink-900" type="submit">Submit</button>`,
      `<button class="btn btn-md max-w-md btn-wide mt-4 bg-pink-500 border-none hover:bg-pink-900" onClick="window.location.reload();" type="button">Reset</button>`
    );
    for (let j = 1; j <= i; j++) {
      let check = document.getElementById("addCharge" + j);
      if (check) {
        let temp = Number(document.getElementById("addCharge" + j).value);
        if (temp) {
          arrTemp.push(temp);
          tempIndex.push(j);
        }
      }
    }

    for (let k = 0; k < arrTemp.length; k++) {
      totalAddCharge += arrTemp[k];
      $("#chargeDesc" + tempIndex[k]).prop("readonly", true);
      $("#addCharge" + tempIndex[k]).prop("readonly", true);
    }
    $(".total").val(totalHarga + totalAddCharge);

    // if (sum === "undefined" || sum === 0) {
    //   $(".amount").val(0);
    // } else if (isDeleted && sum) {
    //   $(".amount").each(function () {
    //     totalHarga += Number($(this).val());
    //   });
    //   $(".total").val(totalHarga);
    // } else if (isDeleted) {
    //   $(".total").val(totalHarga);
    // }
    check = false;
  }
});

//===== delete the form field row
function remove(index) {
  if (check) {
    let rowToRemove = document.getElementById("row" + index);
    rowToRemove.remove();
  }
}

// function saveValue(index) {
//   let temp = Number(document.getElementById("addCharge" + index).value);
//   previousAddCharge = temp;
// }

// function gantiValue(index) {
//   let temp = Number(document.getElementById("addCharge" + index).value);
//   addCharge += temp;
// }

// $(document).on("change", ".amount", function () {
//   var sum = Number($(".hargaService").val());
//   var amount = Number($(".amount").val());
//   $(".amount").each(function () {
//     sum += Number($(this).val());
//   });
//   $(".total").val(sum);
//   if (amount === 0) {
//     $(".amount").val(0);
//   }
// });
