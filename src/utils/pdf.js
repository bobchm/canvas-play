import { jsPDF } from "jspdf";
import { svg2pdf } from "svg2pdf.js";

function openPDF(orientation, format) {
    return new jsPDF({ orientation: orientation, format: format });
    // return new jsPDF("p", "pt", [795, 924]);
}

function addPDFpage(pdfObj, orientation, format) {}

function svgElementWidth(elem) {
    return parseInt(elem.getAttribute("width"));
}

function svgElementHeight(elem) {
    return parseInt(elem.getAttribute("height"));
}

function svgElementFromString(svgstring) {
    const div = document.createElement("div");
    div.innerHTML = svgstring;
    return div.firstChild;
}

function preprocessSVG(inSVG) {
    // trim leading XML header
    var outSVG = inSVG.substring(inSVG.indexOf("<svg"));

    // Background is expressed as rectangle with width=100% and height=100%. svg2pdf doesn't
    // understand this. Need to replace with actual width and height but need to make an element
    // first
    var element = svgElementFromString(outSVG);
    var realWd = element.viewBox.baseVal.width;
    var realHgt = element.viewBox.baseVal.height;

    // super brittle
    var goodSVG = outSVG.replace(
        'width="100%" height="100%"',
        `width="${realWd}" height="${realHgt}"`
    );
    return goodSVG;
}

function elementFromSVG(inSVG) {
    // clean up SVG and create element from result
    return svgElementFromString(preprocessSVG(inSVG));
}

function scaleToFit(pdfObj, element) {
    var pdfWd = pdfObj.internal.pageSize.getWidth();
    var pdfHgt = pdfObj.internal.pageSize.getHeight();
    var svgWd = svgElementWidth(element);
    var svgHgt = svgElementHeight(element);
    var pdfRatio = pdfWd / pdfHgt;
    var svgRatio = svgWd / svgHgt;
    var newWd, newHgt;
    if (pdfRatio < svgRatio) {
        newWd = pdfWd;
        newHgt = newWd / svgRatio;
    } else {
        newHgt = pdfHgt;
        newWd = newHgt * svgRatio;
    }

    return { width: newWd, height: newHgt, ratio: newWd / svgWd };
}

function writeSVGtoPDF(pdfObj, svgstring) {
    var element = elementFromSVG(svgstring);
    var dims = scaleToFit(pdfObj, element);

    return svg2pdf(element, pdfObj, {
        xOffset: 0,
        yOffset: 0,
        width: dims.width,
        height: dims.height,
    });
}

function savePDF(pdfObj, filename) {
    pdfObj.save(filename);
}

export { openPDF, addPDFpage, writeSVGtoPDF, savePDF };
