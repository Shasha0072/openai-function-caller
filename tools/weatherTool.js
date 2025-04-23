import fetch from 'node-fetch';

/**
 * Weather tool implementation
 */
export const weatherTool = {
  /**
   * Definition for the OpenAI tool
   */
  definition: {
    name: 'get_weather',
    description: 'Get current weather or forecast for a location',
    parameters: {
      type: "object",
      properties: {
        location: {
          type: 'string',
          description: 'The city and state or country (e.g., "New York, NY" or "Tokyo, Japan")'
        },
        date: {
          type: 'string',
          description: 'The date to get weather for in YYYY-MM-DD format, defaults to today'
        }
      },
      required: ["location"]
    }
  },
  
  /**
   * Handler function that will be called when the tool is invoked
   * @param {object} params - The parameters passed to the tool
   * @returns {object} Weather data
   */
  handler: async (params) => {
    const { location, date = 'today' } = params;
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      throw new Error('WEATHER_API_KEY is not set in environment variables');
    }
    
    try {
      // Make the API call to a weather service
      const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=3`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Weather API error (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      
      // For simplicity, if date is 'today', return current weather
      if (date === 'today') {
        return {
          location: data.location.name,
          region: data.location.region,
          country: data.location.country,
          localTime: data.location.localtime,
          temperature: {
            celsius: data.current.temp_c,
            fahrenheit: data.current.temp_f
          },
          condition: data.current.condition.text,
          humidity: data.current.humidity,
          windSpeed: {
            kph: data.current.wind_kph,
            mph: data.current.wind_mph
          },
          precipitation: {
            mm: data.current.precip_mm,
            inches: data.current.precip_in
          }
        };
      } else {
        // Otherwise find the forecast for the specified date
        const forecastDay = data.forecast.forecastday.find(day => day.date === date);
        
        if (!forecastDay) {
          return {
            error: `Forecast not available for date: ${date}`,
            availableDates: data.forecast.forecastday.map(day => day.date)
          };
        }
        
        return {
          location: data.location.name,
          region: data.location.region,
          country: data.location.country,
          date: forecastDay.date,
          forecast: {
            maxTemp: {
              celsius: forecastDay.day.maxtemp_c,
              fahrenheit: forecastDay.day.maxtemp_f
            },
            minTemp: {
              celsius: forecastDay.day.mintemp_c,
              fahrenheit: forecastDay.day.mintemp_f
            },
            avgTemp: {
              celsius: forecastDay.day.avgtemp_c,
              fahrenheit: forecastDay.day.avgtemp_f
            },
            condition: forecastDay.day.condition.text,
            chanceOfRain: forecastDay.day.daily_chance_of_rain,
            chanceOfSnow: forecastDay.day.daily_chance_of_snow
          },
          hourlyForecast: forecastDay.hour.map(hour => ({
            time: hour.time,
            tempC: hour.temp_c,
            tempF: hour.temp_f,
            condition: hour.condition.text,
            chanceOfRain: hour.chance_of_rain
          }))
        };
      }
    } catch (error) {
      console.error('Weather API error:', error);
      return { 
        error: `Failed to get weather for ${location}: ${error.message}` 
      };
    }
  }
};

export default weatherTool;