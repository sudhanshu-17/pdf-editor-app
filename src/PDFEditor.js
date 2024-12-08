import React, { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";

const PDFEditor = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [outputPdf, setOutputPdf] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPdfFile(file);
        }
    };

    const addTextToPdf = async () => {
        if (!pdfFile) return;

        // Read the PDF
        const fileReader = new FileReader();
        fileReader.onload = async () => {
            const pdfBytes = fileReader.result;

            // Load the existing PDF
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const form = pdfDoc.getForm()

// Fill the form's fields
            const fields = form.getFields();
            console.log('lets dXXXXo it', fields)


            const page = pdfDoc.getPages()[0]; // Get the first page

            const { width, height } = page.getSize();
            console.log('lets do it', width, height)

            // Adjusted text placements
            page.drawText("John Doe", { // Section 1
                x: 374, // Adjusted X coordinate
                y: 1043, // Adjusted Y coordinate
                size: 24,
                color: rgb(0.1, 0.1, 0.95),
            });

            page.drawText("Texas, USA", { // Section 3
                x: 70,
                y: height - 180,
                size: 12,
                color: rgb(0.1, 0.1, 0.95),
            });

            page.drawText("01/01/2024", { // Section 4
                x: 70,
                y: height - 270,
                size: 12,
                color: rgb(0.1, 0.1, 0.95),
            });

            page.drawText("Full Services", { // Section 5
                x: 70,
                y: height - 360,
                size: 12,
                color: rgb(0.1, 0.1, 0.95),
            });

            page.drawText("5%", { // Section 6
                x: 70,
                y: height - 450,
                size: 12,
                color: rgb(0.1, 0.1, 0.95),
            });

            page.drawText("3%", { // Section 7
                x: 70,
                y: height - 540,
                size: 12,
                color: rgb(0.1, 0.1, 0.95),
            });

            // Serialize the PDF with the added text
            const updatedPdfBytes = await pdfDoc.save();

            // Convert updated PDF to blob for downloading
            const blob = new Blob([updatedPdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setOutputPdf(url);
        };
        fileReader.readAsArrayBuffer(pdfFile);
    };

    return (
        <div>
            <h1>PDF Editor</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={addTextToPdf}>Add Text to PDF</button>

            {outputPdf && (
                <a href={outputPdf} download="updated.pdf">
                    Download Updated PDF
                </a>
            )}
        </div>
    );
};

export default PDFEditor;
