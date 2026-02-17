import { readdirSync, statSync } from "fs"
import { join } from "path"

export const EXTENSIONS_PATH = join( process.cwd(), "src", "extensions")

export function getFoldersFromFolder(path: string) {
    return readdirSync( path ).filter(f => statSync( join(path, f) ).isDirectory())
}
