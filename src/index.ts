import { EXTENSIONS_PATH, getFoldersFromFolder } from "./utilities"
import { join } from "path"
import { writeFileSync, readFileSync, readdirSync } from "fs"

for( const extension of getFoldersFromFolder(EXTENSIONS_PATH) ) {
    const pathToExtension = join( EXTENSIONS_PATH, extension )
    const template = readFileSync( join(__dirname, "utilities", "template.js") )
    const folderOfThisExtension = readdirSync( pathToExtension )
    // Create both type of files, since not possible to know if the strapi instance is using typescript or not
    for( const file of ["strapi-server.js", "strapi-server.ts"] ) {
        // If there is already a existing file it's not possible to overwrite it, it might have even more extra logic
        if( folderOfThisExtension.includes(file) ) {
            continue
        }
        writeFileSync( join( pathToExtension, file), template)
    }
}
