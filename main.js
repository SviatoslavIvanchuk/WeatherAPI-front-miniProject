
const form = document.querySelector(".searchBlock form");
const input = document.querySelector(".searchBlock input");
const apiKey = "024e8b0b937d6df0d53229905adc339a";


const msg = document.getElementsByClassName('msg')[0];
    msg.style.display = 'none';
document.getElementById('msgButton').onclick = () => {
    msg.style.display = 'none';
}

form.addEventListener("submit", e => {
    e.preventDefault();
    let inputValue = input.value;

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${inputValue}&appid=${apiKey}`

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {

                msg.style.display = 'none';
                console.log(data)

            let baseInfoBlock = document.getElementsByClassName('baseInfo')[0];
                baseInfoBlock.innerHTML = '';
            let forecastTodayBlock = document.getElementsByClassName('forecastToday')[0];
                forecastTodayBlock.innerHTML = '';
            let airConditionsBlock = document.getElementsByClassName('airConditionsBlock')[0];
                airConditionsBlock.innerHTML = '';
            let forecastFiveDaysBlock = document.getElementsByClassName('forecastFiveDays')[0];
                forecastFiveDaysBlock.innerHTML = `
                    <div class="title"><h3>4-DAY FORECAST</h3></div>
                `;

            let baseInfo = document.createElement('div');
                baseInfo.classList.add('baseInfo')
                const { name, country } = data.city;
                console.log(data.list[0])
            const { main, weather, pop, wind, dt} = data.list[0];
            const icon = weather[0].icon;

            baseInfo.innerHTML = `
                <div class="cityNameAndTemperature">
                    <h2 class="cityName">${name}
                    <sup>${country}</sup>
                    </h2>
                    <p></p>
                    <h2 class="cityTemperature"><b>${Math.round(main.temp) - '273'}</b><div class="grad"></div></h2>
                </div>
                <div class="iconWeather">
                    <img src="./icons/${icon}.png" alt="${icon}">
                </div>
            `;

            baseInfoBlock.appendChild(baseInfo);

            let airConditions = document.createElement('div');
                airConditions.classList.add('airConditions');

            airConditions.innerHTML = `
                <div class="data"><span>Real Feel</span><h3>${Math.round(main.feels_like).toFixed(1) - '273'}<div class="grad"></div></h3></div>
                <div class="data"><span>Wind</span><h3>${wind.speed} m/s</h3></div>
                <div class="data"><span>Chance of raine</span><h3>${Math.trunc(pop * 100)} %</h3></div>
            `;
            airConditionsBlock.appendChild(airConditions);


            let forecastToday = document.createElement('div');
                forecastToday.classList.add('forecastTodayScroll')
            for (let i=1; i<9; i++) {
                let timeOfDay = document.createElement('div');
                    timeOfDay.classList.add('timeOfDay');

                const {dt_txt, weather, main, dt} = data.list[i];
                const timeArr = dt_txt.split(' ')[1].split(':');
                let time = timeArr[0]+':'+timeArr[1];
                const icon = weather[0].icon;
                const temperature = Math.round(main.temp)-'273';

                timeOfDay.innerHTML = `
                    <span>${time}</span>
                    <img src="./icons/${icon}.png" alt="${icon + dt}">
                    <h3>${temperature}<div class="grad"></div></h3>
                `;

                forecastToday.appendChild(timeOfDay);
            }
            forecastTodayBlock.appendChild(forecastToday);

            for (let i=1; i<40; i++) {
                const {dt_txt, main, weather} = data.list[i];
                let time = dt_txt.split(' ')[1];
                let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                let dayOfWeek = '';
                let dayTemperature = '';
                let nightTemperature = '';

                if (time.split(':')[0] === '15') {
                    let forecastDayOfWeek = document.createElement('div');
                        forecastDayOfWeek.classList.add('dayOfWeek');

                    dayOfWeek = days[new Date(dt_txt).getDay()];
                    dayTemperature = Math.round(main.temp)-'273';
                    nightTemperature = Math.round(data.list[i+5].main.temp)-'273';

                    const icon = weather[0].icon;
                    const weatherMain = weather[0].main;

                    forecastDayOfWeek.innerHTML = `
                        <div class="forecastDayBlock">
                            <div class="nameOfWeek">
                                <h4>${dayOfWeek}</h4>
                            </div>
                            <div class="weatherNameAndTemperature">
                                <div class="icon"><img src="./icons/${icon}.png" alt="${icon}"></div>
                                <h4>${weatherMain}</h4>
                                <h4>${dayTemperature}<span>/${nightTemperature}</span></h4>
                            </div>
                        </div>
                    `;

                    forecastFiveDaysBlock.appendChild(forecastDayOfWeek);
                }
            }
            } else {
                msg.style.display = 'flex';
                console.log(data)
                function closeError() {
                    return msg.style.display = 'none';
                }
                const msgError = document.getElementsByClassName('msgError')[0];
                msgError.innerHTML = `
                        <h2>${data.cod}</h2>
                        <span>${data.message}</span>
                    `;

            }
        })

    form.reset()
})
