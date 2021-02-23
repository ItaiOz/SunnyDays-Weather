(function() {
    document.addEventListener('DOMContentLoaded', function () {
        //function to load data to dropdown when dom is loaded
        addLocationsToList();
        //the event listeners for every event happens on the website
        document.getElementById("add btn").addEventListener("click", addCity);
        document.getElementById("display").addEventListener("click", gettingForecast);
        document.getElementById("delete").addEventListener("click", deleteLocation);
        document.getElementById("reset").addEventListener("click", resetData);
        document.getElementById("drop").addEventListener("change", setLocation);
    })

    //function to reset the whole table while clicked on
    function resetData(){ fetch('/api/reset', {method: 'DELETE'})
        .then(
            function (response) {
                // handle the error
                if (response.status !== 200) {
                    document.querySelector("#data").innerHTML = 'Looks like there was a problem. Status Code: ' +
                        response.status;
                    return;
                }

                // Examine the response and generate the HTML
                response.json().then(function (data) {
                    if (data.error)     //if we got an error
                        console.log('Request failed');
                    else {
                        //moving to function to get new data from server
                        // (which is nothing but we still need to update)
                        addLocationsToList();
                        fillLog.fillNote("All locations have been cleared from the table")

                    }
                }).catch(function (error) {     //in case we got an error
                    console.log('Request failed', error);
                });

            })
    }

    //main function of API that sends a request and get a user's locations each time
    function addLocationsToList(){

        fetch('/api/resources', {method: 'GET'})
            .then(
                function (response) {
                    // handle the error
                    if (response.status !== 200) {
                        document.querySelector("#data").innerHTML = 'Looks like there was a problem. Status Code: ' +
                            response.status;
                        return;
                    }
                    // Examine the response and generate the HTML
                    response.json().then(function (data) {
                        addToDropdown(data);            //to make a cleaner code, I have created a function to add the data seperately

                    }).catch(function (error) {
                        console.log('Request failed', error);
                    });

                })
    }

    //we dont want double code so we are creating this function to add elements to dropdown form the api
    //(in delete method and when dom loads)
    function addToDropdown(data){

        //resetting dropdown and inner array
        document.querySelector("#drop").innerHTML = "";
        locations = [];

        //creating first element which is the default one
        let newDiv = document.createElement("option")
        newDiv.text = "Location";
        newDiv.id = "Location";
        newDiv.className = "opt";
        document.getElementById("drop").appendChild(newDiv);

        //adding elements to dropdown menu
        for(i in data) {
            let newDiv = document.createElement("option")
            newDiv.text = data[i].location;
            newDiv.id = data[i].location;
            newDiv.className = "opt";
            let loc = {
                name: data[i].location,
                longitude: data[i].longitude,
                latitude: data[i].latitude
            };
            locations.push(loc);        //adding elements to the array
            document.getElementById("drop").appendChild(newDiv);
        }

        if (locations.length === 0) {
            document.getElementById("display").setAttribute('disabled', 'disabled');
            document.getElementById("delete").setAttribute('disabled', 'disabled');
        }

        //empty the input boxes
        document.querySelector("#city").value = "";
        document.querySelector("#longitude").value = "";
        document.querySelector("#latitude").value = "";

    }

    //namespace for validation of fields
    let validateFunc = (function(){
        //validate empty input
        let checkLen = function(str){
            return str.length === 0;
        }
        //validate if a number contains numbers only
        let checkIfLettersOnly = (function (str){
            return(/^[a-zA-Z\- ]+$/.test(str));
        })
        //validate if number is in range
        let checkRange = (function(num, min, max){
            return num >=min && num <=max;
        })
        //validate if variable is a number
        let checkVar = (function (x){
            return parseInt(x);
        })

        return{
            isEmpty : checkLen,
            isString : checkIfLettersOnly,
            inRange : checkRange,
            isInteger : checkVar,
        }

    })();

    //a namespace for filling the log beneath the input boxes
    let fillLog = (function(){

        let addNote = function(str){
            let errorLog = document.querySelector("#errors");
            document.querySelector(".errorList").innerHTML = "";
            errorLog.innerHTML = '';
            let newDiv = document.createElement("p");
            newDiv.className = "note";
            let txt = document.createTextNode(str);
            newDiv.appendChild(txt);
            errorLog.appendChild(newDiv);
        }

        let addError = function(str, event){
            event.preventDefault();
            let errorLog = document.querySelector("#errors");
            let noteLog = document.querySelector(".errorList");
            noteLog.innerHTML = '';
            let newDiv = document.createElement("p");
            newDiv.className = "errNote";
            let txt = document.createTextNode(str);
            newDiv.appendChild(txt);
            errorLog.appendChild(newDiv);
        }

        return{
            fillNote : addNote,
            fillError: addError
        }
    })();


let lat;
let lon;


//in this function we are handling situation when we have chosen one location.
// we can either choose do delete the particular location or delete it from list
function setLocation() {

    let box = document.getElementById("box");
    box.style.display = "none";

    let cast = document.querySelector("#fcast");

    for(let i = 0; i < cast.children.length; i++)
        cast.children[i].innerHTML = "";

    let title = document.querySelector("#disp");
    title.innerHTML = "";
    document.images[2].src = "";

    let e = document.getElementById("drop");
    let errorLog = document.getElementById("errors");
    errorLog.innerHTML = '';

    if (e.value !== "Location") {
        document.getElementById("delete").removeAttribute('disabled');
        document.getElementById("display").removeAttribute('disabled');

        for (let i = 0; i < locations.length; i++)
            if (e.value === locations[i].name) {
                lon = locations[i].longitude;
                lat = locations[i].latitude;
                selected = i;
                break;
            }

    }
    else {
        document.getElementById("display").setAttribute('disabled', 'disabled');
        document.getElementById("delete").setAttribute('disabled', 'disabled');
    }
}


//in this function we will handle things when we pressed on the "delete" function
//we will remove the object from the array
function deleteLocation() {
    fetch('/api/delete/' + document.querySelector("#drop").value, {method: 'DELETE'})
        .then(
            function (response) {
                // handle the error
                if (response.status !== 200) {
                    document.querySelector("#data").innerHTML = 'Looks like there was a problem. Status Code: ' +
                        response.status;
                    return;
                }
                // Examine the response and generates the HTML
                response.json().then(function (data) {
                    if (data !== 1)
                        console.log('Request failed');
                    else {
                        let currDelete = document.querySelector("#drop").value;
                        addLocationsToList();
                        fillLog.fillNote(currDelete + " has deleted successfully");
                    }
                }).catch(function (error) {
                    console.log('Request failed', error);
                });


            })

}

    let locations = []
    let selected;
    let myImages = { //I'm creating an object to make it easier to get source images
        "clear": "http://www.7timer.info/img/misc/about_civil_clear.png",
        "pcloudy": "http://www.7timer.info/img/misc/about_civil_pcloudy.png",
        "cloudy": "http://www.7timer.info/img/misc/about_civil_mcloudy.png",
        "mcloudy": "http://www.7timer.info/img/misc/about_civil_mcloudy.png",
        "vcloudy": "http://www.7timer.info/img/misc/about_civil_cloudy.png",
        "foggy": "http://www.7timer.info/img/misc/about_civil_fog.png",
        "lightrain": "http://www.7timer.info/img/misc/about_civil_lightrain.png",
        "oshower": "http://www.7timer.info/img/misc/about_civil_oshower.png",
        "ishower": "http://www.7timer.info/img/misc/about_civil_ishower.png",
        "humid": "http://www.7timer.info/img/misc/about_civil_ishower.png",
        "lightsnow": "http://www.7timer.info/img/misc/about_civil_rainsnow.png",
        "rain": "http://www.7timer.info/img/misc/about_civil_rain.png",
        "snow": "http://www.7timer.info/img/misc/about_civil_snow.png",
        "rainsnow": "http://www.7timer.info/img/misc/about_civil_rainsnow.png",
    }

    let myDays = {      //creating object to return what day is it of the week
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday"
    }


    function addCity(event) {

        //this function is first of all checking to see if
        //we have any errors on inserting data. if not we're adding the city into to dropdown menu
        let errorLog = document.getElementById("errors");
        errorLog.innerHTML = "";

        let error = false;

        let city = document.getElementById('city').value;

        //using map functionality to find if the object exists already in the array
        //if it does, we dont add the city once again and return
        if (locations.find((item) => item.name === city) !== undefined) {
            fillLog.fillError("City name is already in the list", event)
            return;
        }

        //city name validation
        if (validateFunc.isInteger(city) || validateFunc.isEmpty(city.trim()) || !validateFunc.isString(city)) {
            error = true;
            fillLog.fillError("City name is invalid", event);
        }
        //longitude validation
        lon = document.getElementById('longitude').value;
        if (!validateFunc.isInteger(lon) || !validateFunc.inRange(lon, -180, 180) ||
            validateFunc.isEmpty(lon)) {
            error = true;
            fillLog.fillError("Longitude is invalid", event);
        }
        //latitude validation
        lat = document.getElementById('latitude').value;
        if (!validateFunc.isInteger(lat) || !validateFunc.inRange(lat, -90, 90) ||
            validateFunc.isEmpty(lat)) {
            error = true;
            fillLog.fillError("Latitude is invalid", event);
        }
        //if no errors were found were creating a new object and pushing to the array
        if (!error) {

            let info = {
                name: city,
                longitude: lon,
                latitude: lat
            };

            fetch('/api/add', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(info)
            })
                .then(function (response) {
                    // handle the error
                    if (response.status !== 200) {
                        document.querySelector("#data").innerHTML = 'Looks like there was a problem. Status Code: ' +
                            response.status;
                    }
                })
                .then(() => {
                    addLocationsToList()
                    fillLog.fillNote(city + " has been added")


                })
                .catch(function (error) {
                    console.log('Request failed', error);
                    //then fetch
                });

            //were clearing the text boxes
            document.getElementById('city').value = "";
            document.getElementById('latitude').value = "";
            document.getElementById('longitude').value = "";

        }
    }

    //function to add the data from the API into the daily boxes
    function addData(daysblock, temp, num){
        let newDiv = document.createElement("p");
        let txt = document.createTextNode(temp);
        newDiv.appendChild(txt);
        daysblock.children[num].appendChild(newDiv);
    }

    //we will get this function when we want to get the API, access the details inside
    //and present them on then screen. we will show. images, temperature and wind
    function gettingForecast(){

            document.getElementById("display").setAttribute('disabled', 'disabled');

            //loading the "loading" gif
            document.images[1].src = "/images/load.gif";
            document.images[1].width = 60;
            document.images[1].height = 60;
            document.images[1].style.float = "right";


            fetch('http://www.7timer.info/bin/api.pl?lon='+lon+'&lat='+lat+'&product=civillight&output=json')
                .then(
                    function (response) {
                        // handle the error - for example pass a bad URL to the loadMenu function
                        if (response.status !== 200) {
                            document.querySelector("#menu").innerHTML = 'Looks like there was a problem. ' +
                                'Status Code: ' +
                                response.status;
                            return;
                        }
                    response.json().then(function(data){


                        document.getElementById("box").style.display = "block";

                        //clear error log if there is data
                         let errorLog = document.getElementById("errors");
                         errorLog.innerHTML = '';

                         //query selector for an easier search
                         let daysblock = document.querySelector("#fcast")

                         let cc = document.getElementById("drop").value;
                         //setting the header for the title
                         let newDiv = document.createElement("h3");
                         let txt = document.createTextNode("Here is the forecast for the next 7 days in " + cc + ":");
                         newDiv.style.textAlign = "center";
                         newDiv.appendChild(txt);
                         document.getElementById("disp").appendChild(newDiv);

                         let d = new Date();
                         let currDay;

                         for(let i = 0; i < data.dataseries.length; i++) {

                             newDiv = document.createElement("br")
                             daysblock.children[i].appendChild(newDiv);

                             //adding relevant image
                             newDiv = document.createElement("img");
                             newDiv.src = myImages[data.dataseries[i].weather];
                             daysblock.children[i].appendChild(newDiv);

                             //adding to breaks to create a gap
                             newDiv = document.createElement("br")
                             daysblock.children[i].appendChild(newDiv);
                             newDiv = document.createElement("br")
                             daysblock.children[i].appendChild(newDiv);

                             //adding the day of the week
                             if((d.getDay() + i) > 6)
                                 currDay = ((d.getDay() + i) % 6) - 1;
                             else currDay = d.getDay() + i;

                             //we can't move these tasks to a general function because we're adding a class to the nodes
                             newDiv = document.createElement("p");
                             txt = document.createTextNode(myDays[currDay]);
                             newDiv.appendChild(txt);
                             newDiv.className = "dayname";
                             daysblock.children[i].appendChild(newDiv);


                             //adding the weather condition for today
                             addData(daysblock, data.dataseries[i].weather, i);

                             //adding the temperatures for today
                             addData(daysblock, "High: " + data.dataseries[i].temp2m.max + "°C", i);
                             addData(daysblock, "Low: " + data.dataseries[i].temp2m.min + "°C", i);

                             //adding wind speed for today
                             if (data.dataseries[i].wind10m_max > 10.8){
                                 newDiv = document.createElement("img");
                                 newDiv.src = "http://www.7timer.info/img/misc/about_civil_windy.png"
                                 document.getElementById("d" + (i + 1)).appendChild(newDiv);
                             }
                             else if(data.dataseries[i].wind10m_max > 1)
                                 addData(daysblock, "Wind: " + data.dataseries[i].wind10m_max + "m/s", i);

                         }

                         //add the image for the weekly forecast
                         document.images[9].src = "http://www.7timer.info/bin/astro.php?%20lon="+lon+
                             "&lat="+lat+"&ac=0&lang=en&unit=metric&output=internal&tzshift=0";
                         document.images[1].src = "";
                         document.images[1].height = 0;
                         document.images[1].width = 0;

                    }

                    );

                    })
                // .then(res => res.json())
                // .then(json => console.log(JSON.stringify ( json) ) )
                .catch(function (err) {
                    console.log('Fetch Error:', err);
                    fillLog.fillError("The service is not available at the moment, please try again later", event)
                });


    }
})();
