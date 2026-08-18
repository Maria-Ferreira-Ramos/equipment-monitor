import {useState, useEffect} from "react";
import { Routes, Route } from "react-router-dom";
import StatusCard from "./StatusCard";
import AddEquipmentForm from "./AddEquipmentForm";
import LogsPage from "./LogsPage";
import "./App.css";
import {API_BASE_URL} from "./api";

function Dashboard() {
  const [equipmentList, setEquipmentList] = useState([]);

  function fetchEquipmentList() {
    fetch(`${API_BASE_URL}/equipment`)
    .then((response) => response.json())
    .then((data) => setEquipmentList(data));
  }

  useEffect(() => {
    fetchEquipmentList();
  }, []);

  return (
    <div className="app">
      <h1>Equipment Monitoring Dashboard</h1>
      <div className="layout">
        <AddEquipmentForm onEquipmentAdded={fetchEquipmentList} />
        <div className="grid">
          {equipmentList.map((eq) => (
            <StatusCard key={eq.id} equipmentID={eq.id} name={eq.name} />
          ))}
        </div>
      </div>
    </div>
  );
}


function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/equipment/:equipmentId/logs" element={<LogsPage />} />
    </Routes>
  );
}

export default App;