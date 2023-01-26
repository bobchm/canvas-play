import { jsPDF } from "jspdf";
import { svg2pdf } from "svg2pdf.js";

function openPDF(orientation, format) {
    // return new jsPDF({ orientation: orientation, format: format });
    return new jsPDF("p", "pt", [795, 924]);
}

function addPDFpage(pdfObj, orientation, format) {}

function writeSVGtoPDF(pdfObj, svgstring) {
    // returns a promise - can take x, y, width, height options
    //var parser = new DOMParser();
    // svgstring =
    //     '<svg width="400" height="100"><rect width="400" height="100" style="fill:rgb(0,0,255);stroke-width:10;stroke:rgb(0,0,0)" /></svg>';
    //var element = parser.parseFromString(svgstring, "image/svg+xml");
    const div = document.createElement("div");
    div.innerHTML = svgstring.substring(svgstring.indexOf("<svg"));
    const element = div.firstChild;
    return svg2pdf(element, pdfObj, { xOffset: 0, yOffset: 0, scale: 1 });
    //return pdfObj.svg(element, { xOffset: 0, yOffset: 0, scale: 1 });
}

function savePDF(pdfObj, filename) {
    pdfObj.save(filename);
}

export { openPDF, addPDFpage, writeSVGtoPDF, savePDF };
