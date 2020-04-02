sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"../../library",
	"sap/ui/core/Control",
	"sap/m/List",
	"sap/ui/model/json/JSONModel",
	"sap/m/ListMode",
	"sap/ui/core/CustomData",
	"sap/ui/model/Sorter",
	"sap/rules/ui/parser/infrastructure/util/utilsBase"
], function (jQuery, library, Control, List, JSONModel, ListMode, CustomData, Sorter, infraUtils) {
	"use strict";

	var autoSuggestionVocabularyPanel = Control.extend("sap.rules.ui.ast.autoCompleteContent.AutoSuggestionVocabularyPanel", {
		metadata: {
			library: "sap.rules.ui",
			properties: {
				reference: {
					type: "object",
					defaultValue: null,
				},
				dialogOpenedCallbackReference: {
					type: "object",
					defaultValue: null,
				},
				data: {
					type: "object",
					defaultValue: null
				},
				context: {
					type: "string",
					defaultValue: ""
				},
			},
			aggregations: {
				PanelLayout: {
					type: "sap.m.Panel",
					multiple: false
				}
			},
			events: {}
		},

		init: function () {
			this.oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
			this.infraUtils = new sap.rules.ui.parser.infrastructure.util.utilsBase.lib.utilsBaseLib();
			this.needCreateLayout = true;
			this.AttributeSegmentSelected = true;
			this.dataObjectName = "";
		},
		onBeforeRendering: function () {
			this.suggestionContext = this.getContext();
			this._reference = this.getReference();
			this._dialogOpenedCallbackReference = this.getDialogOpenedCallbackReference();
			if (this.needCreateLayout) {
				var layout = this._createLayout();
				this.setAggregation("PanelLayout", layout, true);
				this.needCreateLayout = false;
			}
		},

		initializeVariables: function () {

		},

		_createAggregateFunctionSection: function () {
			var AggregateFunctionsPanel = new sap.m.Panel({
				expandable: false,
				expanded: true,
				width: "auto",
				content: [new sap.m.Link({
					wrapping: true,
					text: this.oBundle.getText("aggregateFunctionPanelTitle"),
					press: function (oEvent) {
						var functionAndOfLayout = new sap.ui.layout.HorizontalLayout({
							content: [
								new sap.m.Label({
									text: this.oBundle.getText("function") + ": "
								}),
								new sap.m.Select({
									width: "200px",
									height: "60px"
								}),
								new sap.m.Label({
									text: " " + this.oBundle.getText("oflabel") + " "
								}),
								new sap.m.TextArea({
									value: "",
									showExceededText: true,
									width: "150%",
									height: "65px"
								})
							]
						});

						var whereLayout = new sap.ui.layout.HorizontalLayout({
							content: [
								new sap.m.Label({
									text: this.oBundle.getText("where_label") + ":"
								}),
								new sap.m.TextArea({
									value: "",
									showExceededText: true,
									width: "300px"
								})
							]
						});

						var GroupByLayout = new sap.ui.layout.HorizontalLayout({
							content: [
								new sap.m.Label({
									text: this.oBundle.getText("group_by") + ": "
								}),
								new sap.m.TextArea({
									value: "",
									showExceededText: true,
									width: "300px"
								})
							]
						});

						var FunctionLabelLayout = new sap.ui.layout.HorizontalLayout({
							content: [
								new sap.m.Label({
									text: this.oBundle.getText("function_label") + ":",
								}),
								new sap.m.TextArea({
									value: "",
									enabled: false,
									width: "300px"
								})
							]
						});

						var verticalLayoutForAggregateFunction = new sap.ui.layout.VerticalLayout({
							content: [functionAndOfLayout, whereLayout, GroupByLayout, FunctionLabelLayout]
						});
						var that = this;
						var aggregateFunctionsDialog = new sap.m.Dialog({
							title: this.oBundle.getText("configure_aggr_title"),
							contentWidth: "800px",
							contentHeight: "500px",
							showHeader: true,
							content: [verticalLayoutForAggregateFunction],
							afterClose: function () {
								that._dialogOpenedCallbackReference(false);
							},
							buttons: [
								new sap.m.Button({
									text: this.oBundle.getText("applyChangesBtn"),
									tooltip: this.oBundle.getText("applyChangesBtn"),
									press: function (event) {
										aggregateFunctionsDialog.close();
									}
								}),
								new sap.m.Button({
									text: this.oBundle.getText("cancelBtn"),
									tooltip: this.oBundle.getText("cancelBtn"),
									press: function (event) {
										aggregateFunctionsDialog.close();
									}
								})
							]
						});

						aggregateFunctionsDialog.open();
					}
				})]
			})

			var AggregateFunctionsItem = new sap.m.CustomListItem({
				content: AggregateFunctionsPanel
			})
			return AggregateFunctionsItem;
		},

		_createLayout: function () {
			var that = this;
			this.VocabularyTerms = this.getData();
			// create a Model with this data
			var model = new sap.ui.model.json.JSONModel();

			/*Setting growing shows the growing trigger button with text as 2/14 which we do not need
			Hence, setting to top 5 and the rest will be shown in More link */
			var topFiveVocabularyData = [];
			for (var termCount = 0; termCount < 5 && termCount < this.VocabularyTerms.length; termCount++) {
				topFiveVocabularyData.push(this.VocabularyTerms[termCount]);
			}
			model.setData(topFiveVocabularyData);

			// create a list 
			this.vocabularylist = new sap.m.List({
				growingScrollToLoad: true,
				enableBusyIndicator: true
			});

			//for every item, add relevant icon and description and add item to the list
			// bind the List items to the data collection
			this.vocabularylist.bindItems({
				path: "/",
				sorter: new sap.ui.model.Sorter("label"),
				rememberSelections: false,
				mode: ListMode.SingleSelectMaster,
				template: new sap.m.DisplayListItem({
					label: "{label}",
					type: "Active",
					press: function (oEvent) {
						that._setModal(false);
						that._reference(oEvent);
					}
				})
			});

			// set the model to the List, so it knows which data to use
			this.vocabularylist.setModel(model);
			var moreVocabularyLink = this.getMoreVocabulariesLink();

			// add list to the panel
			var vocabularyListPanel = new sap.m.Panel({
				headerText: this.oBundle.getText("vocabularyPanelTitle"),
				expandable: true,
				expanded: true,
				// expand: this.onExpand,
				content: this.vocabularylist,
				width: "auto"
			});
		        if (this.VocabularyTerms.length >= 5){
			    vocabularyListPanel.addContent(moreVocabularyLink);
		        }

			return vocabularyListPanel;
		},

		_setModal: function (value) {
			var pop = sap.ui.getCore().byId("popover");
			if (pop) {
				pop.setModal(value);
			}
		},

		getMoreVocabulariesLink: function () {
			var that = this;
			var suggestionsData = this.getData();
            if (suggestionsData && suggestionsData.length > 0) {
                if (suggestionsData[0].isParentEntity) {
                    that.suggestionContext = "dataObject";
                } else {
                    that.suggestionContext = "attribute";
                }
            }
			var moreVocabularyLink = new sap.m.Link({
				text: this.oBundle.getText("more_link"),
				tooltip: this.oBundle.getText("more_link_tooltip"),
				enabled: true,
				press: function (oEvent) {
					that._setModal(true);
					that._dialogOpenedCallbackReference(true);
                    if (that.VocabularyTerms[0].isParentEntity) {
                        that.getDataObjectsDialog();
                    } else {
                        that.getAttributesDialog(that.dataObjectName);
                    }
				}
			});
			return moreVocabularyLink;

		},

		getDataObjectsDialog: function () {
			var that = this;
			var searchFieldText = this.oBundle.getText("searchTextVocabulary");
			var searchField = this.getSearchField(searchFieldText);
			this.detailedVocabularyList = this.initializeVocabularyList(this.VocabularyTerms);
			this.bindFilteredTermsToList(this.detailedVocabularyList, "DataObjects", "", false);
			var verticalLayoutForVocabularyFunction = new sap.ui.layout.VerticalLayout({
				content: [searchField, that.detailedVocabularyList]
			}).addStyleClass("sapAstVocabularyPanel");

			this.dataObjectsDialog = new sap.m.Dialog({
				title: this.oBundle.getText("selectVocabularyTitle"),
				contentWidth: "500px",
				contentHeight: "500px",
				showHeader: true,
				content: [verticalLayoutForVocabularyFunction],
				afterClose: function () {
					that._dialogOpenedCallbackReference(false);
				},
				buttons: [
					new sap.m.Button({
						text: this.oBundle.getText("cancelBtn"),
						tooltip: this.oBundle.getText("cancelBtn"),
						press: function (event) {
							that._setModal(false);
							that.dataObjectsDialog.close();
						}
					})
				]
			});
			that.dataObjectsDialog.open();

		},

		getAttributesDialog: function (dataObjectName) {
			var that = this;
			var segmentedButton = this.getAttributesSegmentedButtons();
			//deafault
			var searchFieldText = this.oBundle.getText("searchTextAttr");
			if (this.AttributeSegmentSelected) {
				searchFieldText = this.oBundle.getText("searchTextAttr");
			}
			if (this.AssociationSegmentSelected) {
				searchFieldText = this.oBundle.getText("searchTextAssoc");
			}
			var searchField = this.getSearchField(searchFieldText);
			this.detailedVocabularyList = this.initializeVocabularyList(this.VocabularyTerms);
			this.bindFilteredAttributesAndAssociationsToList(this.detailedVocabularyList, "Attributes", "E", false);

			var verticalLayoutForAttributesFunction = new sap.ui.layout.VerticalLayout({
				content: [segmentedButton, searchField, that.detailedVocabularyList]
			}).addStyleClass("sapAstVocabularyPanel");
			that.attributesDialog = new sap.m.Dialog({
				title: this.oBundle.getText("selectAttrAssocTitle"),
				contentWidth: "500px",
				contentHeight: "500px",
				showHeader: true,
				content: [verticalLayoutForAttributesFunction],
				afterClose: function () {
					that._dialogOpenedCallbackReference(false);
				},
				buttons: [
					new sap.m.Button({
						text: this.oBundle.getText("cancelBtn"),
						tooltip: this.oBundle.getText("cancelBtn"),
						press: function (event) {
							that._setModal(false);
							that.attributesDialog.close();
						}
					})
				]
			});

			that.attributesDialog.open();

		},

		getAttributesSegmentedButtons: function () {
			var that = this;
			var SegmentedButton = new sap.m.SegmentedButton({
				items: [new sap.m.SegmentedButtonItem({
						text: this.oBundle.getText("attributes"),
						width: "230px",
						press: function () {
							that._setModal(false);
							that.AttributeSegmentSelected = true;
							that.AssociationSegmentSelected = false;
							that.searchField.setValue("")
							that.searchField.setPlaceholder(that.oBundle.getText("searchTextAttr"));
							that.bindFilteredAttributesAndAssociationsToList(that.detailedVocabularyList, "Attributes", "E", false);
						}
					}),
					new sap.m.SegmentedButtonItem({
						text: this.oBundle.getText("associations"),
						width: "230px",
						press: function () {
							that._setModal(false);
							that.AttributeSegmentSelected = false;
							that.AssociationSegmentSelected = true;
							that.searchField.setValue("")
							that.searchField.setPlaceholder(that.oBundle.getText("searchTextAssoc"));
							that.bindFilteredAttributesAndAssociationsToList(that.detailedVocabularyList, "Association", "AO", false);
						}
					})
				]
			});
			return SegmentedButton;
		},

		bindFilteredTermsToList: function (oList, objectPath, searchText, requireSearch) {
			var model = new sap.ui.model.json.JSONModel(this.VocabularyTerms);
			for (var entry in model.oData) {
				if (model.oData[entry].type === "T") {
					model.oData[entry].displayType = "Table";
				} else if (model.oData[entry].type === "S") {
					model.oData[entry].displayType = "Structure";
				} else if (model.oData[entry].type === "E") {
					model.oData[entry].displayType = "Element";
				} else if (model.oData[entry].ResultDataObjectId && !model.oData[entry].type) {
					model.oData[entry].displayType = "Rule";
				} else {
					model.oData[entry].displayType = model.oData[entry].type;
				}
			}
			var that = this;
			var datapath = "/";
			if (!oList) {
				oList = new sap.m.List({});
			}
			oList.setModel(model);
			oList.bindItems({
				path: datapath,
				sorter: new sap.ui.model.Sorter("type"),
				template: new sap.m.DisplayListItem({
					label: "{label}",
					value: "{displayType}",
					type: "Active",
					customData: [new CustomData({
						Type: "sap.ui.core.CustomData",
						key: "id",
						value: "{id}"
					})],
					press: function (oEvent) {
					    that._setModal(false);
						if (that.dataObjectsDialog.isOpen()) {
							that.dataObjectsDialog.close();
						} else {
							that.attributesDialog.close()
						}
						that._reference(oEvent);
					}
				}),
				rememberSelections: false,
				mode: ListMode.SingleSelectMaster
			});
			if (requireSearch) {
				var filterArray = [];
				var filterProperty = "label";
				filterArray.push(new sap.ui.model.Filter(filterProperty, sap.ui.model.FilterOperator.Contains, searchText));
				oList.getBinding("items").filter(filterArray);
				oList.getModel().refresh(true);
			}
		},

		bindFilteredAttributesAndAssociationsToList: function (oList, objectPath, searchText, requireSearch) {
			var model = new sap.ui.model.json.JSONModel(this.VocabularyTerms);
			var that = this;
			var datapath = "/";
			if (!oList) {
				oList = new sap.m.List({});
			}
			oList.setModel(model);
			oList.bindItems({
				path: datapath,
				sorter: new sap.ui.model.Sorter("label"),
				template: new sap.m.DisplayListItem({
					label: "{label}",
					type: "Active",
					press: function (oEvent) {
						that._setModal(false);
						that.attributesDialog.close();
						that._reference(oEvent);
					}
				}),
				rememberSelections: false,
				mode: ListMode.SingleSelectMaster
			});

			if (requireSearch) {
				oList.getBinding("items").filter(new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.Contains, objectPath),
						new sap.ui.model.Filter("label", sap.ui.model.FilterOperator.Contains, searchText),
					],
					and: true
				}));
			} else {
				var filterArray = [];
				var filterProperty = "type";
				filterArray.push(new sap.ui.model.Filter(filterProperty, sap.ui.model.FilterOperator.Contains, searchText));
				oList.getBinding("items").filter(filterArray);
				oList.getModel().refresh(true);
			}
		},

		getDataObjectFilter: function () {
			if (this.AttributeSegmentSelected) {
				return new sap.ui.model.Filter("DataObjectId", sap.ui.model.FilterOperator.Contains, this.dataObjectId)
			}
			if (this.AssociationSegmentSelected) {
				return new sap.ui.model.Filter("SourceDataObjectId", sap.ui.model.FilterOperator.Contains, this.dataObjectId)
			}
		},

		getSearchFilters: function (searchText) {
			return new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, searchText),
					new sap.ui.model.Filter("label", sap.ui.model.FilterOperator.Contains, searchText)
				],
				and: false
			});
		},

		getSearchField: function (placeHolderText) {
			var that = this;
			this.searchField = new sap.m.SearchField({
				showSearchButton: false,
				width: "462px",
				placeholder: placeHolderText, //searchType,
				liveChange: function (oEvent) {
					if (that.dataObjectsDialog) {
						that.searchTheValueInDataObjects(oEvent.getParameter("newValue"), searchType);
					} else {
						// Deafult case when no tab is selected by the user, we search on the first tab which is "Attribute"
						var searchType = "Attributes";
						if (that.AttributeSegmentSelected) {
							searchType = "Attributes";
						}
						if (that.AssociationSegmentSelected) {
							searchType = "Association";
						}

						//if Attributes or Association is selected, we will have to search in them
						that.searchValueInAttributesAndAssociation(oEvent.getParameter("newValue"), searchType);
					}

				}
			})
			return this.searchField;
		},

		searchTheValueInDataObjects: function (searchText, searchType) {
			this.bindFilteredTermsToList(this.detailedVocabularyList, searchType, searchText, true);
		},

		searchValueInAttributesAndAssociation: function (searchText, searchType) {
			if (this.AttributeSegmentSelected) {
				searchType = "E";
			}
			if (this.AssociationSegmentSelected) {
				searchType = "AO";
			}
			this.bindFilteredAttributesAndAssociationsToList(this.detailedVocabularyList, searchType, searchText, true);
		},

		initializeVocabularyList: function (vocabularyData) {
			var model = new sap.ui.model.json.JSONModel(vocabularyData);
			var datapath = "/";
			var vocabularylist = new sap.m.List({
				headerText: this.oBundle.getText("vocabulary")
			});
			vocabularylist.setModel(model);
			vocabularylist.bindItems({
				path: datapath,
				sorter: new sap.ui.model.Sorter("label"),
				template: new sap.m.DisplayListItem({
					label: "{label}",
					value: "{type}",
					type: "Active",
					customData: [new CustomData({
						Type: "sap.ui.core.CustomData",
						key: "id",
						value: "{id}"
					})]
				})

			});
			return vocabularylist;
		}

	});

	return autoSuggestionVocabularyPanel;
}, /* bExport= */ true);
