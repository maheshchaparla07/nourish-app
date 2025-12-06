import React from 'react';
import { useNavigate } from 'react-router-dom';

const CarerDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">Carer Management</h1>
        
        {/* Requirement 1: Button on the right corner */}
        <button 
          onClick={() => navigate('/add-carer')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add New Carer
        </button>
      </div>

      <div className="bg-gray-100 p-8 text-center rounded">
        <p>List of carers would go here...</p>
      </div>
    </div>
  );
};

export default CarerDashboard;