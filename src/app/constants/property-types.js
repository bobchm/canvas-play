export const PropertyValueType = {
    Color: "color",
    Text: "text",
    Percent: "percent",
};

export const PropertyType = {
    Id: { name: "ID", valueType: PropertyValueType.Text },
    Name: { name: "Name", valueType: PropertyValueType.Text },
    FillColor: { name: "Fill Color", valueType: PropertyValueType.Color },
    LineColor: { name: "Line Color", valueType: PropertyValueType.Color },
    BackgroundColor: {
        name: "Background Color",
        valueType: PropertyValueType.Color,
    },
    Opacity: {
        name: "Opacity",
        valueType: PropertyValueType.Percent,
    },
};
