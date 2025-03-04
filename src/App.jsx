import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import { WiDayWindy } from "react-icons/wi";
import { CiCloudOn } from "react-icons/ci";
import { PiCloudRainThin } from "react-icons/pi";
import { PiThermometerLight } from "react-icons/pi";
import { BiSearch } from "react-icons/bi";
function App() {
  const [color, setColor] = useState("black");
  const [weatherInfo, setWeatherInfo] = useState({});
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [searchQuery, setSearchQuery] = useState("");
  const getWeatherInfo = async () => {
    const options = {
      method: "GET",
      url: "https://weatherapi-com.p.rapidapi.com/current.json",
      params: {
        q: searchQuery ? searchQuery : `${location?.lat}, ${location?.lon}`,
      },
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_RAPID_API_KEY,
        "x-rapidapi-host": import.meta.env.VITE_RAPID_API_HOST,
      },
    };

    try {
      const response = await axios.request(options);
      setWeatherInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getWeatherInfo();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.log(error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [searchQuery, location]);

  const getWeatherImage = () => {
    const condition = weatherInfo?.current?.condition?.text?.toLowerCase();
    if (condition?.includes("sunny") || condition?.includes("clear"))
      return "/sunny.jpg";
    if (
      condition?.includes("cloudy") ||
      condition?.includes("overcast") ||
      condition?.includes("mist")
    )
      return "/cloudy.jpg";
    if (
      condition?.includes("rain") ||
      condition?.includes("drizzle") ||
      condition?.includes("showers")
    )
      return "/rainy.jpg";
    return "/default.jpg";
  };

  // if (
  //   weatherInfo?.current?.condition?.text?.includes("cloudy") ||
  //   weatherInfo?.current?.condition?.text?.includes("overcast") ||
  //   weatherInfo?.current?.condition?.text?.includes("mist")
  // ) {
  //   return setColor("white");
  // } else {
  //   setColor("black");
  // }

  console.log(weatherInfo);

  return (
    <div className="main-container flex col">
      <div className="search-bar flex">
        <input
          type="text"
          placeholder="Search Your City"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="bg">
        <img src={getWeatherImage()} alt="Weather Condition" />
      </div>
      <div className="container flex col">
        <div className="top-container flex col">
          <h2>
            {weatherInfo?.location?.name}, {weatherInfo?.location?.country}
          </h2>
          <h1>{weatherInfo?.current?.temp_c}&nbsp;&#176;C</h1>
          <h2>{weatherInfo?.current?.condition?.text}</h2>
        </div>
        <div className="bottom-cards flex">
          <div className="card flex col">
            <div className="icon flex">
              <WiDayWindy />
            </div>
            <h1>
              {weatherInfo?.current?.wind_kph} <span>km/h</span>
            </h1>
          </div>
          <div className="card flex col">
            <div className="icon flex">
              <CiCloudOn />
            </div>
            <h1>
              {weatherInfo?.current?.cloud} <span>%</span>
            </h1>
          </div>
          <div className="card flex col">
            <div className="icon flex">
              <PiCloudRainThin />
            </div>
            <h1>
              {weatherInfo?.current?.precip_mm} <span>mm</span>
            </h1>
          </div>
          <div className="card flex col">
            <div className="icon flex">
              <PiThermometerLight />
            </div>
            <h1>
              {weatherInfo?.current?.heatindex_c} <span>&#176;C</span>{" "}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
