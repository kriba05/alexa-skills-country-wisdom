/**
 * Created by Balasubramanian Krishnan on 2/1/2018.
 */

const countriesData = require('./countries.json');
const countryCodeMap = require('./countryCodeMap.json');

var fs = require('fs');

const countryAttributes = {};
let alpha = /^[a-zA-Z]+$/i;
countriesData.forEach(country => {
    let altCountryNames = [];
    let countryName = country.name;
    let bracketIndex = countryName.indexOf('(');
    if(bracketIndex !== -1) {
        countryName = countryName.substring(0, bracketIndex).trim();
    }
    if(alpha.test(countryName)) {
        altCountryNames.push(countryName.toLowerCase());
    }

    let altSpellings = country.altSpellings;
    if (altSpellings && altSpellings.length > 0) {
        altSpellings.forEach(altSpelling => {
            if(alpha.test(altSpelling)) {
                altCountryNames.push(altSpelling.toLowerCase());
            }
        });
    }

    let capital = country.capital;
    let callingCodes = country.callingCodes;
    let region = country.region;
    let borders = [];
    country.borders.forEach(border => {
        borders.push(countryCodeMap[border]);
    });

    let currencies = [];
    country.currencies.forEach(curr => {
        currencies.push(curr.name);
    });

    let languages = [];
    country.languages.forEach(language => {
        languages.push(language['name']);
    });

    altCountryNames.forEach(altCountryName => {
        countryAttributes[altCountryName] = {capital, callingCodes, region, borders, currencies, languages, fullCountryName: countryName, altCountryNames};
    });
});

fs.writeFile('countryMap.json', JSON.stringify(countryAttributes, null, 4), 'utf8', function(err) {
    if(err) {
        console.error('Error creating country map file', err);
    } else {
        console.log('Country Map Created Successfully');
    }
});
