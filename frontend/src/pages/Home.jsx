import { useState } from "react";
import Navbar from "../components/Navbar";
import ATMCard from "../components/ATMCard";
import MapSection from "../components/MapSection";
import Footer from "../components/Footer";
function Home() {

  const [cashATMs, setCashATMs] = useState([]);

  const [amount, setAmount] = useState("");
  const [searchedAmount, setSearchedAmount] = useState("");

  const [searchedCash, setSearchedCash] = useState(false);

  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [locationATMs, setLocationATMs] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState(false);
  // Filters

  const [distanceFilter, setDistanceFilter] = useState("all");
  const [bankFilter, setBankFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("nearest");




  const checkCash = () => {

    if(!amount){

  alert("Enter required cash amount");

  return;

}


if(Number(amount) < 100){

  alert("Minimum cash search amount is ₹100");

  return;

}


if(Number(amount) > 50000){

  alert("Maximum cash search amount is ₹50000");

  return;

}

    setLoading(true);
    setLocationATMs([]);
    setSearchedLocation(false);
    navigator.geolocation.getCurrentPosition(

      (position)=>{

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;


        setUserLocation({
          lat,
          lng
        });



        fetch(
`${import.meta.env.VITE_API_URL}/api/atms/check?amount=${amount}&lat=${lat}&lng=${lng}`
)

        .then(res=>res.json())

        .then(data=>{

  setCashATMs(data);

  setSearchedAmount(amount);

  setSearchedCash(true);

  setLoading(false);

})

        .catch(error=>{

  console.log(error);

  setLoading(false);

});


      },


      ()=>{
 alert("Location permission required");
 setLoading(false);
}


    );


  };

const useCurrentLocation = () => {

  setLocationLoading(true);


  navigator.geolocation.getCurrentPosition(

    (position)=>{

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;


      setUserLocation({
        lat,
        lng
      });



      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )

      .then(res=>res.json())

      .then(data=>{


        const city =

        data.address.city ||

        data.address.town ||

        data.address.village ||

        data.address.county ||

        "";


        setLocationSearch(city);



        return fetch(
`${import.meta.env.VITE_API_URL}/api/atms/search?location=${city}&lat=${lat}&lng=${lng}`
)


      })

      .then(res=>res.json())

      .then(data=>{


        setLocationATMs(data);

        setSearchedLocation(true);

        setLocationLoading(false);


      })

      .catch(error=>{


        console.log(error);

        setLocationLoading(false);


      });


    },


    ()=>{


      alert("Unable to fetch current location");

      setLocationLoading(false);


    }


  );


};

const searchLocation = () => {

  if(!locationSearch){
    alert("Enter location");
    return;
  }


  setLocationLoading(true);


  // clear cash results
  setCashATMs([]);
  setSearchedCash(false);



  navigator.geolocation.getCurrentPosition(

    (position)=>{


      const lat = position.coords.latitude;
      const lng = position.coords.longitude;


      setUserLocation({
        lat,
        lng
      });



      fetch(
`${import.meta.env.VITE_API_URL}/api/atms/search?location=${locationSearch}&lat=${lat}&lng=${lng}`
)

      .then(res=>res.json())

      .then(data=>{

    setLocationATMs(data);

    setSearchedLocation(true);

    setLocationLoading(false);

})

      .catch(error=>{

        console.log(error);

        setLocationLoading(false);

      });


    },


    ()=>{

      alert("Location permission required");

      setLocationLoading(false);

    }


  );


};



  const applyFilters=(data)=>{

    let result=[...data];


    if(bankFilter!=="all"){

      result=result.filter(
        atm=>atm.bank===bankFilter
      );

    }



    if(distanceFilter!=="all"){

      result=result.filter(
        atm=>atm.distance <= Number(distanceFilter)
      );

    }



    if(sortOrder==="nearest"){

      result.sort(
        (a,b)=>a.distance-b.distance
      );

    }

    else{

      result.sort(
        (a,b)=>b.distance-a.distance
      );

    }


    return result;

  };




  const displayedATMs = applyFilters(cashATMs);
  const mapATMs = searchedLocation 
? locationATMs 
: displayedATMs;
  const nearestATM = 
  displayedATMs.length > 0
  ?
  displayedATMs.reduce((nearest, atm) =>
    atm.distance < nearest.distance ? atm : nearest
  )
  :
  null;







return (

<div className="home">


<Navbar />



<section 
className="hero"
id="home"
>


<h1>
Find Cash.
<span> Find ATMs.</span>
</h1>


<p>
Search ATMs by location or check cash availability near you in seconds.
</p>

<div className="hero-features">

<span>📍 Location Search</span>

<span>💵 Cash Availability</span>

<span>🧭 Smart Navigation</span>

</div>

<div className="search-card">
<h3>📍 Find ATMs by Location</h3>

<div className="location-search">


<input

type="text"

placeholder="Search ATMs..."

value={locationSearch}

onChange={(e)=>
setLocationSearch(e.target.value)
}

/>

<button

className="current-location-btn"

onClick={useCurrentLocation}

>

📍 Use My Current Location

</button>
<button 
onClick={searchLocation}
disabled={locationLoading}
>

{
locationLoading
?
"⏳ Searching..."
:
"🔍 Find ATM"
}

</button>

{
locationLoading &&

<div className="loading-box">

<div className="spinner"></div>

<p>
Searching ATMs in {locationSearch}...
</p>

</div>

}
</div>
</div>


<div className="search-card">
<h3>💵 Check Cash Availability</h3>

<div className="cash-check">

<input

type="number"

placeholder="Enter required cash amount"

min="100"

max="50000"

value={amount}

onChange={(e)=>{

const value = Number(e.target.value);

if(value <= 50000){

setAmount(e.target.value);

}

}}

/>


<button 
onClick={checkCash}
disabled={loading}
>

💰 Check Availability

</button>


{
loading &&

<div className="loading-box">

<div className="spinner"></div>

<p>
Searching nearby ATMs...
</p>

</div>

}


</div>
</div>






{
searchedCash &&

<div className="filters">



<label>

Distance:

<select

value={distanceFilter}

onChange={(e)=>
setDistanceFilter(e.target.value)
}

>

<option value="all">
All
</option>


<option value="1">
Within 1 km
</option>


<option value="5">
Within 5 km
</option>


<option value="10">
Within 10 km
</option>


</select>

</label>





<label>

Bank:

<select

value={bankFilter}

onChange={(e)=>
setBankFilter(e.target.value)
}

>

<option value="all">
All Banks
</option>


<option value="State Bank of India">
SBI
</option>


<option value="HDFC Bank">
HDFC
</option>


<option value="ICICI Bank">
ICICI
</option>


</select>

</label>





<label>

Sort:

<select

value={sortOrder}

onChange={(e)=>
setSortOrder(e.target.value)
}

>


<option value="nearest">
Nearest First
</option>


<option value="farthest">
Farthest First
</option>


</select>


</label>





<button

onClick={()=>{

setDistanceFilter("all");
setBankFilter("all");
setSortOrder("nearest");

}}

>

Reset Filters

</button>



</div>

}



</section>


{
searchedLocation &&

<section className="atm-section">

<h2>
ATMs in {locationSearch}
</h2>


<div className="atm-grid">


{
locationATMs.length > 0

?

locationATMs.map(atm=>(

<ATMCard

key={atm.id}

atm={atm}

/>

))


:

<h3>
😔 No ATMs found in this location
</h3>

}


</div>

</section>

}





<section 
className="atm-section"
id="explore"
>


{
searchedCash && displayedATMs.length>0 &&

<div className="result-title">

<h2>
ATMs Available for ₹{searchedAmount}
</h2>

<p>
{displayedATMs.length} ATM{displayedATMs.length > 1 ? "s" : ""} found near you
</p>

</div>

}



<div className="atm-grid">



{

displayedATMs.length>0

?

displayedATMs.map((atm)=>(

<ATMCard

key={atm.id}

atm={atm}

amount={searchedAmount}

isNearest={
  displayedATMs.length > 1 &&
  atm.id === nearestATM?.id
}

/>

))


:


searchedCash &&

<div className="no-results">

<h3>
😔 No ATMs found
</h3>

<p>
No ATM has enough cash for ₹{searchedAmount}
</p>

<div>

Try:
<br/>
• Increasing search distance
<br/>
• Reducing required amount
<br/>
• Selecting another bank

</div>

</div>


}



</div>


</section>






<MapSection

atms={mapATMs}

userLocation={userLocation}

/>


<Footer />

</div>


);


}


export default Home;