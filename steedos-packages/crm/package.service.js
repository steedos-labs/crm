"use strict";

const path = require("path");

module.exports = {
  name: "@crm/steedos-package-crm",
  namespace: "steedos-packages",
  metadata: {
    $package: {
      name: "@crm/steedos-package-crm",
      label: "CRM",
      description: "客户关系管理元数据包",
      is_package: true
    }
  },
  settings: {
    packageInfo: {
      path: __dirname,
      name: "@crm/steedos-package-crm"
    }
  },
  async started() {
    this.logger.info(
      `[CRM] 元数据包已加载，目录：${path.relative(process.cwd(), __dirname)}`
    );
  }
};
