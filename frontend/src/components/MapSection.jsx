import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import { useEffect } from "react";
import L from "leaflet";
import { useMapEvents } from "react-leaflet";


// Default marker fix

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"

});



// Custom icons

const userIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize:[35,35]
});


const atmIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/2830/2830284.png",
  iconSize:[35,35]
});



// Auto fit bounds

function FitBounds({atms,userLocation}){

  const map = useMap();


  useEffect(()=>{


    const points=[];


    if(userLocation){

      points.push([
        userLocation.lat,
        userLocation.lng
      ]);

    }



    atms.forEach(atm=>{

      points.push([
        Number(atm.latitude),
        Number(atm.longitude)
      ]);

    });



    if(points.length>0){

      map.fitBounds(points,{
        padding:[50,50]
      });

    }


  },[atms,userLocation,map]);



  return null;

}




function MapSection({atms,userLocation}){


const defaultCenter=[
17.9784,
79.5941
];



return (

<div className="map-section">


<h2>
ATM Locations
</h2>



<MapContainer

center={defaultCenter}

zoom={13}

style={{
height:"450px",
width:"100%",
borderRadius:"20px"
}}

>



<FitBounds

atms={atms}

userLocation={userLocation}

/>



<TileLayer

url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"

/>





{
userLocation &&

<Marker

position={[
userLocation.lat,
userLocation.lng
]}

icon={userIcon}

>

<Popup>

📍 Your Location

</Popup>


</Marker>

}




{
atms.map(atm=>(


<Marker

key={atm.id}

position={[
Number(atm.latitude),
Number(atm.longitude)
]}

icon={atmIcon}

>


<Popup>


<h3>
{atm.bank}
</h3>


<p>
{atm.location}
</p>


<p>
📏 {atm.distance} km
</p>


<a

href={`https://www.google.com/maps/dir/?api=1&destination=${atm.latitude},${atm.longitude}`}

target="_blank"

rel="noreferrer"

>

🚗 Get Directions

</a>


</Popup>


</Marker>


))

}




</MapContainer>


</div>


);


}


export default MapSection;