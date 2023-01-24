import { fabric } from "fabric";
import { drawRoundRect, drawRect, decorateText } from "./canvas-shared";

import { Context } from "svgcanvas";

export const CtnBoxShape = {
    Rectangle: "rectangle",
    RoundedRect: "rounded",
};

export const ContainerBoxShapes = [
    { name: "Rectangle", value: CtnBoxShape.Rectangle },
    { name: "Rounded Rectangle", value: CtnBoxShape.RoundedRect },
];

var ContainerBox = fabric.util.createClass(fabric.Rect, {
    type: "containerBox",
    // initialize can be of type function(options) or function(property, options), like for text.
    // no other signatures allowed.
    initialize: function (title, shape, spec) {
        spec || (spec = {});

        this.children = [];
        this.shape = shape || CtnBoxShape.RoundedRect;
        this.callSuper("initialize", spec);
        this.set("title", title || "");
        this.setFont(spec);
        this.textColor = spec.textColor || "black";
        this.svRgn = {
            left: this.left,
            top: this.top,
            width: this.width,
            height: this.height,
        };
    },

    toSVG: function () {
        var wd = this.left + this.width;
        var hgt = this.top + this.height;
        var ctx = new Context(wd, hgt);
        this._render(
            ctx,
            this.left + this.width / 2,
            this.top + this.height / 2
        );
        const mySerializedSVG = ctx.getSerializedSvg();
        return mySerializedSVG;
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

    toObject: function () {
        return fabric.util.object.extend(this.callSuper("toObject"), {
            title: this.get("title"),
            fontFamily: this.get("fontFamily"),
            fontSize: this.get("fontSize"),
            fontWeight: this.get("fontWeight"),
            fontStyle: this.get("fontStyle"),
            underline: this.get("underline"),
            linethrough: this.get("linethrough"),
            textAlign: this.get("textAlign"),
            textColor: this.get("textColor"),
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

    drawRoundRectShape: function (ctx, offx = 0, offy = 0) {
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        drawRoundRect(
            ctx,
            -this.width / 2 + offx,
            -this.height / 2 + offy,
            this.width,
            this.height,
            10,
            true,
            true
        );
    },

    drawRectShape: function (ctx, offx, offy) {
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;

        drawRect(
            ctx,
            -this.width / 2 + offx,
            -this.height / 2 + offy,
            this.width,
            this.height,
            true,
            true
        );
    },

    drawBackground: function (ctx, offx = 0, offy = 0) {
        switch (this.shape) {
            case CtnBoxShape.RoundedRect:
                this.drawRoundRectShape(ctx, offx, offy);
                break;
            default:
                this.drawRectShape(ctx, offx, offy);
        }
    },

    _render: function (ctx, offx = 0, offy = 0) {
        this.drawBackground(ctx, offx, offy);

        const textYOffset = 5;

        ctx.font = this.font;
        ctx.fillStyle = this.textColor;

        // in this coordinate system, 0.0 is in the center of the rectangle - we want to center the text
        var metrics = ctx.measureText(this.title);
        var x = -this.width / 2 + this.justifiedTextX(ctx, metrics) + offx;
        var y =
            -this.height / 2 +
            textYOffset +
            metrics.fontBoundingBoxAscent +
            offy;

        ctx.fillText(this.title, x, y);
        decorateText(ctx, metrics, this.underline, this.linethrough, x, y);
    },

    setTitle(cnv, title) {
        this.set("title", title);
        this.makeDirty();
    },

    makeDirty() {
        // for properties that it knows will need to force a rerender, this gets set automatically
        this.set("dirty", true);
    },
});

export { ContainerBox };
