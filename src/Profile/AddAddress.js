import React, { useState } from "react";
import './AddAddress.css'; 
import configDetails from "../Config/Config";

const AddAddress = ({ onClose, userEmail, authIdToken }) => {
    const [addressDetails, setAddressDetails] = useState({
        name:"",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        phone: ""
    });

    const US_STATES = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
        "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
        "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
        "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
        "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
        "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
        "West Virginia", "Wisconsin", "Wyoming"
    ];


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "zip") {
            const newValue = value.replace(/[^\d]/g, '').slice(0, 5);
            setAddressDetails((prevDetails) => ({
                ...prevDetails,
                [name]: newValue
            }));
        } else if (name === "phone") {
            const newValue = value.replace(/\D/g, '').slice(0, 10);
            setAddressDetails((prevDetails) => ({
                ...prevDetails,
                [name]: newValue
            }));
        } else {
            setAddressDetails((prevDetails) => ({
                ...prevDetails,
                [name]: value
            }));
        }
    };

    const handleAddAddress = async () => {
        try {
            const response = await fetch(`${configDetails.baseUrl}${configDetails.addAddress}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':authIdToken
                },
                body: JSON.stringify({
                    name: addressDetails.name,
                    email: userEmail,
                    address1: addressDetails.address1,
                    address2: addressDetails.address2,
                    city: addressDetails.city,
                    state: addressDetails.state,
                    zip: parseInt(addressDetails.zip),
                    phone: "+1"+addressDetails.phone
                })
            });

            if (response.ok) {
                onClose();
            } else {
                console.error('Failed to add address:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding address:', error);
        }
    };

    return (
        <div className="popup">
            <div className="popup-content" style={{backgroundColor:'lightgrey'}}>
                <h2>Add New Address</h2>
                <div className="input-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={addressDetails.name} onChange={handleInputChange} placeholder="Name" />
                </div>
                <div className="input-group">
                    <label>Address Line 1:</label>
                    <input type="text" name="address1" value={addressDetails.address1} onChange={handleInputChange} placeholder="Address Line 1" />
                </div>
                <div className="input-group">
                    <label>Address Line 2:</label>
                    <input type="text" name="address2" value={addressDetails.address2} onChange={handleInputChange} placeholder="Address Line 2" />
                </div>
                <div className="input-group">
                    <label>City:</label>
                    <input type="text" name="city" value={addressDetails.city} onChange={handleInputChange} placeholder="City" />
                </div>
                <div className="input-group">
                    <label htmlFor="state">State:</label>
                    <select id="state" name="state" value={addressDetails.state} onChange={handleInputChange}>
                        <option value="">Select a state</option>
                        {US_STATES.map((state) => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="zip">ZIP Code:</label>
                    <input type="text" id="zip" name="zip" value={addressDetails.zip} onChange={handleInputChange} placeholder="ZIP Code" pattern="\d{5}" title="ZIP Code should be 5 digits" />
                </div>
                <div className="input-group">
                    <label htmlFor="phone">Phone Number:</label>
                    <input type="tel" id="phone" name="phone" value={addressDetails.phone} onChange={handleInputChange} placeholder="10 Digits" />
                </div>
                <div className="button-group">
                    <button className="add-btn"  onClick={handleAddAddress}>Add Address</button>
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddAddress;
