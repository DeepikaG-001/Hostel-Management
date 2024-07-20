import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadForm() {
  const [groupFile, setGroupFile] = useState(null);
  const [hostelFile, setHostelFile] = useState(null);
  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("groupFile", groupFile);
    formData.append("hostelFile", hostelFile);

    try {
      const response = await axios.post("/upload", formData);
      const { allocations, downloadUrl } = response.data;
      navigate("/results", { state: { allocations, downloadUrl } });
    } catch (error) {
      console.error("Error uploading files", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Hostel Room Allocation</h1>
        <form onSubmit={handleFileUpload}>
          <div className="mb-4">
            <label className="block text-gray-700">
              Group Information File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setGroupFile(e.target.files[0])}
              className="mt-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Hostel Information File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setHostelFile(e.target.files[0])}
              className="mt-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Upload and Allocate
          </button>
        </form>
      </div>
    </div>
  );
}
export default UploadForm;
