export type Dict<T> = Map<string, T>;
export interface Record {
    [Key: string]: string;      // mat-table expects an array of objects, something keyable, unlike Map<string, string>...
}

export class Entry {
    id!: string;
    ref_id!: string;
    fields!: Record;
}
