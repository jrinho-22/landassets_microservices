import resources from "src/app/config/resources";

type SourceKeys = keyof typeof resources;

export function getPropertyFromResource<K extends SourceKeys>(prop: K): typeof resources[K] {
    return resources[prop];
}