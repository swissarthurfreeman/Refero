import { Colfig } from "./Colfig.model";
import { Injection } from "./injection.model";
import { View } from "./view.model";

export class Referential {
    id!: string;
    name!: string;
    description!: string;
    columns!: Colfig[];
    injections!: Injection[];
    views!: View[];
}