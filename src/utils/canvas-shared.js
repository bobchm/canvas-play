export const BackgroundImageStyle = {
    Center: "center",
    Stretch: "stretch",
    Tile: "tile", // not implemented yet - need to create the tiled image and then assign that
};

export const OverlayHighlightFill = "rgba(211, 211, 211, 0.8)";

export function drawRoundRect(
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

export function drawRect(
    ctx,
    x,
    y,
    width,
    height,
    fill = false,
    stroke = true
) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

export function folderTabHeight(buttonHeight) {
    return Math.min(buttonHeight / 10, 20);
}

export function drawFolder(
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
    var tabHgt = folderTabHeight(height);
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

function drawHorizontalLine(ctx, x1, x2, y) {
    ctx.beginPath();
    ctx.strokeStyle = this.textColor;
    ctx.lineWidth = 1;
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
}

export function decorateText(ctx, metrics, doUnderline, doLinethrough, x, y) {
    if (doUnderline) {
        drawHorizontalLine(
            ctx,
            x,
            x + metrics.width,
            y + metrics.fontBoundingBoxDescent
        );
    }
    if (doLinethrough) {
        drawHorizontalLine(
            ctx,
            x,
            x + metrics.width,
            y - metrics.fontBoundingBoxAscent / 4
        );
    }
}
