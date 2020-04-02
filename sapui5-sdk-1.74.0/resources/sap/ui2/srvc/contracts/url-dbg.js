// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The <code>url</code> contract.
 */
(function () {
  "use strict";
  /*global jQuery, sap */

  // Note: jQuery might not yet be available!
  if (typeof jQuery === "function" && jQuery.sap) {
    jQuery.sap.declare("sap.ui2.srvc.contracts.url");
    jQuery.sap.require("sap.ui2.srvc.chip");
  }

  /**
   * @namespace The namespace for the CHIP API's <code>url</code> contract, which allows you
   * convert relative URLs into absolute ones.
   * @name chip.url
   * @since 1.2.0
   */

  sap.ui2.srvc.Chip.addContract("url", function (oChipInstance) {
    /**
     * Makes the given server-relative service URL point to the system given as parameter
     * <code>sSystem</code> or to the system of this CHIP's catalog if <code>sSystem</code>
     * is empty.
     * <em>Server-relative URL</em> means a URL starting with exactly one "/" (also known as
     * absolute-path URL).
     * <p>
     * The function is typically used if the CHIP has been loaded from a remote catalog. In this
     * case, a CHIP wants to perform service calls to the system providing the remote catalog:
     * it must convert the corresponding URLs via this method. The function may also be used for
     * CHIPs loaded from a local catalog to perform service calls to a different system.
     * <p>
     * The system is added via segment parameter <code>o</code> to the last URL segment of the
     * service URL. It is also possible to make this function put the system to a different
     * URL path segment of the service URL by specifying the empty segment parameter
     * <code>o</code>. If both <code>sSystem</code> is empty and the CHIP is loaded from a local
     * catalog, no system is added and the empty segment parameter <code>o</code> is removed.
     * <br/>
     * <b>Example 1:</b> <code>/sap/opu/odata/MyService/?p1=v1</code> is converted to
     * <code>/sap/opu/odata/MyService;o=SYS/?p1=v1</code> if the corresponding CHIP has been loaded
     * via a remote catalog with system ID &quot;SYS&quot;.
     * However it remains unchanged if the CHIP has been loaded from the logon system <em>and</em>
     * the parameter <code>sSystem</code> is empty.<br/>
     * <b>Example 2:</b> <code>/sap/opu/odata/MyService;o=/MyEntities/$count?p1=v1</code> is
     * converted to <code>/sap/opu/odata/MyService;o=sid(SYS.123)/MyEntities/$count?p1=v1</code> if
     * parameter <code>sSystem</code> is set to &quot;sid(SYS.123)&quot;</code>.
     * <p>
     * The URL is in no way normalized.
     *
     * @name chip.url.addSystemToServiceUrl
     * @function
     * @since 1.19.1
     * @param {string} sServiceUrl
     *   a server-relative service URL (to be used when addressing the system directly)
     * @param {string} [sSystem]
     *   a system specification like &quot;SYS&quot; or &quot;sid(SYS.123)&quot;; if empty the
     *   system of the CHIP's catalog is used
     * @returns {string}
     *   the service URL pointing to the system specified in parameter <code>sSystem</code> or to
     *   the system from which the CHIP's catalog has been loaded
     * @throws Error if the URL is not server-relative such as <code>./something</code>,
     *   <code>http://foo.bar/something</code>, ...)
     */
    this.addSystemToServiceUrl = function (sServiceUrl, sSystem) {
      return oChipInstance.getChip().getCatalog().addSystemToServiceUrl(sServiceUrl, sSystem);
    };

    /**
     * Returns the system of this CHIP's catalog where application data for this CHIP is typically
     * located. This API is needed in scenarios where a CHIP navigates to another application and
     * needs to transfer system information so that the application can use the same application
     * system.
     *
     * @name chip.url.getApplicationSystem
     * @function
     * @since 1.19.1
     * @returns {string}
     *   the system of this CHIP's catalog or <code>undefined</code> if there is no such catalog
     * @see chip.url.addSystemToServiceUrl
     */
    this.getApplicationSystem = function () {
      return oChipInstance.getChip().getCatalog().getSystemAlias();
    };

    /**
     * Makes the given relative URL absolute. URLs containing host and/or protocol
     * and URLs with an absolute path remain unchanged. The URL is in no way
     * normalized; the function takes the URL of the CHIP definition XML as base.
     *
     * @name chip.url.toAbsoluteUrl
     * @function
     * @since 1.2.0
     * @param {string} sUrl
     *   the (possibly server-relative) URL
     * @returns {string}
     *   the absolute URL
     */
    this.toAbsoluteUrl = function (sUrl) {
      return oChipInstance.getChip().toAbsoluteUrl(sUrl);
    };
  });
}());
