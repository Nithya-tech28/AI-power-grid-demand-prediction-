```javascript
// ==========================================
// AI POWER GRID PROJECT
// FINAL PREDICTION SCRIPT
// ==========================================


// ==========================================
// FLASK API URL
// ==========================================

const API_URL = "http://127.0.0.1:5000/predict";


// ==========================================
// PREDICT POWER DEMAND
// ==========================================

async function predictDemand() {

    const temperature =
        document.getElementById("temperature").value;

    const humidity =
        document.getElementById("humidity").value;

    const wind =
        document.getElementById("wind").value;

    const solar =
        document.getElementById("solar").value;

    const previousDemand =
        document.getElementById("previousDemand").value;

    const result =
        document.getElementById("result");

    const currentDemand =
        document.getElementById("currentDemand");

    const predictedDemand =
        document.getElementById("predictedDemand");

    const gridStatus =
        document.getElementById("gridStatus");


    // ==========================================
    // CHECK INPUTS
    // ==========================================

    if (
        temperature === "" ||
        humidity === "" ||
        wind === "" ||
        solar === "" ||
        previousDemand === ""
    ) {

        if (result) {
            result.innerHTML =
                "⚠️ Please enter all values.";
        }

        return;
    }


    // ==========================================
    // SHOW LOADING
    // ==========================================

    if (result) {
        result.innerHTML =
            "⏳ AI is predicting...";
    }


    try {

        // ==========================================
        // SEND DATA TO FLASK
        // ==========================================

        const response = await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    temperature:
                        Number(temperature),

                    humidity:
                        Number(humidity),

                    wind:
                        Number(wind),

                    solar:
                        Number(solar),

                    previousDemand:
                        Number(previousDemand)

                })
            }
        );


        // ==========================================
        // CHECK RESPONSE
        // ==========================================

        if (!response.ok) {

            throw new Error(
                "Server returned error: " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "AI API Response:",
            data
        );


        // ==========================================
        // GET PREDICTION
        // ==========================================

        const prediction =
            Number(data.predicted_demand);


        if (isNaN(prediction)) {

            throw new Error(
                "Invalid prediction received from API"
            );

        }


        // ==========================================
        // DISPLAY RESULT
        // ==========================================

        if (result) {

            result.innerHTML =
                "⚡ Predicted Power Demand: " +
                prediction.toFixed(2) +
                " MW";

        }


        // ==========================================
        // CURRENT DEMAND
        // ==========================================

        if (currentDemand) {

            currentDemand.innerText =
                prediction.toFixed(2);

        }


        // ==========================================
        // PREDICTED DEMAND
        // ==========================================

        if (predictedDemand) {

            predictedDemand.innerText =
                prediction.toFixed(2);

        }


        // ==========================================
        // GRID STATUS
        // ==========================================

        if (gridStatus) {

            gridStatus.classList.remove(
                "status-low",
                "status-normal",
                "status-high"
            );


            if (prediction < 150) {

                gridStatus.innerText =
                    "🟢 Low";

                gridStatus.classList.add(
                    "status-low"
                );

            }

            else if (prediction <= 200) {

                gridStatus.innerText =
                    "🟡 Normal";

                gridStatus.classList.add(
                    "status-normal"
                );

            }

            else {

                gridStatus.innerText =
                    "🔴 High";

                gridStatus.classList.add(
                    "status-high"
                );

            }

        }


        // ==========================================
        // UPDATE GRAPH
        // ==========================================

        if (
            typeof demandChart !== "undefined" &&
            demandChart
        ) {

            const nextNumber =
                demandChart.data.labels.length + 1;


            demandChart.data.labels.push(
                "Prediction " + nextNumber
            );


            demandChart.data.datasets[0].data.push(
                prediction
            );


            demandChart.update();

        }


    }

    catch (error) {

        console.error(
            "Prediction Error:",
            error
        );


        if (result) {

            result.innerHTML =
                "❌ Cannot connect to AI Power Grid API.<br>" +
                "Please make sure Flask is running.";

        }

    }

}


// ==========================================
// LOAD SAMPLE DATA
// ==========================================

function fillSampleData() {

    document.getElementById(
        "temperature"
    ).value = 32;


    document.getElementById(
        "humidity"
    ).value = 65;


    document.getElementById(
        "wind"
    ).value = 12;


    document.getElementById(
        "solar"
    ).value = 180;


    document.getElementById(
        "previousDemand"
    ).value = 250;


    // Automatically predict

    predictDemand();

}


// ==========================================
// POWER DEMAND CHART
// ==========================================

let demandChart = null;


document.addEventListener(
    "DOMContentLoaded",
    function () {

        const canvas =
            document.getElementById(
                "demandChart"
            );


        // Chart not available on this page

        if (!canvas) {

            return;

        }


        // Chart.js not loaded

        if (
            typeof Chart === "undefined"
        ) {

            console.warn(
                "Chart.js is not loaded."
            );

            return;

        }


        const ctx =
            canvas.getContext("2d");


        demandChart = new Chart(
            ctx,
            {

                type: "line",

                data: {

                    labels: [],

                    datasets: [

                        {

                            label:
                                "Predicted Power Demand (MW)",

                            data: [],

                            borderWidth: 3,

                            tension: 0.4,

                            fill: false,

                            pointRadius: 5

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false

                }

            }

        );

    }
);
```
