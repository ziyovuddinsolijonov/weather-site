// Элементы DOM
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherResult = document.getElementById('weatherResult');
const autocompleteList = document.getElementById('autocomplete-list');

// Популярные города (50+ городов из разных стран)
const popularCities = [
    // Узбекистан
    'Ташкент', 'Самарканд', 'Бухара', 'Андижан', 'Наманган', 'Фергана', 'Карши', 'Нукус', 'Термез', 'Коканд',
    // Россия
    'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск', 'Красноярск', 'Самара', 'Уфа',
    // Европа
    'Лондон', 'Париж', 'Берлин', 'Мадрид', 'Рим', 'Амстердам', 'Барселона', 'Вена', 'Прага', 'Варшава',
    'London', 'Paris', 'Berlin', 'Madrid', 'Rome', 'Amsterdam', 'Barcelona', 'Vienna', 'Prague', 'Warsaw',
    // Азия
    'Токио', 'Сеул', 'Пекин', 'Шанхай', 'Дубай', 'Бангкок', 'Сингапур', 'Стамбул', 'Дели', 'Мумбаи',
    'Tokyo', 'Seoul', 'Beijing', 'Shanghai', 'Dubai', 'Bangkok', 'Singapore', 'Istanbul', 'Delhi', 'Mumbai',
    // Америка
    'Нью-Йорк', 'Лос-Анджелес', 'Чикаго', 'Майами', 'Торонто', 'Ванкувер', 'Мехико',
    'New York', 'Los Angeles', 'Chicago', 'Miami', 'Toronto', 'Vancouver', 'Mexico City',
    // Другие
    'Сидней', 'Мельбурн', 'Кейптаун', 'Каир',
    'Sydney', 'Melbourne', 'Cape Town', 'Cairo',
    // Дополнительные города
    'Киев', 'Минск', 'Алматы', 'Баку', 'Тбилиси', 'Ереван',
    'Kyiv', 'Minsk', 'Almaty', 'Baku', 'Tbilisi', 'Yerevan'
];

// Переменная для отслеживания активной подсказки
let activeIndex = -1;

// Функция фильтрации городов по введённому тексту
function filterCities(input) {
    if (!input) return [];
    
    const searchText = input.toLowerCase().trim();
    
    // Фильтруем города и ограничиваем до 10 результатов
    return popularCities
        .filter(city => city.toLowerCase().includes(searchText))
        .slice(0, 10);
}

// Функция отображения подсказок
function showSuggestions(cities) {
    // Очищаем список
    autocompleteList.innerHTML = '';
    activeIndex = -1;
    
    if (cities.length === 0) {
        closeSuggestions();
        return;
    }
    
    // Создаём элементы подсказок
    cities.forEach((city, index) => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = city;
        item.dataset.index = index;
        
        // Обработчик клика по подсказке
        item.addEventListener('click', () => {
            selectCity(city);
        });
        
        autocompleteList.appendChild(item);
    });
    
    // Показываем список
    autocompleteList.classList.add('show');
}

// Функция выбора города
function selectCity(city) {
    cityInput.value = city;
    closeSuggestions();
    // Можно сразу запустить поиск погоды (опционально)
    // searchWeather();
}

// Функция закрытия списка подсказок
function closeSuggestions() {
    autocompleteList.classList.remove('show');
    autocompleteList.innerHTML = '';
    activeIndex = -1;
}

// Функция обновления активной подсказки
function updateActiveItem() {
    const items = autocompleteList.querySelectorAll('.autocomplete-item');
    
    items.forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add('active');
            // Прокручиваем к активному элементу
            item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
            item.classList.remove('active');
        }
    });
}

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

// Обработчик ввода текста для автодополнения
cityInput.addEventListener('input', (event) => {
    const inputValue = event.target.value;
    const filteredCities = filterCities(inputValue);
    showSuggestions(filteredCities);
});

// Обработчик нажатия клавиш в поле ввода
cityInput.addEventListener('keydown', (event) => {
    const items = autocompleteList.querySelectorAll('.autocomplete-item');
    
    if (event.key === 'ArrowDown') {
        // Стрелка вниз - переход к следующей подсказке
        event.preventDefault();
        if (items.length > 0) {
            activeIndex = (activeIndex + 1) % items.length;
            updateActiveItem();
        }
    } else if (event.key === 'ArrowUp') {
        // Стрелка вверх - переход к предыдущей подсказке
        event.preventDefault();
        if (items.length > 0) {
            activeIndex = activeIndex <= 0 ? items.length - 1 : activeIndex - 1;
            updateActiveItem();
        }
    } else if (event.key === 'Enter') {
        // Enter - выбор активной подсказки или поиск
        if (activeIndex >= 0 && items[activeIndex]) {
            event.preventDefault();
            const selectedCity = items[activeIndex].textContent;
            selectCity(selectedCity);
        } else {
            // Если нет активной подсказки, выполняем поиск
            searchWeather();
        }
    } else if (event.key === 'Escape') {
        // Escape - закрытие списка
        closeSuggestions();
    }
});

// Закрытие списка при клике вне области
document.addEventListener('click', (event) => {
    if (!cityInput.contains(event.target) && !autocompleteList.contains(event.target)) {
        closeSuggestions();
    }
});

