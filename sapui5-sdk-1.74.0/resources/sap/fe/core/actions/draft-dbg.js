/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

// Provides static functions for the draft programming model
sap.ui.define(["sap/m/Dialog", "sap/m/Button", "sap/m/Text", "sap/m/MessageBox", "sap/fe/core/actions/messageHandling"], function(
	Dialog,
	Button,
	Text,
	MessageBox,
	messageHandling
) {
	"use strict";

	/**
	 * Interface for callbacks used in the functions
	 *
	 *
	 * @author SAP SE
	 * @since 1.54.0
	 * @interface
	 * @name sap.fe.core.actions.draft.ICallback
	 * @public
	 * @sap-restricted
	 */

	/**
	 * Callback to approve or reject the creation of a draft
	 * @name sap.fe.core.actions.draft.ICallback.beforeCreateDraftFromActiveDocument
	 * @function
	 * @public
	 * @static
	 * @abstract
	 * @param {sap.ui.model.odata.v4.Context} oContext Context of the active document for the new draft
	 * @returns {(boolean|Promise)} Approval of draft creation [true|false] or Promise that resolves with the boolean value
	 *
	 * @sap-restricted
	 */

	/**
	 * Callback after a draft was successully created
	 * @name sap.fe.core.actions.draft.ICallback.afterCreateDraftFromActiveDocument
	 * @function
	 * @public
	 * @static
	 * @abstract
	 * @param {sap.ui.model.odata.v4.Context} oContext Context of the new draft
	 * @param {sap.ui.model.odata.v4.Context} oActiveDocumentContext Context of the active document for the new draft
	 * @returns {sap.ui.model.odata.v4.Context} oActiveDocumentContext
	 *
	 * @sap-restricted
	 */

	/**
	 * Callback to approve or reject overwriting an unsaved draft of another user
	 * @name sap.fe.core.actions.draft.ICallback.whenDecisionToOverwriteDocumentIsRequired
	 * @function
	 * @public
	 * @static
	 * @abstract
	 *
	 * @param {sap.ui.model.odata.v4.Context} oContext Context of the active document for the new draft
	 * @returns {(boolean|Promise)} Approval to overwrite unsaved draft [true|false] or Promise that resolves with the boolean value
	 *
	 * @sap-restricted
	 */

	/**
	 * Creates a draft document from an existing document
	 *
	 * The function supports several hooks as there is a certain coreography defined
	 * @function
	 * @name sap.fe.core.actions.draft#createDraftFromActiveDocument
	 * @memberof sap.fe.core.actions.draft
	 * @static
	 * @param {sap.ui.model.odata.v4.Context} oContext Context of the active document for the new draft
	 * @param {object} mParameters The parameters
	 * @param {boolean} [mParameters.bPreserveChanges] [true] Preserve changes of an existing draft of another user
	 * @param {sap.fe.core.actions.draft.ICallback.beforeCreateDraftFromActiveDocument} [mParameters.fnBeforeCreateDraftFromActiveDocument] Callback that allows veto before create request is executed
	 * @param {sap.fe.core.actions.draft.ICallback.afterCreateDraftFromActiveDocument} [mParameters.fnAfterCreateDraftFromActiveDocument] Callback for postprocessiong after draft document was created
	 * @param {sap.fe.core.actions.draft.ICallback.whenDecisionToOverwriteDocumentIsRequired} [mParameters.fnWhenDecisionToOverwriteDocumentIsRequired] Callback for deciding on overwriting an unsaved change by another user
	 * @returns {Promise} Promise resolves with the {@link sap.ui.model.odata.v4.Context context} of the new draft document
	 * @private
	 * @sap-restricted
	 */
	function createDraftFromActiveDocument(oContext, mParameters) {
		var mParam = mParameters || {},
			localI18nRef = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core"),
			bRunPreserveChangesFlow =
				typeof mParam.bPreserveChanges === "undefined" || (typeof mParam.bPreserveChanges === "boolean" && mParam.bPreserveChanges); //default true

		/**
		 * Overwrite or reject based on fnWhenDecisionToOverwriteDocumentIsRequired
		 * @param {*} bOverwrite Overwrite the change or not
		 * @returns {Promise} Resolves with result of {@link sap.ui.fe.model.DraftModel#executeDraftEditAction}
		 */
		function overwriteOnDemand(bOverwrite) {
			if (bOverwrite) {
				//Overwrite existing changes
				var oModel = oContext.getModel(),
					draftDataContext = oModel.bindContext(oContext.getPath() + "/DraftAdministrativeData").getBoundContext();
				return draftDataContext.requestObject().then(function(draftAdminData) {
					if (draftAdminData) {
						// remove all unbound transition messages as we show a special dialog
						messageHandling.removeUnboundTransitionMessages();
						var sInfo = draftAdminData.InProcessByUserDescription || draftAdminData.InProcessByUser;
						if (sInfo) {
							MessageBox.error(localI18nRef.getText("OBJECT_PAGE_DRAFT_LOCKED_BY_USER", sInfo));
							throw new Error(localI18nRef.getText("OBJECT_PAGE_DRAFT_LOCKED_BY_USER", sInfo));
						} else {
							return showMessageBox(draftAdminData).then(function() {
								return oContext.executeDraftEditAction(false);
							});
						}
					}
				});
			}
			return Promise.reject(new Error("Draft creation aborted for document: " + oContext.getPath()));
		}

		function showMessageBox(draftAdminData) {
			return new Promise(function(resolve, reject) {
				var sInfo = draftAdminData.CreatedByUserDescription || draftAdminData.CreatedByUser,
					oDialog = new Dialog({
						title: localI18nRef.getText("OBJECT_PAGE_WARNING"),
						state: "Warning",
						content: new Text({
							text: localI18nRef.getText("OBJECT_PAGE_DRAFT_UNSAVED_CHANGES", sInfo)
						}),
						beginButton: new Button({
							text: localI18nRef.getText("OBJECT_PAGE_EDIT"),
							type: "Emphasized",
							press: function() {
								oDialog.close();
								resolve(true);
							}
						}),
						endButton: new Button({
							text: localI18nRef.getText("OBJECT_PAGE_CANCEL"),
							press: function() {
								oDialog.close();
								reject("Draft creation aborted for document: " + oContext.getPath());
							}
						}),
						afterClose: function() {
							oDialog.destroy();
						}
					});
				oDialog.addStyleClass("sapUiContentPadding");
				oDialog.open();
			});
		}

		if (!oContext) {
			return Promise.reject(new Error("Binding context to active document is required"));
		}
		if (!oContext.executeDraftEditAction) {
			return Promise.reject(new Error("Draft is not supported by document: " + oContext.getPath()));
		}
		return Promise.resolve(
			mParam.fnBeforeCreateDraftFromActiveDocument
				? mParam.fnBeforeCreateDraftFromActiveDocument(oContext, bRunPreserveChangesFlow)
				: true
		)
			.then(function(bExecute) {
				if (!bExecute) {
					throw new Error("Draft creation was aborted by extension for document: " + oContext.getPath());
				}
				return oContext.executeDraftEditAction(bRunPreserveChangesFlow).catch(function(oResponse) {
					//Only call back if error 409
					if (bRunPreserveChangesFlow && oResponse.status === 409) {
						return Promise.resolve(
							mParam.fnWhenDecisionToOverwriteDocumentIsRequired ? mParam.fnWhenDecisionToOverwriteDocumentIsRequired() : true
						).then(overwriteOnDemand);
					} else {
						throw new Error(oResponse);
					}
				});
			})
			.then(function(oDraftContext) {
				return Promise.resolve(
					mParam.fnAfterCreateDraftFromActiveDocument
						? mParam.fnAfterCreateDraftFromActiveDocument(oContext, oDraftContext)
						: oDraftContext
				);
			})
			.catch(function(exc) {
				return Promise.reject(exc);
			});
	}

	/**
		 * Creates an active document from a draft document
		 *
		 * The function supports several hooks as there is a certain coreography defined
		 * @function
		 * @name sap.fe.core.actions.draft#activateDocument
		 * @memberof sap.fe.core.actions.draft
		 * @static
		 * @param {sap.ui.model.odata.v4.Context} oContext Context of the active document for the new draft

		 * @param {object} mParameters The parameters
		 * @param {sap.fe.core.actions.draft.ICallback.fnBeforeActivateDocument} [mParameters.fnBeforeActivateDocument] Callback that allows veto before create request is executed
		 * @param {sap.fe.core.actions.draft.ICallback.fnAfterActivateDocument} [mParameters.fnAfterActivateDocument] Callback for postprocessiong after document was activated.
		 * @returns {Promise} Promise resolves with the {@link sap.ui.model.odata.v4.Context context} of the new draft document
 		 * @private
		 * @sap-restricted
		 */
	function activateDocument(oContext, mParameters) {
		var mParam = mParameters || {};

		if (!oContext) {
			return Promise.reject(new Error("Binding context to draft document is required"));
		}
		if (!oContext.executeDraftActivationAction) {
			return Promise.reject(new Error("Activation action is not supported for document : " + oContext.getPath()));
		}
		return Promise.resolve(mParam.fnBeforeActivateDocument ? mParam.fnBeforeActivateDocument(oContext) : true)
			.then(function(bExecute) {
				if (!bExecute) {
					return Promise.reject(
						new Error("Activation of the document was aborted by extension for document: " + oContext.getPath())
					);
				}
				if (!oContext.executeDraftPreparationAction) {
					return oContext.executeDraftActivationAction();
				}
				/* activation requires preparation */
				return oContext
					.executeDraftPreparationAction(/* default is "" */)
					.then(function() {
						return oContext.executeDraftActivationAction();
					})
					.catch(function(exc) {
						return Promise.reject(exc);
					});
			})
			.then(function(oActiveDocumentContext) {
				return Promise.resolve(
					mParam.fnAfterActivateDocument
						? mParam.fnAfterActivateDocument(oContext, oActiveDocumentContext)
						: oActiveDocumentContext
				);
			})
			.catch(function(exc) {
				return Promise.reject(exc);
			});
	}

	/**
	 * Static functions for the draft programming model
	 *
	 * @namespace
	 * @alias sap.fe.core.actions.draft
	 * @public
	 * @sap-restricted
	 * @experimental This module is only for experimental use! <br/><b>This is only a POC and maybe deleted</b>
	 * @since 1.54.0
	 */
	var draft = {
		createDraftFromActiveDocument: createDraftFromActiveDocument,
		activateDocument: activateDocument
	};

	return draft;
});
