import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/get-app",
    },
    {
      type: "category",
      label: "Login",
      items: [
        {
          type: "doc",
          id: "api/login-controller-get-token",
          label: "User Login",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/login-controller-get-refresh-token",
          label: "Get Refresh Token",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Upload",
      items: [
        {
          type: "doc",
          id: "api/upload-controller-upload-artifact",
          label: "Upload Artifact",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/upload-controller-upload-manifest",
          label: "Upload Manifest",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/upload-controller-update-upload-status",
          label: "Update Upload Status",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/upload-controller-get-last-version",
          label: "Get Last Version",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Delivery",
      items: [
        {
          type: "doc",
          id: "api/delivery-controller-update-download-status",
          label: "Update Delivery Status",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/delivery-controller-prepare-delivery",
          label: "Prepare Delivery",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/delivery-controller-get-prepared-delivery-status",
          label: "Get Prepared Delivery Status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/delivery-controller-delete-from-cache",
          label: "Enable to delete artifacts from cache by size or date or a given id or ids",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api/delivery-controller-get-map-config",
          label: "Get Delivery Cache Configurations",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/delivery-controller-set-map-config",
          label: "Set Delivery Cache Configurations",
          className: "api-method put",
        },
      ],
    },
    {
      type: "category",
      label: "Offering",
      items: [
        {
          type: "doc",
          id: "api/offering-controller-get-offering-of-comp",
          label: "Get Offering of Component",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Project Management",
      items: [
        {
          type: "doc",
          id: "api/project-management-controller-create-project",
          label: "Create Project",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/project-management-controller-get-user-projects",
          label: "Get all User's projects",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/project-management-controller-get-project-config-option",
          label: "Get project's config option",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/project-management-controller-set-project-config-option",
          label: "Set project's config option",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/project-management-controller-create-token",
          label: "Create Upload token for a Project",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/project-management-controller-add-member-to-project",
          label: "Add member to Project",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/project-management-controller-remove-member-from-project",
          label: "Remove member from Project",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api/project-management-controller-edit-member",
          label: "Edit member details",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "api/project-management-controller-get-project-releases",
          label: "Get project release",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/project-management-controller-get-devices-by-catalog-id",
          label: "Get all devices with catalogId",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/project-management-controller-get-devices-by-project",
          label: "Get all devices using component of the projectId",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/project-management-controller-get-device-by-platform",
          label: "Get all devices in platform",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Get-Map",
      items: [
        {
          type: "doc",
          id: "api/get-map-controller-get-offering",
          label: "Get Map Offerings",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-map-controller-create-import",
          label: "Create Import",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/get-map-controller-get-import-status",
          label: "Get Import Status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-map-controller-export-notification",
          label: "Export Notification",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/get-map-controller-get-inventory-updates",
          label: "Get Inventory Updates",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/get-map-controller-get-map-config",
          label: "Get Map Configurations",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-map-controller-set-map-config",
          label: "Set Map Configurations",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "api/get-map-controller-get-all-maps",
          label: "Get All Maps",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-map-controller-get-map",
          label: "Get Map by Catalog ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-map-controller-put-device-name",
          label: "Set Device Name",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "api/get-map-controller-start-map-updated-cron-job",
          label: "Start Map Updates Cron Job",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Deploy",
      items: [
        {
          type: "doc",
          id: "api/deploy-controller-update-deploy-status",
          label: "Update Deploy Status",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Device - discovery",
      items: [
        {
          type: "doc",
          id: "api/discovery-controller-discovery-catalog",
          label: "Discover Catalog",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/discovery-controller-im-push-discovery-devices",
          label: "IM Push Discovery Devices",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/discovery-controller-im-pull-discovery-devices",
          label: "IM Pull Discovery Devices",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/discovery-controller-update-m-tls-status",
          label: "DiscoveryController_updateMTlsStatus",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Device - group",
      items: [
        {
          type: "doc",
          id: "api/group-controller-create-group",
          label: "Create Devices Group",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/group-controller-edit-group",
          label: "Edit Devices Group",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "api/group-controller-get-groups",
          label: "Get Devices Groups and children groups",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/group-controller-get-group-devices",
          label: "Get Devices in a group",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/group-controller-set-devices-in-group",
          label: "Set Devices in a Group",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Device",
      items: [
        {
          type: "doc",
          id: "api/device-controller-register",
          label: "Register Device",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/device-controller-get-registered-devices",
          label: "Get Registered Devices",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/device-controller-put-device-name",
          label: "Set Device Name",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "api/device-controller-get-device-maps",
          label: "Get Device Maps",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/device-controller-get-device-content-installed",
          label: "Get Installed Device Content",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Device - Bug Report",
      items: [
        {
          type: "doc",
          id: "api/bug-report-controller-report-new-bug",
          label: "Report New Bug",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/bug-report-controller-get-bug-report",
          label: "Get Bug Report",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
