
const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

var add = encodeURIComponent(argv.a);

var geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${add}`;

axios.get(geocodeURL).then((response) => {

    if(response.data.status === 'ZERO_RESULTS'){
        throw new Error('Unable to find that address.');
    }
    var lat = response.data.results[0].geometry.location.lat;
    var lon = response.data.results[0].geometry.location.lng;

    var weatherURL = `https://api.darksky.net/forecast/41eb8ba367df3a29486cac42ed89e898/${lat}, ${lon}`;
    console.log(response.data.results[0].formatted_address);

    return axios.get(weatherURL);
}).then((response) => {
    var temperature = response.data.currently.temperature;
    var apparentTemp = response.data.currently.apparentTemperature;
    console.log(`The current temperature is ${temperature}. It feels like ${apparentTemp}.`);
}).catch((e) => {
    if(e.code == 'ENOTFOUND'){
        console.log('unable to connect to API servers.');

    }
    else
    {
        console.log(e.message);
    }
});