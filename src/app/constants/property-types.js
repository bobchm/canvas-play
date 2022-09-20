export const PropertyValueType = {
    Color: "color",
    Text: "text",
    Percent: "percent",
    TextStyle: "textstyle",
};

export const PropertyType = {
    Id: { name: "ID", valueType: PropertyValueType.Text },
    Name: { name: "Name", valueType: PropertyValueType.Text },
    FillColor: { name: "Fill Color", valueType: PropertyValueType.Color },
    LineColor: { name: "Line Color", valueType: PropertyValueType.Color },
    TextColor: { name: "Text Color", valueType: PropertyValueType.Color },
    TextStyle: { name: "Text Style", valueType: PropertyValueType.TextStyle },
    BackgroundColor: {
        name: "Background Color",
        valueType: PropertyValueType.Color,
    },
    Opacity: {
        name: "Opacity",
        valueType: PropertyValueType.Percent,
    },
};
