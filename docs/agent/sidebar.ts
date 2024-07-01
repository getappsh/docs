import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "agent/getapp-agent-rest-api",
    },
    {
      type: "category",
      label: "Delivery",
      items: [
        {
          type: "doc",
          id: "agent/cancel-delivery",
          label: "cancel_delivery",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "agent/delete-delivery",
          label: "delete_delivery",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "agent/download-file",
          label: "Endpoint to download a file based on the provided filename.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "agent/get-delivery-ready-list",
          label: "get_delivery_ready_list",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "agent/get-delivery-status",
          label: "get_delivery_status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "agent/pause-delivery",
          label: "pause_delivery",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "agent/prepare-delivery-cache",
          label: "prepare_delivery_cache",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "agent/get-prepared-delivery",
          label: "get_prepared_delivery",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "agent/start-delivery",
          label: "start_delivery",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Deploy",
      items: [
        {
          type: "doc",
          id: "agent/deploy-change-state",
          label: "deploy_change_state",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "agent/get-deploy",
          label: "get_deploy",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "agent/get-deploy-status",
          label: "get_deploy_status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "agent/deploy-item",
          label: "deploy_item",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "agent/deploy-message",
          label: "deploy_message",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Discovery",
      items: [
        {
          type: "doc",
          id: "agent/get-discovery",
          label: "get_discovery",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "agent/start-discovery",
          label: "start_discovery",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "General",
      items: [
        {
          type: "doc",
          id: "agent/get-general-device",
          label: "get_general_device",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "agent/update-general-device",
          label: "update_general_device",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "agent/update-device-status",
          label: "update_device_status",
          className: "api-method put",
        },
      ],
    },
    {
      type: "category",
      label: "Installation Machine",
      items: [
        {
          type: "doc",
          id: "agent/send-command",
          label: "Send commands to other agents",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "agent/sync-with-server",
          label: "Sync devices discoveries with Get-app server",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Map Import - Create",
      items: [
        {
          type: "doc",
          id: "agent/map-import-create",
          label: "This service message allows to consumer demand to creation of an up-to-date map stamp import",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "agent/map-create-cancel",
          label: "map_create_cancel",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "agent/get-map-create-status",
          label: "This service message allows the sender to receive information about the stamp creation status.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "agent/get-map-resume",
          label: "This service message allows the consumer the re-request a exist map.",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Map Import - Delivery",
      items: [
        {
          type: "doc",
          id: "agent/get-map-delivery-cancel",
          label: "This service message allows the sender to cancel downloading a map stamp.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "agent/get-map-delivery-delete",
          label: "This service message allows the sender to delete downloaded a map stamp.",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "agent/get-map-delivery-pause",
          label: "This service message allows the sender to stop downloading a map stamp.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "agent/get-map-delivery-start",
          label: "This service message allows the sender to continue downloading a stamp from a map that has been stopped.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "agent/get-map-delivery-status",
          label: "This service message allows the sender to receive information about the status of the stamp download in the device.",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Map Import - Deploy",
      items: [
        {
          type: "doc",
          id: "agent/get-map-deploy-status",
          label: "get_map_deploy_status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "agent/get-map-deploy",
          label: "This service message allows the sender to notify the installation status of the map stamp.",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Map - Inventory",
      items: [
        {
          type: "doc",
          id: "agent/inventory-discover",
          label: "This service message allows the consumer to send the inventory of the map with its flow state",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "agent/get-maps-updates",
          label: "This service message allows the consumer to get the update information for the map list",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "agent/get-map-update-by-id",
          label: "This service message allows the consumer to get the update information for the given map",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "agent/delete-map",
          label: "This service message allows the consumer to delete the map of the given request id",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "agent/get-map-status",
          label: "This service message allows the consumer to get the updated state and status information for the map",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "agent/get-maps-status",
          label: "This service message allows the consumer to get the updated state and status information for the map list",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Offering",
      items: [
        {
          type: "doc",
          id: "agent/get-offering",
          label: "get_offering",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
