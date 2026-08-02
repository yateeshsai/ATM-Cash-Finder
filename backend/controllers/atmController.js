const pool = require("../db");
const calculateDistance = require("../utils/distance");
const checkCashAvailability = async (req, res) => {

    try {

        const { amount, lat, lng } = req.query;


        if (!amount) {
            return res.status(400).json({
                error: "Amount required"
            });
        }
        if(Number(amount) < 100){

    return res.status(400).json({

        error:"Minimum cash amount is ₹100"

    });

}


if(Number(amount) > 50000){

    return res.status(400).json({

        error:"Maximum cash amount is ₹50000"

    });

}

        const result = await pool.query(
            "SELECT * FROM atms WHERE cash_balance >= $1",
            [amount]
        );


        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);



        const updatedATMs = result.rows.map((atm)=>{


            const distance = calculateDistance(

                userLat,
                userLng,

                parseFloat(atm.latitude),
                parseFloat(atm.longitude)

            );


            return {

                ...atm,

                distance:Number(distance.toFixed(2))

            };


        });



        updatedATMs.sort(
            (a,b)=>a.distance-b.distance
        );



        res.json(updatedATMs);



    }
    catch(error){

        console.log(error);

        res.status(500).json({
            error:"Database error"
        });

    }

};
const getATMs = async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM atms"
        );

        res.json(result.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Database error"
        });

    }

};
const getNearbyATMs = async (req, res) => {

    try {

        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({
                error: "Latitude and longitude required"
            });
        }

        const result = await pool.query(
            "SELECT * FROM atms"
        );

        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);

        const nearbyATMs = result.rows.map(atm => {

            const distance = calculateDistance(
                userLat,
                userLng,
                parseFloat(atm.latitude),
                parseFloat(atm.longitude)
            );

            return {
                ...atm,
                distance: Number(distance.toFixed(2))
            };

        });

        nearbyATMs.sort((a, b) => a.distance - b.distance);

        res.json(nearbyATMs);


    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Database error"
        });

    }

};

const searchATMs = async (req,res)=>{

    try{

        const {location, lat, lng} = req.query;


        if(!location){

            return res.status(400).json({
                message:"Location required"
            });

        }


        const result = await pool.query(

            `
            SELECT *
            FROM atms
            WHERE location ILIKE $1
            `,

            [`%${location}%`]

        );


        const userLat = Number(lat);
        const userLng = Number(lng);


        const updatedATMs = result.rows.map((atm)=>{

            const distance = calculateDistance(

                userLat,
                userLng,

                Number(atm.latitude),
                Number(atm.longitude)

            );


            return {

                ...atm,

                distance:Number(distance.toFixed(2))

            };


        });



        updatedATMs.sort(
            (a,b)=>a.distance-b.distance
        );


        res.json(updatedATMs);


    }


    catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server error"
        });

    }

};

module.exports = {
    getATMs,
    getNearbyATMs,
    checkCashAvailability,
    searchATMs
};