import { ScreenObjectType } from "./screen-object-types";

export const AppMode = {
    Select: { mode: "Select", submode: "" },
    AddRectangle: { mode: "Add", submode: ScreenObjectType.Rectangle },
    AddCircle: { mode: "Add", submode: ScreenObjectType.Circle },
    Play: { mode: "Play", submode: "" },
};
