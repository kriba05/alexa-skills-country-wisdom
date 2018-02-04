/**
 * Created by Balasubramanian Krishnan on 1/30/2018.
 */
const Alexa = require('alexa-sdk');
const countriesData = require('./countryMap.json');

// APP_ID is your skill id which can be found in the Amazon developer console where you create the skill.
const APP_ID = "amzn1.ask.skill.89812b0e-4b91-409f-99b6-b0cae7081fac";

//Skill Messages Constants
const WELCOME_MSG = 'Hello! Ask any country information like, capital, currency, region, languages spoken, or, neighbouring countries of any Country';
const INITAL_RE_PROMPT_MSG = 'Which country information, you would like to know?';
const RE_PROMPT_MSG = 'Need any other country information?';
const GOODBYE_MSG = 'GoodBye, Thanks for using Country Wisdom!';
const HELP_MSG = 'You can ask any country information like capital, currency, region, languages spoken and neighbouring countries of any country. For example, what is the currency of India?, or, what is the capital of USA?';
const GENERIC_ERR_MSG = 'Sorry. I could not fulfill your request.'+ HELP_MSG;

//Country enums
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
            let message = getResponse(this.event, CountryProperty.CAPITAL);
            this.response.speak(message).listen(RE_PROMPT_MSG);
            this.emit(':responseReady');
        } catch (e) {
            console.error('Error occurred', e);
            this.emit(':ask',GENERIC_ERR_MSG,INITAL_RE_PROMPT_MSG);
        }
    },
    'GetCountryCurrencyIntent' : function() {
        try {
            let message = getResponse(this.event, CountryProperty.CURRENCY);
            this.response.speak(message).listen(RE_PROMPT_MSG);
            this.emit(':responseReady');
        } catch (e) {
            console.error('Error occurred', e);
            this.emit(':ask',GENERIC_ERR_MSG,INITAL_RE_PROMPT_MSG);
        }
    },
    'GetCountryRegionIntent' : function() {
        try {
            let message = getResponse(this.event, CountryProperty.REGION);
            this.response.speak(message).listen(RE_PROMPT_MSG);
            this.emit(':responseReady');
        } catch (e) {
            console.error('Error occurred', e);
            this.emit(':ask',GENERIC_ERR_MSG,INITAL_RE_PROMPT_MSG);
        }
    },
    'GetCountryLanguagesIntent' : function() {
        try {
            let message = getResponse(this.event, CountryProperty.LANGUAGES);
            this.response.speak(message).listen(RE_PROMPT_MSG);
            this.emit(':responseReady');
        } catch (e) {
            console.error('Error occurred', e);
            this.emit(':ask',GENERIC_ERR_MSG,INITAL_RE_PROMPT_MSG);
        }
    },
    'GetCountryBordersIntent' : function() {
        try {
            let message = getResponse(this.event, CountryProperty.BORDERS);
            this.response.speak(message).listen(RE_PROMPT_MSG);
            this.emit(':responseReady');
        } catch (e) {
            console.error('Error occurred', e);
            this.emit(':ask',GENERIC_ERR_MSG,INITAL_RE_PROMPT_MSG);
        }
    },
    'GetCountryCallingCodesIntent' : function() {
        try {
            let message = getResponse(this.event, CountryProperty.CALLING_CODES);
            this.response.speak(message).listen(RE_PROMPT_MSG);
            this.emit(':responseReady');
        } catch (e) {
            console.error('Error occurred', e);
            this.emit(':ask',GENERIC_ERR_MSG,INITAL_RE_PROMPT_MSG);
        }
    },
    'NotInterestedIntent' : function() {
        this.emit(':tell',GOODBYE_MSG);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask',HELP_MSG, INITAL_RE_PROMPT_MSG);
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

function getResponse(event, countryProperty) {
    var country = event.request.intent.slots.Country.value.toLowerCase();
    console.log(`country: ${country}`);
    var fullCountryName = getFullCountryName(country);
    console.log(`fullCountryName: ${fullCountryName}`);
    var countryPropertyValue = getCountryProperty(country, countryProperty);
    console.log(`countryProperty: ${countryProperty}`);
    console.log(`countryPropertyValue: ${countryPropertyValue}`);
    var message = buildDefaultMessage(fullCountryName, countryProperty);
    if(countryPropertyValue) {
        message = buildSuccessMessage(fullCountryName, countryProperty, countryPropertyValue);
    }
    console.log('Intent is '+ JSON.stringify(event.request.intent, null, 4));
    console.log('Message is '+ message);
    return message;
}


/*
function sendResponse(event, countryProperty) {
    try {
        var country = event.request.intent.slots.Country.value.toLowerCase();
        var fullCountryName = getFullCountryName(country);
        var countryPropertyValue = getCountryProperty(country, countryProperty);
        var message = buildDefaultMessage(fullCountryName, countryProperty);
        if(countryPropertyValue) {
            message = buildSuccessMessage(fullCountryName, countryProperty, countryPropertyValue);
        }
        console.log('Intent is '+ JSON.stringify(event.request.intent, null, 4));
        console.log('Message is '+ message);
        return message;
    } catch (e) {
        console.error('Error occurred', e);
        obj.emit(':ask','Sorry. I could not fulfill your request.'+ HELP_MSG,'What can I help you with?');
    }
}
*/

function getFullCountryName(countryName) {
    let fullCountryName = countryName;
    if(countriesData[countryName]) {
        fullCountryName = countriesData[countryName].fullCountryName;
    }
    return fullCountryName;
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

function buildDefaultMessage(fullCountryName, countryProperty) {
    let message = "Sorry, could not find "+ countryProperty + " for " + fullCountryName;
    return message;
}

function buildSuccessMessage(fullCountryName, countryProperty, countryPropertyValue) {
    let message = null;
    if(countryProperty === CountryProperty.CAPITAL) {
        message = countryProperty + " of " + fullCountryName + " is " + countryPropertyValue;
    } else if (countryProperty === CountryProperty.LANGUAGES) {
        if(Array.isArray(countryPropertyValue) && countryPropertyValue.length > 1) {
            message =  "Languages spoken in " + fullCountryName + " are " + countryPropertyValue.toString();
        } else {
            message =  "Languages spoken in " + fullCountryName + " is " + countryPropertyValue.toString();
        }
    } else if (countryProperty === CountryProperty.BORDERS) {
        if(Array.isArray(countryPropertyValue) && countryPropertyValue.length > 1) {
            message =  "Neighbouring countries of " + fullCountryName + " are " + countryPropertyValue.toString();
        } else if(Array.isArray(countryPropertyValue) && countryPropertyValue.length === 1){
            message =  "Neighbouring countries of " + fullCountryName + " is " + countryPropertyValue.toString();
        } else if(Array.isArray(countryPropertyValue) && countryPropertyValue.length === 0) {
            message =  "Good Question! There are, no, neighbouring countries for " + fullCountryName + " ." +  fullCountryName + " is surrounded by waters";
        }

    } else if (countryProperty === CountryProperty.CALLING_CODES) {
        if(Array.isArray(countryPropertyValue) && countryPropertyValue.length > 1) {
            message =  "Calling Code for " + fullCountryName + " are " + countryPropertyValue.toString();
        } else {
            message =  "Calling Code for " + fullCountryName + " is " + countryPropertyValue.toString();
        }
    } else if (countryProperty === CountryProperty.REGION) {
        message =  "Region for " + fullCountryName + " is " + countryPropertyValue.toString();
    } else if (countryProperty === CountryProperty.CURRENCY) {
        if(Array.isArray(countryPropertyValue) && countryPropertyValue.length > 1) {
            message =  "Currency for " + fullCountryName + " are " + countryPropertyValue.toString();
        } else {
            message =  "Currency for " + fullCountryName + " is " + countryPropertyValue.toString();
        }
    }
    return message;
}

