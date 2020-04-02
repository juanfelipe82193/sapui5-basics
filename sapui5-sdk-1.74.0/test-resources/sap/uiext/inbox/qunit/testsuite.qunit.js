sap.ui.define(function() {

	"use strict";
	return {
		name: "QUnit TestSuite for sap.uiext.inbox",
		defaults: {
			bootCore: true,
			ui5: {
				libs: "sap.ui.commons,sap.uiext.inbox",
				theme: "sap_bluecrystal"
			},
			qunit: {
				version: 1,
				reorder: false
			},
			sinon: {
				version: "edge",
				qunitBridge: true,
				useFakeTimers: false
			}
		},
		tests: {
			Inbox: {
				title: "Qunit Test for Inbox",
				ui5: {
					libs: "sap.uiext.inbox",
					language: "en-US"
				},
			},
			InboxAddActionAPI: {
				title: "Qunit for testing Add Action API for Inbox Control",
				ui5: {
					language: "en-US"
				},
			},
			InboxCommentUsage: {
				title: "qUnit Page for Inbox Comments",
				ui5: {
					language: "en-US"
				},
			},
			InboxCustomActions: {
				title: "qUnit Page for Custom Actions in Table View",
				ui5: {
					language: "en-US"
				},
			},
			InboxFilterCategory: {
				title: "qUnit Page for Inbox Task Category",
				ui5: {
					language: "en-US"
				},
			},
			InboxFilterPreservation: {
				title: "qUnit Page for Inbox Task Category",
				ui5: {
					language: "en-US"
				},
			},
			InboxLink: {
				title: "Test Page for sap.uiext.inbox.InboxLink",
				ui5: {
					libs: "sap.uiext.inbox",
					language: "en-US"
				},
			},
			InboxNotification: {
				title: "qUnit Page for Inbox Notification Bar",
				ui5: {
					language: "en-US"
				},
			},
			InboxObjectLink: {
				title: "qUnit Page for Inbox Object Link",
				ui5: {
					language: "en-US"
				},
			},
			InboxRRViewDescriptionDefinitionSearchTest: {
				title: "Qunit Test for TaskDescription and TaskDefinition Search in RR View",
				ui5: {
					libs: "sap.uiext.inbox",
					language: "en-US"
				}
			},
			InboxRenderTaskDescriptionAsHtml: {
				title: "Qunit for testing rendering of Task Description as HTML",
				ui5: {
					language: "en-US"
				},
			},
			InboxResizingTaskExecutnOverlay: {
				title: "qUnit Page for Resizing of Task ExecutionUI Overlayr",
				ui5: {
					language: "en-US"
				},
			},
			InboxRowRepeaterView: {
				title: "Qunit Test for Inbox using Row Repeater View",
				ui5: {
					libs: "sap.uiext.inbox",
					language: "en-US"
				},
			},
			InboxSearchUsers: {
				title: "qUnit Page for Inbox Search Users",
				ui5: {
					language: "en-US"
				},
			},
			InboxShowHideCustomAttributes: {
				title: "Qunit for Custom Attribute Icon",
				ui5: {
					language: "en-US"
				},
			},
			InboxSubstitutionRulesManager: {
				title: "Qunit Test for Inbox Subtitution Rules Manager",
				ui5: {
					libs: "sap.uiext.inbox"
				},
			},
			InboxTCMModelTest: {
				title: "Test Page for sap.uiext.inbox.tcm.TCMModel",
				ui5: {
					libs: "sap.uiext.inbox",
					language: "en-US"
				},
				module: [
					"./tcm/InboxTCMModelQUnit",
					"./tcm/InboxTCMFunctionImportMockServerQUnit"
				]
			},
			InboxTableColumnFilter: {
				title: "qUnit Page for Column Filters in Table View",
				ui5: {
					language: "en-US"
				},
			},
			InboxTaskCategory: {
				title: "qUnit Page for Inbox Task Category",
				ui5: {
					language: "en-US"
				},
			},
			InboxTaskComments: {
				title: "qunit Test for InboxTaskComments",
				ui5: {
					libs: "sap.uiext.inbox"
				},
			},
			InboxTaskDefinitionTest: {
				title: "Qunit Test for Inbox TaskDefinition Facet Filter",
				ui5: {
					libs: "sap.uiext.inbox"
				},
			},
			InboxTaskInitialFilterTest: {
				title: "Qunit Test for Task Initial Filters",
				ui5: {
					libs: "sap.uiext.inbox"
				},
			},
			InboxTaskSelectionAPI: {
				title: "Qunit for testing taskSelection event for inbox",
				ui5: {
					language: "en-US"
				},
			},
			InboxUtils: {
				title: "qUnit Page for Inbox Utils",
				ui5: {
					language: "en-US"
				},
			},
			"controller/Inbox": {
				title: "qUnit Page for Inbox Controller",
				ui5: {
					language: "en-US"
				},
			},
			"controller/InboxController": {
				title: "qUnit Page for Inbox Controller",
				ui5: {
					language: "en-US"
				},
			},
			"controller/InboxControllerFactory": {
				title: "qUnit Page for Inbox ControllerFactroy",
				ui5: {
					language: "en-US"
				},
			}
		}
	};
});
