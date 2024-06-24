import { Country } from "./country";
import { Skill } from "./skill";
import { Theme } from "./theme";

export interface FormLists {
    countries : Country[];
    themes : Theme[];
    skills : Skill[];
}
