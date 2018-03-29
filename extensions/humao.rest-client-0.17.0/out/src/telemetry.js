'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const configurationSettings_1 = require("./models/configurationSettings");
const Constants = require("./constants");
const appInsights = require("applicationinsights");
class Telemetry {
    static sendEvent(eventName, properties) {
        try {
            if (Telemetry.restClientSettings.enableTelemetry) {
                let client = appInsights.getClient(Constants.AiKey);
                client.trackEvent(eventName, properties);
            }
        }
        catch (error) {
        }
    }
}
Telemetry.restClientSettings = new configurationSettings_1.RestClientSettings();
exports.Telemetry = Telemetry;
//# sourceMappingURL=telemetry.js.map