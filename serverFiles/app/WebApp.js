/**
 * @typedef {import("../../node_modules/octopus-app/src/app")} OctopusAppModule
 */

/**
 * @type {OctopusAppModule}
 */
let __octopusAppWindow__ = window;
var OctopusApp = __octopusAppWindow__.OctopusApp;

class WebOctopusApp extends OctopusApp {
    type = "WebApp";

    onInit(message) {
        super.onInit(message);

        if(this.oninit) {
            this.oninit(message);
        }
    }
}