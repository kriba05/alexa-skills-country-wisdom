/**
 * Created by bitzb on 1/30/2018.
 */

const Alexa = require('alexa-sdk');

const countriesData = require('./countries.json');

var countryCapitalMap = {};

const APP_ID = "amzn1.ask.skill.89812b0e-4b91-409f-99b6-b0cae7081fac"; // APP_ID is your skill id which can be found in the Amazon developer console where you create the skill.
//My ARN: arn:aws:lambda:us-east-1:283850061414:function:countrywisdom

exports.handler = function(event, context, callback) {
    init();
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask','Hello Abirami, Shakthi and Nethra! Which Country Capital you would like to know?','Which Country Capital you would like to know?');
    },
    'GetCountryCapitalIntent' : function() {
        try {
            var country = this.event.request.intent.slots.Country.value;
            console.log('Country is '+ country);
            var capital = getCapital(country);
            console.log('Capital is '+ capital);
            var message = "Sorry. Couldn't find any country with name "+ country;
            if(capital) {
                message = "Capital of "+ country + " is " + capital;
            }
            this.emit(':ask',message,'Do you want to know capital of any other Country?');
        } catch (e) {
            this.emit(':ask','You can say, What is the capital of France, or, you can say capital of France, or, France Capital','What can I help you with?');
        }

    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask','You can say, What is the capital of France, or, you can say capital of France, or, France Capital','What can I help you with?');
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell','GoodBye, Thanks for using Country Wisdom!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell','GoodBye, Thanks for using Country Wisdom!');
    }
}

function getCapital(countryName) {
    return countryCapitalMap[countryName.toLowerCase()];
}

function init() {
    countriesData.forEach(obj => {
        let countryName = obj.name.toLowerCase();
        let countryCapital = obj.capital;
        countryCapitalMap[countryName] = countryCapital;
    });
}
