/**
 * Created by Balasubramanian Krishnan on 1/30/2018.
 */
const Alexa = require('alexa-sdk');

const countriesData = require('./countryMap.json');

// APP_ID is your skill id which can be found in the Amazon developer console where you create the skill.
const APP_ID = "amzn1.ask.skill.89812b0e-4b91-409f-99b6-b0cae7081fac";

const WELCOME_MSG = 'Hello! Ask any country information like, capital, currency, region, languages spoken, or, neighbouring countries of any Country';
const INITAL_RE_PROMPT_MSG = 'Which country information, you would like to know?';
const RE_PROMPT_MSG = 'Need any other country information?';
const GOODBYE_MSG = 'GoodBye, Thanks for using Country Wisdom!';
const HELP_MSG = 'You can ask any country information like capital, currency, region, languages spoken and neighbouring countries of any country. For example, what is the currency of India?, or, what is the capital of USA?';

const CAPITAL = 'CAPITAL';
const CURRENCY = 'CURRENCY';
const REGION = 'REGION';
const LANGUAGES = 'LANGUAGES';
const BORDERS = 'BORDERS';
const CALLING_CODES = 'CALLING_CODES';
const CountryProperty = {CAPITAL, CURRENCY, REGION, LANGUAGES, BORDERS, CALLING_CODES};

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', WELCOME_MSG, INITAL_RE_PROMPT_MSG);
    },
    'GetCountryCapitalIntent' : function() {
        try {
            var country = this.event.request.intent.slots.Country.value.toLowerCase();
            var fullCountryName = getFullCountryName(country);
            var capital = getCountryProperty(country, CountryProperty.CAPITAL);
            var message = "Sorry. Couldn't find any country with name "+ country;
            if(capital) {
                message = "Capital of "+ fullCountryName + " is " + capital;
            }
            console.log('Message is '+ message);
            this.response.speak(message).listen(RE_PROMPT_MSG);
            this.emit(':responseReady');
        } catch (e) {
            console.error('Error occured during GetCountryCapitalIntent '+ e);
            this.emit(':ask','You can say, What is the capital of France, or, you can say capital of France, or, France Capital','What can I help you with?');
        }
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask',HELP_MSG, INITAL_RE_PROMPT_MSG);
    },
    'NotInterestedIntent' : function() {
        this.emit(':tell',GOODBYE_MSG);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell',GOODBYE_MSG);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell',GOODBYE_MSG);
    },
    "Unhandled": function() {
        this.emit(':ask',HELP_MSG, INITAL_RE_PROMPT_MSG);
    }
}

function getCountryProperty(countryName, propertyName) {
    let countryProperty = null;
    let countryData = countriesData[countryName];
    if(countryData) {
        switch(propertyName) {
            case CountryProperty.CAPITAL:
                countryProperty = countryData.capital;
                break;
            case CountryProperty.CURRENCY:
                countryProperty = countryData.currencies;
                break;
            case CountryProperty.LANGUAGES:
                countryProperty = countryData.languages;
                break;
            case CountryProperty.BORDERS:
                countryProperty = countryData.borders;
                break;
            case CountryProperty.REGION:
                countryProperty = countryData.region;
                break;
            case CountryProperty.CALLING_CODES:
                countryProperty = countryData.callingCodes;
                break;
        }
    }
    return countryProperty;
}

function buildDefaultMessage(countryName, fullCountryName, countryProperty) {
    let message = "";

    return message;
}

function buildSuccessMessage(countryName, fullCountryName, countryProperty, countryPropertyValue) {
    let message = "";

    return message;

}

function getFullCountryName(countryName) {
    let fullCountryName = countryName;
    if(countriesData[countryName]) {
        fullCountryName = countriesData[countryName].fullCountryName;
    }
    return fullCountryName;
}