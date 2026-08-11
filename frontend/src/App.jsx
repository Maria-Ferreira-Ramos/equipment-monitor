import {useState, useEffect} from "react";
import StatusCard from "./StatusCard";
import "./App.css"
import {API_BASE_URL} from "./api";

function App() {
  const [equipmentList, setEquipmentList] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/equipment`)
      .then((response) => response.json())
      .then((data) => setEquipmentList(data));

  }, []);

  return (
    <div className="app">
      <h1>Equipment Monitoring Dashboard</h1>
      <div className="grid">
        {equipmentList.map((eq) => (
          <StatusCard key={eq.id} equipmentID={eq.id} name={eq.name} />
        ))}
      </div>
    </div>
  );
}

export default App;