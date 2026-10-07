from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

# Load trained ML model
model = joblib.load("power_demand_model.pkl")


@app.route("/")
def home():
    return "AI Power Grid Demand Prediction API is Running!"


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    temperature = float(data["temperature"])
    humidity = float(data["humidity"])
    wind_speed = float(data["wind"])
    solar_generation = float(data["solar"])
    previous_demand = float(data["previousDemand"])

    input_data = [[
        temperature,
        humidity,
        wind_speed,
        solar_generation,
        previous_demand
    ]]

    prediction = model.predict(input_data)[0]

    return jsonify({
        "predicted_demand": round(float(prediction), 2)
    })


if __name__ == "__main__":
    app.run(debug=True)
