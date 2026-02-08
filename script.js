// Элементы DOM
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherResult = document.getElementById('weatherResult');

// Иконки погоды (emoji)
const weatherIcons = {
    'clear': '☀️',
    'partly-cloudy': '⛅',
    'cloudy': '☁️',
    'overcast': '☁️',
    'fog': '🌫️',
    'drizzle': '🌦️',
    'rain': '🌧️',
    'snow': '🌨️',
    'thunderstorm': '⛈️'
};

// Переводы описаний погоды на русский
const weatherTranslations = {
    'Clear sky': 'Ясное небо',
    'Mainly clear': 'Преимущественно ясно',
    'Partly cloudy': 'Переменная облачность',
    'Overcast': 'Пасмурно',
    'Fog': 'Туман',
    'Depositing rime fog': 'Изморозь',
    'Light drizzle': 'Лёгкая морось',
    'Moderate drizzle': 'Умеренная морось',
    'Dense drizzle': 'Сильная морось',
    'Light rain': 'Небольшой дождь',
    'Moderate rain': 'Умеренный дождь',
    'Heavy rain': 'Сильный дождь',
    'Light snow': 'Небольшой снег',
    'Moderate snow': 'Умеренный снег',
    'Heavy snow': 'Сильный снег',
    'Thunderstorm': 'Гроза',
    'Thunderstorm with light hail': 'Гроза с небольшим градом',
    'Thunderstorm with heavy hail': 'Гроза с сильным градом'
};

// Получение иконки по коду погоды Open-Meteo
function getWeatherIcon(weatherCode) {
    if (weatherCode === 0) return weatherIcons['clear'];
    if (weatherCode >= 1 && weatherCode <= 2) return weatherIcons['partly-cloudy'];
    if (weatherCode === 3) return weatherIcons['overcast'];
    if (weatherCode >= 45 && weatherCode <= 48) return weatherIcons['fog'];
    if (weatherCode >= 51 && weatherCode <= 57) return weatherIcons['drizzle'];
    if (weatherCode >= 61 && weatherCode <= 67) return weatherIcons['rain'];
    if (weatherCode >= 71 && weatherCode <= 77) return weatherIcons['snow'];
    if (weatherCode >= 80 && weatherCode <= 82) return weatherIcons['rain'];
    if (weatherCode >= 85 && weatherCode <= 86) return weatherIcons['snow'];
    if (weatherCode >= 95 && weatherCode <= 99) return weatherIcons['thunderstorm'];
    return weatherIcons['cloudy'];
}

// Получение описания погоды по коду
function getWeatherDescription(weatherCode) {
    const descriptions = {
        0: 'Ясное небо',
        1: 'Преимущественно ясно',
        2: 'Переменная облачность',
        3: 'Пасмурно',
        45: 'Туман',
        48: 'Изморозь',
        51: 'Лёгкая морось',
        53: 'Умеренная морось',
        55: 'Сильная морось',
        61: 'Небольшой дождь',
        63: 'Умеренный дождь',
        65: 'Сильный дождь',
        71: 'Небольшой снег',
        73: 'Умеренный снег',
        75: 'Сильный снег',
        80: 'Небольшой дождь',
        81: 'Умеренный дождь',
        82: 'Сильный дождь',
        85: 'Небольшой снег',
        86: 'Сильный снег',
        95: 'Гроза',
        96: 'Гроза с небольшим градом',
        99: 'Гроза с сильным градом'
    };
    return descriptions[weatherCode] || 'Неизвестно';
}

// Функция получения координат города
async function getCoordinates(cityName) {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=ru&format=json`;
    
    const response = await fetch(geocodingUrl);
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
        throw new Error('Город не найден');
    }
    
    return {
        latitude: data.results[0].latitude,
        longitude: data.results[0].longitude,
        name: data.results[0].name,
        country: data.results[0].country
    };
}

// Функция получения погоды
async function getWeather(latitude, longitude) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
    
    const response = await fetch(weatherUrl);
    const data = await response.json();
    
    return data.current;
}

// Функция отображения погоды
function displayWeather(cityData, weatherData) {
    const icon = getWeatherIcon(weatherData.weather_code);
    const description = getWeatherDescription(weatherData.weather_code);
    
    weatherResult.innerHTML = `
        <div class="weather-info">
            <div class="city-name">${cityData.name}, ${cityData.country}</div>
            <div class="weather-icon">${icon}</div>
            <div class="temperature">${Math.round(weatherData.temperature_2m)}°C</div>
            <div class="description">${description}</div>
            <div class="weather-details">
                <div class="detail-item">
                    <div class="detail-label">Влажность</div>
                    <div class="detail-value">${weatherData.relative_humidity_2m}%</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Ветер</div>
                    <div class="detail-value">${Math.round(weatherData.wind_speed_10m)} км/ч</div>
                </div>
            </div>
        </div>
    `;
}

// Функция отображения ошибки
function displayError(message) {
    weatherResult.innerHTML = `<div class="error">❌ ${message}</div>`;
}

// Функция отображения загрузки
function displayLoading() {
    weatherResult.innerHTML = '<div class="loading">⏳ Загрузка...</div>';
}

// Основная функция поиска погоды
async function searchWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        displayError('Пожалуйста, введите название города');
        return;
    }
    
    try {
        displayLoading();
        
        // Получаем координаты города
        const cityData = await getCoordinates(city);
        
        // Получаем погоду по координатам
        const weatherData = await getWeather(cityData.latitude, cityData.longitude);
        
        // Отображаем результат
        displayWeather(cityData, weatherData);
        
    } catch (error) {
        displayError(error.message || 'Произошла ошибка при получении данных о погоде');
        console.error('Ошибка:', error);
    }
}

// Обработчик клика по кнопке
searchBtn.addEventListener('click', searchWeather);

// Обработчик нажатия Enter в поле ввода
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchWeather();
    }
});
