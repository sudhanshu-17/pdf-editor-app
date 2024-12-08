import React, { useEffect, useRef, useState } from "react";
import { getDocument } from "pdfjs-dist";

// Set the worker source
import { GlobalWorkerOptions } from "pdfjs-dist";
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

const PDFCoordinateViewer = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfInstance, setPdfInstance] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const canvasRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPdfFile(fileReader.result);
            };
            fileReader.readAsArrayBuffer(file);
        }
    };

    useEffect(() => {
        if (pdfFile) {
            const loadPdf = async () => {
                const loadingTask = getDocument({ data: pdfFile });
                const pdf = await loadingTask.promise;
                setPdfInstance(pdf);
            };
            loadPdf();
        }
    }, [pdfFile]);

    useEffect(() => {
        if (pdfInstance && canvasRef.current) {
            const renderPage = async () => {
                const page = await pdfInstance.getPage(pageNum);
                const viewport = page.getViewport({ scale: 1.5 });

                const canvas = canvasRef.current;
                const context = canvas.getContext("2d");
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({ canvasContext: context, viewport }).promise;
            };
            renderPage();
        }
    }, [pdfInstance, pageNum]);

    const handleCanvasClick = async (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left; // X-coordinate relative to canvas
        const y = e.clientY - rect.top; // Y-coordinate relative to canvas

        // Get the page object from pdfjs-dist
        const page = await pdfInstance.getPage(pageNum);

        // Get the viewport based on the scale (1.5 in this case)
        const viewport = page.getViewport({ scale: 1.5 });

        // Adjust coordinates for the bottom-left origin (used in pdf-lib)
        const adjustedX = x * (viewport.width / rect.width);
        const adjustedY = viewport.height - (y * (viewport.height / rect.height));

        console.log(`Clicked at X: ${adjustedX}, Y: ${adjustedY}`);
    };

    return (
        <div>
            <h1>PDF Coordinate Viewer</h1>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <canvas
                ref={canvasRef}
                style={{ border: "1px solid black", cursor: "crosshair" }}
                onClick={handleCanvasClick}
            />
            {pdfInstance && (
                <div>
                    <button
                        disabled={pageNum <= 1}
                        onClick={() => setPageNum((prev) => prev - 1)}
                    >
                        Previous Page
                    </button>
                    <button
                        disabled={pageNum >= pdfInstance.numPages}
                        onClick={() => setPageNum((prev) => prev + 1)}
                    >
                        Next Page
                    </button>
                    <p>
                        Page {pageNum} of {pdfInstance.numPages}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PDFCoordinateViewer;
