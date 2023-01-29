let dataTime = [];
for (let i = 15; i > 1; i--) {
  var element = document.getElementsByName("totalVisit" + i)[0];
  let value = element.childNodes[0].nodeValue;
  let valueInt = parseInt(value);
  dataTime.push(valueInt);
}

var options = {
  chart: {
    type: "bar",
  },
  colors: ["#EC4899"],
  series: [
    {
      name: "pengunjung",
      data: [dataTime[13] + dataTime[6], dataTime[12] + dataTime[5], dataTime[11] + dataTime[4], dataTime[10] + dataTime[3], dataTime[9] + dataTime[2], dataTime[8] + dataTime[1], dataTime[7] + dataTime[0]],
    },
  ],
  xaxis: {
    categories: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
  },
  yaxis: {
    title: {
      text: "Jumlah Pengunjung",
    },
  },
};

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();
