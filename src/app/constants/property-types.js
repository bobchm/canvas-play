export const PropertyValueType = {
    Color: "color",
    Text: "text",
    Percent: "percent",
    TextStyle: "textstyle",
    ImageSource: "imagesource",
    SymBtnImageSource: "symbtnimagesource",
    BackgroundImageSource: "backgroundimagesource",
    BackgroundImageStyle: "backgroundimagestyle",
    EmbedImage: "embedimage",
    ButtonShape: "buttonshape",
};

export const PropertyType = {
    Id: { name: "ID", valueType: PropertyValueType.Text, forceReset: false },
    Name: {
        name: "Name",
        valueType: PropertyValueType.Text,
        forceReset: false,
    },
    FillColor: {
        name: "Fill Color",
        valueType: PropertyValueType.Color,
        forceReset: false,
    },
    LineColor: {
        name: "Line Color",
        valueType: PropertyValueType.Color,
        forceReset: false,
    },
    TextColor: {
        name: "Text Color",
        valueType: PropertyValueType.Color,
        forceReset: false,
    },
    TextStyle: {
        name: "Text Style",
        valueType: PropertyValueType.TextStyle,
        forceReset: false,
    },
    BackgroundColor: {
        name: "Background Color",
        valueType: PropertyValueType.Color,
        forceReset: false,
    },
    Opacity: {
        name: "Opacity",
        valueType: PropertyValueType.Percent,
        forceReset: false,
    },
    ImageSource: {
        name: "Source",
        valueType: PropertyValueType.ImageSource,
        forceReset: true,
    },
    SymbolButtonImageSource: {
        name: "Symbol",
        valueType: PropertyValueType.SymBtnImageSource,
        forceReset: true,
    },
    BackgroundImageSource: {
        name: "BackgroundImageSource",
        valueType: PropertyValueType.BackgroundImageSource,
        forceReset: false,
    },
    BackgroundImageStyle: {
        name: "BackgroundImageStyle",
        valueType: PropertyValueType.BackgroundImageStyle,
        forceReset: false,
    },
    EmbedImage: {
        name: "Embed Image",
        valueType: PropertyValueType.EmbedImage,
        forceReset: false,
    },
    ButtonLabel: {
        name: "Label",
        valueType: PropertyValueType.Text,
        forceReset: false,
    },
    ButtonShape: {
        name: "Shape",
        valueType: PropertyValueType.ButtonShape,
        forceReset: false,
    },
};

function checkTextStyleStyle(dest, src, styles, prop) {
    if (
        dest.current.styles.includes(prop) &&
        src.current.styles.includes(prop)
    ) {
        styles.push(prop);
    }
}

export function combineProperties(dest, src) {
    if (dest.type !== src.type) return;

    switch (dest.type) {
        case PropertyType.TextStyle:
            if (dest.current.fontFamily !== src.current.fontFamily) {
                dest.current.fontFamily = "";
            }
            if (dest.current.fontSize !== src.current.fontSize) {
                dest.current.fontSize = 0;
            }
            if (dest.current.alignment !== src.current.alignment) {
                dest.current.alignment = "";
            }
            if (dest.current.styles !== src.current.styles) {
                var styles = [];
                checkTextStyleStyle(dest, src, styles, "bold");
                checkTextStyleStyle(dest, src, styles, "italic");
                checkTextStyleStyle(dest, src, styles, "underline");
                checkTextStyleStyle(dest, src, styles, "strikethrough");
                dest.current.styles = styles;
            }
            break;
        default:
            if (dest.current !== src.current) {
                dest.current = null;
            }
    }
}
