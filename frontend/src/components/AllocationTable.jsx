import React from "react";
import { useLocation } from "react-router-dom";

function AllocationTable() {
  const location = useLocation();
  const { allocations, downloadUrl } = location.state || {
    allocations: [],
    downloadUrl: "",
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Allocation Results</h1>
        {allocations.length > 0 ? (
          <>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Group ID</th>
                  <th className="py-2 px-4 border-b">Hostel Name</th>
                  <th className="py-2 px-4 border-b">Room Number</th>
                  <th className="py-2 px-4 border-b">Members Allocated</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((allocation, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">
                      {allocation["Group ID"]}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {allocation["Hostel Name"]}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {allocation["Room Number"]}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {allocation["Members Allocated"]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <a
                href={downloadUrl}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Download Allocation CSV
              </a>
            </div>
          </>
        ) : (
          <p>No allocations found.</p>
        )}
      </div>
    </div>
  );
}

export default AllocationTable;
