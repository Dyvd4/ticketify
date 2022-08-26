// lookups are entities with name and color properties

type Lookup = {
    color: string
    name: string
}

export const mapLookup = <T extends Lookup>(lookup: T) => {
    return lookup.name;
}