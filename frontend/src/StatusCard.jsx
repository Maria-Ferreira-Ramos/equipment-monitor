import {useState, useEffect} from "react";
import {API_BASE_URL} from "./api";

function StatusCard({equipmentID, name}) {
    const [status, setStatus] = useState(null);

    useEffect(()=> {
        fetch(`${API_BASE_URL}/equipment/${equipmentID}/status`)
        .then((response) => response.json())
        .then((data) => setStatus(data));
    }, [equipmentID]);

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
        </div>
    );
}

export default StatusCard;