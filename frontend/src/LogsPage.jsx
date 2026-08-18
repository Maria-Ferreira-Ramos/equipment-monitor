import {useState, useEffect} from "react";
import { useParams, Link } from "react-router-dom";
import {API_BASE_URL} from "./api";

function LogsPage() {
    const {equipmentId} = useParams();
    const [readings, setReadings] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/equipment/${equipmentId}/readings?limit=10`)
        .then((response) => response.json())
        .then((data) => setReadings(data));

    }, [equipmentId]);

    return (
        <div className="app">
            <Link to="/">Back to Dashboard</Link>
            <h1>Reading History</h1>
            <table className="logs-table">
                <thead>
                    <tr>
                        <th>Value</th>
                        <th>Unit</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {readings.map((r) => (
                        <tr key={r.id}>
                            <td>{r.value}</td>
                            <td>{r.unit}</td>
                            <td>{new Date(r.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LogsPage;