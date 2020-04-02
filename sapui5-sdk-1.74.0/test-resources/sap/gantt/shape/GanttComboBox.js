sap.ui.define(["sap/m/ComboBox", "sap/m/ComboBoxRenderer"], function (ComboBox, ComboBoxRenderer) {
	"use strict";

	var GanttComboBox = ComboBox.extend("sap.gantt.test.shape.GanttComboBox", {
		updateState: function(sKey) {
			var aItems = this.getItems();
			var sSelectedKey = this.getSelectedKey();

			for (var i = aItems.length - 1; i > -1; i--) {
				if (aItems[i].getKey() != sSelectedKey) {
					this.removeItem(aItems[i]);
				}
			}

			if (sKey == "created") {
				this.addItem(new sap.ui.core.Item({
					key: "released",
					text: "released"
				}), true);
			} else if (sKey == "released") {
				this.addItem(new sap.ui.core.Item({
					key: "canceled",
					text: "canceled"
				}), true);
				this.addItem(new sap.ui.core.Item({
					key: "completed",
					text: "completed"
				}), true);
			} else if (sKey == "canceled") {
				this.addItem(new sap.ui.core.Item({
					key: "released",
					text: "released"
				}), true);
			} else if (sKey == "completed") {
			} else {
				this.addItem(new sap.ui.core.Item({
					key: "created",
					text: "created"
				}), true);
			}

			this.setEnabled(sKey != "completed");
		},

		createItem: function(sKey) {
			if (sKey) {
				this.addItem(new sap.ui.core.Item({
					key: sKey,
					text: sKey
				}), true);
			}
		},

		setSelectedKey: function(sKey) {
			this.updateState(sKey);
			this.createItem(sKey);

			ComboBox.prototype.setSelectedKey.apply(this, arguments);
		},

		renderer: function(oRm, oControl) {
			ComboBoxRenderer.render.apply(this, arguments);
		}
	});
	return GanttComboBox;
}, true);
