import express from "express"
import axios from "axios"
import bodyParser from "body-parser";
import { config } from "dotenv";
config();

const app = express();
const PORT = 3000;
const API_KEY = process.env.API_KEY;
const API_URL = "https://api.openweathermap.org/data/2.5/weather/";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//render the Homepage with the form to enter the city
app.get("/", (req, res) =>{
    try{
        res.render("homepage.ejs");
    } catch (error){
        res.statusCode(500);
        console.log(error);
    }
});

app.get("/redirect-homescreen", (req, res) =>{
    try{
        res.render("homepage.ejs");
    } catch (error){
        res.statusCode(500);
    }
});

//when submit on homepage, render the new Screen
app.post("/city", async (req, res)=>{
    const cityName = req.body.city;
    try{
        const result = await axios.get(API_URL, {
            params: {
                appid: API_KEY,
                q: cityName,
            }
        });
        console.log(result.data);
        res.render("cityScreen.ejs", {
            cityName: cityName,
            curTemp: result.data.main.temp,
            minTemp: result.data.main.temp_min,
            maxTemp: result.data.main.temp_max,
            sunrise: result.data.sys.sunrise,
            sunset: result.data.sys.sunset,
            wind: result.data.wind.speed,
            clouds: result.data.clouds.all,
            humidity: result.data.main.humidity,

        });
    }
    catch (error){
        res.render("homepage.ejs");
        console.log(JSON.stringify(error));
    }
});


app.listen(PORT, () =>{
    console.log(`The Weather-Application is running on http://localhost:${PORT}`);
});