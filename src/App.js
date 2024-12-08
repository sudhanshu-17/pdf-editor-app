import React from "react";
import "./App.css";
import PDFEditor from "./PDFEditor";
import PDFCoordinateViewer from "./PdfCoordinator"; // Import the PDFEditor component

function App() {
  return (
      <div className="App">
        <PDFEditor /> {/* Use the PDFEditor component here */}

        <h2>
            clean this shit working
        </h2>

          <PDFCoordinateViewer />
      </div>
  );
}

export default App;
