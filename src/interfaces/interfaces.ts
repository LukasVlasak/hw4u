// pokud chci v datagridu renderovat jen nejake polozky z T (Tasku), tak pres Partial<T> to nepujde protoze DataGrid pozaduje T s id: number
export type PartialWithId<T> = Partial<T> & { id: number };