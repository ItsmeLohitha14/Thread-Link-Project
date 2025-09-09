// src/pages/UserRequests.jsx

import React from "react";

const UserRequests = () => {
  return (
    <div className="bg-white p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-10">My Requests</h2>
      </div>

      <div className="text-gray-600">
        <p>No requests yet.</p>
      </div>
    </div>
  );
};

export default UserRequests;
