import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UploadForm from "./components/UploadForm";
import AllocationTable from "./components/AllocationTable";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadForm />} />
        <Route path="/results" element={<AllocationTable />} />
      </Routes>
    </Router>
  );
}

export default App;
