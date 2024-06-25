import { City } from "./city";
import { Country } from "./country";
import { Skill } from "./skill";
import { Theme } from "./theme";

export interface FormLists {
    countries : Country[];
    themes : Theme[];
    skills : Skill[];
}

export interface FilterList {
    countries : Country[];
    themes : Theme[];
    skills : Skill[];
    cities : City[];
}