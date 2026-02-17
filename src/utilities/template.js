'use strict';

const { join, parse } = require("path")
const { readdir } = require("fs/promises")

async function loadCustomControllers(plugin) {
    const defaultControllers = Object.keys( plugin.controllers )
    const folder = join(__dirname, "controllers")
    const pluginName = parse(__dirname).name

    for( const file of await readdir(folder) ) {
        const { ext, name } = parse(file)
        if( ext !== ".js" ) {
            continue
        }
        if( defaultControllers.includes( name ) ) {
            throw new Error(`It's not possible to create the custom controller '${name}' inside the '${pluginName} plugin'. That controller is default from the plugin.`)
        }
        const required = require(join(folder, name)).default
        if( !required ) {
            continue
        }
        plugin.controllers[name] = required
    }
}

async function loadCustomRoutes(plugin) {
    const defaultControllers = Object.keys( plugin.routes )
    const folder = join(__dirname, "routes")
    const pluginName = parse(__dirname).name

    for( const file of await readdir(folder) ) {
        const { ext, name } = parse(file)
        if( ext !== ".js" ) {
            continue
        }
        if( defaultControllers.includes( name ) ) {
            throw new Error(`It's not possible to create the custom routes '${name}' inside the '${pluginName} plugin'. That routes is default from the plugin.`)
        }
        const required = require(join(folder, name))?.default?.routes
        if( !required ) {
            continue
        }
        plugin.routes[name] = { type: 'content-api', routes: required }
    }
}

module.exports = async (plugin) => {
    await loadCustomControllers(plugin)
    await loadCustomRoutes(plugin)
    return plugin
}
