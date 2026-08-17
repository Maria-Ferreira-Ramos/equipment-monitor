import { useState } from "react";
import {API_BASE_URL } from "./api";

function AddEquipmentForm( {onEquipmentAdded }) {
    const [formData, setFormData] = useState ({
        name: "",
        equipment_type: "",
        min_expected: "",
        max_expected: "",
    });
    function handleChange(event) {
        const {name, value } = event.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }

    function handleSubmit(event) {
        event.preventDefault();

        fetch(`${API_BASE_URL}/equipment`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: formData.name,
                equipment_type: formData.equipment_type,
                min_expected: parseFloat(formData.min_expected),
                max_expected: parseFloat(formData.max_expected),
            }),

        })
        .then((response) => response.json())
        .then (() => {
            setFormData({name: "", equipment_type: "", min_expected: "", max_expected:""});
            onEquipmentAdded();
        });

    }
    
    return (
        <form onSubmit={handleSubmit} className="add-form">
            <h3> Add Equipment</h3>
            <input
                name="name"
                placeholder="Name (e.g. Pump-2)"
                value={formData.name}
                onChange={handleChange}
                required
            />

            <input
                name="equipment_type"
                placeholder="Type (e.g. pump)"
                value={formData.equipment_type}
                onChange={handleChange}
                required
            />

            <input
                name="min_expected"
                type="number"
                step="any"
                placeholder="Min expected"
                value={formData.min_expected}
                onChange={handleChange}
                required
            />

            <input
                name="max_expected"
                type="number"
                step="any"
                placeholder="Max expected"
                value={formData.max_expected}
                onChange={handleChange}
                required
            />

            <button type="submit">Add</button>

        </form>
    );
}

export default AddEquipmentForm
