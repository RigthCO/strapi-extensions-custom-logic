import { join, parse } from "path"
import { readdir } from "fs/promises"
import type { Core } from "@strapi/strapi"

async function loadCustomsAndGetRequires(plugin: Core.Plugin, calledDir: string, what: "controllers" | "routes" | "services") {
    const originalPluginContent = Object.keys( plugin[what] )
    // CalledDir is to be the '__dirname' at the strapi-server file. Since this function is here instead of there we need to know the path comming from outside
    const folderWithCustom = join(calledDir, what)

    const customs: { name: string, required: any }[] = []
    for( const file of await readdir(folderWithCustom) ) {
        const { ext, name } = parse(file)
        if( ext !== ".js" ) {
            continue
        }
        if( originalPluginContent.includes( name ) ) {
            throw new Error(`Not possible to use the name '${name}', thats already a default from the plugin being extended.`)
        }
        customs.push({ name: name, required: require(join(folderWithCustom, name)).default })
    }
    return customs
}

async function loadCustomControllers(plugin: Core.Plugin, calledDir: string) {
    for( const custom of await loadCustomsAndGetRequires(plugin, calledDir, "controllers") ) {
        const { name, required } = custom
        if( !required ) {
            continue
        }
        plugin.controllers[name] = required
    }
}

async function loadCustomRoutes(plugin: Core.Plugin, calledDir: string) {
    for( const custom of await loadCustomsAndGetRequires(plugin, calledDir, "routes") ) {
        const { name, required } = custom
        if( !required?.routes ) {
            continue
        }
        // @ts-ignore
        plugin.routes[name] = { type: 'content-api', routes: required?.routes }
    }
}

async function loadCustomServices(plugin: Core.Plugin, calledDir: string) {
    for( const custom of await loadCustomsAndGetRequires(plugin, calledDir, "services") ) {
        const { name, required } = custom
        if( !required ) {
            continue
        }
        plugin.services[name] = required
    }
}

async function loadCustomLifecycles(plugin: Core.Plugin, calledDir: string) {
    const contentTypesPath = join(calledDir, "content-types")
    const contentTypes = await readdir(contentTypesPath)

    for( const contentType of contentTypes ) {
        // Only needed the names
        const files = await readdir( join(contentTypesPath, contentType) )
        const lifecycles = files.find(f => f === "lifecycles.js")
        if( !lifecycles ) {
            continue
        }
        const required = require( join(contentTypesPath, contentType, "lifecycles") ).default
        if( !required ) {
            continue
        }
        // @ts-ignore
        plugin.contentTypes[contentType].lifecycles = required
    }    
}

/**
 * Loads all the custom extended logic created
 * @param plugin 
 * @param calledDir Use Node `__dirname` so the package knows where the strapi-server file is
 */
export async function loadExtendedLogic(plugin: Core.Plugin, calledDir: string) {
    await loadCustomControllers(plugin, calledDir)
    await loadCustomRoutes(plugin, calledDir)
    await loadCustomServices(plugin, calledDir)
    await loadCustomLifecycles(plugin, calledDir)
}
