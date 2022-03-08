'use strict'

/**************
 * CONSTANTES *
 **************/

const OM_API_URL = 'https://api.open-meteo.com/v1/forecast';
const OSM_API_URL = 'https://nominatim.openstreetmaps.org/';
const TIMEZONE = 'Europe/Madrid';

// Iconos relacionados al tiempo
const weatherIcons = {
    soleadoBajo: 'bi bi-brightness-low',
    soleadoAlto: 'bi bi-brightness-high',
    nublado: 'bi bi-cloud',
    llovizna: 'bi bi-cloud-drizzle',
    niebla: 'bi bi-cloud-fog2',
    neblina: 'bi bi-cloud-haze2',
    granizo: 'bi bi-cloud-hail',
    tormentaElectrica: 'bi bi-cloud-lightning-rain',
    nocheNubesConClaros: 'bi bi-cloud-moon',
    lluvia: 'bi bi-cloud-rain',
    lluviaFuerte: 'bi bi-cloud-rain-heavy',
    aguaNieve: 'bi bi-cloud-sleet',
    nieve: 'bi bi-cloud-snow',
    diaNubesConClaros: 'bi bi-cloud-sun',
    tormentaDeNieve: 'bi bi-snow2'
};

// Iconos relacionados a la intersidad
const intensityIcons = {
    middle: {
        icon: 'bi bi-chevron-up',
        alt: 'Intensidad moderada'
    },
    high: {
        icon: 'bi bi-chevron-double-up',
        alt: 'Alta intensidad'
    }
}

// Iconos relacionados a temperaturas
const tempIcons = {
    low: {
        icon: 'bi bi-thermometer-low',
        alt: 'Bajas temperaturas'
    },
    middle: {
        icon: 'bi bi-thermometer-half',
        alt: 'Temperaturas moderadas'
    },
    high: {
        icon: 'bi bi-thermometer-high',
        alt: 'Altas temperaturas'
    }
};

// Iconos extra
const extras = {
    windy: 'bi bi-wind'
};

// Mapeo de los códigos WMO del tiempo
// fuente: https://open-meteo.com/en/docs
const weatherCode = {
    0: {
        description: 'Cielo claro',
        icon: weatherIcons.soleadoBajo
    },
    1: {
        description: 'Mayormente despejado',
        icon: weatherIcons.diaNubesConClaros
    },
    2: {
        description: 'Parcialmente nublado',
        icon: weatherIcons.diaNubesConClaros,
        intensity: intensityIcons.middle
    },
    3: {
        description: 'Nublado',
        icon: weatherIcons.nublado
    },
    45: {
        description: 'Niebla',
        icon: weatherIcons.niebla
    },
    48: {
        description: 'Niebla con escarcha',
        icon: weatherIcons.niebla,
        extra: tempIcons.low
    },
    51: {
        description: 'Llovizna',
        icon: weatherIcons.llovizna
    },
    53: {
        description: 'Llovizna',
        icon: weatherIcons.llovizna,
        intensity: intensityIcons.middle
    },
    55: {
        description: 'Llovizna',
        icon: weatherIcons.llovizna,
        intensity: intensityIcons.high
    },
    56: {
        description: 'Ligera llovizna',
        icon: weatherIcons.llovizna,
        extra: tempIcons.low
    },
    57: {
        description: 'Llovizna helada',
        icon: weatherIcons.llovizna,
        intensity: intensityIcons.high,
        extra: tempIcons.low
    },
    61: {
        description: 'Lluvia',
        icon: weatherIcons.lluvia
    },
    63: {
        description: 'Lluvia',
        icon: weatherIcons.lluvia,
        intensity: intensityIcons.middle
    },
    65: {
        description: 'Lluvia',
        icon: weatherIcons.lluvia,
        intensity: intensityIcons.high
    },
    66: {
        description: 'Aguanieve',
        icon: weatherIcons.aguaNieve,
    },
    67: {
        description: 'Aguanieve',
        icon: weatherIcons.aguaNieve,
        intensity: intensityIcons.high
    },
    71: {
        description: 'Nevada',
        icon: weatherIcons.nieve
    },
    73: {
        description: 'Nevada',
        icon: weatherIcons.nieve,
        intensity: intensityIcons.middle
    },
    75: {
        description: 'Nevada',
        icon: weatherIcons.nieve,
        intesity: intensityIcons.high
    },
    77: {
        description: 'Copos de nieve',
        icon: weatherIcons.nieve
    },
    80: {
        description: 'Aguacero',
        icon: weatherIcons.lluviaFuerte
    },
    81: {
        description: 'Aguacero',
        icon: weatherIcons.lluviaFuerte,
        intensity: intensityIcons.middle
    },
    81: {
        description: 'Aguacero',
        icon: weatherIcons.lluviaFuerte,
        intensity: intensityIcons.high
    },
    85: {
        description: 'Tormenta de nieve',
        icon: weatherIcons.tormentaDeNieve
    },
    86: {
        description: 'Tormenta de nieve',
        icon: weatherIcons.tormentaDeNieve,
        intensity: intensityIcons.high
    },
    95: {
        description: 'Tormenta eléctrica',
        icon: weatherIcons.tormentaElectrica
    },
    96: {
        description: 'Tormenta eléctrica y granizo',
        icon: weatherIcons.tormentaElectrica
    },
    99: {
        description: 'Tormenta eléctrica y granizo',
        icon: weatherIcons.tormentaElectrica,
        intensity: intensityIcons.high
    }
}

// Elementos para la tabla de resumen y gráficos
const weekday = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const tableIcons = {
    weather: '<i class="bi bi-brightness-low"></i>',
    precipitation: '<i class="bi bi-droplet"></i>',
    tempMin: '<i class="bi bi-thermometer-low"></i>',
    tempMax: '<i class="bi bi-thermometer-high"></i>',
    sunrise: '<i class="bi bi-sunrise"></i>',
    sunset: '<i class="bi bi-sunset"></i>',
    windspeed: '<i class="bi bi-wind"></i>',
    time: '<i class="bi bi-clock"></i>'
}

// Chart
var newChart = true;
var chart;

// Opciones del geolocalizacion
const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

// Objeto que almacena la información relacionada a la localización
var locationSearch = {
    city: '',
    province: '',
    stateDistrict: '',
    state: '',
    country: '',
    lat: 0,
    lon: 0
};

// Tiempo actual de la localización
// almacena el tiempo pronosticado para la hora actual
var currentWeather = {
    windspeed: 0,
    winddirection: 0,
    weathercode: 0,
    time: Date.now(),
    temperature: 0
};

/*************
 * FUNCIONES *
 *************/

/* --- Utiles --- */

// Retorna el icono del código de tiempo pasado como parámetro
function weatherCodeToIcon(code) {
    let weather = weatherCode[code];
    let icon = `<i class="${weather.icon}" title="${weather.description}"></i>`;
    if(typeof weather.intensity !== 'undefined') 
        icon += `<i class="${weather.intensity.icon} my-small-text" title="${weather.intensity.alt}"></i>`
    icon += ` ${weather.description}`;
    return icon;
}

/* --- Open Street Maps API --- */

// Geolocalizacion correcta
function geoLocationSuccess(pos) {
    let crd = pos.coords;

    locationSearch.lat = crd.latitude;
    locationSearch.lon = crd.longitude;

    getReverseLocation();
};

// error de geolocalizacion
function geoLocationError(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
};

// Obtiene un listado de localizaciones por nombre mediante 
// la api de Open Street Maps
async function getLocationsByInput(input) {
    let url = `${OSM_API_URL}search`;

    $.ajax({
        url: url,
        method: 'GET',
        data: {
            format: 'json',
            countrycodes: 'es',
            q: input
        },
        success: (res) => {
            //console.log(res);
            drawLocationSuggestion(res);
        },
        error: (err) => {
            console.error(err);
        }
    })
}

// La funcion realiza una búsqueda para obtener información de la ciudad
async function getReverseLocation() {
    let url = `${OSM_API_URL}reverse`;

    $.ajax({
        url: url,
        method: 'GET',
        data: {
            format: 'json',
            lat: locationSearch.lat,
            lon: locationSearch.lon,
            zoom: 10 // Restringir resultados a ciudades
        },
        success: (res) => {
            // console.log(res);
            saveLocationInformation(res);
            getCurrentWeather();
            get7DaysResumedWeather();
            get7DaysDetailedWeather();
        },
        error: (err) => {
            console.error(err);
        }
    })
}

// Guarda la información de la localizacion pasada como data
async function saveLocationInformation(data) {
    locationSearch.city = data.address.city;
    locationSearch.province = data.address.province;
    locationSearch.stateDistrict = data.address.state_district;
    locationSearch.state = data.address.state;
    locationSearch.country = data.address.country;

    printLocationInformation();
}

// Imprime la información de la información actual
function printLocationInformation() {
    let state = locationSearch.province != undefined ? locationSearch.province : locationSearch.state;
    let city = locationSearch.city
    if(locationSearch.stateDistrict != undefined) city += ' - ' + locationSearch.stateDistrict;
    let location = `${city} (${state}), ${locationSearch.country}`;
    let lat = `Latitud: ${locationSearch.lat}`;
    let lon = `Longitud: ${locationSearch.lon}`;

    $('#cl-name').text(location);
    $('#cl-lat').text(lat);
    $('#cl-lon').text(lon);
}

// Imprime los resultados de la busqueda por nombre
function drawLocationSuggestion(data) {
    let box = $('#locationSuggestionList');
    let html = '';
    for(let location of data) {
        html += `<li>`
            + `<span class="dropdown-item pe-auto" onclick="setSearchingLocation(${location.lat}, ${location.lon});">`
            + `${location.display_name}`
            + `</span>`
            + `</li>`
    }
    box.html(html).addClass('show');
}

// Establece el locationSearch en la latitud y longitud pasados como parámetros
function setSearchingLocation(lat, lon) {
    $('#locationSearchBox').val('');
    $('#locationSuggestionList').html('').removeClass('show');

    locationSearch.lat = lat;
    locationSearch.lon = lon;

    getReverseLocation();
}

/* --- Open Meteo API --- */

// Obtiene el tiempo actual (tiempo real)
async function getCurrentWeather() {
    let url = OM_API_URL;
    console.log('getCurrentWeather');

    $.ajax({
        url: url,
        method: 'GET',
        data: {
            latitude: locationSearch.lat,
            longitude: locationSearch.lon,
            current_weather: true
        },
        success: (res) => {
            // console.log(res);
            saveCurrentWeatherInfo(res);
        },
        error: (err) => {
            console.error(err);
        }
    });
}

// Guarda la información pasada como data del tiempo actual
function saveCurrentWeatherInfo(data) {
    currentWeather.windspeed = data.current_weather.windspeed;
    currentWeather.winddirection = data.current_weather.winddirection;
    currentWeather.weathercode = data.current_weather.weathercode;
    currentWeather.time = new Date(data.current_weather.time);
    currentWeather.temperature = data.current_weather.temperature;
    printCurrentWeatherInfo();
}

// Imprime el detalle de del tiempo actual
function printCurrentWeatherInfo() {
    let tempIcon;
    let time = `Actualizado el ${currentWeather.time.getDate()}-${currentWeather.time.getMonth()}-${currentWeather.time.getFullYear()}`
    + ` a las ${currentWeather.time.getHours()}:${currentWeather.time.getMinutes()}`;

    if(currentWeather.temperature < 15) {
        tempIcon = tempIcons.low;
    } else if(currentWeather.temperature < 25) {
        tempIcon = tempIcons.middle;
    } else {
        tempIcon = tempIcons.high;
    }

    let temperature = `<i class="${tempIcon.icon}" title="${tempIcon.alt}"></i> ${currentWeather.temperature} ºC`;

    let htmlWeather = `<span>${weatherCodeToIcon(currentWeather.weathercode)}</span>`;

    let wind = `<i class="${extras.windy}"></i><span> ${currentWeather.windspeed} km/h</span>`;

    $('#cl-temperature').html(temperature);
    $('#cl-weather-detail').html(htmlWeather);
    $('#cl-time').text(time);
    $('#cl-windspeed').html(wind);
}

// Consulta el tiempo de los próximos 7 dias
async function get7DaysResumedWeather() {
    let url = OM_API_URL;

    $.ajax({
        url: url,
        method: 'GET',
        data: {
            latitude: locationSearch.lat,
            longitude: locationSearch.lon,
            daily: [
                'weathercode',
                'temperature_2m_max',
                'temperature_2m_min',
                'sunrise',
                'sunset',
                'precipitation_sum',
                'windspeed_10m_max'
            ],
            timezone: TIMEZONE
        },
        success: (res) => {
            // console.log(res);
            printWeekWeatherResumedTable(res);
        },
        error: (err) => {
            console.error(err);
        }
    });
}


// Imprime una tabla con el resumen del tiempo de la semana
function printWeekWeatherResumedTable(data) {
    let units = data.daily_units;
    let tempMin = data.daily.temperature_2m_min;
    let weather = data.daily.weathercode;
    let sunset = data.daily.sunset;
    let windspeed = data.daily.windspeed_10m_max;
    let time = data.daily.time;
    let tempMax = data.daily.temperature_2m_max;
    let precipitation = data.daily.precipitation_sum;
    let sunrise = data.daily.sunrise;

    let table = $('#week-resume-table');
    let tableContent = '<thead style="color:white;"><tr><th scope="col"><i class="bi bi-calendar2-day"></i></th>';

    for(let i = 0; i < time.length; i++) {
        let day = new Date(time[i]);
        tableContent += `<th scope="col">${weekday[day.getDay()]}</th>`;
    }

    tableContent += '</tr></thead><tbody>';

    // weather 
    tableContent += makeATableRow(weather, tableIcons.weather, units.weathercode);
    // tempMax
    tableContent += makeATableRow(tempMax, tableIcons.tempMax, units.temperature_2m_max);
    // tempMin
    tableContent += makeATableRow(tempMin, tableIcons.tempMin, units.temperature_2m_min);
    // precipitation
    tableContent += makeATableRow(precipitation, tableIcons.precipitation, units.precipitation_sum);
    // windspeed
    tableContent += makeATableRow(windspeed, tableIcons.windspeed, units.windspeed_10m_max);
    // sunrise
    tableContent += makeATableRow(sunrise, tableIcons.sunrise, units.sunrise);
    // sunset
    tableContent += makeATableRow(sunset, tableIcons.sunset, units.sunset);

    tableContent += '</tbody>';
    // Print
    table.html('');
    table.html(tableContent);
}

// Formatea y retorna la una fila de la tabla para mostrar el resumen semanal
function makeATableRow(rowData, firstCell = null, unit='') {
    let row = '<tr>';
    if(firstCell !== null) {
        row += `<th scope="row">${firstCell}</th>`; 
    }
    for(let data in rowData) {
        switch(unit) {
            case 'wmo code':
                row += `<td>${weatherCodeToIcon(rowData[data])}</td>`;
                break;
            case 'iso8601':
                let time = new Date(rowData[data]);
                row += `<td>${time.getHours()}:${time.getMinutes()}</td>`;
                break;
            default:
                row += `<td>${rowData[data]} ${unit}</td>`;
                break;
        }
    }
    row += '</tr>';
    return row;
}

// Consulta el tiempo detallado de 7 días con actualizaciones de 1 hora
async function get7DaysDetailedWeather() {
    let url = OM_API_URL;
    console.log('getCurrentWeather');

    $.ajax({
        url: url,
        method: 'GET',
        data: {
            latitude: locationSearch.lat,
            longitude: locationSearch.lon,
            hourly: [
                'temperature_2m',
                'relativehumidity_2m',
                'apparent_temperature',
                'precipitation',
                'windspeed_10m'
            ],
            timezone: TIMEZONE
        },
        success: (res) => {
            // console.log(res);
            printWeekWeatherDetailedChart(res);
        },
        error: (err) => {
            console.error(err);
        }
    });
}

// Imprime un gráfico con el detalle del tiempo de la semana
function printWeekWeatherDetailedChart(data) {
    let times = data.hourly.time;
    let myData = data.hourly;

    let prevDay = '';
    for(let i = 0; i < times.length; i++) {
        let day = new Date(times[i]);
        if(i == 0 || weekday[day.getDay()] != prevDay) {
            times[i] = weekday[day.getDay()];
        } else {
            times[i] = `${day.getHours()}:${day.getMinutes()}`;
        }
        prevDay = weekday[day.getDay()];
    }
    delete data.hourly.time;

    // Para solventar un problema con el tamaño del gráfico al actualizarlo 
    // creamos el canvas cada vez que vamos a crear un gráfico nuevo
    $('#week-detail-chart').html('<canvas id="myCanvas" height="100px"></canvas>'); 
    
    // Creamos el gráfico
    if(newChart == false) {
        chart.destroy();
    }
    let ctx = document.getElementById('myCanvas').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: `Sensación térmica [${data.hourly_units.apparent_temperature}]`,
                data: myData.apparent_temperature,
                borderColor: 'rgb(255,0,0)',
                backgroundColor: 'rgb(255,0,0, 0.1)',
                fill: true
            }, {
                label: `Temperatura [${data.hourly_units.temperature_2m}]`,
                data: myData.temperature_2m,
                borderColor: 'rgb(255,165,0)',
                backgroundColor: 'rgb(255,165,0, 0.1)',
                fill: true
            }, {
                label: `Precipitaciones [${data.hourly_units.precipitation}]`,
                data: myData.precipitation,
                borderColor: 'rgb(52, 152, 219)',
                backgroundColor: 'rgb(52, 152, 219, 0.1)',
                fill: true
            }, {
                label: `Velocidad del viento [${data.hourly_units.windspeed_10m}]`,
                data: myData.windspeed_10m,
                borderColor: 'rgb(46, 204, 113)',
                backgroundColor: 'rgb(46, 204, 113, 0.1)',
                fill: true
            }, {
                label: `Humedad [${data.hourly_units.relativehumidity_2m}]`,
                data: myData.relativehumidity_2m,
                borderColor: 'rgb(244, 208, 63)',
                backgroundColor: 'rgb(244, 208, 63, 0.1)',
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        color: 'white'
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x',
                    }
                }
            }
        }
    });

    newChart = false;
}

/* --- MAIN --- */
$(document).ready(() => {
    // Solicatmos la geolocalizacion
    navigator.geolocation.getCurrentPosition(geoLocationSuccess, geoLocationError, geolocationOptions);

    // Búsqueda de localización manual por input
    $("#locationSearchBox").on('input', (event) => {
        getLocationsByInput(event.target.value);
    });

    // bucle de actualización
    setInterval(getCurrentWeather, 60000);
});

