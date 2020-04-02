/*eslint-disable */

jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageStrip");
jQuery.sap.require("sap.ui.core.MessageType");
jQuery.sap.require("sap.ui.core.TitleLevel");

var oEventCounter = {
	chartMouseOver: 0,
	chartRightClick: 0,
	chartDoubleClick: 0,
	shapeSelectionChange: 0,
	customSettingChange: 0
};

var oMsgStackManager = {
	oMsgStack: null,
	oMsgModel: null,
	oMsgPopover: null,
	oMsgButton: null
}

function printEventInMsgToast (oEvent) {
	sap.m.MessageToast.show(eventText(oEvent));
}

function createPage(title, bNeedFooter) {
	window.oPage = new sap.m.Page({
		title: title,
		titleLevel: sap.ui.core.TitleLevel.H2
	});
	if (bNeedFooter) {
		window.oPage.setFooter(new sap.m.OverflowToolbar({
			content: [createMsgStack()]
		}));
	}
	window.oPage.placeAt("content");
}
function addFooterContentsToPage(oContent) {
	if (!window.oPage.getFooter()) {
		window.oPage.setFooter(new sap.m.OverflowToolbar({
			content: [new sap.m.ToolbarSpacer(), oContent]
		}));
	} else {
		window.oPage.getFooter().addContent(new sap.m.ToolbarSpacer());
		window.oPage.getFooter().addContent(oContent);
	}
}
function createMsgStack() {
	// create model
	oMsgStackManager.oMsgStack = [];
	oMsgStackManager.oMsgStack.push({
		type: sap.ui.core.MessageType.Information,
		title: "All events are captured here",
		description: "Message placeholder for a bug of message popover control"
	});
	
	oMsgStackManager.oMsgModel = new sap.ui.model.json.JSONModel({
		msgStack: oMsgStackManager.oMsgStack,
		msgLength: oMsgStackManager.oMsgStack.length,
		msgErrorExist: false
	});
	//set the limit size to 1000
	oMsgStackManager.oMsgModel.setSizeLimit(1000);
	// create popover and bind to model
	oMsgStackManager.oMsgPopover = new sap.m.MessagePopover({
		initiallyExpanded: true,
		items: {
			path: "/msgStack",
			template: new sap.m.MessagePopoverItem({
				type: "{type}",
				title: "{title}",
				description: "{description}"
			})
		},
		headerButton: new sap.m.Button({
			text: "Clear",
			press: function () {
				while (oMsgStackManager.oMsgStack.length >1) {
					oMsgStackManager.oMsgStack.pop();
				};
				oMsgStackManager.oMsgModel.setProperty("/msgStack", oMsgStackManager.oMsgStack);
				oMsgStackManager.oMsgModel.setProperty("/msgLength", oMsgStackManager.oMsgStack.length);
				oMsgStackManager.oMsgModel.setProperty("/msgErrorExist", false);
			}
		})
	});
	oMsgStackManager.oMsgPopover.setModel(oMsgStackManager.oMsgModel);
	// create button and bind to model
	oMsgStackManager.oMsgButton = new sap.m.Button("gantt-msg", {
		icon: "sap-icon://message-popup",
		type: {
			path: "/msgErrorExist",
			formatter: function (bErrorExist) {
				return bErrorExist ? sap.m.ButtonType.Reject : sap.m.ButtonType.Accept;
			}
		},
		text: "{/msgLength}",
		press: function (oEvent) {
			oMsgStackManager.oMsgPopover.openBy(oEvent.getSource());
		}
	});
	oMsgStackManager.oMsgButton.setModel(oMsgStackManager.oMsgModel);
	return oMsgStackManager.oMsgButton;
};

function pushEventToMsgStack (oEvent, sMsg, sMsgId) {
	var oMsg = generateEventMsg(oEvent);
	if (sMsg) {
		oMsg.description = sMsg;
	}
	if (sMsgId) {
		oMsg.title = sMsgId;
	}

	if (oMsg) {
		oMsgStackManager.oMsgStack.push(oMsg);
		oMsgStackManager.oMsgModel.setProperty("/msgStack", oMsgStackManager.oMsgStack);
		oMsgStackManager.oMsgModel.setProperty("/msgLength", oMsgStackManager.oMsgStack.length);
		if (oMsg && oMsg.type === sap.ui.core.MessageType.Error) {
			oMsgStackManager.oMsgModel.setProperty("/msgErrorExist", true);
		}
	}
};

function generateEventMsg (oEvent) {
	if (!oEvent) {
		return {
			type: sap.ui.core.MessageType.Success,
			title: null,
			description: null,
		};
	} else {
		return {
			type: oEvent.sId === "chartMouseOver" ? sap.ui.core.MessageType.Information : sap.ui.core.MessageType.Success,
			title: oEvent.getId(),
			description: eventText(oEvent),
		}
	}
}

function eventText (oEvent) {
	if (typeof oEvent === "string") {
		return oEvent;
	}
	if (oEvent.getId() == "chartMouseOver") {
		var oParam = oEvent.getParameters();
		var topShape = d3.select(oParam.originEvent.target).data()[0];
		var rowId;
		if (oParam.objectInfo !== undefined) {
			rowId = oParam.objectInfo.data.uuid ? oParam.objectInfo.data.uuid : oParam.objectInfo.id;
		}else if (oParam.leadingObjectInfo !== undefined) {
			rowId = oParam.leadingObjectInfo.data.uuid ? oParam.leadingObjectInfo.data.uuid : oParam.leadingObjectInfo.id;
		}else {
			rowId = "dummy row";
		}
		
		var msg = "Event:" + oEvent.getId() + " is triggered on Row " + rowId + ";";
		if (topShape !== undefined) {
			msg = msg + " on shape " + topShape.id + ";";
		}
		return msg;
	} else {
		return "Event:" + oEvent.getId() + " is triggered " + ++oEventCounter[oEvent.getId()] + " times.";
	}
	
};

sap.ui.jsfragment("sap.gantt.test.ZoomSlider", {
	createContent: function (oGanttChart) {
		var oRetVal = new sap.m.FlexBox({
			direction: sap.m.FlexDirection.Row,
			items: [new sap.m.Label({
				text: "Zoom Rate:",
				labelFor: "gantt_zs"
			}), new sap.m.Slider("gantt_zs", {
				width: "200px",
				max: Math.log(oGanttChart.getAxisTimeStrategy()._oZoom.maxRate),
				min: Math.log(oGanttChart.getAxisTimeStrategy()._oZoom.minRate),
				value: Math.log(oGanttChart.getAxisTimeStrategy()._oZoom.rate),
				liveChange: function (oEvent) {
					oGanttChart.setTimeZoomRate(Math.pow(Math.E, oEvent.getParameter("value")));
				}
			})]
		});
		return oRetVal;
	}
});

sap.ui.jsfragment("sap.gantt.test.JumpDatePicker", {
	createContent: function (oGanttChart) {
		var oRetVal = new sap.m.FlexBox({
			direction: sap.m.FlexDirection.Row,
			items: [new sap.m.Label({
				text: "Jump to:",
				labelFor: "gantt_dp"
			}), new sap.m.DatePicker("gantt_dp", {
				width: "150px",
				valueFormat:"M/d/yyyy",
				change: function (oEvent) {
					oGanttChart.jumpToPosition(new Date(oEvent.getParameter("value")));
				}
			})]
		});
		return oRetVal;
	}
});

sap.ui.jsfragment ( "sap.gantt.test.CSSModeButton",{ 
	createContent: function (oGanttChart ) {
		var fnToggleCompactCozyMode = function (sMode) {
			return function(){
				var $content = $('body');
				var iBaseRowHeight = null; 
				switch(sMode) {
					case "TOGGLE_COZY":
						$content.removeClass('sapUiSizeCompact sapUiSizeCondensed').addClass('sapUiSizeCozy');
						break;
					case "TOGGLE_COMPACT":
						$content.removeClass('sapUiSizeCozy sapUiSizeCondensed').addClass('sapUiSizeCompact');
						break;
					case "TOGGLE_CONDENSED":
						$content.removeClass('sapUiSizeCompact sapUiSizeCozy').addClass('sapUiSizeCompact sapUiSizeCondensed');
						break;
					case "TOGGLE_WEBDYNPRO":
						$content.removeClass('sapUiSizeCozy sapUiSizeCondensed').addClass('sapUiSizeCompact');
						iBaseRowHeight = 27;
						break;
					default:
				}
				// set base row height
				if (oGanttChart instanceof sap.gantt.GanttChartContainer) {
					var aGantts = oGanttChart.getGanttCharts();
					for (var i = 0; i < aGantts.length; i++) {
						aGantts[i].setBaseRowHeight(iBaseRowHeight);
					}
				} else {
					oGanttChart.setBaseRowHeight(iBaseRowHeight);
				}
				window.oPage.invalidate();
			}
		};
		var oModeSegmentedButton = new sap.m.SegmentedButton({
			buttons: [
				new sap.m.Button({id: "sapGanttCompact", text: "Compact", press: fnToggleCompactCozyMode('TOGGLE_COMPACT')}),
				new sap.m.Button({id: "sapGanttCozy", text: "Cozy", press: fnToggleCompactCozyMode('TOGGLE_COZY')}),
				new sap.m.Button({id: "sapGanttCondense", text: "Condense", press: fnToggleCompactCozyMode('TOGGLE_CONDENSED')}),
				new sap.m.Button({id: "sapGanttWebdynpro", text: "Webdynpro", press: fnToggleCompactCozyMode('TOGGLE_WEBDYNPRO')})
			]
		});
		return oModeSegmentedButton; 
	} 
});

sap.ui.jsfragment("sap.gantt.test.ThemeSwitcher", {
	createContent: function() {
		var oSelect = new sap.m.Select({
			selectedKey: sap.ui.getCore().getConfiguration().getTheme(),
			items: [
				new sap.ui.core.Item({ key: "sap_belize", text: "Belize"}),
				new sap.ui.core.Item({ key: "sap_hcb", text: "HCB"}),
				new sap.ui.core.Item({ key: "sap_bluecrystal", text: "BlueCrystal"})
			],
			change: function(oEvent){
				var sTheme = oEvent.getParameter("selectedItem").getKey();
				sap.ui.getCore().applyTheme(sTheme);
			}
		});
		return oSelect;
	}
});

sap.ui.jsfragment("sap.gantt.perf.UISettings", {
	createContent : function(oController) {

		var oViewsInput = new sap.m.Input({
			id: 'views',
			width: "3rem",
			type: sap.m.InputType.Number,
			value: 1
		});
		var oRowsInput = new sap.m.Input({
			id: 'rows',
			width: "3rem",
			type: sap.m.InputType.Number,
			value: 10
		});

		var oHierarchyInput = new sap.m.Input({
			id: 'hierarchy',
			width: "3rem",
			type: sap.m.InputType.Number,
			value: 1
		});

		var oActivitiesInput = new sap.m.Input({
			id: 'shapes',
			width: "3rem",
			type: sap.m.InputType.Number,
			value: 10
		});
		
		var oViewHorizon = new sap.m.Input({
			id: 'horizon',
			width: "3rem",
			type: sap.m.InputType.Number,
			value: 1
		});

		var oWithRelationship = new sap.m.CheckBox({
			id: "relationship",
			text: "Relationship"
		});
		
		var oWithCalendar = new sap.m.CheckBox({
			id: 'calendar',
			text: "Calendar"
		});
		
		var oWithWarning = new sap.m.CheckBox({
			id: 'warning',
			text: "Warning"
		});

		var oWithText = new sap.m.CheckBox({
			id: 'text',
			text: "Text"
		});

		var oSettings = new sap.m.OverflowToolbar({
				design: sap.m.ToolbarDesign.Info,
				content: [
							new sap.m.Label({text: "Views:"}),
							oViewsInput,
							new sap.m.Label({id: 'hierarchy-label', text: "Hierarchy:"}),
							oHierarchyInput,
							new sap.m.Label({text: "Rows:"}),
							oRowsInput,
							new sap.m.Label({text: "Shapes per row:"}),
							oActivitiesInput,
							new sap.m.Label({id: 'horizon-label', text: "Time Horizon (days)"}),
							oViewHorizon,
							oWithRelationship,
							oWithCalendar,
							oWithWarning,
							oWithText
				]
		});

		return oSettings;
	}
});
