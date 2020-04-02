jQuery.sap.declare('sap.apf.testhelper.stub.activeStepStub');
(function() {
	'use strict';
	sap.apf.testhelper.stub.activeStepStub = function() {
	};
	sap.apf.testhelper.stub.activeStepStub.prototype.constructor = sap.apf.testhelper.stub.activeStepStub;
	sap.apf.testhelper.stub.activeStepStub.prototype.getselectedRepresentationStub = function(selectionData) {
		var selectedRep = {};
		selectedRep.chart = {};
		selectedRep.getSelections = function() {
			return selectionData;
		};
		selectedRep.removeAllSelection = function() {
			return null;
		};
		selectedRep.bIsAlternateView = false;
		selectedRep.getMainContent = function() {
			var mainContent = {};
			mainContent.addEventDelegate = function() {
			};
			mainContent.getContent = function() {
				var div = document.createElement("div");
				return div;
			};
			mainContent.setContent = function(html) {
				return html;
			};
			return mainContent;
		};
		selectedRep.getAlternateRepresentation = function() {
			var altRep = {};
			altRep.id = sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION;
			altRep.picture = "sap-icon://table-view";
			return altRep;
		};
		selectedRep.getParameter = function() {
			return {
				alternateRepresentationType : {
					constructor : "sap.apf.ui.representations.table"
				},
				requiredFilters : [ {
					label : "Customer"
				} ],
				dimensions : [ {
					fieldName : "YearMonth",
					kind : "xAxis"
				} ],
				measures : [ {
					fieldName : "DaysSalesOutstanding",
					kind : "yAxis"
				} ]
			};
		};
		selectedRep.getData = function() {
			return;
		};
		selectedRep.getMetaData = function() {
			var metData = {};
			metData.getPropertyMetadata = function(x) {
				return x;
			};
			return metData;
		};
		return selectedRep;
	};
	sap.apf.testhelper.stub.activeStepStub.prototype.getActiveStepStub = function(selectionData) {
		var step = {};
		step.title = "Step Title";
		step.getSelectedRepresentationInfo = function() {
			return {
				picture : "sap-icon://line-chart",
				label : {
					type : "label",
					key : "LineChart",
					kind : "text"
				}
			};
		};
		step.getSelectedRepresentation = function() {
			var selectedRep = {};
			selectedRep.chart = {};
			selectedRep.chartPlotArea = {plotArea: {
                dataLabel: {
                    visible: false,
                    formatString: "measureFormatter"
                }
            }};
			selectedRep.getSelections = function() {
				return selectionData;
			};
			selectedRep.getSortedSelections = function() {
				return selectionData;
			};
			selectedRep.removeAllSelection = function() {
				return null;
			};
			selectedRep.bIsAlternateView = false;
			selectedRep.bIsDataVisible = false;
			selectedRep.getMainContent = function() {
				var mainContent = {};
				mainContent.addEventDelegate = function() {
				};
				mainContent.getContent = function() {
					var div = document.createElement("div");
					return div;
				};
				mainContent.setContent = function(html) {
					return html;
				};
				return mainContent;
			};
			selectedRep.getAlternateRepresentation = function() {
				var altRep = {};
				altRep.id = sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION;
				altRep.picture = "sap-icon://table-view";
				return altRep;
			};
			selectedRep.getParameter = function() {
				return {
					alternateRepresentationType : {
						constructor : "sap.apf.ui.representations.table"
					},
					requiredFilters : [ {
						label : "Customer"
					} ],
					dimensions : [ {
						fieldName : "YearMonth",
						kind : "xAxis"
					} ],
					measures : [ {
						fieldName : "DaysSalesOutstanding",
						kind : "yAxis"
					} ]
				};
			};
			selectedRep.getData = function() {
				return;
			};
			selectedRep.getMetaData = function() {
				var metData = {};
				metData.getPropertyMetadata = function(x) {
					return x;
				};
				return metData;
			};
			selectedRep.getSelectionFilterLabel = function(sFilterProperty) {
				return sFilterProperty;
			};
			return selectedRep;
		};
		step.setSelectedRepresentation = function(id) {
			return id;
		};
		step.getRepresentationInfo = function() {
			return [ {
				picture : "sap-icon://line-chart",
				label : {
					type : "label",
					key : "LineChart",
					kind : "text"
				}
			}, {
				picture : "sap-icon://bar-chart",
				label : {
					type : "label",
					key : "ColumnChart",
					kind : "text"
				}
			} ];
		};
		return step;
	};
	sap.apf.testhelper.stub.activeStepStub.prototype.getActiveStepWithSelectionStub = function() {
		var selectionData = [ {
			id : "AR",
			text : "Argentina(AR)"
		} ];
		var aSelectionData = [];
		aSelectionData.push(selectionData);
		var step = sap.apf.testhelper.stub.activeStepStub.prototype.getActiveStepStub(aSelectionData);
		return step;
	};
	sap.apf.testhelper.stub.activeStepStub.prototype.getActiveStepWithOutSelectionStub = function() {
		var selectionData = {};
		var step = sap.apf.testhelper.stub.activeStepStub.prototype.getActiveStepStub(selectionData);
		return step;
	};
	sap.apf.testhelper.stub.activeStepStub.prototype.getActiveStepTableRepStub = function(topNValue) {
		var step = {};
		step.title = "Step Title";
		step.getSelectedRepresentationInfo = function() {
			return {
				picture : "sap-icon://table-view",
				label : {
					type : "label ",
					key : "Tabl",
					kind : "text"
				}
			};
		};
		step.getSelectedRepresentation = function() {
			var selectedRep = {};
			selectedRep.chart = {};
			var selectionData = {
				id : "AR",
				text : "Argentina(AR)"
			};
			var aSelectionData = [];
			aSelectionData.push(selectionData);
			selectedRep.getColumnFromProperties = function() {
				return;
			};
			selectedRep.oTableRepresentation = function() {
				return new sap.ui.table.Table();
			};
			selectedRep.getSelectionFilterLabel = function(sFilterProperty) {
				return sFilterProperty;
			};
			selectedRep.setData = function() {
				return;
			};
			selectedRep.adoptSelection = function() {
				return;
			};
			selectedRep.getMainContent = function() {
				var mainContent = {};
				mainContent.addEventDelegate = function() {
				};
				mainContent.getContent = function() {
					var div = document.createElement("div");
					return div;
				};
				mainContent.setContent = function(html) {
					return html;
				};
				return mainContent;
			};
			selectedRep.getViewSettingDialog = function() {
				var oDialog = new sap.m.Dialog({
					endButton : new sap.m.Button()
				});
				oDialog.getEndButton().attachPress(function() {
					oDialog.close();
				});
				return oDialog;
			};
			selectedRep.type = "TableRepresentation";
			selectedRep.topN = topNValue;
			selectedRep.getSelections = function() {
				return aSelectionData;
			};
			selectedRep.removeAllSelection = function() {
				return null;
			};
			selectedRep.bIsAlternateView = false;
			selectedRep.getParameter = function() {
				return {
					requiredFilters : [ {
						label : "Customer"
					} ]
				};
			};
			selectedRep.getData = function() {
				return;
			};
			selectedRep.getMetaData = function() {
				var metData = {};
				metData.getPropertyMetadata = function(x) {
					return x;
				};
				return metData;
			};
			return selectedRep;
		};
		step.setSelectedRepresentation = function(id) {
			return id;
		};
		return step;
	};
	sap.apf.testhelper.stub.activeStepStub.prototype.getActiveStepTableRepWithTopNStub = function() {
		var step = sap.apf.testhelper.stub.activeStepStub.prototype.getActiveStepTableRepStub("20");
		return step;
	};
	sap.apf.testhelper.stub.activeStepStub.prototype.getActiveStepTableRepWithOutTopNStub = function() {
		var step = sap.apf.testhelper.stub.activeStepStub.prototype.getActiveStepTableRepStub(undefined);
		return step;
	};
	sap.apf.testhelper.stub.activeStepStub.prototype.getActiveStepAlternateRep = function() {
		var step = {};
		step.title = "Step Title";
		step.getSelectedRepresentationInfo = function() {
			return {
				picture : "sap-icon://table-view",
				label : {
					type : "label",
					key : "Tabl",
					kind : "text"
				}
			};
		};
		step.getSelectedRepresentation = function() {
			var selectedRep = {};
			selectedRep.chart = {};
			selectedRep.toggleInstance = {};
			selectedRep.toggleInstance.getColumnFromProperties = function() {
				return;
			};
			selectedRep.toggleInstance.getViewSettingDialog = function() {
				return new sap.m.Dialog();
			};
			selectedRep.toggleInstance.oTableRepresentation = function() {
				return new sap.ui.table.Table();
			};
			selectedRep.toggleInstance.setData = function() {
				return;
			};
			selectedRep.toggleInstance.adoptSelection = function() {
				return;
			};
			selectedRep.toggleInstance.getMainContent = function() {
				var mainContent = {};
				mainContent.addEventDelegate = function() {
				};
				mainContent.getContent = function() {
					var div = document.createElement("div");
					return div;
				};
				mainContent.setContent = function(html) {
					return html;
				};
				return mainContent;
			};
			selectedRep.toggleInstance.type = "TableRepresentation";
			selectedRep.toggleInstance.topN = "20";
			selectedRep.toggleInstance.getSelections = function() {
				return 0;
			};
			selectedRep.removeAllSelection = function() {
				return null;
			};
			selectedRep.bIsAlternateView = true;
			selectedRep.getParameter = function() {
				return {
					alternateRepresentationType : {
						constructor : "sap.apf.ui.representations.table"
					},
					requiredFilters : [ {
						label : "Customer"
					} ],
					dimensions : [ {
						fieldName : "YearMonth",
						kind : "xAxis",
						labelDisplayOption : "key"
					} ],
					measures : [ {
						fieldName : "DaysSalesOutstanding",
						kind : "yAxis"
					} ]
				};
			};
			selectedRep.getData = function() {
				return [ {
					data : {
						"Year Month" : "201312",
						"Days Sales Outstanding" : 55.22
					}
				}, {
					data : {
						"Year Month" : "201311",
						"Days Sales Outstanding" : 40.3
					}
				} ];
			};
			selectedRep.getMetaData = function() {
				var metData = {};
				metData.getPropertyMetadata = function(x) {
					return {
						"dataType" : {
							"maxLength" : "10",
							"type" : "Edm.String"
						},
						"label" : "Company Code Country",
						"name" : "CompanyCodeCountry"
					};
				};
				return metData;
			};
			return selectedRep;
		};
		step.setSelectedRepresentation = function(id) {
			return id;
		};
		return step;
	};
})();