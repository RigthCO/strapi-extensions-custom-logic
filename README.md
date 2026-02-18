# Strapi v5 Extensions Custom Logic Loader

A package for [Strapi v5](https://github.com/strapi/strapi) that automates the setup of custom logic (controllers, services, routes and/or lifecycles) just like creating them for a normal API content-type.

## How it works

The package exposes one single method `loadExtendedLogic` and this method should be called inside the `strapi-server.(ts|js)` file of the plugin you want to extend its logic.

This package **DOES NOT** allow to overwrite the already existent logic of the plugin, so all custom logic has to be new and created in a way that the names of services/controllers dont conflict with the base ones.

The package also has a cli command `npx strapi-extensions-custom-logic` that will create for you the `strapi-server` file (only if there is no file already). A nuance with this is that the package doesn't know if the Strapi instance is using Typescript or not, so it will create both `.js` and `.ts` files.

## Compatibility

The package was verified working with Strapi `5.10.0`. It might work in even older versions but it was not tested.
