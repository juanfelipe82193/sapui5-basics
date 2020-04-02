sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/m/MessageToast',
	'sap/m/SearchField'
], function (Controller, MessageToast, SearchField) {
	"use strict";
	return Controller.extend("sap.ui.comp.sample.filterbar.example2.FilterBar", {

		onInit: function () {
			this.oFilterBar = null;
			var sViewId = this.getView().getId();

			this.oFilterBar = sap.ui.getCore().byId(sViewId + "--filterBar");

			this.oFilterBar.registerFetchData(this.fFetchData);
			this.oFilterBar.registerApplyData(this.fApplyData);
			this.oFilterBar.registerGetFiltersWithValues(this.fGetFiltersWithValues);

			this.fVariantStub();
			this.onToggleSearchField();
			this.oFilterBar.fireInitialise();
			this._sHeader = this.oFilterBar.getHeader();
		},

		onToggleSearchField: function (oEvent) {
			var oSearchField = this.oFilterBar.getBasicSearch();
			var oBasicSearch;
			if (!oSearchField) {
				oBasicSearch = new SearchField({
					showSearchButton: false
				});
			} else {
				oSearchField = null;
			}

			this.oFilterBar.setBasicSearch(oBasicSearch);

			oBasicSearch.attachBrowserEvent("keyup", function (e) {
					if (e.which === 13) {
						this.onSearch();
					}
				}.bind(this)
			);
		},

		onToggleShowFilters: function (oEvent) {
			var bFlag = this.oFilterBar.getShowFilterConfiguration();
			this.oFilterBar.setShowFilterConfiguration(!bFlag);
		},

		onToggleHeader: function (oEvent) {
			var sHeader = "";
			if (this.oFilterBar.getHeader() !== this._sHeader) {
				sHeader = this._oHeader;
			}

			this.oFilterBar.setHeader(sHeader);

		},

		onChange: function (oEvent) {
			this.oFilterBar.fireFilterChange(oEvent);
		},

		onClear: function (oEvent) {
			var oItems = this.oFilterBar.getAllFilterItems(true);
			for (var i = 0; i < oItems.length; i++) {
				var oControl = this.oFilterBar.determineControlByFilterItem(oItems[i]);
				if (oControl) {
					oControl.setValue("");
				}
			}
		},

		_showToast: function (sMessage) {
			MessageToast.show(sMessage);
		},

		onCancel: function (oEvent) {
			this._showToast("cancel triggered");
		},

		onReset: function (oEvent) {
			this._showToast("reset triggered");
		},

		onSearch: function (oEvent) {
			this._showToast("search triggered");
		},

		onFiltersDialogClosed: function (oEvent) {
			this._showToast("filtersDialogClosed triggered");
		},

		fFetchData: function () {
			var oJsonParam;
			var oJsonData = [];
			var sGroupName;
			var oItems = this.getAllFilterItems(true);

			for (var i = 0; i < oItems.length; i++) {
				oJsonParam = {};
				sGroupName = null;
				if (oItems[i].getGroupName) {
					sGroupName = oItems[i].getGroupName();
					oJsonParam.groupName = sGroupName;
				}

				oJsonParam.name = oItems[i].getName();

				var oControl = this.determineControlByFilterItem(oItems[i]);
				if (oControl) {
					oJsonParam.value = oControl.getValue();
					oJsonData.push(oJsonParam);
				}
			}

			return oJsonData;
		},

		fApplyData: function (oJsonData) {

			var sGroupName;

			for (var i = 0; i < oJsonData.length; i++) {

				sGroupName = null;

				if (oJsonData[i].groupName) {
					sGroupName = oJsonData[i].groupName;
				}

				var oControl = this.determineControlByName(oJsonData[i].name, sGroupName);
				if (oControl) {
					oControl.setValue(oJsonData[i].value);
				}
			}
		},

		fGetFiltersWithValues: function () {
			var i;
			var oControl;
			var aFilters = this.getFilterGroupItems();

			var aFiltersWithValue = [];

			for (i = 0; i < aFilters.length; i++) {
				oControl = this.determineControlByFilterItem(aFilters[i]);
				if (oControl && oControl.getValue && oControl.getValue()) {
					aFiltersWithValue.push(aFilters[i]);
				}
			}

			return aFiltersWithValue;
		},

		fVariantStub: function () {
			var oVM = this.oFilterBar._oVariantManagement;
			oVM.initialise = function () {
				this.fireEvent("initialise");
				this._setStandardVariant();

				this._setSelectedVariant();
			};

			var nKey = 0;
			var mMap = {};
			var sCurrentVariantKey = null;
			oVM._oVariantSet = {

				getVariant: function (sKey) {
					return mMap[sKey];
				},
				addVariant: function (sName) {
					var sKey = "" + nKey++;

					var oVariant = {
						key: sKey,
						name: sName,
						getItemValue: function (s) {
							return this[s];
						},
						setItemValue: function (s, oObj) {
							this[s] = oObj;
						},
						getVariantKey: function () {
							return this.key;
						}
					};
					mMap[sKey] = oVariant;

					return oVariant;
				},

				setCurrentVariantKey: function (sKey) {
					sCurrentVariantKey = sKey;
				},

				getCurrentVariantKey: function () {
					return sCurrentVariantKey;
				},

				delVariant: function (sKey) {
					if (mMap[sKey]) {
						delete mMap[sKey];
					}
				}

			};
		}
	});

});