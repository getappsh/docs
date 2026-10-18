// Local/dev default. In the Docker image this file is regenerated at container
// start from docker/config.template.js, populated from real env vars.
window.__RUNTIME_CONFIG__ = {
  DASHBOARD_URL: "",
  // Same dev host already hardcoded as the Server API specPath in docusaurus.config.js —
  // safe to default to here so local preview actually shows working Swagger links.
  SERVER_API_URL: "https://api-getapp-dev.apps.getapp.sh"
};
