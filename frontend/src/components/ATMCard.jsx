function ATMCard({ atm, amount, isNearest }) {
const bankIcon = {

  "State Bank of India":"🏦",

  "HDFC Bank":"🔵",

  "ICICI Bank":"🟠"

};
return (

<div className="atm-card">
{
isNearest &&

<div className="recommended">

⭐ Recommended

</div>

}
<h3>

{bankIcon[atm.bank] || "🏧"} {atm.bank}

</h3>

<p className="location-row">

📍 {atm.location}

</p>


{
atm.distance !== undefined &&

<p className="distance-row">

📏 {atm.distance} km away

</p>

}


{
amount &&

<div className="available">

🟢 ₹{amount} available

</div>

}


<button className="direction-btn">

🚗 Get Directions

</button>


</div>

);

}


export default ATMCard;