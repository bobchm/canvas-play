import { fabric } from "fabric";

var SymbolButton = fabric.util.createClass(fabric.Rect, {
    type: "symbolButton",
    // initialize can be of type function(options) or function(property, options), like for text.
    // no other signatures allowed.
    initialize: function (label, options) {
        options || (options = {});

        this.callSuper("initialize", options);
        this.set("label", label || "");
        this.setFont(options);
        this.textColor = options.textColor || "black";
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
            label: this.get("label"),
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

    decorateText: function (metrics, x, y) {
        // to implement linethrough & underline
    },

    _render: function (ctx) {
        this.callSuper("_render", ctx);

        ctx.font = this.font;
        ctx.fillStyle = this.textColor;

        // in this coordinate system, 0.0 is in the center of the rectangle - we want to center the text
        var metrics = ctx.measureText(this.label);
        var x = -this.width / 2 + this.justifiedTextX(ctx, metrics);
        var y = -this.height / 2 + 20;
        ctx.fillText(this.label, x, y);
        this.decorateText(metrics, x, y);
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
