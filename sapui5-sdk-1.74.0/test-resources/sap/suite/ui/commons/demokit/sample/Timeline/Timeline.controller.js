sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/suite/ui/commons/util/DateUtils"],
	function (Controller, JSONModel, DateUtils) {
		"use strict";

		/**
		 * A context path is the first path of window.locatin.pathname (e.g. sapui5-sdk-dist). It may be empty.
		 * @returns {string} The context path based on the windows url
		 * @private
		 */
		function getBasePath() {
			return jQuery.sap.getModulePath("sap.suite.ui.commons.sample.Timeline", "");
		}


		function convertData(oEvent) {
			var oData,
				oModel = oEvent.getSource(),
				sBasePath = getBasePath();

			if (!oEvent.getParameters().success) {
				return;
			}

			oData = oModel.getData();
			oData.Employees.forEach(function (oEmployee) {
				oEmployee.HireDate = DateUtils.parseDate(oEmployee.HireDate);
				oEmployee.Photo = sBasePath + oEmployee.Photo;
			});
			oModel.updateBindings(true);
		}

		var oPageController = Controller.extend("sap.suite.ui.commons.sample.Timeline.Timeline", {
			onInit: function () {
				var oModel = new JSONModel(jQuery.sap.getModulePath("sap.suite.ui.commons.sample.Timeline", "/data.json"));
				oModel.attachRequestCompleted(convertData);
				this.getView().setModel(oModel);
				this._timeline = this.byId("idTimeline");

				this.getView().attachEvent("afterRendering", function () {
					// in production you would probably want to use something like ScrollContainer
					// but for demo purpose we want to keep it simple
					// sctretch:true on container prevents scrolling by default
					jQuery("section").css("overflow", "auto");
				});
			},
			enableScrollSelected: function (oEvent) {
				var bSelected = oEvent.getParameter("selected");
				this._timeline.setEnableScroll(bSelected);
			},
			textHeightChanged: function (oEvent) {
				var sKey = oEvent.getParameter("selectedItem").getProperty("key");
				this._timeline.setTextHeight(sKey);
			},
			groupByChanged: function (oEvent) {
				var sKey = oEvent.getParameter("selectedItem").getProperty("key");
				this._timeline.setGroupByType(sKey);
			},
			alignmentChanged: function (oEvent) {
				var sKey = oEvent.getParameter("selectedItem").getProperty("key");
				if (sKey === "DoubleSided") {
					this._timeline.setEnableDoubleSided(true);
				} else {
					this._timeline.setEnableDoubleSided(false);
					this._timeline.setAlignment(sKey);
				}
			},
			dataChanged: function (oEvent) {
				var sKey = oEvent.getParameter("selectedItem").getProperty("key"),
					sFileName = "data.json";

				if (sKey !== "A") {
					sFileName = sKey === "B" ? "data1.json" : "data2.json";
				}

				var oModel = new JSONModel(jQuery.sap.getModulePath("sap.suite.ui.commons.sample.Timeline", "/" + sFileName));
				oModel.attachRequestCompleted(convertData);
				this.getView().setModel(oModel);
			},
			orientationChanged: function (oEvent) {
				var sKey = oEvent.getParameter("selectedItem").getProperty("key"),
					itemA = sKey === "Horizontal" ? "Top" : "Left",
					itemB = sKey === "Horizontal" ? "Bottom" : "Right",
					oFirstItem = this.byId("idAlignmentFirst"),
					oSecondItem = this.byId("idAlignmentSecond");

				oFirstItem.setText(itemA);
				oFirstItem.setKey(itemA);

				oSecondItem.setText(itemB);
				oSecondItem.setKey(itemB);

				this._timeline.setAxisOrientation(sKey);
			}
		});
		return oPageController;
	});
