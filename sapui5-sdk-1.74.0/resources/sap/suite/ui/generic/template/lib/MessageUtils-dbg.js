/* Class containing static methods for message handling. */
sap.ui.define(["sap/ui/generic/app/util/MessageUtil",
	"sap/base/Log"
], function(GenericMessageUtil, Log) {
		"use strict";

		/**
		 * Logger for this class.
		 *
		 * @type {Log.Logger}
		 * @static
		 * @private
		 * @ignore
		 */
		var oLogger = Log.getLogger("sap.suite.ui.generic.template.lib.MessageUtils");

		/**
		 * Handles errors for all of Smart Templates.
		 *
		 * @param {string} sOperation - String defined by the object sap.ui.generic.app.util.MessageUtil.operations.
		 * @param {sap.ui.core.mvc.Controller} oController - Controller instance of the calling function.
		 * @param {object} oServices - Object containing instances of the calling template's services.
		 * @param {object} oError - Error object fired by a variety of classes.
		 * @param {map} mParameters - Additional parameters that can be of use while handling an error.
		 * @private
		 * @ignore
		 */
		function fnHandleError(sOperation, oController, oServices, oError, mParameters, mCallbacks) {
			mParameters = mParameters || {};

			var oErrorResponse = GenericMessageUtil.parseErrorResponse(oError);
			var sMessageText = oErrorResponse.messageText;
			var sMessageDescription;
			var bNavigateToMessagePage = false;

			// This tells this function not to add the
			// transient message at the end. I do this because
			// in the only case where the message popover is shown,
			// the ODataModel has already added the message to the
			// MessageManager's set of messages, and doesn't need to be
			// repeated by calling the GenericMessageUtil.addTransientErrorMessage
			// method at the end of the function.
			var bShowMessagePopover = false;
			var oComponent = oController && oController.getOwnerComponent();
			var oResourceBundle = mParameters.resourceBundle || oComponent.getModel("i18n").getResourceBundle();
			var oNavigationController = mParameters.navigationController || oServices.oNavigationController;
			var oModel = mParameters.model || oComponent.getModel();

			oLogger.debug("handleError has been called with operation " + sOperation + " and HTTP response status code " + oErrorResponse.httpStatusCode);
			var fnCallback = mCallbacks && mCallbacks[oErrorResponse.httpStatusCode];
			if (fnCallback) {
				fnCallback(oErrorResponse.httpStatusCode);
			}
			switch (oErrorResponse.httpStatusCode) {
				case "400":
					switch (sOperation) {
						case GenericMessageUtil.operations.modifyEntity:
							// if a draft patch failed with a 400 we rely on a meaningful message from the backend
							break;
						case GenericMessageUtil.operations.callAction:
							sMessageText = oResourceBundle.getText("ST_GENERIC_BAD_REQUEST_ACTION");
							break;
						case GenericMessageUtil.operations.deleteEntity:
							sMessageText = oResourceBundle.getText("ST_GENERIC_BAD_REQUEST_DELETE");
							break;
						case GenericMessageUtil.operations.editEntity:
							sMessageText = oResourceBundle.getText("ST_GENERIC_BAD_REQUEST_EDIT");
							break;
						case GenericMessageUtil.operations.saveEntity:
						case GenericMessageUtil.operations.activateDraftEntity:
							if (oServices &&
									oServices.oTemplateCapabilities &&
									oServices.oTemplateCapabilities.oMessageButtonHelper &&
									oServices.oTemplateCapabilities.oMessageButtonHelper.showMessagePopover) {
								oServices.oTemplateCapabilities.oMessageButtonHelper.showMessagePopover();
								bShowMessagePopover = true;
							} else {
								oLogger.info("A MessageButtonHelper class instance could not be found as one of the services' template capabilities.");
							}
							break;
						default:
							sMessageText = oResourceBundle.getText("ST_GENERIC_BAD_REQUEST");
							break;
					}
					break;
				case "401":
					bNavigateToMessagePage = true;
					sMessageText = oResourceBundle.getText("ST_GENERIC_ERROR_AUTHENTICATED_FAILED");
					sMessageDescription = oResourceBundle.getText("ST_GENERIC_ERROR_AUTHENTICATED_FAILED_DESC");
					break;
				case "403":
					switch (sOperation) {
						case GenericMessageUtil.operations.callAction:
							sMessageText = oResourceBundle.getText("ST_GENERIC_ERROR_NOT_AUTORIZED_ACTION");
							break;
						case GenericMessageUtil.operations.deleteEntity:
							sMessageText = oResourceBundle.getText("ST_GENERIC_ERROR_NOT_AUTORIZED_DELETE");
							break;
						case GenericMessageUtil.operations.editEntity:
							sMessageText = oResourceBundle.getText("ST_GENERIC_ERROR_NOT_AUTORIZED_EDIT");
							break;
						default:
							sMessageText = oResourceBundle.getText("ST_GENERIC_ERROR_NOT_AUTORIZED");
							sMessageDescription = oResourceBundle.getText("ST_GENERIC_ERROR_NOT_AUTORIZED_DESC");
							bNavigateToMessagePage = true;
							break;
					}
					break;
				case "404":
					switch (sOperation) {
						case GenericMessageUtil.operations.callAction:
							sMessageText = oResourceBundle.getText("ST_GENERIC_BAD_REQUEST_ACTION");
							break;
						default:
							sMessageText = oResourceBundle.getText("ST_GENERIC_BAD_REQUEST");
							break;
					}
					break;
				case "409":
				case "412":
					// Warning scenario
					if (sOperation === GenericMessageUtil.operations.activateDraftEntity && oError.response && oError.response.headers && oError.response.headers["preference-applied"] === "handling=strict"){
						return;
					}
					// Conflict, we show the message returned from the backend in a dialog
					break;
				case "500":
				case "501":
				case "502":
				case "503":
				case "504":
				case "505":
					bNavigateToMessagePage = true;
					switch (sOperation) {
						case GenericMessageUtil.operations.callAction:
							sMessageText = oResourceBundle.getText("ST_GENERIC_ERROR_SYSTEM_UNAVAILABLE_FOR_ACTION");
							break;
						default:
							sMessageText = oResourceBundle.getText("ST_GENERIC_ERROR_SYSTEM_UNAVAILABLE");
							break;
					}
					sMessageDescription = oResourceBundle.getText("ST_GENERIC_ERROR_SYSTEM_UNAVAILABLE_DESC");
					break;
				case undefined:
					/*adapted to have a reasonable processing for the Apply-Button -
					 * workaround to not leave the page in case of apply */
					bNavigateToMessagePage = false;
					bShowMessagePopover = true;
					break;
				default:
					// Even though the HTTP protocol doesn't specify status codes outside
					// of what is handled in this switch statement, the Checkmarx code scan
					// picks up a missing default case as problematic. This default case
					// is added here for the sake of the Checkmarx scan.
					bNavigateToMessagePage = true;
					sMessageText = oResourceBundle.getText("ST_GENERIC_ERROR_SYSTEM_UNAVAILABLE");
					sMessageDescription = oResourceBundle.getText("ST_GENERIC_ERROR_SYSTEM_UNAVAILABLE_DESC");
					break;
			}

			if (bNavigateToMessagePage) {
				var iViewLevel;
				if (oComponent){
					var oTemplPrivModel = oComponent.getModel("_templPriv");
					iViewLevel = oTemplPrivModel.getProperty("/generic/viewLevel");
				}
				// TODO: we shall remove the transient messages as they might come up later
				oNavigationController.navigateToMessagePage({
					title: oResourceBundle.getText("ST_GENERIC_ERROR_TITLE"),
					text: sMessageText,
					description: sMessageDescription,
					icon: "sap-icon://message-error",
					viewLevel: iViewLevel
				});
			} else {
				// When bShowMessagePopover is true we open the message popover and expect that the service returned either
				// state or transient messages, in case it's false and there's no transient message returned from
				// the backend we add our generic message as transient message
				if (!oErrorResponse.containsTransientMessage && !bShowMessagePopover) {
					GenericMessageUtil.addTransientErrorMessage(sMessageText, sMessageDescription, oModel);
				}
			}
		}

		function fnNavigateToMessageTarget(oCommonUtils, oMessage) {
			var sId = oCommonUtils.getPositionableControlId(oMessage.controlIds, true);
			oCommonUtils.focusControl(sId);
		}

		/**
		 * Gets section based on section title and visibility.
		 *
		 * @param {object} oObjectPage - Object page.
		 * @param {string} sSectionTitle - Section title.
		 * @private
		 * @ignore
		 */
		function fnGetSectionBySectionTitle(oObjectPage, sSectionTitle) {
			if (sSectionTitle) {
				var aSections = oObjectPage.getSections();
				var oSection;
				for (var i = 0; i < aSections.length; i++) {
					if (aSections[i].getVisible() && aSections[i].getTitle() === sSectionTitle) {
						oSection = aSections[i];
						break;
					}
				}
				return oSection;
			}
		}

		/**
		 * Navigates to section if object page uses IconTabBar and current section is not equal to the section to navigate.
		 *
		 * @param {object} oObjectPage - Object page.
		 * @param {string} sSectionTitle - Section title.
		 * @private
		 * @ignore
		 */
		function fnNavigateFromMessageToSectionInIconTabBarMode(oObjectPage, sSectionTitle) {
			var bUseIconTabBar = oObjectPage.getUseIconTabBar();
			if (bUseIconTabBar) {
				var oSection = fnGetSectionBySectionTitle(oObjectPage, sSectionTitle);
				var sSelectedSectionId = oObjectPage.getSelectedSection();
				if (oSection && sSelectedSectionId !== oSection.getId()) {
					oObjectPage.setSelectedSection(oSection.getId());
				}
			}
		}

		/**
		 * Navigate to section to which current clicked message belongs and calls method to focus
		 * on current clicked message control.
		 *
		 * @param {object} oCommonUtils - Object containing instance of common service.
		 * @param {object} oEvent - Event object.
		 * @param {object} oController - Controller of the enclosing object page.
		 * @private
		 * @ignore
		 */
		function fnNavigateFromMessageTitleEvent(oCommonUtils, oEvent, oController) {
			var oMessageItem = oEvent.getParameter("item");
			var oObjectPage = oController ? oController.byId("objectPage") : undefined;
			if (oObjectPage) {
				var sSectionTitle = oMessageItem.getGroupName();
				fnNavigateFromMessageToSectionInIconTabBarMode(oObjectPage, sSectionTitle);
			}
			var oMessage = oMessageItem.getBindingContext("msg").getObject();
			fnNavigateToMessageTarget(oCommonUtils, oMessage);
		}

		/*
		This function shows the given success message in case no transient message is available(in the message model).
		If transient messages are available this function does nothing,
		as it relies on the fact that these transient messages will be shown.
		*/
		function fnShowSuccessMessageIfRequired(sFallbackMessageText, oServices){
			var aMessages  = sap.ui.getCore().getMessageManager().getMessageModel().getData();
			var bMessageAvailable = aMessages.some(function(oMessage) {
							return oMessage.persistent;
						});
			if (!bMessageAvailable){
				oServices.oApplication.showMessageToast(sFallbackMessageText);
			}
		}

		return {
			operations: GenericMessageUtil.operations,
			handleTransientMessages: GenericMessageUtil.handleTransientMessages,
			handleError: fnHandleError,
			navigateFromMessageTitleEvent: fnNavigateFromMessageTitleEvent,
			removeTransientMessages: GenericMessageUtil.removeTransientMessages,
			showSuccessMessageIfRequired: fnShowSuccessMessageIfRequired
		};
	});
