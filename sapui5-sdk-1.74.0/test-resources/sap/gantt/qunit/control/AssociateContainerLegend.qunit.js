/*global QUnit */
sap.ui.define([
	"sap/gantt/control/AssociateContainer",
	"sap/gantt/legend/LegendContainer"
], function (AssociateContainer, LegendContainer) {
	"use strict";

	QUnit.module("Test associate container", {
		beforeEach: function () {
			this.oCheckBox = new sap.m.CheckBox();
			this.oAssociateContainer = new AssociateContainer({
				enableRootDiv: true,
				content: this.oCheckBox
			});
		},
		afterEach: function () {
			this.oCheckBox.destroy();
			this.oAssociateContainer.destroy();
		}
	});

	QUnit.test("Test associate container set content", function (assert) {
		assert.strictEqual(this.oCheckBox._oAC, this.oAssociateContainer);
		assert.strictEqual(this.oAssociateContainer.getContent(), this.oCheckBox.getId());
	});

	QUnit.module("Test legend", {
		beforeEach: function () {
			this.oLegendContainer = new LegendContainer({
				width: "300px",
				height: "250px",
				legendSections: [new sap.m.Page({
					title: "Message",
					content: [new sap.m.FlexBox({
						direction: sap.m.FlexDirection.Row,
						alignItems: sap.m.FlexAlignItems.Center,
						items: [new sap.m.CheckBox({
							selected: true
						}), new sap.ui.core.Icon({
							src: "sap-icon://message-error",
							size: "15px",
							color: "red",
							width: "25px"
						}), new sap.m.Label({
							text: "Error"
						})]
					}), new sap.m.FlexBox({
						direction: sap.m.FlexDirection.Row,
						alignItems: sap.m.FlexAlignItems.Center,
						items: [new sap.m.CheckBox({
							selected: true
						}), new sap.ui.core.Icon({
							src: "sap-icon://message-warning",
							size: "15px",
							color: "yellow",
							width: "25px"
						}), new sap.m.Label({
							text: "Warning"
						})]
					}), new sap.m.FlexBox({
						direction: sap.m.FlexDirection.Row,
						alignItems: sap.m.FlexAlignItems.Center,
						items: [new sap.m.CheckBox({
							selected: true
						}), new sap.ui.core.Icon({
							src: "sap-icon://message-information",
							size: "15px",
							color: "green",
							width: "25px"
						}), new sap.m.Label({
							text: "Information"
						})]
					})]
				})
				]
			}).placeAt("content");
			this.oCalendarPage = new sap.m.Page({
				title: "Calendar",
				content: [new sap.m.FlexBox({
					direction: sap.m.FlexDirection.Row,
					alignItems: sap.m.FlexAlignItems.Center,
					items: [new sap.m.CheckBox({
						selected: true
					}), new sap.ui.core.Icon({
						src: "sap-icon://appointment",
						size: "15px",
						color: "yellow",
						width: "25px"
					}), new sap.m.Label({
						text: "DT"
					})]
				}), new sap.m.FlexBox({
					direction: sap.m.FlexDirection.Row,
					alignItems: sap.m.FlexAlignItems.Center,
					items: [new sap.m.CheckBox({
						selected: true
					}), new sap.ui.core.Icon({
						src: "sap-icon://appointment-2",
						size: "15px",
						color: "blue",
						width: "25px"
					}), new sap.m.Label({
						text: "NWT"
					})]
				})]
			});
			this.oLegendContainer.addLegendSection(this.oCalendarPage);
		},
		afterEach: function () {
			this.oLegendContainer.destroy();
		}
	});

	QUnit.test("Test legend", function (assert) {
		assert.strictEqual(this.oLegendContainer.getWidth(), "300px", "Width set correctly");
		assert.strictEqual(this.oLegendContainer.getHeight(), "250px", "Height set correctly");
		assert.strictEqual(this.oLegendContainer.getCurrentLegendSection().getTitle(), this.oLegendContainer.getNavigationPage().getTitle(), "Current legendSecion is 'Navigation Page'");
		this.oLegendContainer.getNavigationItems()[0].firePress();
		assert.strictEqual(this.oLegendContainer.getNavigationItems()[0].getTitle(), this.oLegendContainer.getCurrentLegendSection().getTitle(), "Current legendSecion is 'Message Page'");
		this.oLegendContainer.getLegendSections()[0].fireNavButtonPress();
		assert.strictEqual(this.oLegendContainer.getCurrentLegendSection().getTitle(), this.oLegendContainer.getNavigationPage().getTitle(), "Back to 'Navigation Page'");
		this.oLegendContainer.getNavigationItems()[1].firePress();
		assert.strictEqual(this.oLegendContainer.getNavigationItems()[1].getTitle(), this.oLegendContainer.getCurrentLegendSection().getTitle(), "Current legendSecion is 'Calendar Page'");
		this.oLegendContainer.getLegendSections()[1].fireNavButtonPress();
		this.oLegendContainer.insertLegendSection(new sap.m.Page({
			title: "Warnings",
			content: [new sap.m.FlexBox({
				direction: sap.m.FlexDirection.Row,
				alignItems: sap.m.FlexAlignItems.Center,
				items: [new sap.m.CheckBox({
					selected: true
				}), new sap.ui.core.Icon({
					src: "sap-icon://warning",
					size: "15px",
					color: "yellow",
					width: "25px"
				}), new sap.m.Label({
					text: "Warning"
				})]
			}), new sap.m.FlexBox({
				direction: sap.m.FlexDirection.Row,
				alignItems: sap.m.FlexAlignItems.Center,
				items: [new sap.m.CheckBox({
					selected: true
				}), new sap.ui.core.Icon({
					src: "sap-icon://warning2",
					size: "15px",
					color: "yellow",
					width: "25px"
				}), new sap.m.Label({
					text: "Warning 2"
				})]
			})]
		}), 1);
		this.oLegendContainer.getNavigationItems()[1].firePress();
		assert.strictEqual(this.oLegendContainer.getNavigationItems()[1].getTitle(), this.oLegendContainer.getCurrentLegendSection().getTitle(), "Current legendSecion is 'Warnings page'");
		this.oLegendContainer.getLegendSections()[1].fireNavButtonPress();
		this.oLegendContainer.removeLegendSection(0);
		this.oLegendContainer.getNavigationItems()[0].firePress();
		assert.strictEqual(this.oLegendContainer.getNavigationItems()[0].getTitle(), "Warnings", "Remove page by index");
		this.oLegendContainer.getLegendSections()[0].fireNavButtonPress();
		this.oLegendContainer.removeLegendSection(this.oCalendarPage);
		this.oLegendContainer.getNavigationItems()[0].firePress();
		assert.strictEqual(this.oLegendContainer.getNavigationItems()[0].getTitle(), "Warnings", "Remove page by object");
		this.oLegendContainer.getLegendSections()[0].fireNavButtonPress();
		this.oLegendContainer.removeAllLegendSection();
		assert.strictEqual(this.oLegendContainer.getLegendSections().length, 0, "Remove all legend sections");
	});

});
