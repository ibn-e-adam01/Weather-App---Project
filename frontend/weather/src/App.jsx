import axios from 'axios'
import React, { useRef, useState } from 'react'
import Lenis from 'lenis'

const App = () => {
  const resultRef = useRef(null);
  const [City, setCity] = useState("");
  const [Country, setCountry] = useState("");
  const [Error, setError] = useState("");
  const [Lat, setLat] = useState("");
  const [Lon, setLon] = useState("");
  const [Icon, setIcon] = useState("");
  const [Temp, setTemp] = useState("--");
  const [TimeZone, setTimeZone] = useState("");
  const [Gust, setGust] = useState("--");
  const [Hum, setHum] = useState("--");
  const [Press, setPress] = useState("--");
  const [AirSpeed, setAirSpeed] = useState("--");
  const [Sunrise, setSunrise] = useState("--");
  const [Sunset, setSunset] = useState("--");
  const [Dir, setDir] = useState("");
  const APIKEY = import.meta.env.VITE_Api_Key;
  const [WeatherType, setWeatherType] = useState("");
  const [RainInOneHr, setRainInOneHr] = useState("--");
  const [isLoading, setisLoading] = useState(false);
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

  const lenis = new Lenis();

// Use requestAnimationFrame to continuously update the scroll
  function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);


  const formatSunTime = (timestamp) => {
  if (!timestamp) return "--";
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};


  const getWeatherData = async () => {


    try{

      setisLoading(true);
      setError("")

      if(City == ""){
        setError('Enter City Name!!!');
        return;
      }

      let resCity = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${City}&count=1&language=en&format=json`,
        {headers:{
          "Content-Type": "application/json"
        }, withCredentials: false},
      );

      if (!resCity.data.results || resCity.data.results.length === 0) {
          setError('City not found❗Try Again');
          return; 
      }

      setError("")


      console.log(resCity.data);
      setLat(resCity.data.results[0].latitude);
      setLon(resCity.data.results[0].longitude);

      let resWeather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${Lat}&lon=${Lon}&appid=${APIKEY}`
      );

      console.log(resWeather.data.main);
      console.log(resWeather.data.wind.speed);
      let weatherIcon = resWeather.data.weather[0].icon
      setIcon(`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`)
      let windDeg = resWeather.data.wind.deg;

      if(337.5 <= windDeg < 360 || 0 <= windDeg < 22.5){
        setDir(directions[0]);
      }
      else if(22.5 <= windDeg < 67.5){
        setDir(directions[1]);
      }
      else if(67.5 <= windDeg < 112.5){
        setDir(directions[2]);
      }
      else if(112.5 <= windDeg < 157.5){
        setDir(directions[3]);
      }
      else if(157.5 <= windDeg < 202.5){
        setDir(directions[4]);
      }
      else if(202.5 <= windDeg < 247.5){
        setDir(directions[5]);
      }
      else if(247.5 <= windDeg < 292.5){
        setDir(directions[6]);
      }
      else if(292.5 <= windDeg < 337.5){
        setDir(directions[7]);
      }



  const handleScroll = () => {
    // 1. Check if the screen width is wider than mobile (e.g., 768px)
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    // 2. If it is mobile, exit early (no scroll at all)
    if (!isDesktop) return;

    // 3. Otherwise, perform the smooth scroll for desktop users
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  handleScroll();
    

      


      setHum(resWeather.data.main.humidity + " %")
      console.log(resWeather.data)
      setWeatherType(resWeather.data.weather[0].description)
      console.log(resWeather.data.weather[0].icon)
      setAirSpeed(resWeather.data.wind.speed + " m/s" + ` ${Dir}`)
      setGust(resWeather.data.wind.gust + " m/s" + ` ${Dir}`)
      setPress(resWeather.data.main.pressure + " Pa")
      setTemp(((resWeather.data.main.temp) - 273.15).toFixed(1) + " °C")
      
      


      const sunriseTimestampSeconds = resWeather?.data?.sys?.sunrise; 
      const sunsetTimestampSeconds = resWeather?.data?.sys?.sunset; 
    console.log(resWeather.data.sys.sunrise)
    console.log(resWeather.data.sys.sunset)
    console.log(resWeather.data.sys.country)
    setSunrise(formatSunTime(sunriseTimestampSeconds));
    setSunset(formatSunTime(sunsetTimestampSeconds));
    setCountry("Country: " + resWeather.data.sys.country)


      if(!resWeather.data.rain){
        setRainInOneHr("Not Expected");
        return;
      }
      setRainInOneHr(resWeather?.data?.rain['1h'] + " mm/hr");
      
      // setLat(resCity.data.results[0].latitude);
      // setLon(resCity.data.results[0].longitude);


    } catch (err) {
      console.error(err);
      setError("Failed to fetch data! Try Again");
    } finally {
      setisLoading(false);
    }

      
  }
  return (
    <>

    <div className="header">
        <div className="h"><p className="md:text-md text-2xl">WEATHER</p></div>
    </div>
    <div className="curr-con md:h-19 h-0">
        <div className="curr" id="date"> 
        </div>
    </div>
    <div className="pic-sec">
        <input type="text" onChange={(e) => {
          setCity(e.target.value)
          // console.log(e.target.value)
        }} className="placeholder:text-zinc-300 md:px-33 md:py-7 tracking-[0.09rem]" placeholder="Enter Your City Name" />
        {Error &&
        <div className="remark"><p className='text-red-800 text-normal tracking-[0.06rem]'>{Error}</p></div>
        } {!Error &&
        
          <div className='remark2'><p className='text-zinc-600 text-normal tracking-[0.06rem]'>{Country}</p></div>
        
        }
        <img src={Icon} id="icon" />
        <p className="w">{WeatherType}</p>
        <img src="null" alt="" />
        <button className="tracking-[0.03rem]" disabled={isLoading} onClick={getWeatherData}>{isLoading? "Searching...":"CHECK WEATHER"}</button>
    </div>
    <div className='flex items-center justify-center md:gap-33 lg:gap-12 gap-155 flex-col w-full'>
    <div className="weather-cond h-auto flex flex-col md:flex-row gap-11 md:gap-11 lg:gap-27">
        <div className="para">
            <div className="pp">
                <p id="temp" disabled={isLoading}>{isLoading? "Loading..." : `${Temp}`}</p></div><p>Temperature</p><div><p className='text-sm'>"Temperature is, how hot or cold something</p></div><div><p className='text-sm'>is, based on how fast its tiny parts move"</p></div></div>
            <div className="para">
            <div className="pp">
                <p id="hum" disabled={isLoading}>{isLoading? "Loading..." : `${Hum}`}</p></div><p>Humidity</p><div><p className='text-sm'>"Humidity simply is, how much water</p></div><div><p className='text-sm'>vapor or wetness is in the air"</p></div></div>
            <div className="para">
            <div className="pp">
                <p id="pr" disabled={isLoading}>{isLoading? "Loading..." : `${Press}`}</p></div><p>Pressure</p><div><p className='text-sm'>"Air Pressure is the heavy push</p></div><div><p className='text-sm'>of the air, all around us"</p></div></div>
                <div className="para">
            <div className="pp">
                <p id="aqi" disabled={isLoading}>{isLoading? "Loading..." : `${AirSpeed}`}</p></div><p>Air Speed</p><div><p className='text-sm'>"Air Speed is, how fast air goes</p></div><div><p className='text-sm'>from one place to another place"</p></div></div>
        
    </div>
    <div className="weather-cond h-auto flex flex-col md:flex-row gap-11 md:gap-11 lg:gap-29">
        <div className="para">
            <div className="pp">
                <p id="temp" disabled={isLoading}>{isLoading? "Loading..." : `${Gust}`}</p></div><p>Wind Gust</p> <div><p className='text-sm'>"A wind gust is a sudden,</p></div><div><p className='text-sm'> short burst of fast wind"</p></div></div>
            <div className="para">
            <div className="pp">
                <p id="hum" disabled={isLoading}>{isLoading? "Loading..." : `${Sunrise}`}</p></div><p>Sunrise</p><div><p className='text-sm'>"Sunrise is, when the Sun</p></div><div><p className='text-sm'>comes up in the morning sky"</p></div></div>
            <div className="para">
            <div className="pp">
                <p id="pr" disabled={isLoading}>{isLoading? "Loading..." : `${Sunset}`}</p></div><p>Sunset</p><div><p className='text-sm'>"Sunset is, when the Sun</p></div><div><p className='text-sm'>goes down below the sky"</p></div></div>
                <div className="para">
            <div className="pp">
                <p id="aqi" disabled={isLoading}>{isLoading? "Loading..." : `${RainInOneHr}`}</p>
                </div><p>Rain Rate(mm/hr)</p><div><p className='text-sm'>"Rain Rate is, how many millimeters of water</p></div><div><p className='text-sm'>stack up on the ground in one hour"</p></div></div>
        
    </div>
    </div>

    <div ref={resultRef}></div>
    
    </>
  )
}

export default App