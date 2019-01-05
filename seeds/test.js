const cities = require("all-the-cities");
const countries = require("./countries");
//
// const res = cities.filter(city => {
//   return city.name.match("Casablanca");
// });
//
// const countries = res.filter(country => {
//   return country.code.match();
// });
//
// console.log(res);

var chapters = [
  {
    lat: "51.509865",
    lng: "-0.118092",
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    facebook: "https://www.facebook.com/COYILondon/",
    twitter: "circleofyi",
    linkedin1: "https://www.linkedin.com/in/timjrheard/",
    linkedin2: "https://www.linkedin.com/in/davidjspears/"
  },
  {
    lat: "37.774929",
    lng: "-122.419418",
    city: "San Francisco",
    country: "United States",
    countryCode: "US",
    facebook: "",
    twitter: "",
    linkedin1: "",
    linkedin2: ""
  },
  {
    lat: "41.8781",
    lng: "-87.6298",
    city: "Chicago",
    country: "United States",
    countryCode: "US",
    facebook: "",
    twitter: "",
    linkedin1: "",
    linkedin2: ""
  },
  {
    lat: "-33.918861	",
    lng: "18.423300",
    city: "Cape Town",
    country: "South Africa",
    countryCode: "ZA",
    facebook: "",
    twitter: "",
    linkedin1: "",
    linkedin2: ""
  },
  {
    lat: "46.204391",
    lng: "6.143158",
    city: "Geneva",
    country: "Switzerland",
    countryCode: "CH",
    facebook: "",
    twitter: "",
    linkedin1: "",
    linkedin2: ""
  },
  // {
  //   lat: "34.05223",
  //   lng: "-118.24368",
  //   city: "Los Angeles",
  //   country: "United States",
  //   countryCode: "USA",
  //   facebook: "",
  //   twitter: "Deshawaustin",
  //   linkedin1: "https://www.linkedin.com/in/justin-deshaw-5574b51a/"
  // },
  {
    lat: "38.90719",
    lng: "-77.03687",
    city: "Washington DC",
    country: "United States",
    countryCode: "USA",
    facebook: "https://www.facebook.com/dccircleofyi/",
    twitter: "JohnBalkam",
    linkedin1: "https://www.linkedin.com/in/johnbalkam/",
    linkedin2: "https://www.linkedin.com/in/achalapatel/"
  },
  {
    lat: "40.71278",
    lng: "-74.00594",
    city: "New York City",
    country: "United States",
    countryCode: "USA",
    facebook: "https://www.facebook.com/COYINYC/",
    twitter: "circleofyi",
    linkedin1: "https://www.linkedin.com/in/hallie-stebbins-76b170133/"
  },
  {
    lat: "42.36008",
    lng: "-71.05888",
    city: "Boston",
    country: "United States",
    countryCode: "USA",
    facebook: "https://www.facebook.com/COYIBoston/",
    twitter: "Alejagrupp ",
    linkedin1: "https://www.linkedin.com/in/alejandra-grupp-5aa7a51a/"
  },
  {
    lat: "40.440624",
    lng: "-79.995888",
    city: "Pittsburgh",
    country: "United States",
    countryCode: "USA",
    facebook: "",
    twitter: "",
    linkedin1: ""
  },
  {
    lat: "19.432608",
    lng: "-99.133209",
    city: "Mexico City",
    country: "Mexico",
    countryCode: "MX",
    facebook: "",
    twitter: "",
    linkedin1: ""
  },
  {
    lat: "47.376888",
    lng: "8.541694",
    city: "Zurich",
    country: "Switzerland",
    countryCode: "CHE",
    facebook: "",
    twitter: "",
    linkedin1: ""
  },
  {
    lat: "-0.100658",
    lng: "-78.718420",
    city: "Quito",
    country: "Ecuador",
    countryCode: "EC",
    facebook: "",
    twitter: "",
    linkedin1: ""
  },
  {
    lat: "-36.848461",
    lng: "174.763336",
    city: "Auckland",
    country: "New Zealand",
    countryCode: "NZ",
    facebook: "",
    twitter: "",
    linkedin1: ""
  },
  {
    lat: "1.352083",
    lng: "103.819839",
    city: "Singapore",
    country: "Singapore",
    countryCode: "SGP",
    facebook: "",
    twitter: "",
    linkedin1: ""
  },
  {
    lat: "53.3498",
    lng: "-6.2603",
    city: "Dublin",
    country: "Republic of Ireland",
    countryCode: "IE",
    facebook: "https://www.facebook.com/COYIdublin/",
    twitter: "circleofyi",
    linkedin1: "https://www.linkedin.com/in/ciara-keane-517b6a56/"
  },
  // {
  //   lat: "52.48624",
  //   lng: "-1.8904",
  //   city: "Birmingham",
  //   country: "United Kingdom",
  //   countryCode: "GB",
  //   facebook: "",
  //   twitter: "Sallyeaves",
  //   linkedin1: "https://www.linkedin.com/in/sally-eaves/"
  // },
  {
    lat: "48.85661",
    lng: "2.35222",
    city: "Paris",
    country: "France",
    countryCode: "FR",
    facebook: "https://www.facebook.com/COYIparis/",
    twitter: "Anna_Donnahie ",
    linkedin1: "https://www.linkedin.com/in/annadonahie/"
  },
  // {
  //   lat: "43.73841",
  //   lng: "7.42461",
  //   city: "Monaco",
  //   country: "France",
  //   countryCode: "FR",
  //   facebook: "",
  //   twitter: "DaraMiller23",
  //   linkedin1: "https://www.linkedin.com/in/dara-mclean-0491563/"
  // },
  {
    lat: "52.37021",
    lng: "4.89516",
    city: "Amsterdam",
    country: "Netherlands",
    countryCode: "NL",
    facebook: "",
    twitter: "TFTWFK",
    linkedin1: "https://www.linkedin.com/in/aouatif-tawfik-mba-2a108a4b/"
  },
  {
    lat: "33.57311",
    lng: "-7.58984",
    city: "Casablanca",
    country: "Morocco",
    countryCode: "MA",
    facebook: "",
    twitter: "G_Vigier",
    linkedin1: "https://www.linkedin.com/in/gvigier/"
  },
  {
    lat: "28.61393",
    lng: "77.20902",
    city: "New Delhi",
    country: "India",
    countryCode: "IN",
    facebook: "https://www.facebook.com/COYIIndia/",
    twitter: "circleofyi",
    linkedin1: "https://www.linkedin.com/in/ashutosh-kumar-9b86686/"
  },
  {
    lat: "1.35208",
    lng: "103.81983",
    city: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    facebook: "https://www.facebook.com/coyisingapore/",
    twitter: "DavidNosibor",
    linkedin1: "https://www.linkedin.com/in/davidnosibor/"
  },
  {
    lat: "-26.2041",
    lng: "28.0473",
    city: "Johannesburg",
    country: "South Africa",
    countryCode: "ZA",
    facebook: "https://www.facebook.com/COYIJoburg/",
    twitter: "https://twitter.com/coyi_jhb",
    linkedin1: "https://www.linkedin.com/in/fabiohenriquez/",
    linkedin2: "https://www.linkedin.com/in/garciahiram/"
  },
  // {
  //   lat: "-33.86881",
  //   lng: "151.20929",
  //   city: "Sydney",
  //   country: "Australia",
  //   countryCode: "AU",
  //   facebook: "https://www.facebook.com/circleofyisydney/",
  //   twitter: "LauriesBrown",
  //   linkedin1: "https://www.linkedin.com/in/lauriesbrown/"
  // },
  {
    lat: "40.44062",
    lng: "-79.99588",
    city: "Pittsburgh",
    country: "United States",
    countryCode: "US",
    facebook: "https://www.facebook.com/COYIPGH/",
    twitter: "meg_trite",
    linkedin1: "https://www.linkedin.com/in/megantrite/"
  },
  {
    lat: "25.2048",
    lng: "55.2708",
    city: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    facebook: "https://www.facebook.com/COYIDXB/",
    twitter: "coyi_dxb",
    linkedin1: "https://www.linkedin.com/in/abdeljalil/",
    linkedin2: "https://www.linkedin.com/in/mohamed-al-moosa-998a764a/"
  },
  {
    lat: "43.70011",
    lng: "-79.4163",
    city: "Toronto",
    country: "Canada",
    countryCode: "CA",
    facebook: "https://www.facebook.com/COYIToronto/",
    twitter: "Nadersaif_ns",
    linkedin1: "https://www.linkedin.com/in/nadersaif/",
    linkedin2: "https://www.linkedin.com/in/kabir-sewani-b6512039/"
  }

  // {
  //   lat: "59.3293",
  //   lng: "18.0686",
  //   city: "Stockholm",
  //   country: "Sweden",
  //   countryCode: "SE",
  //   facebook: "https://www.facebook.com/COYIstockholm/",
  //   twitter: "circleofyi",
  //   linkedin1: "https://www.linkedin.com/in/jacobhlarsson/",
  //   linkedin2: "https://www.linkedin.com/in/jonatan-norman/"
  // },
  // {
  //   lat: "-33.4489",
  //   lng: "-70.6693",
  //   city: "Santiago",
  //   country: "Chile",
  //   countryCode: "CL",
  //   twitter: "crisguerreroa",
  //   facebook:
  //     "https://www.facebook.com/Circle-of-Young-Intrapreneurs-Santiago-161754641086172/",
  //   linkedin1: "https://www.linkedin.com/in/cristianguerreroa/"
  // }
  // {
  //   lat: "50.8503",
  //   lng: "4.3517",
  //   city: "Brussels",
  //   country: "Belgium",
  //   countryCode: "BE",
  //   facebook: "https://www.facebook.com/coyibru/",
  //   twitter: "circleofyi",
  //   linkedin1: "https://www.linkedin.com/in/jason-stamm/",
  //   linkedin2: "https://www.linkedin.com/in/elizabethmwoodward/"
  // }
];

module.exports = chapters;
