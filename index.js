/**
 * Created by Balasubramanian Krishnan on 1/30/2018.
 */
const Alexa = require('alexa-sdk');
const countriesData = require('./countryMap.json');

// APP_ID is your skill id which can be found in the Amazon developer console where you create the skill.
const APP_ID = "amzn1.ask.skill.89812b0e-4b91-409f-99b6-b0cae7081fac";

//Skill Messages Constants
const SKILL_NAME = 'Country Wisdom';
const WELCOME_MSG = 'Hello! Ask any country information like, capital, currency, region, languages, calling codes, or, neighbours of any Country';
const INITAL_RE_PROMPT_MSG = 'Which country information, you would like to know?';
const RE_PROMPT_MSG = 'Need any country information?';
const GOODBYE_MSG = 'GoodBye, Thanks for using Country Wisdom!';
const HELP_MSG = 'You can ask any country information like, capital, currency, region, languages, calling codes, or, neighbours of any Country. For example, what is the currency of France?, or, what is the capital of USA?';
const GENERIC_ERR_MSG = 'Sorry. I could not fulfill your request.'+ HELP_MSG;


//Country Property enums
const CAPITAL = 'Capital';
const CURRENCY = 'Currency';
const REGION = 'Region';
const LANGUAGES = 'Languages';
const NEIGHBOURS = 'Neighbours';
const CALLING_CODES = 'Calling Codes';
const CountryProperty = {CAPITAL, CURRENCY, REGION, LANGUAGES, NEIGHBOURS, CALLING_CODES};

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.emit(':askWithCard', WELCOME_MSG, INITAL_RE_PROMPT_MSG, SKILL_NAME, WELCOME_MSG, null);
    },
    'GetCountryCapitalIntent' : function() {
        try {
            let message = getResponse(this.event, CountryProperty.CAPITAL);
            this.response.speak(message).listen(RE_PROMPT_MSG);
            this.response.cardRenderer(CountryProperty.CAPITAL, message, null);
            this.emit(':responseReady');
        } catch (e) {
            console.error('Error occurred', e);
            this.emit(':askWithCard',GENERIC_ERR_MSG,INITAL_RE_PROMPT_MSG, SKILL_NAME, WELCOME_MSG, null);
        }
    },
    'GetCountryCurrencyIntent' : function() {
        try {
            let message = getResponse(this.event, CountryProperty.CURRENCY);
            this.response.speak(message).listen(RE_PROMPT_MSG);
            this.response.cardRenderer(CountryProperty.CURRENCY, message, null);
            this.emit(':responseReady');
        } catch (e) {
            console.error('Error occurred', e);
            this.emit(':askWithCard',GENERIC_ERR_MSG,INITAL_RE_PROMPT_MSG, SKILL_NAME, WELCOME_MSG, null);
        }
    },
    'GetCountryRegionIntent' : function() {
        try {
            let message = getResponse(this.event, CountryProperty.REGION);
            this.response.speak(message).listen(RE_PROMPT_MSG);
            this.response.cardRenderer(CountryProperty.REGION, message, null);
            this.emit(':responseReady');
        } catch (e) {
            console.error('Error occurred', e);
            this.emit(':askWithCard',GENERIC_ERR_MSG,INITAL_RE_PROMPT_MSG, SKILL_NAME, WELCOME_MSG, null);
        }
    },
    'GetCountryLanguagesIntent' : function() {
        try {
            let message = getResponse(this.event, CountryProperty.LANGUAGES);
            this.response.speak(message).listen(RE_PROMPT_MSG);
            this.response.cardRenderer(CountryProperty.LANGUAGES, message, null);
            this.emit(':responseReady');
        } catch (e) {
            console.error('Error occurred', e);
            this.emit(':askWithCard',GENERIC_ERR_MSG,INITAL_RE_PROMPT_MSG, SKILL_NAME, WELCOME_MSG, null);
        }
    },
    'GetCountryBordersIntent' : function() {
        try {
            let message = getResponse(this.event, CountryProperty.NEIGHBOURS);
            this.response.speak(message).listen(RE_PROMPT_MSG);
            this.response.cardRenderer(CountryProperty.NEIGHBOURS, message, null);
            this.emit(':responseReady');
        } catch (e) {
            console.error('Error occurred', e);
            this.emit(':askWithCard',GENERIC_ERR_MSG,INITAL_RE_PROMPT_MSG, SKILL_NAME, WELCOME_MSG, null);
        }
    },
    'GetCountryCallingCodesIntent' : function() {
        try {
            let message = getResponse(this.event, CountryProperty.CALLING_CODES);
            this.response.speak(message).listen(RE_PROMPT_MSG);
            this.response.cardRenderer(CountryProperty.CALLING_CODES, message, null);
            this.emit(':responseReady');
        } catch (e) {
            console.error('Error occurred', e);
            this.emit(':askWithCard',GENERIC_ERR_MSG,INITAL_RE_PROMPT_MSG, SKILL_NAME, WELCOME_MSG, null);
        }
    },
    'NotInterestedIntent' : function() {
        this.emit(':tellWithCard',GOODBYE_MSG, SKILL_NAME, GOODBYE_MSG, null);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':askWithCard',HELP_MSG, INITAL_RE_PROMPT_MSG, SKILL_NAME, HELP_MSG, null);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tellWithCard',GOODBYE_MSG, SKILL_NAME, GOODBYE_MSG, null);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tellWithCard',GOODBYE_MSG, SKILL_NAME, GOODBYE_MSG, null);
    },
    "Unhandled": function() {
        this.emit(':askWithCard',HELP_MSG, INITAL_RE_PROMPT_MSG, SKILL_NAME, HELP_MSG, null);
    }
}

function getResponse(event, countryProperty) {
    var country = event.request.intent.slots.Country.value.toLowerCase();
    console.log(`Attribute ${countryProperty} requested for country: ${country}`);
    var fullCountryName = getFullCountryName(country);
    console.log(`fullCountryName: ${fullCountryName}`);
    var countryPropertyValue = getCountryProperty(country, countryProperty);
    console.log(`${countryProperty} of ${fullCountryName} is ${countryPropertyValue}`);
    var message = null;
    if(countryPropertyValue) {
        message = buildSuccessMessage(fullCountryName, countryProperty, countryPropertyValue);
    } else {
        message = buildDefaultMessage(country);
    }
    console.log('Intent is '+ JSON.stringify(event.request.intent, null, 4));
    console.log('Message is '+ message);
    return message;
}

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
            case CountryProperty.NEIGHBOURS:
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

function buildDefaultMessage(country) {
    let message = `Sorry, ${country} is not recognized as a valid Country. Please try again.`;
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
    } else if (countryProperty === CountryProperty.NEIGHBOURS) {
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

