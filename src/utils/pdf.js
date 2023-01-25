import PDFDocument from "@react-pdf/pdfkit";
import FileSaver from "file-saver";
import SVGtoPDF from "svg-to-pdfkit";
const blobStream = require("blob-stream");

function openPDF(orientation, format) {
    var bs = blobStream();
    var pdfdoc = new PDFDocument({
        bufferPages: true,
        size: format,
        layout: orientation,
        autoFirstPage: true,
    });

    var stream = pdfdoc.pipe(bs);
    return {
        pdfdoc: pdfdoc,
        stream: stream,
    };
}

function addPDFpage(pdfObj, orientation, format) {}

function writeSVGtoPDF(pdfObj, svgstring) {
    let svgOptions = {
        width: 5 * 72,
        height: 3 * 72,
        preserveAspectRatio: "xMidYmid meet",
    };

    SVGtoPDF(pdfObj.pdfdoc, svgstring, 1 * 72, 3 * 72, svgOptions);
}

function savePDF(pdfObj, filename) {
    pdfObj.pdfdoc.end();
    pdfObj.stream.on("finish", () => {
        const blob = pdfObj.stream.toBlob("application/pdf");
        FileSaver.saveAs(blob, filename);
    });
}

export { openPDF, addPDFpage, writeSVGtoPDF, savePDF };
