import { Platform } from "react-native";

// All constants relataed to theses
export const MAXIMUM_THESIS_CONTENT_CHARACTERS = 30000;
export const MAXIMUM_THESIS_TITLE_CHARACTERS = 100;
export const MAXIMUM_THESIS_CONTENT_VISIBLE_LINES = 5;
export const MAXIMUM_THESIS_TITLE_VISIBLE_LINES = 1;
export const THESIS_BOX_HEIGHT = Platform.OS === "ios" ? 235 : 245;
export const THESIS_BOX_CONTAINED_HEIGHT = 220;
export const THESES_RECORDS_PER_PAGE = 50;