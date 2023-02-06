let dataVisit = [];
for (let i = 15; i > 1; i--) {
  var element = document.getElementsByName("totalVisit" + i)[0];
  let valueTotalVisit = element.childNodes[0].nodeValue;
  let valueInt = parseInt(valueTotalVisit);
  dataVisit.push(valueInt);
}

let dataDay = [];
let dataDate = [];
for (let i = 15; i > 1; i--) {
  var element = document.getElementsByName("date" + i)[0];
  let value = element.childNodes[0].nodeValue;
  let valueDayString = getDayName(value);
  let valueDateString = getDate(value);
  dataDate.push(valueDateString);
  dataDay.push(valueDayString);
}

function getDayName(dateStr) {
  var date = new Date(dateStr);
  return date.toLocaleDateString("in-IN", { weekday: "long" });
}

function getDate(dateStr) {
  var date = new Date(dateStr);
  return date.getDate();
}

var options = {
  chart: {
    type: "bar",
  },
  colors: ["#EC4899"],
  series: [
    {
      name: "pengunjung",
      data: [dataVisit[13], dataVisit[12], dataVisit[11], dataVisit[10], dataVisit[9], dataVisit[8], dataVisit[7], dataVisit[6], dataVisit[5], dataVisit[4], dataVisit[3], dataVisit[2], dataVisit[1], dataVisit[0]],
    },
  ],
  xaxis: {
    categories: [
      dataDay[13] + " " + dataDate[13],
      dataDay[12] + " " + dataDate[12],
      dataDay[11] + " " + dataDate[11],
      dataDay[10] + " " + dataDate[10],
      dataDay[9] + " " + dataDate[9],
      dataDay[8] + " " + dataDate[8],
      dataDay[7] + " " + dataDate[7],
      dataDay[6] + " " + dataDate[6],
      dataDay[5] + " " + dataDate[5],
      dataDay[4] + " " + dataDate[4],
      dataDay[3] + " " + dataDate[3],
      dataDay[2] + " " + dataDate[2],
      dataDay[1] + " " + dataDate[1],
      dataDay[0] + " " + dataDate[0],
    ],
  },
  yaxis: {
    title: {
      text: "Jumlah Pengunjung",
    },
  },
};

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();
