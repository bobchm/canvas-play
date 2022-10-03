export const PropertyValueType = {
    Color: "color",
    Text: "text",
    Percent: "percent",
    TextStyle: "textstyle",
    ImageSource: "imagesource",
    EmbedImage: "embedimage",
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
    EmbedImage: {
        name: "Embed Image",
        valueType: PropertyValueType.EmbedImage,
        forceReset: false,
    },
};
