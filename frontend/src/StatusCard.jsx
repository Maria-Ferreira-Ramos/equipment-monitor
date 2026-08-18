import {useState, useEffect} from "react";
import {API_BASE_URL} from "./api";
import { Link } from "react-router-dom";

function StatusCard({equipmentID, name}) {
    const [status, setStatus] = useState(null);
    const [readingValue, setReadingValue] = useState("");
    const [readingUnit, setReadingUnit] = useState("");

    function fetchStatus() {
        fetch(`${API_BASE_URL}/equipment/${equipmentID}/status`)
        .then((response) => response.json())
        .then((data) => setStatus(data));
    }

    useEffect(()=> {
        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, [equipmentID]);

    function handleAddReading(event) {
        event.preventDefault();
        fetch(`${API_BASE_URL}/equipment/${equipmentID}/readings`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                value: parseFloat(readingValue),
                unit: readingUnit,
            }),
        })

        .then((response) => response.json())
        .then(() => {
            setReadingValue("")
            setReadingUnit("")
            fetchStatus();
        });
    }

    if (!status) {
        return <p>Loading {name}...</p>;
    }
    
    return (

        <div className={`card ${status.is_anomalous ? "anomalous" : "normal"}`}>
            <h3>{status.name} </h3>
            <p className="value">
                {status.latest_value !== null ? `${status.latest_value} ${status.unit}` : "No readings yet"}
            </p>
            <p>{status.is_anomalous ? "Anomaly detected" : "Normal"} </p>

            <form onSubmit={handleAddReading} className="reading-form">
                <input 
                    type="number"
                    step="any"
                    placeholder="Value"
                    value={readingValue}
                    onChange={(e) => setReadingValue(e.target.value)}
                    required
                />

                <input 
                    type="text"
                    placeholder="Unit"
                    value={readingUnit}
                    onChange={(e) => setReadingUnit(e.target.value)}
                    required
                />

                <button type="submit">Log</button>

            </form>

            <Link to={`/equipment/${equipmentID}/logs`}>View Logs</Link>
        </div>
    );
}

export default StatusCard;