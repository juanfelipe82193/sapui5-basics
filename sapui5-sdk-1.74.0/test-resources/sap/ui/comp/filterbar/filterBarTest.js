sap.ui.require([
	"sap/base/Log",
	"sap/ui/comp/filterbar/FilterBar",
	"sap/m/Button",
	"sap/ui/comp/filterbar/FilterGroupItem",
	"sap/m/Input",
	"sap/ui/comp/variants/VariantManagement",
	"sap/ui/comp/filterbar/FilterItem",
	"sap/m/SearchField",
	"sap/m/MultiComboBox",
	"sap/m/ComboBox",
	"sap/ui/model/json/JSONModel",
	"sap/m/ToggleButton"

], function (Log, FilterBar, Button, FilterGroupItem, Input, VariantManagement, FilterItem, SearchField, MultiComboBox, ComboBox, JSONModel, ToggleButton) {
	"use strict";

	var that = this;
	this.oFilterBar = new FilterBar({ id: "theFilterBar", showClearButton: true });

	var sCurrentVariantId = null;
	// Advanced area
	var fCreateGroupItem = function (sGroupTitle, sGroupName, sName, sLabel, bInvisible, sTooltip) {
		var oFilterGroupItem = new FilterGroupItem();
		oFilterGroupItem.setGroupName(sGroupName);
		oFilterGroupItem.setGroupTitle(sGroupTitle);

		oFilterGroupItem.setLabel(sLabel ? sLabel : ("oCtrl" + sName));

		var oCtrl = new Input();
		if (oCtrl.attachChange) {
			oCtrl.attachChange(function (oEvent) {
				that.oFilterBar.fireFilterChange(oEvent);
			});
		}

		if (bInvisible) {
			oFilterGroupItem.setVisible(false);
		}

		//oFilterGroupItem.setVisible(false);


		oFilterGroupItem.setControl(oCtrl);
		oFilterGroupItem.setName(sName);

		if ((sName === "G15")) {
			oFilterGroupItem.bindProperty("visible", "/myAAVisible");  //has to be done befor fireInitialise
			oFilterGroupItem.bindProperty("visibleInFilterBar", "/myVisibleFBA");  //has to be done befor fireInitialise
			oCtrl.bindProperty("value", "/myAAValue");  //has to be done befor fireInitialise
		}

		if (sTooltip) {
			oFilterGroupItem.setLabelTooltip(sTooltip);
		}

		that.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		return oFilterGroupItem;
	};
	var fCleanUp = function () {
		that.oFilterBar.removeAllFilterItems();
		that.oFilterBar.removeAllFilterGroupItems();
		that.oFilterBar.removeBasicSearch();
	};
	var fSetTestData2 = function (bFlag) {

		if (bFlag === undefined) {
			bFlag = true;
		}
		this.oFilterBar.removeAllFilterGroupItems();

		var sGroupTitle = "Test";
		var sGroupName = "TEST";

		fCreateGroupItem(sGroupTitle, sGroupName, "G01 FRANZ", "Open Item Management").setVisibleInFilterBar(bFlag);

		fCreateGroupItem(sGroupTitle, sGroupName, "G02_FRANZ").setVisibleInFilterBar(bFlag);

		fCreateGroupItem(sGroupTitle, sGroupName, "G03\FRANZ", "oInputField").setVisibleInFilterBar(bFlag);

		fCreateGroupItem(sGroupTitle, sGroupName, "0G04").setVisibleInFilterBar(bFlag);

		fCreateGroupItem(sGroupTitle, sGroupName, "G05").setVisibleInFilterBar(bFlag);

		fCreateGroupItem(sGroupTitle, sGroupName, "G06").setVisibleInFilterBar(bFlag);
		fCreateGroupItem(sGroupTitle, sGroupName, "G07").setVisibleInFilterBar(bFlag);
		fCreateGroupItem(sGroupTitle, sGroupName, "G08").setVisibleInFilterBar(bFlag);
		fCreateGroupItem(sGroupTitle, sGroupName, "G09").setVisibleInFilterBar(bFlag);
		fCreateGroupItem(sGroupTitle, sGroupName, "G10").setVisibleInFilterBar(bFlag);
		fCreateGroupItem(sGroupTitle, sGroupName, "G11").setVisibleInFilterBar(bFlag);
		fCreateGroupItem(sGroupTitle, sGroupName, "G12").setVisibleInFilterBar(bFlag);
		fCreateGroupItem(sGroupTitle, sGroupName, "G13").setVisibleInFilterBar(bFlag);
		fCreateGroupItem(sGroupTitle, sGroupName, "G14").setVisibleInFilterBar(bFlag);

		fCreateGroupItem(sGroupTitle, sGroupName, "G021", "Open Item Management2").setVisibleInFilterBar(bFlag);
		fCreateGroupItem(sGroupTitle, sGroupName, "G022").setVisibleInFilterBar(bFlag);
	};


	var fsetNonVisibleOnFBFilters = function () {
		fCleanUp();
		this.oFilterBar.setFilterBarExpanded(false);

		fSetTestData2(false);

	};

	var fsetNoFilters = function () {
		fCleanUp();
		this.oFilterBar.setFilterBarExpanded(false);
		this.oFilterBar._filterBarExpandedState();
	};

	var fConsiderGroupTitle = function () {
		var bFlag = this.oFilterBar.getConsiderGroupTitle();

		this.oFilterBar.setConsiderGroupTitle(!bFlag);
	};

	var fgetCurrentVariantId = function () {
		var sKey = this.oFilterBar.getCurrentVariantId();
		//alert("current variant id:" + sKey);

		sCurrentVariantId = sKey;
	};

	var fsetCurrentVariantId = function () {

		//alert("set current variant id:" + sCurrentVariantId);

		this.oFilterBar.setCurrentVariantId(sCurrentVariantId);
	};

	var fsetCollectiveSearch = function () {

		if (this.oFilterBar.getAdvancedMode()) {
			var oCollectiveSearch = new VariantManagement();
			this.oFilterBar._setCollectiveSearch(oCollectiveSearch);
		}
	};

	var fDetermineMandatory = function () {
		Log.info("count of mandatory fields: <" + that.oFilterBar.determineMandatoryFilterItems().length + ">");
	};


	var toggleMandBA = function () {
		if (this.oModel) {
			var bValue = this.oModel.getProperty("/myMandBA");
			this.oModel.setProperty("/myMandBA", !bValue);
		}
	};


	var toggleMandAA = function () {
		if (this.oModel) {
			var bValue = this.oModel.getProperty("/myMandAA");
			this.oModel.setProperty("/myMandAA", !bValue);
		}
	};

	var toggleBA = function () {
		if (this.oModel) {
			var bValue = this.oModel.getProperty("/myVisible");
			this.oModel.setProperty("/myVisible", !bValue);
		}
	};

	var toggleAA = function () {
		if (this.oModel) {
			var bValue = this.oModel.getProperty("/myAAVisible");
			this.oModel.setProperty("/myAAVisible", !bValue);
		}
	};


	var toggleFBA = function () {
		if (this.oModel) {
			var bValue = this.oModel.getProperty("/myVisibleFBA");
			this.oModel.setProperty("/myVisibleFBA", !bValue);
		}
	};

	var toggleFBB = function () {
		if (this.oModel) {
			var bValue = this.oModel.getProperty("/myVisibleFBB");
			this.oModel.setProperty("/myVisibleFBB", !bValue);
		}
	};


	var toggleTitleRenameA = function () {
		if (this.oModel) {
			var sLongTitle = "GROUP1 with a long long long long long lang long title";
			var sShortTitle = "GROUP1 short title";

			var sValue = this.oModel.getProperty("/myGroupTitle");
			if (sValue === sLongTitle) {
				this.oModel.setProperty("/myGroupTitle", sShortTitle);
			} else {
				this.oModel.setProperty("/myGroupTitle", sLongTitle);
			}
		}
	};

	var toggleLabelRenameB = function () {
		if (this.oModel) {
			var sLabel = "My New Label B";
			if (sLabel === this.oModel.getProperty("/myLabel")) {
				this.oModel.setProperty("/myLabel", "another label");
			} else {
				this.oModel.setProperty("/myLabel", sLabel);
			}
		}
	};

	var toggleLabelRenameA = function () {
		if (this.oModel) {
			var sLabel = "My New Label A";
			if (sLabel === this.oModel.getProperty("/myGroupLabel")) {
				this.oModel.setProperty("/myGroupLabel", "another label");
			} else {
				this.oModel.setProperty("/myGroupLabel", sLabel);
			}
		}
	};





	var toggleAdvancedMode = function () {

		fCleanUp();

		var bFlag = !this.oFilterBar.getAdvancedMode();

		if (bFlag) {
			this.oFilterBar.setAdvancedMode(true);
			fSetTestData2();
			fAddSearchField();
		} else {
			this.oFilterBar.setAdvancedMode(false);
			fSetTestData();
		}
	};

	var toggleExpandAdvancedArea = function () {

		if (this.oFilterBar.getAdvancedMode()) {
			var bFlag = this.oFilterBar.getExpandAdvancedArea();
			this.oFilterBar.setExpandAdvancedArea(!bFlag);
		}
	};


	var toggleAdvancedMode1 = function () {

		fCleanUp();

		var bFlag = !this.oFilterBar.getAdvancedMode();

		if (bFlag) {
			this.oFilterBar.setAdvancedMode(true);

			fSetTestData2();
		} else {
			this.oFilterBar.setAdvancedMode(false);
			fSetTestData();
		}
	};

	var fTriggerButtonState = function () {
		this.oFilterBar.setSearchEnabled(!this.oFilterBar.getSearchEnabled());
	};


	var fGetFiltersWithValues = function () {
		var i;
		var oControl;
		var aFilters = that.oFilterBar.getFilterGroupItems();


		var aFiltersWithValue = [];

		for (i = 0; i < aFilters.length; i++) {
			oControl = that.oFilterBar.determineControlByFilterItem(aFilters[i]);
			if (oControl && oControl.getValue && oControl.getValue()) {
				aFiltersWithValue.push(aFilters[i]);
			}
		}

		return aFiltersWithValue;
	};

	var fFetchData = function () {
		var oJsonParam;
		var oJsonData = [];
		var sGroupName;

		var oItems = that.oFilterBar.getAllFilterItems(true);
		for (var i = 0; i < oItems.length; i++) {
			oJsonParam = {};
			sGroupName = null;
			if (oItems[i].getGroupName) {
				sGroupName = oItems[i].getGroupName();
				oJsonParam.group_name = sGroupName;
			}

			oJsonParam.name = oItems[i].getName();

			var oControl = that.oFilterBar.determineControlByFilterItem(oItems[i]);
			if (oControl) {
				oJsonParam.value = oControl.getValue();
				oJsonData.push(oJsonParam);
			}
		}

		return oJsonData;
	};

	var fApplyData = function (oJsonData) {

		var sGroupName;

		for (var i = 0; i < oJsonData.length; i++) {

			sGroupName = null;

			if (oJsonData[i].group_name) {
				sGroupName = oJsonData[i].group_name;
			}

			var oControl = that.oFilterBar.determineControlByName(oJsonData[i].name, sGroupName);
			if (oControl) {
				oControl.setValue(oJsonData[i].value);
			}
		}

	};

	var _change = function (oEvent) {

		var params = oEvent.getParameters();
		if (params.newValue === "VISB") {
			toggleBA();
		} else if (params.newValue === "VISA") {
			toggleAA();
		} else if (params.newValue === "LABB") {
			toggleLabelRenameB();
		} else if (params.newValue === "LABA") {
			toggleLabelRenameA();
		} else if (params.newValue === "TITA") {
			toggleTitleRenameA();
		} else if (params.newValue === "VISFBA") {
			toggleFBA();
		} else if (params.newValue === "VISFBB") {
			toggleFBB();
		} else if (params.newValue === "MANDBA") {
			toggleMandBA();
		} else if (params.newValue === "MANDAA") {
			toggleMandAA();
		}

	};

	// Basic area
	var fCreateItem = function (sName, sLabel, bRequire, sWidth, bInvisible, sTooltip) {
		var oCtrl = null;
		var oFilterItem = new FilterItem();
		oFilterItem.setLabel(sLabel ? sLabel : ("Control" + sName));
		oCtrl = new Input();
		if (oCtrl.attachChange) {
			oCtrl.attachChange(function (oEvent) {
				that.oFilterBar.fireFilterChange(oEvent);
			});
		}

		if (sWidth) {
			//oCtrl.setWidth(sWidth);
		}

		oFilterItem.setControl(oCtrl);
		oFilterItem.setName(sName);

		if (bRequire) {
			oFilterItem.setMandatory(bRequire);
		}

		if (bInvisible) {
			oFilterItem.setVisible(false);
		}

		if (sName === "B") {
			oFilterItem.bindProperty("visibleInFilterBar", "/myVisibleFBB");  // has to be done befor added to the aggregation
			oFilterItem.bindProperty("visible", "/myVisible");  // has to be done befor added to the aggregation
			oCtrl.bindProperty("value", "/myValue");  // has to be done befor added to the aggregation
			oCtrl.attachChange(_change);
		} else if (sName === "A") {
			oCtrl.bindProperty("value", "/valueOfA");  // has to be done befor added to the aggregation
			oCtrl.attachChange(this._change);
		} else if (sName === "D") {
			oFilterItem.bindProperty("mandatory", "/myMandBA");  // has to be done befor added to the aggregation
			oCtrl.attachChange(this._change);
		}

		if (sTooltip) {
			oFilterItem.setLabelTooltip(sTooltip);
		}

		oFilterBar.addFilterItem(oFilterItem);
		return oFilterItem;
	};


	var fAddSearchField = function () {

		var oBasicSearch = new SearchField({
			//maxLength: "28rem",
			showSearchButton: false
		});

		oFilterBar.setBasicSearch(oBasicSearch);
	};







	var singleSelection = function () {

		fCleanUp();
		fCreateItem("A");
	};

	var singleGroup = function () {

		if (this.oFilterBar.getAdvancedMode()) {

			this.oFilterBar.removeAllFilterGroupItems();

			var sGroupTitle = "Open Item Management";
			var sGroupName = "G1";

			fCreateGroupItem(sGroupTitle, sGroupName, "G01", "Open Item Management", false, "Test with Tooltip");
			fCreateGroupItem(sGroupTitle, sGroupName, "G02");
		}
	};

	var fSetTestData = function () {

		var f = fCreateMCBItem("MCB");
		f.setVisibleInFilterBar(false);

		fCreateCBItem("CB CB");

		fCreateItem("A A A A");
		fCreateItem("B\\C", "ChangeMyVisDynamic", true); //dynamicaly hidden/visible

		fCreateItem("0C", "Test.123456789.123456789.123456789");
		fCreateItem("D/D");
		fCreateItem("E");
		fCreateItem("F", "ControlFASDEDEERRabadadadsassassasasa", false, "30px");

		fCreateItem("G", "ControlG", false, "370px", false, "This is a Tooltip"); // default hidden
		var oItem = fCreateItem("H", null, true, null, false, "Sein Blick ist vom Vorübergehn der Stäbe so müd geworden, dass er nichts mehr hält. Ihm ist, als ob es tausend Stäbe gäbe  und hinter tausend Stäben keine Welt.");
		if (oItem) {
			oItem.bindProperty("label", "/myLabel");
		}

		sGroupTitle = "Invisible Group";
		sGroupName = "G8";
		fCreateGroupItem(sGroupTitle, sGroupName, "G82", "first", true);
		var oFilterItem = fCreateGroupItem(sGroupTitle, sGroupName, "G83", "invisible");
		oFilterItem.bindProperty("visible", "/myAAVisible"); //has to be done befor fireInitialise
		oFilterItem.setPartOfCurrentVariant(true);

		fCreateGroupItem(sGroupTitle, sGroupName, "G84", "last", true);

		var sGroupTitle = "Open Item Management";
		var sGroupName = "G1";

		var oFirstGroupElement = fCreateGroupItem(sGroupTitle, sGroupName, "G11", "oCtrlG11", false, "Tooltip"); // default visible hidden
		if (oFirstGroupElement) {
			oFirstGroupElement.bindProperty("groupTitle", "/myGroupTitle");
			oFirstGroupElement.bindProperty("label", "/myGroupLabel");

			oFirstGroupElement.setVisibleInFilterBar(true);
		}

		fCreateGroupItem(sGroupTitle, sGroupName, "G12", "oCtrlG12", true); // default hidden
		fCreateGroupItem(sGroupTitle, sGroupName, "G13", "Open Item Management");
		fCreateGroupItem(sGroupTitle, sGroupName, "G14");
		fCreateGroupItem(sGroupTitle, sGroupName, "G15", "ChangeMyVisDynamic", false, "Sein Blick ist vom Vorübergehn der Stäbe so müd geworden, dass er nichts mehr hält. Ihm ist, als ob es tausend Stäbe gäbe  und hinter tausend Stäben keine Welt."); //dynamic hidden/visible
		fCreateGroupItem(sGroupTitle, sGroupName, "G16");
		fCreateGroupItem(sGroupTitle, sGroupName, "G17");

		sGroupTitle = "Group 2";
		sGroupName = "G2";
		fCreateGroupItem(sGroupTitle, sGroupName, "G21");

		sGroupTitle = "Group3";
		sGroupName = "G3";
		fCreateGroupItem(sGroupTitle, sGroupName, "G31");
		fCreateGroupItem(sGroupTitle, sGroupName, "G32");
		fCreateGroupItem(sGroupTitle, sGroupName, "G33");

		sGroupTitle = "Group4";
		sGroupName = "G4";
		fCreateGroupItem(sGroupTitle, sGroupName, "G41");
		fCreateGroupItem(sGroupTitle, sGroupName, "G42");
		fCreateGroupItem(sGroupTitle, sGroupName, "G43");

		sGroupTitle = "Group5";
		sGroupName = "G5";
		fCreateGroupItem(sGroupTitle, sGroupName, "G51");
		fCreateGroupItem(sGroupTitle, sGroupName, "G52");

		sGroupTitle = "";
		sGroupName = "G6";
		fCreateGroupItem(sGroupTitle, sGroupName, "G61");
		fCreateGroupItem(sGroupTitle, sGroupName, "G62");

		sGroupTitle = "Group7";
		sGroupName = "G7";
		fCreateGroupItem(sGroupTitle, sGroupName, "G71", "Sehr sehr sehr sehr sehr sehr langes Label");
		fCreateGroupItem(sGroupTitle, sGroupName, "G72");
		fCreateGroupItem(sGroupTitle, sGroupName, "G73");
		fCreateGroupItem(sGroupTitle, sGroupName, "G74");
	};

	//Basic area
	var fCreateMCBItem = function (sName, sLabel, bRequire, sWidth, bInvisible) {
		var oCtrl = null;
		var oFilterItem = new FilterItem();
		oFilterItem.setLabel(sLabel ? sLabel : ("Control" + sName));
		oCtrl = new MultiComboBox();

		if (sWidth) {
			oCtrl.setWidth(sWidth);
		} else {
			//oCtrl.setWidth("300px");
		}

		oFilterItem.setControl(oCtrl);
		oFilterItem.setName(sName);

		if (bRequire) {
			oFilterItem.setMandatory(bRequire);
		}

		if (bInvisible) {
			oFilterItem.setVisible(false);
		}

		that.oFilterBar.addFilterItem(oFilterItem);
		return oFilterItem;
	};

	var fCreateCBItem = function (sName, sLabel, bRequire, sWidth, bInvisible) {
		var oCtrl = null;
		var oFilterItem = new FilterItem();
		oFilterItem.setLabel(sLabel ? sLabel : ("Control" + sName));
		oCtrl = new ComboBox();

		if (sWidth) {
			oCtrl.setWidth(sWidth);
		} else {
			//oCtrl.setWidth("300px");
		}

		oFilterItem.setControl(oCtrl);
		oFilterItem.setName(sName);

		if (bRequire) {
			oFilterItem.setMandatory(bRequire);
		}

		if (bInvisible) {
			oFilterItem.setVisible(false);
		}

		oFilterBar.addFilterItem(oFilterItem);
		return oFilterItem;
	};

	this.bEmphFlag = false;

	//required if used in the sandbox environment
	window.sap.ushell = window.top.sap.ushell;

	var oFilterBar = that.oFilterBar;

	oFilterBar.setPersistencyKey("PersonalizationTest");

	oFilterBar.setShowClearButton(true);

	oFilterBar.registerFetchData(fFetchData);
	oFilterBar.registerApplyData(fApplyData);
	oFilterBar.registerGetFiltersWithValues(fGetFiltersWithValues);

	var oModel = new JSONModel({
		myVisible: false,
		myValue: "",
		myAAVisible: true,
		myAAValue: "",
		myGroupTitle: "Open Item Management",
		myGroupLabel: "Label",
		myLabel: "BALabel",
		valueOfA: "value of A",
		myVisibleFBA: true,
		myVisibleFBB: true,
		myMandBA: true,
		myMandAA: true
	});
	oFilterBar.setModel(oModel);

	this.oModel = oModel;

	oFilterBar.addStyleClass("sapUiSizeCompact");

	oFilterBar.attachClear(function () {
		oFilterBar.reset();
		//alert("Clear pressed");
	});

	oFilterBar.attachBeforeVariantSave(function () {
		//alert("BVA");
	});

	oFilterBar.attachAfterVariantLoad(function () {
		//alert("AVL");
	});

	oFilterBar.attachReset(function () {
		//alert("Reset pressed");
		//oFilterBar.clearVariantSelection();
		oFilterBar.setSearchButtonEmphType(true);
	});

	oFilterBar.setConsiderGroupTitle(true);

	fSetTestData();

	fAddSearchField();
	oFilterBar.setShowClearOnFB(true);

	oFilterBar.placeAt("content");

	oFilterBar.fireInitialise();

	/* --- Buttons --- */
	new Button("B1", { text: "Toggle Basic Field visibility", press: toggleBA.bind(this) }).placeAt("buttons");
	new Button("B2", { text: "Toggle Advanced Field visibility", press: toggleLabelRenameB.bind(this) }).placeAt("buttons");
	new Button("B3", { text: "Basic Label", press: toggleLabelRenameB.bind(this) }).placeAt("buttons");
	new Button("B4", { text: "Advanced Label", press: toggleLabelRenameA.bind(this) }).placeAt("buttons");
	new Button("B5", { text: "Group Title", press: toggleTitleRenameA.bind(this) }).placeAt("buttons");
	new Button("B6", { text: "toggle Advanced Mode", press: toggleAdvancedMode.bind(this) }).placeAt("buttons");
	new Button("B7", { text: "toggle expandAdvancedArea", press: toggleExpandAdvancedArea.bind(this) }).placeAt("buttons");
	new Button("B8", { text: "toggle Advanced Mode without Basic Search", press: toggleAdvancedMode1.bind(this) }).placeAt("buttons");
	new Button("B9", { text: "Single Selection", press: singleSelection.bind(this) }).placeAt("buttons");
	new Button("B10", { text: "Single Group", press: singleGroup.bind(this) }).placeAt("buttons");
	new Button("B11", { text: "Disable/Enable Button", press: fTriggerButtonState.bind(this) }).placeAt("buttons");
	new Button("B12", { text: "Determine Mandatory", press: fDetermineMandatory.bind(this) }).placeAt("buttons");
	new Button("B13", { text: "toggle ConsiderGroupTitle", press: fConsiderGroupTitle.bind(this) }).placeAt("buttons");
	new Button("B14", { text: "getCurrentVariantId", press: fgetCurrentVariantId.bind(this) }).placeAt("buttons");
	new Button("B15", { text: "setCurrentVariantId", press: fsetCurrentVariantId.bind(this) }).placeAt("buttons");
	new Button("B16", { text: "setCollectiveSearch", press: fsetCollectiveSearch.bind(this) }).placeAt("buttons");
	new Button("B17", { text: "noFilters", press: fsetNoFilters.bind(this) }).placeAt("buttons");
	new Button("B18", { text: "onlyNonVisibleOnFBFilters", press: fsetNonVisibleOnFBFilters.bind(this) }).placeAt("buttons");
	new ToggleButton("B19", {
		text: "Header",
		press: function (oEvent) {
			if (oEvent.getParameter("pressed")) {
				oFilterBar.setHeader("This is a Header");
			} else {
				oFilterBar.setHeader();
			}
		}
	}).placeAt("buttons");
	new ToggleButton("B20", {
		text: "BasicSearch",
		press: function (oEvent) {
			if (oEvent.getParameter("pressed")) {
				var oSearchField = new SearchField("mySearchField");
				oFilterBar._addBasicSearchToBasicArea(oSearchField);
			} else {
				oFilterBar._addBasicSearchToBasicArea();
			}
		}
	}).placeAt("buttons");
});