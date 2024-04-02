import React, { useState, useEffect } from "react";
import './AddAddress.css'; 
import configDetails from "../Config/Config";

const UpdateAddress = ({ onClose, userEmail, address, authIdToken }) => {
    const [addressDetails, setAddressDetails] = useState({
        id:address.id,
        name: address.name,
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        phone: address.phone
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

    useEffect(() => {
        // Update address details when the address prop changes
        setAddressDetails({
            name: address.name,
            address1: address.address1,
            address2: address.address2,
            city: address.city,
            state: address.state,
            zip: address.zip,
            phone: address.phone
        });
    }, [address]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "zip") {
            const newValue = value.replace(/[^\d]/g, '').slice(0, 5);
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

    const handleUpdateAddress = async () => {
        try {
            const response = await fetch(`${configDetails.baseUrl}${configDetails.updateAddress}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':authIdToken
                },
                body: JSON.stringify({
                    id:address.id,
                    name: addressDetails.name,
                    email: userEmail,
                    address1: addressDetails.address1,
                    address2: addressDetails.address2,
                    city: addressDetails.city,
                    state: addressDetails.state,
                    zip: parseInt(addressDetails.zip),
                    phone: addressDetails.phone
                })
            });

            if (response.ok) {
                onClose();
            } else {
                console.error('Failed to update address:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <h2>Update Address</h2>
                <div className="input-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={addressDetails.name} onChange={handleInputChange} placeholder="Name" />
                </div>
                <div className="input-group">
                    <label htmlFor="address1">Address 1:</label>
                    <input type="text" id="address1" name="address1" value={addressDetails.address1} onChange={handleInputChange} placeholder="Address Line 1" />
                </div>
                <div className="input-group">
                    <label htmlFor="address2">Address 2:</label>
                    <input type="text" id="address2" name="address2" value={addressDetails.address2} onChange={handleInputChange} placeholder="Address Line 2" />
                </div>
                <div className="input-group">
                    <label htmlFor="city">City:</label>
                    <input type="text" id="city" name="city" value={addressDetails.city} onChange={handleInputChange} placeholder="City" />
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
                    <input type="text" id="zip" name="zip" value={addressDetails.zip} onChange={handleInputChange} placeholder="ZIP Code" />
                </div>
                <div className="input-group">
                    <label htmlFor="phone">Phone Number:</label>
                    <input type="tel" id="phone" name="phone" value={addressDetails.phone} onChange={handleInputChange} placeholder="+1XXXXXXXXXX" />
                </div>
                <button onClick={handleUpdateAddress}>Update Address</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default UpdateAddress;
