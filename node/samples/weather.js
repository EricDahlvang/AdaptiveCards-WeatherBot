var util = require('util');
var rp = require('request-promise');
var LuisActions = require('../core');
var fs = require('fs');
var builder = require('botbuilder');


var ApixuApiKey = process.env.APIXU_API_KEY;

var WeatherInPlaceAction = {
    intentName: 'WeatherInPlace',
    friendlyName: 'What\'s the weather?',
    // Property validation based on schema-inspector - https://github.com/Atinux/schema-inspector#v_properties
    schema: {
        Place: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Geography.City,
            message: 'Please provide a location'
        }
    },
    // Action fulfillment method, recieves parameters as keyed-object (parameters argument) and a callback function to invoke with the fulfillment result.
    fulfill: function (parameters, callback) {
        rp({
            url: util.format('http://api.apixu.com/v1/forecast.json?key=%s&q=%s&days=5', ApixuApiKey, encodeURIComponent(parameters.Place)),
            json: true
        }).then(function (data) {
            if (data.error) {
                callback(data.error.message + ': "' + parameters.Place + '"');
            } else {
                callback(
                    
                   // util.format('The current weather in %s, %s is %s (humidity %s %%)',
                    //data.location.name, data.location.country, data.current.condition.text, data.current.humidity)
                     getWeatherCard(data)
                    );
            }
        }).catch(console.error);
    }
};

module.exports = WeatherInPlaceAction;

function getWeatherCard(data){
    
    var w = JSON.parse(fs.readFileSync('./bot/weather_template.json', 'utf8'));
    //w.content.body[0].columns[0].items[0].url = data.current.condition.icon;

    return new builder.Message().addAttachment(JSON.stringify(w));

    //return util.format('The current weather in %s, %s is %s (humidity %s %%)',
      //              data.location.name, data.location.country, data.current.condition.text, data.current.humidity)
}