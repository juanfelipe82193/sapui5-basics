/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

/**
 * Initialization Code and shared classes of library sap.uiext.inbox.
 */
sap.ui.define([
	"sap/ui/core/library", // library dependency
	"sap/ui/commons/library", // library dependency
	"sap/ui/ux3/library", // library dependency
	"sap/ui/core/Core"
], function() {

	/**
	 * The Unified Inbox control
	 *
	 * @namespace
	 * @name sap.uiext.inbox
	 * @public
	 */

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.uiext.inbox",
		dependencies : ["sap.ui.core","sap.ui.commons","sap.ui.ux3"],
		types: [],
		interfaces: [],
		controls: [
			"sap.uiext.inbox.Inbox",
			"sap.uiext.inbox.InboxLaunchPad",
			"sap.uiext.inbox.InboxSplitApp",
			"sap.uiext.inbox.SubstitutionRulesManager",
			"sap.uiext.inbox.composite.InboxAddAttachmentTile",
			"sap.uiext.inbox.composite.InboxAttachmentTile",
			"sap.uiext.inbox.composite.InboxAttachmentsTileContainer",
			"sap.uiext.inbox.composite.InboxBusyIndicator",
			"sap.uiext.inbox.composite.InboxComment",
			"sap.uiext.inbox.composite.InboxTaskComments",
			"sap.uiext.inbox.composite.InboxTaskTitleControl",
			"sap.uiext.inbox.composite.InboxUploadAttachmentTile"
		],
		elements: [],
		version: "1.74.0"
	});

	return sap.uiext.inbox;

});
