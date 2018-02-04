/**
 * Created by Balasubramanian Krishnan on 2/3/2018.
 */

const countriesData = require('./countries.json');
var fs = require('fs');

const countryCodeMap = {};
countriesData.forEach(countryData => {
    let countryCode =  countryData.alpha3Code;
    let countryName = countryData.name;
    let bracketIndex = countryName.indexOf('(');
    if(bracketIndex !== -1) {
        countryName = countryName.substring(0, bracketIndex).trim();
    }

    countryCodeMap[countryCode] = countryName;
});

fs.writeFile('countryCodeMap.json', JSON.stringify(countryCodeMap, null, 4), 'utf8', function(err) {
    if(err) {
        console.error('Error creating country code map file', err);
    } else {
        console.log('Country Code Map Created successfully');
    }
});
