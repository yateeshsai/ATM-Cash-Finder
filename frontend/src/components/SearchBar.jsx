import { useState } from "react";

function SearchBar() {

  const [location, setLocation] = useState("");

  function getLocation() {

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        (position) => {

          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          setLocation(
            `${lat.toFixed(4)}, ${lon.toFixed(4)}`
          );

        },
        () => {
          alert("Location access denied");
        }
      );

    }

  }


  return (
    <div className="search-box">

      <input
        type="text"
        value={location}
        placeholder="Search your location..."
        readOnly
      />

      <button onClick={getLocation}>
        Find ATM
      </button>

    </div>
  );
}

export default SearchBar;