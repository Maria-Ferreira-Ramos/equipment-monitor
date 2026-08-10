import {useState, useEffect} from "react";

function StatusCard({equipmentID, name}) {
    const [status, setStatus] = useState(null);

    useEffect(()=> {
        fetch(`http://127.0.0.1:8000/equipment/${equipmentID}/status`)
        .then((response) => response.json())
        .then((data) => setStatus(data));
    }, [equipmentID]);

    if (!status) {
        return <p>Loading {name}...</p>;
    }
    
    return (

        <div>
            <h3>{status.name} </h3>
            <p>{status.latest_value !== null ? `${status.latest_value} ${status.unit}` : "No readings yet"}</p>
            <p>{status.is_anomalous ? "Anomaly detected" : "Normal"} </p>
        </div>
    );
}

export default StatusCard;