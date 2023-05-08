/* ---------------------------------------------- */
/*            CODE EXPLAINED TUTORIALS            */
/*         www.youtube.com/CodeExplained          */
/* ---------------------------------------------- */

// SELECT ALL ELEMENTS
const country_name_element = document.querySelector(".country .name");
const total_cases_element = document.querySelector(".total-cases .value");
const new_cases_element = document.querySelector(".total-cases .new-value");
const recovered_element = document.querySelector(".recovered .value");
const new_recovered_element = document.querySelector(".recovered .new-value");
const deaths_element = document.querySelector(".deaths .value");
const new_deaths_element = document.querySelector(".deaths .new-value");

const ctx = document.getElementById("axes_line_chart").getContext("2d");

// APP VARIABLES
let app_data = [],
  cases_list = [],
  recovered_list = [],
  deaths_list = [],
  deaths = [],
  formattedDates = [];

// GET USERS COUNTRY CODE
fetch(
  "https://api.ipgeolocation.io/ipgeo?apiKey=14c7928d2aef416287e034ee91cd360d"
)
  .then(res => {
    return res.json();
  })
  .then(data => {
    let country_code = data.country_code2;
    let user_country;
    country_list.forEach(country => {
      if (country.code == country_code) {
        user_country = country.name;
      }
    });
    fetchData(user_country);
  });

function fetchData(country) {
  user_country = country;
  country_name_element.innerHTML = "Loading...";

  (cases_list = []),
    (recovered_list = []),
    (deaths_list = []),
    (dates = []),
    (formattedDates = []);

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const api_fetch = async country => {
    await fetch(
      "https://api.covid19api.com/total/country/" +
        country +
        "/status/confirmed",
      requestOptions
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        data.forEach(entry => {
          dates.push(entry.Date);
          //   console.log(`Cases : ${entry.Cases}`);
          cases_list.push(entry.Cases);
        });
      });

    await fetch(
      "https://api.covid19api.com/total/country/" +
        country +
        "/status/recovered",
      requestOptions
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        data.forEach((entry, index) => {
          //   console.log(`Recovered : ${entry.Cases}`);
          //   if (entry.Cases == 30974748) alert(index);
          recovered_list.push(entry.Cases);
        });
      });

    await fetch(
      "https://api.covid19api.com/total/country/" + country + "/status/deaths",
      requestOptions
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        data.forEach(entry => {
          //   console.log(`Deaths : ${entry.Cases}`);
          deaths_list.push(entry.Cases);
        });
      });

    updateUI();
  };

  api_fetch(country);
}

// UPDATE UI FUNCTION
function updateUI() {
  updateStats();
  axesLinearChart();
}

function updateStats() {
  console.log(`Recovered list : ${recovered_list}`);
  const total_cases = cases_list[cases_list.length - 1];
  const new_confirmed_cases = total_cases - cases_list[cases_list.length - 2];

  //   const total_recovered = recovered_list[560]; // access older values as no recent cases are reported
  const total_recovered = recovered_list[recovered_list.length - 1]; // access older values as no recent cases are reported

  const new_recovered_cases =
    total_recovered - recovered_list[recovered_list.length - 2];

  const total_deaths = deaths_list[deaths_list.length - 1];
  const new_deaths_cases = total_deaths - deaths_list[deaths_list.length - 2];

  country_name_element.innerHTML = user_country;
  total_cases_element.innerHTML = total_cases;
  new_cases_element.innerHTML = `+${new_confirmed_cases}`;
  recovered_element.innerHTML = total_recovered;

  new_recovered_element.innerHTML = `+${new_recovered_cases}`;
  deaths_element.innerHTML = total_deaths;
  new_deaths_element.innerHTML = `+${new_deaths_cases}`;

  // format dates
  dates.forEach(date => {
    formattedDates.push(formatDate(date));
  });
}

// UPDATE CHART
let my_chart;
function axesLinearChart() {
  if (my_chart) {
    my_chart.destroy();
  }

  my_chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Cases",
          data: cases_list,
          fill: false,
          borderColor: "#FFF",
          backgroundColor: "#FFF",
          borderWidth: 1,
        },
        {
          label: "Recovered",
          data: recovered_list,
          fill: false,
          borderColor: "rgba(0,255,0)",
          backgroundColor: "rgba(0,255,0)",
          borderWidth: 1,
        },
        {
          label: "Deaths",
          data: deaths_list,
          fill: false,
          borderColor: "#f44336",
          backgroundColor: "#f44336",
          borderWidth: 1,
        },
      ],
      labels: formattedDates,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// FORMAT DATES
const monthsNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(dateString) {
  let date = new Date(dateString);

  return `${date.getDate()} ${monthsNames[date.getMonth()]}`;
}
