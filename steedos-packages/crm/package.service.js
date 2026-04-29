"use strict";

const project = require("./package.json");
const packageLoader = require("@steedos/service-package-loader");

module.exports = {
  name: project.name,
  namespace: "steedos",
  mixins: [packageLoader],
  settings: {
    packageInfo: {
      path: __dirname,
      name: project.name
    }
  },
  metadata: {
    $package: {
      name: project.name,
      label: "CRM",
      description: project.description,
      path: __dirname,
      isPackage: true
    }
  },
  dependencies: ["@steedos/service-core-objects"],
  async started() {
    this.logger.info(`[CRM] 元数据包 ${project.name} 已加载，目录：${__dirname}`);
  }
};
