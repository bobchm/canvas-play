import { fabric } from "fabric";
import { defaultImageData, errorImageData } from "./image-defaults";
import { drawRoundRect, drawFolder } from "./canvas";

const SymBtnShape = {
    Rectangle: "rectangle",
    RoundedRect: "rounded ",
    Folder: "folder",
};

export const SymbolButtonShapes = [
    { name: "Rectangle", value: SymBtnShape.Rectangle },
    { name: "Rounded Rectangle", value: SymBtnShape.RoundedRect },
    { name: "Folder", value: SymBtnShape.Folder },
];

var SymbolButton = fabric.util.createClass(fabric.Rect, {
    type: "symbolButton",
    // initialize can be of type function(options) or function(property, options), like for text.
    // no other signatures allowed.
    initialize: function (label, options, callback) {
        options || (options = {});

        this.embedImage = this.embedImage.bind(this);
        this.shape = options.shape || SymBtnShape.RoundedRect;
        this.callSuper("initialize", options);
        this.set("label", label || "");
        this.setFont(options);
        this.textColor = options.textColor || "black";
        this.image = new Image();
        this.setImageSource(options.imageSource, callback);
        this.killScaling();
    },

    setFont: function (spec) {
        this.set("fontFamily", spec.fontFamily || "Helvetica");
        this.set("fontSize", spec.fontSize || 12);
        this.set("fontWeight", spec.fontWeight || "normal");
        this.set("fontStyle", spec.fontStyle || "normal");
        this.set("underline", spec.underline || false);
        this.set("linethrough", spec.linethrough || false);
        this.set("textAlign", spec.textAlign || "center");
        this.buildFont();
        this.makeDirty();
    },

    getShape: function () {
        return this.shape;
    },

    setShape: function (shape) {
        this.shape = shape;
        this.makeDirty();
    },

    setTextColor: function (clr) {
        this.textColor = clr;
        this.makeDirty();
    },

    getImageSource: function () {
        return this.image.src;
    },

    isImageEmbedded: function () {
        return this.image.src && this.image.src.startsWith("data:image");
    },

    embedImage: function (cnv) {
        if (!this.isImageEmbedded()) {
            var url = this.image.src;
            var theThis = this;
            fetch(url)
                .then(function (response) {
                    if (response.ok) {
                        return response.blob();
                    }
                })
                .then(function (myBlob) {
                    var a = new FileReader();
                    a.onload = function (e) {
                        theThis.setImageSource(e.target.result, null);
                    };
                    a.readAsDataURL(myBlob);
                });
        }
    },

    setImageSource: function (src, callback) {
        if (callback) {
            this.image.onload = () => {
                this.makeDirty();
                callback();
            };
        }
        this.image.onerror = (e) => {
            this.image.src = errorImageData;
            this.makeDirty();
        };
        this.makeDirty();
        this.image.src = src || defaultImageData;
    },

    buildFont: function (spec) {
        var fontSpec = "";

        if (this.fontStyle !== "normal") {
            fontSpec += this.fontStyle + " ";
        }
        if (this.fontWeight !== "normal") {
            fontSpec += this.fontWeight + " ";
        }
        fontSpec += `${this.fontSize}px`;
        fontSpec += " ";
        fontSpec += this.fontFamily;
        this.set("font", fontSpec);
    },

    killScaling: function () {
        this.on("scaling", () => {
            this.width = Math.max(this.width * this.scaleX, 5);
            this.height = Math.max(this.height * this.scaleY, 5);
            this.scaleX = 1;
            this.scaleY = 1;
            //console.log(this.width, this.height, this.scaleX, this.scaleY);
            this.makeDirty();
        });
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper("toObject"), {
            label: this.get("label"),
            fontFamily: this.get("fontFamily"),
            fontSize: this.get("fontSize"),
            fontWeight: this.get("fontWeight"),
            fontStyle: this.get("fontStyle"),
            underline: this.get("underline"),
            linethrough: this.get("linethrough"),
            textAlign: this.get("textAlign"),
            textColor: this.get("textColor"),
            imageSource: this.image.src,
        });
    },

    justifiedTextX: function (ctx, metrics) {
        var just = this.textAlign || "center";

        switch (just) {
            case "left":
                return 2;
            case "right":
                return this.width - metrics.width - 2;
            default:
                return (this.width - metrics.width) / 2;
        }
    },

    drawHorizontalLine: function (ctx, x1, x2, y) {
        ctx.beginPath();
        ctx.strokeStyle = this.textColor;
        ctx.lineWidth = 1;
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
    },

    decorateText: function (ctx, metrics, x, y) {
        if (this.underline) {
            this.drawHorizontalLine(
                ctx,
                x,
                x + metrics.width,
                y + metrics.fontBoundingBoxDescent
            );
        }
        if (this.linethrough) {
            this.drawHorizontalLine(
                ctx,
                x,
                x + metrics.width,
                y - metrics.fontBoundingBoxAscent / 4
            );
        }
    },

    drawImageScaled: function (ctx, x, y, width, height) {
        var hRatio = width / this.image.width;
        var vRatio = height / this.image.height;
        var ratio = Math.min(hRatio, vRatio);
        var centerShift_x = (width - this.image.width * ratio) / 2 + x;
        var centerShift_y = (height - this.image.height * ratio) / 2 + y;
        //ctx.clearRect(x, y, width, height);
        ctx.drawImage(
            this.image,
            0,
            0,
            this.image.width,
            this.image.height,
            centerShift_x,
            centerShift_y,
            this.image.width * ratio,
            this.image.height * ratio
        );
    },

    drawRoundRectShape: function (ctx) {
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        drawRoundRect(
            ctx,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,
            10,
            true,
            true
        );
    },

    drawFolderShape: function (ctx) {
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        drawFolder(
            ctx,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,
            10,
            true,
            true
        );
    },

    drawBackground: function (ctx) {
        switch (this.shape) {
            case SymBtnShape.RoundedRect:
                this.drawRoundRectShape(ctx);
                break;
            case SymBtnShape.Folder:
                this.drawFolderShape(ctx);
                break;
            default:
                this.callSuper("_render", ctx);
        }
    },

    labelYOffset: function (shape) {
        var yOffset = 20;
        if (shape === SymBtnShape.Folder) {
            yOffset += this.height / 5;
        }
        return yOffset;
    },

    _render: function (ctx) {
        this.drawBackground(ctx);

        const imageMargin = 5; // margin around the image
        const textYOffset = this.labelYOffset(this.shape); // Y offset of text below the top of the button

        ctx.font = this.font;
        ctx.fillStyle = this.textColor;

        // in this coordinate system, 0.0 is in the center of the rectangle - we want to center the text
        var metrics = ctx.measureText(this.label);
        var x = -this.width / 2 + this.justifiedTextX(ctx, metrics);
        var y = -this.height / 2 + textYOffset;
        ctx.fillText(this.label, x, y);
        this.decorateText(ctx, metrics, x, y);

        x = -this.width / 2 + imageMargin; // x is left of the button plus the margin
        y += metrics.fontBoundingBoxDescent + imageMargin; // y is bottom of the text plus the margin
        var width = this.width - 2 * imageMargin; // width is button width minus margin on either side

        // height is button height minus the Y offset of the text + text descent + image margin
        var height =
            this.height -
            (textYOffset + metrics.fontBoundingBoxDescent + 2 * imageMargin);

        this.drawImageScaled(ctx, x, y, width, height);
    },

    setLabel(cnv, label) {
        this.set("label", label);
        this.makeDirty();
    },

    makeDirty() {
        // for properties that it knows will need to force a rerender, this gets set automatically
        this.set("dirty", true);
    },
});

export { SymbolButton };
