'use strict';

module.exports = async (plugin) => {
    await require("strapi-extensions-generator").loadExtendedLogic(plugin, __dirname);
    return plugin;
};
