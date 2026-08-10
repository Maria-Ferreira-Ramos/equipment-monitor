import {useState, useEffect} from "react";
import StatusCard from "./StatusCard";

function App() {
  const [equipmentList, setEquipmentList] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/equipment")
      .then((response) => response.json())
      .then((data) => setEquipmentList(data));

  }, []);

  return (
    <div>
      <h1>Equipment Monitoring Dashboard</h1>
      {equipmentList.map((eq) => (
        <StatusCard key={eq.id} equipmentID={eq.id} name={eq.name} />
      ))}
    </div>
  );
}

export default App;