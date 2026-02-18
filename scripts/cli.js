#!/usr/bin/env node
const { readFileSync, readdirSync, writeFileSync, statSync } = require("fs")
const { join } = require("path")

const EXTENSIONS_PATH = join( process.cwd(), "src", "extensions")

/**
 * @param {string} path 
 * @returns 
 */
function getFoldersFromFolder(path) {
    return readdirSync( path ).filter(f => statSync( join(path, f) ).isDirectory())
}

for( const extension of getFoldersFromFolder(EXTENSIONS_PATH) ) {
    const pathToExtension = join( EXTENSIONS_PATH, extension )
    const template = readFileSync( join( join(__dirname, ".."), "dist", "template.js") )
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
