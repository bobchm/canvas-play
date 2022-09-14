import { ScreenObjectType } from "../../app/constants/screen-object-types";

export const EditMode = {
    Select: { mode: "Select", submode: null },
    AddRectangle: { mode: "Add", submode: ScreenObjectType.Rectangle },
    AddCircle: { mode: "Add", submode: ScreenObjectType.Circle },
};
