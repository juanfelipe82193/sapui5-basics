// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The <code>preview</code> contract.
 */
(function () {
  "use strict";
  /*global jQuery, sap */

  // Note: jQuery might not yet be available!
  if (typeof jQuery === "function" && jQuery.sap) {
    jQuery.sap.declare("sap.ui2.srvc.contracts.preview");
    jQuery.sap.require("sap.ui2.srvc.chip");
  }

  sap.ui2.srvc.contracts = sap.ui2.srvc.contracts || {};
  sap.ui2.srvc.contracts.preview = sap.ui2.srvc.contracts.preview || {
    environment: null
  };

   /**
   * Allows the page builder to set the global type of environment for the preview contract to either runtime or design time.
   * Based on this a CHIP can decide what preview to be shown. For example, in preview mode at design time, no HTTP request should be made,
   * while in preview mode at runtime the CHIP may request a minimum of data to make the CHIP identifiable.
   *
   * By default the environment is unspecified (null).
   *
   * @param {string} sEnvironment
   *  Specified if the page builder is a design time or an runtime. Accepts only the values 'runtime' or 'designtime'.
   *
   * @since 1.71.0
   * @public
   * @see chip.preview.getEnvironmentType
   */
  sap.ui2.srvc.contracts.preview.setEnvironmentType = function (sEnvironment) {
    if (sEnvironment !== "runtime" && sEnvironment !== "designtime") {
      throw new Error("setEnvironmentType only accepts the values 'runtime' or 'designtime'");
    }

    this.environment = sEnvironment;
  };

  /**
   * Returns the global type of environment for the preview contract. Based on this a CHIP can decide what
   * preview to be shown. For example, in preview mode at design time, no HTTP request should be made,
   * while in preview mode at runtime the CHIP may request a minimum of data to make the CHIP identifiable.
   *
   * By default the environment is unspecified (null).
   *
   * @returns {string} Returns null, which means unspecified, 'runtime' or 'designtime'.
   *
   * @since 1.71.0
   * @private
   *
   * @see #setEnvironmentType
   */
  sap.ui2.srvc.contracts.preview.getEnvironmentType = function () {
    return this.environment;
  };

  /**
   * @namespace The namespace for the CHIP API's <code>preview</code> contract, which
   * allows to display the CHIP in a preview mode.
   * @name chip.preview
   * @since 1.11.0
   */

  sap.ui2.srvc.Chip.addContract("preview", /* @returns {object} */ function (oChipInstance) {
    var bEnabled = false,
      sPreviewIconUrl,
      sPreviewSubtitle,
      sPreviewTitle,
      sTargetUrl;


    /**
     * Returns this CHIP's description. May be used by the CHIP for the UI it shows in preview
     * mode.
     *
     * @name chip.preview.getDescription
     * @function
     * @since 1.11.0
     * @returns {string}
     *   the CHIP description
     */
    this.getDescription = function () {
      return oChipInstance.getChip().getDescription();
    };

    /**
     * Returns this CHIP's title. May be used by the CHIP for the UI it shows in preview mode.
     *
     * @name chip.preview.getTitle
     * @function
     * @since 1.11.0
     * @returns {string}
     *   the CHIP title
     */
    this.getTitle = function () {
      return oChipInstance.getTitle();
    };

    /**
     * Tells whether preview mode is enabled. Note that this value is constant throughout
     * a CHIP's lifetime. If preview mode is enabled, CHIPs should provide a target URL for the
     * embedding application to trigger navigation, see {@link chip.preview.setTargetUrl}.
     * They should not display live data for performance reasons.
     *
     * @name chip.preview.isEnabled
     * @function
     * @since 1.11.0
     * @returns {boolean}
     *   whether preview mode is enabled
     */
    this.isEnabled = function () {
      return bEnabled;
    };

    /**
     * Returns the type of environment in which the preview mode maybe displayed.
     *
     * Based on this a CHIP can decide what preview to be shown. For example, in preview
     * mode at design time, no HTTP request should be made, while in preview mode at runtime
     * the CHIP may request a minimum of data to make the CHIP identifiable.
     *
     * @returns {string} Returns null, which means unspecified, 'runtime' or 'designtime'.
     *
     * @since 1.71.0
     * @public
     *
     * @see sap.ui2.srvc.contracts.preview#setEnvironmentType
     *  @since 1.71.0
     */
    this.getEnvironmentType = function () {
      return sap.ui2.srvc.contracts.preview.getEnvironmentType();
    };

    /**
     * Determines the preview icon to be used by the embedding application for this CHIP.
     *
     * @name chip.preview.setPreviewIcon
     * @function
     * @since 1.11.0
     * @param {string} sNewPreviewIconUrl
     *   the preview icon URL. It is recommended that this URL follows the rules defined for the
     *   <code>src</code> attribute of <code>sap.ui.core.Icon</code>.
     */
    this.setPreviewIcon = function (sNewPreviewIconUrl) {
      sPreviewIconUrl = sNewPreviewIconUrl;
    };

    /**
     * Determines the preview subtitle to be used by the embedding application for this CHIP.
     *
     * @name chip.preview.setPreviewSubtitle
     * @function
     * @since 1.40.0
     * @param {string} sNewPreviewSubtitle
     *   the preview subtitle.
     */
    this.setPreviewSubtitle = function (sNewPreviewSubtitle) {
      sPreviewSubtitle = sNewPreviewSubtitle;
    };

    /**
     * Determines the preview title to be used by the embedding application for this CHIP. If the
     * CHIP has no specific preview title e.g. based on its configuration it may return the title
     * from the <code>getTitle</code> method of this contract.
     *
     * @name chip.preview.setPreviewTitle
     * @function
     * @since 1.11.0
     * @param {string} sNewPreviewTitle
     *   the preview title.
     *
     * @see chip.preview.getTitle
     */
    this.setPreviewTitle = function (sNewPreviewTitle) {
      sPreviewTitle = sNewPreviewTitle;
  };

    /**
     * Determines the target URL for navigation from this CHIP. May be used by the embedding
     * application to trigger navigation to the CHIP's underlying application.
     *
     * @name chip.preview.setTargetUrl
     * @function
     * @since 1.11.0
     * @param {string} sNewTargetUrl
     *   the target URL for navigation triggered in this CHIP
     */
    this.setTargetUrl = function (sNewTargetUrl) {
      sTargetUrl = sNewTargetUrl;
    };

    /**
     * @namespace The namespace for the contract interface (to be used by a page builder) for
     * the <code>preview</code> contract, which allows you to display a CHIP in preview
     * mode and to retrieve the URL of the CHIP's underlying application.
     * "Preview mode" means that a CHIP does not retrieve and display live data, but displays a
     * static preview in order to improve performance.
     * The embedding application has two alternatives to display a CHIP preview:
     * Either it embeds the CHIP UI and relies on the CHIP not rendering live data or it
     * retrieves preview attributes like title and icon from the CHIP to create the preview UI
     * itself.
     *
     * @name contract.preview
     * @since 1.11.0
     */
    return {
      /**
       * Returns the URL of the preview icon for this CHIP.
       *
       * @name contract.preview.getPreviewIcon
       * @function
       * @returns {string}
       *   the preview icon's URL
       * @since 1.11.0
       *
       * @see chip.preview.setPreviewIcon
       */
      getPreviewIcon: function () {
        return sPreviewIconUrl;
      },

      /**
       * Returns the preview subtitle for this CHIP.
       *
       * @name contract.preview.getPreviewSubtitle
       * @function
       * @returns {string}
       *   the preview subtitle
       * @since 1.40.0
       *
       * @see chip.preview.setPreviewSubtitle
       */
      getPreviewSubtitle: function () {
        return sPreviewSubtitle;
      },

      /**
       * Returns the preview title for this CHIP.
       *
       * @name contract.preview.getPreviewTitle
       * @function
       * @returns {string}
       *   the preview title
       * @since 1.11.0
       *
       * @see chip.preview.setPreviewTitle
       */
      getPreviewTitle: function () {
        return sPreviewTitle;
      },


      /**
       * Returns the target URL for the CHIP's underlying application.
       *
       * @name contract.preview.getTargetUrl
       * @function
       * @returns {string}
       *   target URL
       * @since 1.11.0
       *
       * @see chip.preview.setTargetUrl
       */
      getTargetUrl: function () {
        return sTargetUrl;
      },

      /**
       * Determines whether preview mode for this CHIP instance is enabled by the page builder.
       * <b>Note:</b> Changing this setting after <code>getImplementationAsSapui5()</code> has been
       * called probably violates the contract of <code>chip.preview.isEnabled()</code>!
       *
       * @param {boolean} bNewEnabled
       *   whether preview mode for this CHIP instance is enabled by the page builder
       *
       * @name contract.preview.setEnabled
       * @function
       * @since 1.11.0
       *
       * @see sap.ui2.srvc.ChipInstance#getImplementationAsSapui5()
       * @see chip.preview.isEnabled
       */
      setEnabled: function (bNewEnabled) {
        bEnabled = bNewEnabled;
      }
    };
  });
}());
