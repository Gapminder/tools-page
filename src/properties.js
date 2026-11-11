import defaults from "./config/properties.json";

// Container deployments supply public settings before the application starts.
export default { ...defaults, ...globalThis.VIZABI_CONFIG };
