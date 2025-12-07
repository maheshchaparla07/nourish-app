import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

// Map container style
const containerStyle = {
  width: '100%',
  height: '400px'
};

// Default center (e.g., London) before user pins address
const defaultCenter = {
  lat: 51.505,
  lng: -0.09
};

const AddCarer: React.FC = () => {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  // Map State
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);

  // Load Google Maps Script
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY_HERE" // REPLACE THIS
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Requirement 2: Pin on map when address is added
  const handlePinAddress = () => {
    if (!formData.address) return;

    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ address: formData.address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        const newPos = { lat: location.lat(), lng: location.lng() };
        
        // Update map view and place marker
        setMapCenter(newPos);
        setMarkerPosition(newPos);
      } else {
        alert('Geocode was not successful: ' + status);
      }
    });
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Add New Carer Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Form Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input 
              name="name" type="text" 
              className="w-full border p-2 rounded" 
              onChange={handleChange} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input 
              name="phone" type="tel" 
              className="w-full border p-2 rounded" 
              onChange={handleChange} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              name="email" type="email" 
              className="w-full border p-2 rounded" 
              onChange={handleChange} 
            />
          </div>
          
          {/* Address Field with Pin Action */}
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <div className="flex gap-2">
              <input 
                name="address" type="text" 
                placeholder="Enter street, city, zip"
                className="w-full border p-2 rounded" 
                onChange={handleChange} 
              />
              <button 
                onClick={handlePinAddress}
                className="bg-green-600 text-white px-3 py-2 rounded text-sm whitespace-nowrap"
              >
                Pin on Map
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Click "Pin on Map" to update location.</p>
          </div>
        </div>

        {/* Right Column: Google Map */}
        <div className="border rounded overflow-hidden">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={14}
          >
            {/* Show marker only if address is successfully pinned */}
            {markerPosition && <Marker position={markerPosition} />}
          </GoogleMap>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Save Carer
        </button>
      </div>
    </div>
  );
};

export default AddCarer;