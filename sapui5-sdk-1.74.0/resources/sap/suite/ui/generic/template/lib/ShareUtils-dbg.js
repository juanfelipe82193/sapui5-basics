sap.ui.define(["sap/base/util/ObjectPath", "sap/base/util/extend", "sap/base/Log"], function(ObjectPath,extend,Log) {
	"use strict";

	var ShareUtils = {};

	/**
	 * Pre-populates the given shareModel with localized texts so that they can be used in the ShareSheet fragment.
	 *
	 * @param {sap.ui.core.Control} fragment The fragment instance whose model is to be updated
	 * @param {sap.ui.model.json.JSONModel} shareModel The model instance to be updated
	 * @protected
	 * @static
	 */
	ShareUtils.setStaticShareData = function(fragment, shareModel) {
		var oResource = sap.ui.getCore().getLibraryResourceBundle("sap.m");

		shareModel.setProperty("/emailButtonText", oResource.getText("SEMANTIC_CONTROL_SEND_EMAIL"));
		shareModel.setProperty("/jamButtonText", oResource.getText("SEMANTIC_CONTROL_SHARE_IN_JAM"));

		var fnGetUser = ObjectPath.get("sap.ushell.Container.getUser");
		shareModel.setProperty("/jamVisible", !!fnGetUser && fnGetUser().isJamActive());
	};

	/**
	 * Opens a Sharing Dialog. in cFLP scenario, takes the correct URL
	 *
	 * @param {string} text The text of the sharing dialog
	 * @protected
	 * @static
	 */
	ShareUtils.openJamShareDialog = function(text) {
		//in case we are in cFLP scenario, the application is running
		// inside an iframe, and there for we need to get the cFLP URL
		// and not 'document.URL' that represents the iframe URL
		if (sap.ushell && sap.ushell.Container && sap.ushell.Container.runningInIframe && sap.ushell.Container.runningInIframe()) {
			sap.ushell.Container.getFLPUrl(true).then(function (sUrl) {
				doOpenJamShareDialog(text, sUrl);
			}, function (sError) {
				Log.error("Could not retrieve cFLP URL for the sharing dialog (dialog will not be opened)", sError,
					"sap.suite.ui.generic.template.lib.ShareUtils");
			});
		} else {
			//non cFLP scenario - simply open the dialog with document.URL
			doOpenJamShareDialog(text, document.URL);
		}
	};

	//the actual openning of the JAM share dialog
	function doOpenJamShareDialog(text, sUrl) {
		var oShareDialog = sap.ui.getCore().createComponent({
			name: "sap.collaboration.components.fiori.sharing.dialog",
			settings: {
				object: {
					id: sUrl,
					share: text
				}
			}
		});
		oShareDialog.open();
	}

	/**
	 * Instantiates and opens the ShareSheet fragment and merges its model data with the SaveAsTile data
	 * returned by the function getModelData of the fragment controller.
	 *
	 * @param {sap.suite.ui.template.lib.CommonUtils} commonUtils The common utils instance providing common functionality
	 * @param {sap.ui.core.Control} by The control by which the popup is to be opened
	 * @param {object} fragmentController A plain object serving as the share popup's controller
	 * @returns {sap.ui.core.Control} The new instance of the ShareSheet fragment
	 * @protected
	 * @static
	 */
	ShareUtils.openSharePopup = function(commonUtils, by, fragmentController) {
		var oShareActionSheet;
		fragmentController.onCancelPressed = function() {
			oShareActionSheet.close();
		};

		oShareActionSheet = commonUtils.getDialogFragment("sap.suite.ui.generic.template.fragments.ShareSheet", fragmentController, "share", ShareUtils.setStaticShareData);

		var oShareModel = oShareActionSheet.getModel("share");
		var oNewData = extend(oShareModel.getData(), fragmentController.getModelData());

		oShareModel.setData(oNewData);
		oShareActionSheet.openBy(by);

		return oShareActionSheet;
	};

	/**
	 * Get custom URL for creating a new tile.
	 *
	 * @returns {string} The custom URL
	 * @protected
	 * @static
	 */
	ShareUtils.getCustomUrl = function() {
		if (!window.hasher) {
			sap.ui.require("sap/ui/thirdparty/hasher");
		}

		var sHash = window.hasher.getHash();
		return sHash ? ("#" + sHash) : window.location.href;
	};

	return ShareUtils;
});
