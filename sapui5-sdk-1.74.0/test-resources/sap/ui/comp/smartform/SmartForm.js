sap.ui.require([
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/comp/smartform/Layout",
	"sap/ui/comp/smartform/ColumnLayout",
	"sap/ui/layout/GridData",
	"sap/ui/layout/ResponsiveFlowLayoutData",
	"sap/ui/layout/form/ColumnElementData",
	"sap/ui/layout/form/ColumnContainerData",
	"sap/m/FlexItemData",
	"sap/ui/core/VariantLayoutData",
	"sap/m/Toolbar",
	"sap/m/Label",
	"sap/ui/comp/smartfield/SmartField",
	"sap/m/Text",
	"sap/m/ToggleButton",
	"sap/m/Button",
	"sap/m/App",
	"sap/m/Page",
	"sap/m/Bar",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/BindingMode"
	],
	function(
		SmartForm,
		Group,
		GroupElement,
		Layout,
		ColumnLayout,
		GridData,
		ResponsiveFlowLayoutData,
		ColumnElementData,
		ColumnContainerData,
		FlexItemData,
		VariantLayoutData,
		Toolbar,
		Label,
		SmartField,
		Text,
		ToggleButton,
		Button,
		App,
		Page,
		Bar,
		JSONModel,
		BindingMode
	) {
	"use strict";

	var oData = {
			name: {label: "Name", value: "Mustermann"},
			firstName: {label: "Firtst name", value: "Max"},
			street: {label: "Street", value: "Main street"},
			houseNumber: {label: "HouseNumber", value: "1"},
			city: {label: "City", value: "Musterstadt"},
			code: {label: "Code", value: "12345"},
			phone: {label: "Phone", value: "1234567890"},
			mail: {label: "Mail", value: "max@mustermann.de"},
			web: {label: "Web", value: "http://www.sap.com"},
			custom: {label: "Custom Label", value: "Custom Text"}
	};
	var oModel = new JSONModel(oData);
	oModel.setDefaultBindingMode(BindingMode.TwoWay);

	var oSmartForm1 = new SmartForm("SF1",{
		title: "Title",
		tooltip: "Form tooltip",
		editable: true,
		flexEnabled: false,
		groups:[
			new Group("SF1G1", {
				label: "Person",
				groupElements: [
					new GroupElement("SF1G1E1", {
						elements: [
								new SmartField("SField1", {
									contextEditable: true,
									showValueHelp: false,
									mandatory: true,
									editable: false,
									value: "{/name/value}",
									textLabel: "{/name/label}"})
							]
					}),
					new GroupElement("SF1G1E2", {
						elements: [
								new SmartField("SField2", {
									contextEditable: true,
									showValueHelp: false,
									value: "{/firstName/value}",
									textLabel: "{/firstName/label}"})
							]
					}),
					new GroupElement("SF1G1E3", {
						label: "Street/Number",
						elements: [
								new SmartField("SField3", {
									contextEditable: true,
									showValueHelp: false,
									value: "{/street/value}",
									textLabel: "{/street/label}",
									layoutData: new FlexItemData({minWidth: "15em"})}),
								new SmartField("SField4", {
									contextEditable: true,
									showValueHelp: false,
									value: "{/houseNumber/value}",
									textLabel: "{/houseNumber/label}"})
							]
					}),
					new GroupElement("SF1G1E4", {
						elementForLabel: 1,
						elements: [
								new SmartField("SField5", {
									contextEditable: true,
									showValueHelp: false,
									mandatory: true,
									value: "{/code/value}",
									textLabel: "{/code/label}",
									layoutData: new VariantLayoutData({
										multipleLayoutData: [
											new GridData({span: "L2 M2 S2"}),
											new ColumnElementData({cellsSmall: 2, cellsLarge: 2})]})
									}),
								new SmartField("SField6", {
									contextEditable: true,
									showValueHelp: false,
									value: "{/city/value}",
									textLabel: "{/city/label}"})
							]
					})
					]
			}),
			new Group("SF1G2", {
				label: "Contact",
				expandable: true,
				groupElements: [
					new GroupElement("SF1G2E1", {
						elements: [
								new SmartField("SField7", {
									contextEditable: true,
									showValueHelp: false,
									value: "{/phone/value}",
									textLabel: "{/phone/label}",
									layoutData: new ResponsiveFlowLayoutData({minWidth: 200})})
							]
					}),
					new GroupElement("SF1G2E2", {
						label: new Label("Label1", {text: "Email"}),
						elements: [
								new SmartField("SField8", {
									contextEditable: true,
									showValueHelp: false,
									mandatory: true,
									value: "{/mail/value}",
									textLabel: "{/mail/label}",
									layoutData: new VariantLayoutData({
										multipleLayoutData: [new ResponsiveFlowLayoutData({minWidth: 200})]})})
							]
					}),
					new GroupElement("SF1G2E3", {
						elements: [
								new SmartField("SField9", {
									contextEditable: true,
									showValueHelp: false,
									value: "{/web/value}",
									textLabel: "{/web/label}"})
							]
					})
					]
			}),
			new Group("SF1G3", {
				label: "Other",
				groupElements: [
					new GroupElement("SF1G3E1", {
						label: "some text",
						elements: [
								new Text("Text1", {text: "Text"})
							]
					}),
					new GroupElement("SF1G3E2", {
						label: new Label("Label2", {text: "some more text"}),
						elements: [
								new Text("Text2", {text: "Text"})
							]
					}),
					new GroupElement("SF1G3E3", {
						label: "{/custom/label}",
						elements: [
								new Text("Text3", {text: "{/custom/value}"})
							]
					})
					]
			})
			],
		editToggled: function(oEvent) {
			// as SmartField do not toggled in display state using JSON moder set editable of all SmartFields
			var bEditable = oEvent.getParameter("editable");
			var aSmartFields = oEvent.oSource.getSmartFields();
			for (var i = 0; i < aSmartFields.length; i++) {
				aSmartFields[i].setEditable(bEditable);
			}
		}
	});

	var oButtonExp, oButtonHori, oButtonRL;

	oButtonExp = new ToggleButton("B-Exp", {
		icon:"sap-icon://expand-group",
		pressed: false,
		press: function (oEvent) {
				var bPressed = oEvent.getParameter("pressed");
				oSmartForm1.setExpandable(bPressed);
			}
		});
	oButtonHori = new ToggleButton("B-Hori", {
		text:"useHorizontalLayout",
		pressed: false,
		press: function (oEvent) {
			var bPressed = oEvent.getParameter("pressed");
			if (bPressed) {
				var oLayout = new Layout("Layout1", {gridDataSpan:"L3 M4 S6"});
				oSmartForm1.setLayout(oLayout);
				oSmartForm1.setUseHorizontalLayout(true);
				oButtonRL.setEnabled(true);
				oButtonCL.setEnabled(false);
			} else {
				oSmartForm1.setUseHorizontalLayout(false);
				oSmartForm1.destroyLayout();
				oButtonRL.setPressed(false);
				oButtonRL.setEnabled(false);
				oButtonCL.setEnabled(true);
			}
		}
		});
	oButtonRL = new ToggleButton("B-RL", {
		text:"ResponsiveLayout",
		enabled: false,
		pressed: false,
		press: function (oEvent) {
			var bPressed = oEvent.getParameter("pressed");
			if (bPressed) {
				oSmartForm1.destroyLayout();
			} else {
				var oLayout = new Layout("Layout1", {gridDataSpan:"L3 M4 S6"});
				oSmartForm1.setLayout(oLayout);
			}
		}
		});
	var oButtonCL = new ToggleButton("B-CL", {
		text:"ColumnLayout",
		pressed: false,
		press: function (oEvent) {
			var bPressed = oEvent.getParameter("pressed");
			if (bPressed) {
				var oLayout = new ColumnLayout("Layout2");
				oSmartForm1.setLayout(oLayout);
				oButtonHori.setEnabled(false);
			} else {
				oSmartForm1.destroyLayout();
				oButtonHori.setEnabled(true);
			}
		}
		});
	var oButtonTitle = new ToggleButton("B-Title", {
		text:"Title",
		pressed: true,
		press: function (oEvent) {
			var bPressed = oEvent.getParameter("pressed");
			oSmartForm1.setTitle(bPressed ? "Title" : null);
		}
		});
	var oButtonEditable = new ToggleButton("B-Editable", {
		icon:"sap-icon://edit",
		pressed: false,
		press: function (oEvent) {
			var bPressed = oEvent.getParameter("pressed");
			oSmartForm1.setEditTogglable(bPressed);
		}
		});
	var oButtonCheck = new ToggleButton("B-Check", {
		icon:"sap-icon://checklist-item",
		pressed: false,
		press: function (oEvent) {
			var bPressed = oEvent.getParameter("pressed");
			oSmartForm1.setCheckButton(bPressed);
		}
		});
	var oButtonToolbar = new ToggleButton("B-Toolbar", {
		text:"Toolbar",
		pressed: false,
		press: function (oEvent) {
			var bPressed = oEvent.getParameter("pressed");
			if (bPressed) {
				var oToolbar = new Toolbar("TB1", {
					content: [new Button({text: "Button 1"}), new Button({text: "Button 2"})]
				});
				oSmartForm1.setCustomToolbar(oToolbar);
			} else {
				oSmartForm1.destroyCustomToolbar();
			}
		}
		});

	var oApp = new App("myApp", {
		pages: new Page("page1", {
			title: "Test Page for sap.ui.comp.smartform.SmartForm",
			content: [
								oSmartForm1
								],
			footer: new Bar({
								contentMiddle: [
									oButtonExp,
									oButtonHori,
									oButtonRL,
									oButtonCL,
									oButtonTitle,
									oButtonEditable,
									oButtonCheck,
									oButtonToolbar]
							})
		})
	}).placeAt("body");

	oApp.setModel(oModel);

});