sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/type/Integer",
//	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/mdc/condition/ConditionModel",
	"sap/ui/mdc/condition/Condition",
	"sap/ui/mdc/condition/FilterOperatorUtil",
	"sap/ui/mdc/condition/Operator",
	"sap/ui/mdc/util/BaseType",
	"sap/ui/mdc/field/FieldBaseDelegate", // just to have it in Fields from beginning
	"sap/ui/mdc/FilterField",
	"./BoolExprTool",
	"sap/m/MessageToast",
	"sap/m/Slider",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/ui/mdc/p13n/Util"
], function(
		Controller,
		Filter,
		TypeInteger,
//		ResourceModel,
		JSONModel,
		ConditionModel,
		Condition,
		FilterOperatorUtil,
		Operator,
		BaseType,
		FieldBaseDelegate,
		FilterField,
		BoolExprTool,
		MessageToast,
		Slider,
		Dialog,
		Button,
		Util
	) {
	"use strict";

	return Controller.extend("my.Main", {

		onInit: function() {

			// add messageManager. TODO: should work automatically
			sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);

			// fetch the table and Listbinding instance
			// var oTable = this.byId("mdcTable");
			// Promise.all([
			// 	oTable._oTableReady
			// ]).then(function(aValues) {
			// 	var oListBinding = oTable._getRowBinding();

			// 	// create a ConditionModel for the listbinding
			// 	var oCM = ConditionModel.getFor(oListBinding);

			// }.bind(this));


			// create a ConditionModel for the listbinding
			var oCM = new ConditionModel();

			// init/add some default conditions
			// oCM.addCondition("title", Condition.createCondition("Contains", ["Wars"]));
			//oCM.addCondition("*title,genre*", Condition.createCondition("StartsWith", ["Star"]));
			oCM.addCondition("title", Condition.createCondition("BT", ["A", "Z"]));
			oCM.addCondition("rating", Condition.createCondition("GE", [7.5]));
			oCM.addCondition("genre", Condition.createCondition("EEQ", ["action", "Action"]));
			oCM.addCondition("silentMovie", Condition.createCondition("EQ", [false]));
			//oCM.addCondition("releaseDate", Condition.createCondition("BT", [new Date(2017, 3, 25, 0, 0, 0, 0), new Date(2017, 3, 29, 0, 0, 0, 0)]));
			oCM.addCondition("runningTime", Condition.createCondition("EQ", [90]));

			//set the model on your view
			this.getView().setModel(oCM, "cm");

			// add some custom operations to the Fields
			this.addCustomOperators();

			//listen on ConditionModel change event to handle model changes
			var oConditionChangeBinding = oCM.bindProperty("/", oCM.getContext("/"));
			oConditionChangeBinding.attachChange(function(oEvent) {
				var n = 0;
				for ( var sFieldPath in oEvent.oSource.oValue.conditions) {
					n = n + oEvent.oSource.oValue.conditions[sFieldPath].length;
				}
				setTimeout(function() {
					MessageToast.show(n + "# conditions");
				}, 3000);

				var oCM = oEvent.oSource.getModel();
				if (oCM.getConditions("genre").length > 1) {
					MessageToast.show("max 'genre' conditions reached!!!");
				}
				// if (oCM.getConditions("genre").length > 2) {
				// 	oCM.removeCondition("genre", 0);
				// }

				// var aGenreConditions = oCM.getConditions("genre")
				// if (aGenreConditions.length == 1 && aGenreConditions[0].values[0] === "drama") {
				// 	if (oCM.getConditions("title").length <= 1) {
				// 		oCM.addCondition("title", Condition.createCondition("EQ", ["Pulp Fiction"]));
				// 	}
				// }

				var oView = this.getView();
				var oModel = oView.getModel();

				//update chart filter
				for (var i = 0; i < oModel.oData.genreChartElements.length; i++) {
					oModel.oData.genreChartElements[i].selected = false;
				}
				var aConditions = oCM.getConditions("genre");
				aConditions.forEach(function(oCondition) {
					// var sFieldPath = oCondition.fieldPath;
					var sGenre = oCondition.values[0];
					for (var i = 0; i < oModel.oData.genreChartElements.length; i++) {
						if (oModel.oData.genreChartElements[i].key === sGenre) {
							oModel.oData.genreChartElements[i].selected = true;
						}
					}
				});

				oModel.checkUpdate();

				if (this.byId("liveupdate").getSelected()) {
					var bValid = this.applyFilters(oCM, false);
					this.byId("movieTable").setShowOverlay(!bValid);
				}
			}.bind(this));

			// make the default filtering of the table
			var bValid = this.applyFilters(oCM, false);
			this.byId("movieTable").setShowOverlay(!bValid);
		},

		applyFilters: function(oCM, bValidate) {
			var bValid = oCM.isValid(bValidate);
			if (bValid) {
				var oListBinding = this.byId("movieTable").getBinding("items");
				var oFilter = oCM.getFilters();
				oListBinding.filter(oFilter);
			}
			return bValid;
		},

		addCustomOperators: function() {
			//add the LASTYEAR and LASTXYEARS operation to the date Fields
			var oFilterField = this.byId("releaseDateFF");
			var aOperators = FilterOperatorUtil.getOperatorsForType(BaseType.Date);

			aOperators.push("LASTYEAR");
			aOperators.push("LASTXYEARS");
			aOperators.push("LASTXYYEARS");

			FilterOperatorUtil.addOperator(new Operator({
				name: "LASTYEAR",
				tokenParse: "^#tokenText#$",
				tokenFormat: "#tokenText#",
				valueTypes: [],
				getModelFilter: function(oCondition, sFieldPath) {
					return new Filter({ path: sFieldPath, operator: "BT", value1: new Date(new Date().getFullYear() - 1, 0, 1), value2: new Date(new Date().getFullYear() - 1, 11, 31) });
				}
			}));

			FilterOperatorUtil.addOperator(new Operator({
				name: "LASTXYEARS",
				tokenParse: "^#tokenText#$",
				tokenFormat: "#tokenText#",
				valueTypes: ["sap.ui.model.type.Integer"],
				paramTypes: ["(\\d+)"],
				getModelFilter: function(oCondition, sFieldPath) {
					return new Filter({ path: sFieldPath, operator: "BT", value1: new Date(new Date().getFullYear() - oCondition.values[0], 0, 1), value2: new Date(new Date().getFullYear(), 11, 31) });
				},
				createControl: function(oDataType, oOperator, sPath, index) {
					jQuery.extend(true, oDataType.oFormatOptions, { emptyString: null });
					var oNullableType = new TypeInteger(oDataType.oFormatOptions, oDataType.oConstraints);
					// return new sap.m.Input({ value: { path: sPath, type: oNullableType, mode: 'TwoWay' } });
					return new Slider({ min: 1, max: 10, value: { path: sPath, type: oNullableType, mode: 'TwoWay' } });
				}
			}));

			FilterOperatorUtil.addOperator(new Operator({
				name: "LASTXYYEARS",
				tokenParse: "^#tokenText#$",
				tokenFormat: "#tokenText#",
				longText: "last x-y years",
				tokenText: "last $0-$1 years",
				valueTypes: ["sap.ui.model.type.Integer", "sap.ui.model.type.Integer"],
				paramTypes: ["(\\d+)", "(\\d+)"],
				getModelFilter: function(oCondition, sFieldPath) {
					return new Filter({ path: sFieldPath, operator: "BT", value1: new Date(new Date().getFullYear() - oCondition.values[0], 0, 1), value2: new Date(new Date().getFullYear() - oCondition.values[1], 11, 31) });
				}
			}));

			// assign the new Operators to the Date field
			oFilterField.setOperators(aOperators);

		},

		onSaveVariant: function() {
			var oTable = this.byId("movieTable");
			var oListBinding = oTable.getBinding("items");
			var sVariant = this.getView().getModel("cm").serialize(oListBinding);
			this.byId("variant").setValue(sVariant);
		},

		onShowMetadata: function() {
			var oTable = this.byId("movieTable");
			var oListBinding = oTable.getBinding("items");
			var sVariant = this.getView().getModel("cm").serializeMeta(oListBinding);
			this.byId("variant").setValue(sVariant);
		},

		onLoadVariant: function() {
			var oCM = this.getView().getModel("cm");
			oCM.parse(this.byId("variant").getValue());

			var bValid = this.applyFilters(oCM, false);
			this.byId("movieTable").setShowOverlay(!bValid);
		},

		prettyPrintFilters: function(oFilter) {
			var sRes;
			if (!oFilter) {
				return "";
			}
			if (oFilter._bMultiFilter) {
				sRes = "";
				var bAnd = oFilter.bAnd;
				oFilter.aFilters.forEach(function(oFilter, index, aFilters) {
					sRes += this.prettyPrintFilters(oFilter);
					if (aFilters.length - 1 != index) {
						sRes += bAnd ? " and " : " or ";
					}
				}, this);
				return "(" + sRes + ")";
			} else {
				sRes = oFilter.sPath + " " + oFilter.sOperator + " '" + oFilter.oValue1 + "'";
				if (oFilter.sOperator === "BT") {
					sRes += "...'" + oFilter.oValue2 + "'";
				}
				return sRes;
			}
		},

		onGo: function() {
			var oCM = this.getView().getModel("cm");

			// Either use the applyFilters
			var bValid = this.applyFilters(oCM, true);
			this.byId("movieTable").setShowOverlay(!bValid);

			window.console.log(this.prettyPrintFilters(oCM.getFilters()));

			//or fetch allFilters and do the binding Filter by your own
			// var oModelFilters = oCM.getAllFilters();
			// var oTable = this.byId("movieTable");
			// var oListBinding = oTable.getBinding("items");
			// oListBinding.filter(oModelFilters);
		},

		CountFormatter: function(oConditions) {
			var i = 0;
			for ( var sFieldPath in oConditions) {
				i = i + oConditions[sFieldPath].length;
			}
			return "Filter " + (i > 0 ? "(" + i + ")" : "");
		},

		onFilterDialog: function() {
			/*
			var oCM = this.getView().getModel("cm");
			var oNewCM = oCM.clone();
			var oMetaModel = new JSONModel({
				filterItems: [{
					"name": "title",
					"type": "sap.ui.model.type.String",
					"description": "Movie Title",
					"constraints": {
						"maxLength": 16,
						"nullable": false
					},
					"formatOptions": {},
					"maxConditions": -1,
					"position": 0,
					"label": "Title (string)",
					"enable": true,
					"editable": true,
					"visible": true,
					"required": true,
					'visibleOnFilterbar': true
				}, {
					"name": "rating",
					"type": "sap.ui.model.type.Float",
					"description": "Rating of the movie",
					"maxConditions": -1,
					"position": 1,
					"label": "Rating (float)",
					"enable": true,
					"editable": true,
					"visible": true,
					"required": false,
					'visibleOnFilterbar': true
				}, {
					"name": "releaseDate",
					"type": "sap.ui.model.type.Date",
					"description": "Release Date",
					"maxConditions": -1,
					"position": 2,
					"label": "Release Date (date)",
					"enable": true,
					"editable": true,
					"visible": true,
					"required": false,
					'visibleOnFilterbar': true
				}, {
					"name": "genre",
					"type": "sap.ui.model.type.String",
					"description": "Genre",
					"maxConditions": 2,
					"position": 3,
					"label": "Genre (max 2)",
					"enable": true,
					"editable": true,
					"visible": true,
					"required": false,
					'visibleOnFilterbar': true
				}, {
					"name": "startTime",
					"type": "sap.ui.model.type.Time",
					"dataTypeFormatOptions": {
						style: 'short'
					},
					"description": "Start Time",
					"maxConditions": 1,
					"position": 4,
					"label": "Start Time",
					"enable": true,
					"editable": true,
					"visible": true,
					"required": false,
					'visibleOnFilterbar': true
				}, {
					"name": "silentMovie",
					"type": "sap.ui.model.type.Boolean",
					"description": "silent",
					"maxConditions": 1,
					"position": 5,
					"label": "silent Movie (boolean)",
					"enable": true,
					"editable": true,
					"visible": true,
					"required": false,
					'visibleOnFilterbar': true
				}, {
					"name": "colorType",
					"type": "sap.ui.model.type.String",
					"description": "",
					"maxConditions": 1,
					"position": 6,
					"label": "color Type",
					"enable": true,
					"editable": true,
					"visible": true,
					"required": false,
					'visibleOnFilterbar': true
				}, {
					"name": "runningTime",
					"type": "sap.ui.model.type.Integer",
					"description": "",
					"maxConditions": 1,
					"position": 7,
					"label": "Running Time",
					"enable": true,
					"editable": true,
					"visible": true,
					"required": false,
					'visibleOnFilterbar': true
				}, {
					"name": "director",
					"type": "sap.ui.model.type.String",
					"description": "Director",
					"maxConditions": -1,
					"position": 8,
					"label": "director (string)",
					"enable": true,
					"editable": true,
					"visible": true,
					"required": false,
					'visibleOnFilterbar': false
				}]
			});

			var oP13nFilterPanel = new P13nFilterPanel({
				items: {
					path: 'metaModel>/filterItems',
					templateShareable: false,
					factory: function(sId, oBindingContext) {
						var oFilterItem = oBindingContext.getObject(oBindingContext.getPath());
						var oFilterField = new FilterField(oP13nFilterPanel.getId() + "--" + oFilterItem.name + "FF", {
							dataType: oFilterItem.type,
							dataTypeFormatOptions: oFilterItem.dataTypeFormatOptions,
							maxConditions: oFilterItem.maxConditions,
							required: oFilterItem.required,
							width: "100%",
							conditions: {
								path: 'cm>/conditions/' + oFilterItem.name
							},
							valueState: {
								path: 'cm>/fieldPath/' + oFilterItem.name + '/valueState',
								mode: 'OneWay',
								formatter: function(oValue) {
									return oValue;
								}
							},
							valueStateText: {
								path: 'cm>/fieldPath/' + oFilterItem.name + '/valueStateText',
								mode: 'OneWay'
							}
						});
						oFilterField.setModel(oNewCM, "cm");

						return new P13nFilterItem({
							columnKey: {
								path: "metaModel>" + oBindingContext.getPath() + "/name"
							},
							text: {
								path: "metaModel>" + oBindingContext.getPath() + "/label"
							},
							tooltip: {
								path: "metaModel>" + oBindingContext.getPath() + "/label"
							},
							position: {
								path: "metaModel>" + oBindingContext.getPath() + "/position"
							},
							selected: {
								path: "metaModel>" + oBindingContext.getPath() + "/visibleOnFilterbar"
							},
							required: {
								path: "metaModel>" + oBindingContext.getPath() + "/required"
							},
							controls: oFilterField
						});
					}
				}
			});
			oP13nFilterPanel.setModel(oMetaModel, "metaModel");
			oP13nFilterPanel.setModel(this.getView().getModel());

			var oDialog = new Dialog({
				title: 'Filter (clone)',
				draggable: true,
				resizable: true,
				contentWidth: '800px',
				contentHeight: '600px',
				content: oP13nFilterPanel,
				beginButton: new Button({
					text: 'OK',
					press: function() {
						oCM.setConditions(oNewCM.getAllConditions());
						oNewCM.destroy();
						oCM.applyFilters();
						oDialog.close();
						oDialog.destroy();
					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function() {
						oNewCM.destroy();
						oDialog.close();
						oDialog.destroy();
					}
				})
			});
			oDialog.open();
			*/
		},

		onViewSettingsColumns: function (oEvt) {
			var mP13nState = {};
			mP13nState.oRuntimeData = {};
			mP13nState.oRuntimeData.items = [];
			mP13nState.oBaseData = {};
			mP13nState.oBaseData.items = [{
				name: "title",
				label: "Title",
				tooltip: "Title",
				selected: true,
				position: 0
			}, {
				name: "rating",
				label: "Rating",
				tooltip: "Rating",
				selected: true,
				position: 1
			}, {
				name: "releaseDate",
				label: "release Date",
				tooltip: "release Date",
				selected: true,
				position: 2
			}, {
				name: "genre",
				label: "Genre",
				tooltip: "Genre",
				selected: true,
				position: 3
			}, {
				name: "startTime",
				label: "Start Time",
				tooltip: "Strat Time",
				selected: true,
				position: 4
			}, {
				name: "silentMovie",
				label: "silent Movie",
				tooltip: "silent Movie",
				selected: true,
				position: 5
			}, {
				name: "colorType",
				label: "Color Type",
				tooltip: "Color Type",
				selected: true,
				position: 6
			}, {
				name: "runningTime",
				label: "running Time",
				tooltip: "running Time",
				selected: true,
				position: 7
			}];

			Util.showP13nColumns(oEvt.getSource(), mP13nState.oBaseData, mP13nState.oRuntimeData, oEvt.getSource());

		},
		onViewSettingsSort: function(oEvt) {
			var mP13nState = {};
			mP13nState.oRuntimeData = {};
			mP13nState.oRuntimeData.items = [];
			mP13nState.oBaseData = {};
			mP13nState.oBaseData.items = [{
				name: "title",
				label: "Title",
				tooltip: "Title",
				selected: true,
				position: 0,
				sortOrder: ""
			}, {
				name: "rating",
				label: "Rating",
				tooltip: "Rating",
				selected: false,
				position: 1,
				sortOrder: ""
			}, {
				name: "releaseDate",
				label: "release Date",
				tooltip: "release Date",
				selected: false,
				position: 2,
				sortOrder: ""
			}];

			Util.showP13nSort(oEvt.getSource(), mP13nState.oBaseData, mP13nState.oRuntimeData, oEvt.getSource());

		},

		onViewSettingsFilter: function() {

			//var oCM = this.getView().getModel("cm");
			/*
			var oTable = this.byId("movieTable");
			var oListBinding = oTable.getBinding("items");
			var oCM = ConditionModel.getFor(oListBinding, "FilterPanel");
			var oMetaModel = new JSONModel({
				filterItems: [{
					"name": "title",
					"type": "sap.ui.model.type.String",
					"description": "Movie Title",
					"constraints": {
						"maxLength": 16,
						"nullable": false
					},
					"formatOptions": {},
					"maxConditions": -1,
					"position": 0,
					"label": "Title (string)",
					"enable": true,
					"editable": true,
					"visible": true,
					"required": false,
					'visibleOnFilterbar': true
				}, {
					"name": "rating",
					"type": "sap.ui.model.type.Float",
					"description": "Rating of the movie",
					"maxConditions": -1,
					"position": 1,
					"label": "Rating (float)",
					"enable": true,
					"editable": true,
					"visible": true,
					"required": false,
					'visibleOnFilterbar': true
				}, {
					"name": "releaseDate",
					"type": "sap.ui.model.type.Date",
					"description": "Release Date",
					"maxConditions": -1,
					"position": 2,
					"label": "Release Date (date)",
					"enable": true,
					"editable": true,
					"visible": true,
					"required": false,
					'visibleOnFilterbar': true
				}, {
					"name": "genre",
					"type": "sap.ui.model.type.String",
					"description": "Genre",
					"maxConditions": 2,
					"position": 3,
					"label": "Genre (max 2)",
					"enable": true,
					"editable": true,
					"visible": true,
					"required": false,
					'visibleOnFilterbar': true
				}, {
					"name": "startTime",
					"type": "sap.ui.model.type.Time",
					"dataTypeFormatOptions": {
						style: 'short'
					},
					"description": "Start Time",
					"maxConditions": 1,
					"position": 4,
					"label": "Start Time",
					"enable": true,
					"editable": true,
					"visible": true,
					"required": false,
					'visibleOnFilterbar': true
				}, {
					"name": "silentMovie",
					"type": "sap.ui.model.type.Boolean",
					"description": "silent",
					"maxConditions": 1,
					"position": 5,
					"label": "silent Movie (boolean)",
					"enable": true,
					"editable": true,
					"visible": true,
					"required": false,
					'visibleOnFilterbar': true
				}, {
					"name": "colorType",
					"type": "sap.ui.model.type.String",
					"description": "",
					"maxConditions": 1,
					"position": 6,
					"label": "color Type",
					"enable": true,
					"editable": true,
					"visible": true,
					"required": false,
					'visibleOnFilterbar': true
				}, {
					"name": "runningTime",
					"type": "sap.ui.model.type.Integer",
					"description": "",
					"maxConditions": 1,
					"position": 7,
					"label": "Running Time",
					"enable": true,
					"editable": true,
					"visible": true,
					"required": false,
					'visibleOnFilterbar': true
				}]
			});


			var oP13nFilterPanel = new P13nFilterPanel({
				items: {
					path: 'metaModel>/filterItems',
					templateShareable: false,
					factory: function(sId, oBindingContext) {
						var oFilterItem = oBindingContext.getObject(oBindingContext.getPath());
						var oFilterField = new FilterField(oP13nFilterPanel.getId() + "--" + oFilterItem.name + "FF", {
							fieldPath: oFilterItem.name,
							dataType: oFilterItem.type,
							dataTypeFormatOptions: oFilterItem.dataTypeFormatOptions,
							maxConditions: oFilterItem.maxConditions,
							required: oFilterItem.required,
							width: "100%",
							showValueHelp: true,
							//valueHelpRequest: jQuery.proxy(this.onValueHelpRequest, this),
							conditions: {
								path: 'cm>/conditions/' + oFilterItem.name
							},
							valueState: {
								path: 'cm>/fieldPath/' + oFilterItem.name + '/valueState',
								mode: 'OneWay',
								formatter: function(oValue) {
									return oValue;
								}
							},
							valueStateText: {
								path: 'cm>/fieldPath/' + oFilterItem.name + '/valueStateText',
								mode: 'OneWay'
							}
						});
						oFilterField.setModel(oCM, "cm");
						//this.attachSuggest(oFilterField);

						return new P13nFilterItem({
							columnKey: {
								path: "metaModel>" + oBindingContext.getPath() + "/name"
							},
							text: {
								path: "metaModel>" + oBindingContext.getPath() + "/label"
							},
							tooltip: {
								path: "metaModel>" + oBindingContext.getPath() + "/label"
							},
							position: {
								path: "metaModel>" + oBindingContext.getPath() + "/position"
							},
							selected: {
								path: "metaModel>" + oBindingContext.getPath() + "/visibleOnFilterbar"
							},
							required: {
								path: "metaModel>" + oBindingContext.getPath() + "/required"
							},
							controls: oFilterField
						});
					}
				}
			});
			oP13nFilterPanel.setModel(oMetaModel, "metaModel");
			oP13nFilterPanel.setModel(this.getView().getModel());

			var oDialog = new Dialog({
				title: 'Table Filter',
				draggable: true,
				resizable: true,
				contentWidth: '800px',
				contentHeight: '600px',
				content: oP13nFilterPanel,
				beginButton: new Button({
					text: 'OK',
					press: function() {
						oCM.applyFilters(this.byId("movieTable").getBinding("items"));
						oDialog.close();
						oDialog.destroy();
					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function() {
						oDialog.close();
						oDialog.destroy();
					}
				})
			});
			oDialog.open();
			*/
		},

//		onBasicSearch: function(oEvent) {
//			var oBinding = oEvent.oSource.getParent().getBinding("conditions");
//			var oConditionModel = oBinding.getModel();
//			oConditionModel.applyFilters(this.byId("movieTable").getBinding("items"), true);
//		},
//
//		onBasicSearchLiveChange: function(oEvent) {
//			var oFF = oEvent.oSource.getParent();
//			var sValue = oEvent.getParameter("newValue");
//			var oOperator = oFF.getFilterOperatorConfig().getOperator("Contains");
//			if (oOperator && oOperator.test("*" + sValue + "*")) {
//				var oBinding = oFF.getBinding("conditions");
//				var oConditionModel = oBinding.getModel();
//				var oCondition = Condition.createCondition("Contains", [sValue]);
//
//				oConditionModel.removeAllConditions(oFF.getFieldPath());
//				if (sValue) {
//					oConditionModel.addCondition(oFF.getFieldPath(), oCondition);
//				}
//			}
//		},
//
//		formatOperator: function(oContext) { // oContext is a condition
//			var sResult = "";
//			var that = this.getView().byId("singleValueFF");
//			if (oContext) {
//				var oOperator = that.getFilterOperatorConfig().getOperator(oContext.operator);
//				var aValues = oContext.values;
//				sResult = oOperator.format(aValues, oContext, that._getFormatOptions().valueType);
//			}
//			return sResult;
//		},
//
//		onChange: function(oEvent) {
//			var oSource = oEvent.oSource.getParent(),
//				oType = oSource._getFormatOptions().valueType,
//				type = oType.getMetadata().getName();
//
//			var oBinding = oSource.getBinding("conditions");
//
//			var sValue = sValue || oEvent.getParameter("value");
//			sValue = sValue.trim();
//
//			if (!sValue) {
//				if (oSource.getMaxConditions() >= 0 && oBinding.getModel().getConditions(oSource.getFieldPath()).length > 0) {
//					oBinding.getModel().removeCondition(oSource.getFieldPath(), 0);
//				}
//
//				oBinding.getModel().removeUIMessage(oSource.getFieldPath());
//				return;
//			}
//
//			// find the suitable operators
//			var aOperators = oSource.getFilterOperatorConfig().getMatchingOperators(type, sValue);
//			var oNewOperator, oOperator;
//
//			// use default operator if nothing found
//			if (aOperators.length === 0) {
//				// default operation
//				var sDefaultOperator = oSource.getFilterOperatorConfig().getDefaultOperator(type);
//				oNewOperator = oSource.getFilterOperatorConfig().getOperator(sDefaultOperator);
//				sValue = oNewOperator ? oNewOperator.format([sValue]) : sValue;
//			} else {
//				oNewOperator = aOperators[0]; // TODO: multiple matches?
//			}
//
//			try {
//				if (oNewOperator && oNewOperator.test(sValue, oType)) {
//					oOperator = oNewOperator;
//					oBinding.getModel().removeUIMessage(oSource.getFieldPath());
//				}
//			} catch (err) {
//				oBinding.getModel().setUIMessage(oSource.getFieldPath(), err.message);
//			}
//
//			if (oOperator) {
//				var oCondition = oOperator.getCondition(sValue, oType);
//				if (oCondition) {
//					oBinding.getModel().removeAllConditions(oSource.getFieldPath());
//
//					oBinding.getModel().addCondition(oSource.getFieldPath(), oCondition);
//					oSource.fireChange({ value: oCondition, type: "added", valid: true });
//
//					oEvent.oSource.setValue("");
//				}
//			}
//
//		},

		onConditionModelToExpr: function() {
			this.byId("expert").setValue(BoolExprTool.prettyPrintCM(this.getView().getModel("cm")));
		},

		onExprToConditionModel: function() {
			var sExpr = this.byId("expert").getValue();
			var oCM = this.getView().getModel("cm");

			var ast = BoolExprTool.booleanExprParser(sExpr, oCM);
			oCM.removeAllConditions();
			BoolExprTool.ASTtoCM(ast, oCM);
//			var bValid = this.applyFilters(this.getView().getModel("cm"), false);

			// update the saved conditionModel content
			this.onSaveVariant();
		},

		onFormatAst: function() {
			var sValue = this.byId("ast").getValue();

			if (sValue) {
				var ast = JSON.parse(sValue);
				this.byId("expert").setValue(BoolExprTool.booleanExprFormatter(ast, this.getView().getModel("cm")));
			}
		},

		onExprChange: function() {
			this.onParseExpr();
		},

		onParseExpr: function() {
			var sValue = this.byId("expert").getValue();
			var oCM = this.getView().getModel("cm");

			try {
				window.console.log("parse:'" + sValue + "'");
				var ast = BoolExprTool.booleanExprParser(sValue, oCM); //"a and b or !(f1: =c)");
				window.console.log("stringify(ast) : " + JSON.stringify(ast));
				window.console.log("format(ast) : " + BoolExprTool.booleanExprFormatter(ast, oCM));

				this.byId("ast").setValue(JSON.stringify(ast, null, "  "));
				// this.byId("asterror").setText("");

			} catch (error) {
				window.console.error(error.message);
				// this.byId("ast").setValue("");
				this.byId("ast").setValue(error.message);
			}
		},

		onDonutChartSelectionChanged: function(oEvent) {
			var oSegment = oEvent.getParameter("segment");
			var sKey = oSegment._getBindingContext().getObject().key;

			var oCM = this.getView().getModel("cm");
			var oCondition = Condition.createItemCondition(sKey, oSegment.getLabel());
			if (oSegment.getSelected()) {
				oCM.addCondition("genre", oCondition);
			} else {
				oCM.removeCondition("genre", oCondition);
			}
		},

		onBarChartSelectionChanged: function(oEvent) {
			var oBar = oEvent.getParameter("bar");
			var sKey = oBar._getBindingContext().getObject().key;

			var oCM = this.getView().getModel("cm");
			var oCondition = Condition.createItemCondition(sKey, oBar.getLabel());
			if (oBar.getSelected()) {
				oCM.addCondition("genre", oCondition);
			} else {
				oCM.removeCondition("genre", oCondition);
			}
		},

		onLineChartSelectionChanged: function(oEvent) {
			var oPoint = oEvent.getParameter("point");
			var sKey = oPoint._getBindingContext().getObject().key;

			var oCM = this.getView().getModel("cm");
			var oCondition = Condition.createItemCondition(sKey, oPoint.getLabel());
			if (oPoint.getSelected()) {
				oCM.addCondition("genre", oCondition);
			} else {
				oCM.removeCondition("genre", oCondition);
			}
		}
	});

});
