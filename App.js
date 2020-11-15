window.addEventListener("load", () => {
  let long;
  let lat;
  let temperatureDesc = document.querySelector(".temperature-description");
  let temperatureDegree = document.querySelector(".temperature-degree");
  let locationTimezone = document.querySelector(".location-timezone");
  let temperatureSpan = document.querySelector(".temperature span");
  const celsiusIcon = "&#8451";
  const farenhajtIcon = "&#8457";
  let x = 1;

  navigator.geolocation.getCurrentPosition(
    position => runApp(position),
    () => {
      temperatureDegree.textContent = "You must allow location permission!";
      console.log("Error");
    }
  );

  const runApp = position => {
    long = position.coords.longitude;
    lat = position.coords.latitude;

    const proxy = "https://cors-anywhere.herokuapp.com/";
    const api = `${proxy}https://api.darksky.net/forecast/3743cdf924b6b53351465cd2ff192b65/${lat},${long}`;

    fetch(api)
      .then(response => response.json())
      .then(data => {
        //console.log(data);
        const { temperature, summary, icon } = data.currently;
        //Set DOM Element from API
        temperatureDegree.textContent = Math.floor(
          (temperature - 32) * (5 / 9)
        );
        temperatureDesc.textContent =
          summary === "Overcast" ? "Oblacno" : summary;
        locationTimezone.textContent = data.timezone;
        temperatureSpan.innerHTML = celsiusIcon;
        //Set Icon
        setIcons(icon, document.querySelector(".icon"));

        //Change tepmerature to Celsius/Farenhajt
        temperatureDegree.addEventListener("click", () => {
          if (x === 0) {
            temperatureSpan.innerHTML = celsiusIcon;
            temperatureDegree.textContent = Math.floor(
              (temperature - 32) * (5 / 9)
            );
            x = 1;
          } else {
            temperatureSpan.innerHTML = farenhajtIcon;
            temperatureDegree.textContent = temperature;
            x = 0;
          }
        });
      })
      .catch(err => {
        temperatureDegree.textContent =
          "There was an Error! The server was unreachable";
        console.log(err);
      });
  };

  function setIcons(icon, iconId) {
    const skycons = new Skycons({ color: "white" });
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconId, Skycons[currentIcon]);
  }
});
