import { fabric } from "fabric";
import { errorImageData } from "./image-defaults";

const SymBtnShape = {
    Rectangle: "rectangle",
    RoundedRect: "rounded ",
    Folder: "folder",
};

const LabelMargin = 20;

export const SymbolButtonShapes = [
    { name: "Rectangle", value: SymBtnShape.Rectangle },
    { name: "Rounded Rectangle", value: SymBtnShape.RoundedRect },
    { name: "Folder", value: SymBtnShape.Folder },
];

function drawRoundRect(
    ctx,
    x,
    y,
    width,
    height,
    radius = 5,
    fill = false,
    stroke = true
) {
    if (typeof radius === "number") {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius.br,
        y + height
    );
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

function tabHeight(buttonHeight) {
    return Math.min(buttonHeight / 10, 20);
}

function drawFolder(
    ctx,
    x,
    y,
    width,
    height,
    radius = 5,
    fill = false,
    stroke = true
) {
    if (typeof radius === "number") {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
    }
    var tabHgt = tabHeight(height);
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width / 3 - radius.tr, y); // 1
    ctx.quadraticCurveTo(x + width / 3, y, x + width / 3, y + tabHgt); // 2
    ctx.lineTo(x + width - radius.tr, y + tabHgt); // 3
    ctx.quadraticCurveTo(
        x + width,
        y + tabHgt,
        x + width,
        y + tabHgt + radius.tr
    ); // 4
    ctx.lineTo(x + width, y + height); // 5
    ctx.lineTo(x, y + height); // 6
    ctx.lineTo(x, y + radius.tl); // 7
    ctx.quadraticCurveTo(x, y, x + radius.tl, y); // 8
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

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
        if (options.imageSource) {
            this.image = new Image();
            this.setImageSource(options.imageSource, callback);
        } else {
            this.image = null;
        }
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
        if (!this.image) return null;
        return this.image.src;
    },

    isImageEmbedded: function () {
        return (
            this.image &&
            this.image.src &&
            this.image.src.startsWith("data:image")
        );
    },

    embedImage: function (cnv) {
        if (this.image === null) return;
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
        if (src === null) {
            this.image = null;
            this.makeDirty();
            return;
        }
        if (this.image === null) {
            this.image = new Image();
        }
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
        this.image.src = src; // || defaultImageData;
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
            imageSource: this.image ? this.image.src : null,
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

    labelYOffset: function (shape, buttonHgt, hasSymbol) {
        var shapeOffset = 0;
        if (shape === SymBtnShape.Folder) {
            shapeOffset = tabHeight(this.height);
        }
        if (hasSymbol) {
            return shapeOffset + LabelMargin;
        }

        // center vertically in button area
        return (buttonHgt - shapeOffset) / 2;
    },

    _render: function (ctx) {
        this.drawBackground(ctx);

        const imageMargin = 5; // margin around the image
        const textYOffset = this.labelYOffset(
            this.shape,
            this.height,
            this.image !== null
        ); // Y offset of text below the top of the button

        ctx.font = this.font;
        ctx.fillStyle = this.textColor;

        // in this coordinate system, 0.0 is in the center of the rectangle - we want to center the text
        var metrics = ctx.measureText(this.label);
        var x = -this.width / 2 + this.justifiedTextX(ctx, metrics);
        var y = -this.height / 2 + textYOffset;
        ctx.fillText(this.label, x, y);
        this.decorateText(ctx, metrics, x, y);

        if (this.image) {
            x = -this.width / 2 + imageMargin; // x is left of the button plus the margin
            y += metrics.fontBoundingBoxDescent + imageMargin; // y is bottom of the text plus the margin
            var width = this.width - 2 * imageMargin; // width is button width minus margin on either side

            // height is button height minus the Y offset of the text + text descent + image margin
            var height =
                this.height -
                (textYOffset +
                    metrics.fontBoundingBoxDescent +
                    2 * imageMargin);

            this.drawImageScaled(ctx, x, y, width, height);
        }
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
