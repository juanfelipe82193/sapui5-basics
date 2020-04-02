/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

// Provides static functions for the sticky session programming model
sap.ui.define(["sap/fe/core/actions/operations"], function(operations) {
	"use strict";

	/**
	 * Opens a sticky session to edit a document
	 *
	 * @function
	 * @name sap.fe.core.actions.sticky#editDocumentInStickySession
	 * @memberof sap.fe.core.actions.sticky
	 * @static
	 * @param {sap.ui.model.odata.v4.Context} oContext Context of the document to be edited
	 * @private
	 * @sap-restricted
	 */
	function editDocumentInStickySession(oContext) {
		var oModel = oContext.getModel(),
			oMetaModel = oModel.getMetaModel(),
			sMetaPath = oMetaModel.getMetaPath(oContext.getPath()),
			sEditAction = oMetaModel.getObject(sMetaPath + "@com.sap.vocabularies.Session.v1.StickySessionSupported/EditAction"),
			oEditAction;

		if (!sEditAction) {
			throw new Error("Edit Action for Sticky Session not found for " + sMetaPath);
		}

		oEditAction = oModel.bindContext(sEditAction + "(...)", oContext);
		return oEditAction.execute();
	}

	/**
	 * activates a document and closes sticky session
	 *
	 * @function
	 * @name sap.fe.core.actions.sticky#activateDocument
	 * @memberof sap.fe.core.actions.sticky
	 * @static
	 * @param {sap.ui.model.odata.v4.Context} oContext Context of the document to be activated
	 * @private
	 * @sap-restricted
	 */
	function activateDocument(oContext) {
		var oModel = oContext.getModel(),
			oMetaModel = oModel.getMetaModel(),
			sMetaPath = oMetaModel.getMetaPath(oContext.getPath()),
			sSaveAction = oMetaModel.getObject(sMetaPath + "@com.sap.vocabularies.Session.v1.StickySessionSupported/SaveAction"),
			oSaveAction;

		if (!sSaveAction) {
			throw new Error("Save Action for Sticky Session not found for " + sMetaPath);
		}

		oSaveAction = oModel.bindContext(sSaveAction + "(...)", oContext);
		return oSaveAction.execute();
	}

	/**
	 * discards a document and closes sticky session
	 *
	 * @function
	 * @name sap.fe.core.actions.sticky#discardDocument
	 * @memberof sap.fe.core.actions.sticky
	 * @static
	 * @param {sap.ui.model.odata.v4.Context} oContext Context of the document to be discarded
	 * @private
	 * @sap-restricted
	 */
	function discardDocument(oContext) {
		var oModel = oContext.getModel(),
			oMetaModel = oModel.getMetaModel(),
			sMetaPath = oMetaModel.getMetaPath(oContext.getPath()),
			sDiscardAction = oMetaModel.getObject(sMetaPath + "@com.sap.vocabularies.Session.v1.StickySessionSupported/DiscardAction"),
			oDiscardAction;

		if (!sDiscardAction) {
			throw new Error("Discard Action for Sticky Session not found for " + sMetaPath);
		}

		oDiscardAction = oModel.bindContext("/" + sDiscardAction + "(...)");
		return oDiscardAction.execute().then(function() {
			return oContext;
		});
	}

	/**
	 * Static functions for the sticky session programming model
	 *
	 * @namespace
	 * @alias sap.fe.core.actions.sticky
	 * @public
	 * @sap-restricted
	 * @experimental This module is only for experimental use! <br/><b>This is only a POC and maybe deleted</b>
	 * @since 1.54.0
	 */
	var sticky = {
		editDocumentInStickySession: editDocumentInStickySession,
		activateDocument: activateDocument,
		discardDocument: discardDocument
	};

	return sticky;
});
