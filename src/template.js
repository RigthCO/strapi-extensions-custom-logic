'use strict';

module.exports = async (plugin) => {
    await require("strapi-extensions-custom-logic").loadExtendedLogic(plugin, __dirname);
    return plugin;
};
