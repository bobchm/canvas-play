import { jsPDF } from "jspdf";
import "svg2pdf.js";
import { svg2pdf } from "svg2pdf.js";

function openPDF(orientation, format) {
    return new jsPDF({ orientation: orientation, format: format });
}

function addPDFpage(pdfObj, orientation, format) {}

async function writeSVGtoPDF(pdfObj, svgstring) {
    // returns a promise - can take x, y, width, height options
    var parser = new DOMParser();
    var element = parser.parseFromString(svgstring, "image/svg+xml");
    await pdfObj.svg(element, { xOffset: 0, yOffset: 0, scale: 1 });
}

function savePDF(pdfObj, filename) {
    pdfObj.save(filename);
}

export { openPDF, addPDFpage, writeSVGtoPDF, savePDF };
