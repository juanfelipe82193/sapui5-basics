/* global QUnit sinon */
(function() {
	"use strict";

	QUnit.config.autostart = false;

	sap.ui.define([
		"sap/ui/comp/smartlist/SmartList", "sap/ui/comp/smartfilterbar/SmartFilterBar", "sap/m/List", "sap/m/Tree", "sap/m/StandardListItem", "sap/m/Button", "sap/m/Input", "sap/ui/model/json/JSONModel", "sap/m/Toolbar", "sap/m/OverflowToolbar", "sap/m/ToolbarSpacer", "sap/m/ToolbarSeparator", "sap/ui/model/Model"
	], function(SmartList, SmartFilterBar, List, Tree, StandardListItem, Button, Input, JSONModel, Toolbar, OverflowToolbar, ToolbarSpacer, ToolbarSeparator, Model) {

		QUnit.module("sap.ui.comp.smartlist.SmartList", {
			beforeEach: function() {
				this.oSmartList = new SmartList();
			},
			afterEach: function() {
				this.oSmartList.destroy();
			}
		});

		QUnit.test("Shall be instantiable", function(assert) {
			assert.ok(this.oSmartList);
		});

		QUnit.test("Shall have entitySet property", function(assert) {
			this.oSmartList.setEntitySet("foo");
			assert.strictEqual(this.oSmartList.getEntitySet(), "foo");
		});

		QUnit.test("Shall have listItemTemplate aggregation", function(assert) {
			var oTemplate = new StandardListItem();
			this.oSmartList.setListItemTemplate(oTemplate);
			assert.strictEqual(this.oSmartList.getListItemTemplate(), oTemplate);
		});

		QUnit.test("Shall have showRowCount property", function(assert) {
			this.oSmartList.setShowRowCount(true);
			assert.ok(this.oSmartList.getShowRowCount());

			this.oSmartList.setShowRowCount(false);
			assert.ok(!this.oSmartList.getShowRowCount());
		});

		QUnit.test("Shall have showFullScreenButton property", function(assert) {
			this.oSmartList.setShowFullScreenButton(true);
			assert.ok(this.oSmartList.getShowFullScreenButton());

			this.oSmartList.setShowFullScreenButton(false);
			assert.ok(!this.oSmartList.getShowFullScreenButton());
		});

		QUnit.test("Shall trigger initialiseMetadata when entitySet and model are both set", function(assert) {
			var sEntitySet = "COMPANYSet", oModel = new Model();

			sinon.spy(this.oSmartList, "_initialiseMetadata");
			sinon.spy(this.oSmartList, "_listenToSmartFilter");
			sinon.spy(this.oSmartList, "fireInitialise");

			this.oSmartList.setEntitySet(sEntitySet);
			this.oSmartList.setModel(oModel);

			assert.strictEqual(this.oSmartList.getModel(), oModel);
			assert.ok(this.oSmartList._initialiseMetadata.called);
			assert.ok(this.oSmartList._listenToSmartFilter.calledOnce);
			assert.ok(this.oSmartList.fireInitialise.calledOnce);
			assert.strictEqual(this.oSmartList.bIsInitialised, true);
		});

		QUnit.test("_listenToSmartFilter shall attach to search, filterChange and cancel events of the SmartFilterBar control", function(assert) {
			var sEntitySet = "COMPANYSet", oModel = new Model();
			var oSmartFilterBar = new SmartFilterBar("_smartListTestSFB");

			sinon.spy(this.oSmartList, "_listenToSmartFilter");
			sinon.spy(oSmartFilterBar, "attachSearch");
			sinon.spy(oSmartFilterBar, "attachFilterChange");
			sinon.spy(oSmartFilterBar, "attachCancel");

			this.oSmartList.setSmartFilter("_smartListTestSFB");
			this.oSmartList.setEntitySet(sEntitySet);
			this.oSmartList.setModel(oModel);

			assert.strictEqual(this.oSmartList.getModel(), oModel);
			assert.strictEqual(this.oSmartList._oSmartFilter, oSmartFilterBar);
			assert.ok(oSmartFilterBar.attachSearch.called);
			assert.ok(oSmartFilterBar.attachFilterChange.called);
			assert.ok(oSmartFilterBar.attachCancel.called);
			assert.ok(this.oSmartList._listenToSmartFilter.calledOnce);

			oSmartFilterBar.destroy();
		});

		QUnit.test("search, filterChange and cancel events of the SmartFilterBar - shall trigger methods in SmartList", function(assert) {
			var sEntitySet = "COMPANYSet", oModel = new Model();
			var oSmartFilterBar = new SmartFilterBar("_smartListTestSFB", {
				liveMode: false
			});

			var fBindStub = sinon.stub(this.oSmartList._oList, "bindItems");
			sinon.spy(this.oSmartList, "_filterChangeEvent");
			sinon.spy(this.oSmartList, "_cancelEvent");
			sinon.spy(this.oSmartList, "_reBindList");

			this.oSmartList.setSmartFilter("_smartListTestSFB");
			this.oSmartList.setEntitySet(sEntitySet);
			this.oSmartList.setModel(oModel);
			this.oSmartList._bIsListBound = true;

			assert.strictEqual(this.oSmartList.getModel(), oModel);
			assert.strictEqual(this.oSmartList._oSmartFilter, oSmartFilterBar);
			assert.ok(this.oSmartList._filterChangeEvent.notCalled);
			assert.ok(this.oSmartList._cancelEvent.notCalled);
			assert.ok(this.oSmartList._reBindList.notCalled);
			assert.ok(fBindStub.notCalled);

			// Test filterChange
			oSmartFilterBar.fireFilterChange();
			assert.ok(this.oSmartList._filterChangeEvent.calledOnce);

			// Test Cancel
			oSmartFilterBar.fireCancel();
			assert.ok(this.oSmartList._cancelEvent.calledOnce);

			// Test search
			oSmartFilterBar.fireSearch();
			assert.ok(this.oSmartList._reBindList.calledOnce);
			assert.ok(fBindStub.calledOnce);

			oSmartFilterBar.destroy();
		});

		QUnit.test("enableAutoBinding (_checkAndTriggerBinding) shall either trigger search on SmartFilter or _rebindList directly on initialise", function(assert) {
			var sEntitySet = "COMPANYSet", oModel = new Model();
			var oSmartFilterBar = new SmartFilterBar("_smartListTestSFB");

			var fBindStub = sinon.stub(this.oSmartList._oList, "bindItems");
			sinon.spy(this.oSmartList, "_reBindList");
			sinon.spy(oSmartFilterBar, "search");

			this.oSmartList.setSmartFilter("_smartListTestSFB");
			this.oSmartList.setEntitySet(sEntitySet);
			this.oSmartList.setModel(oModel);

			this.oSmartList._checkAndTriggerBinding();
			assert.strictEqual(this.oSmartList.getModel(), oModel);
			assert.strictEqual(this.oSmartList._oSmartFilter, oSmartFilterBar);
			assert.ok(oSmartFilterBar.search.notCalled);
			assert.ok(this.oSmartList._reBindList.notCalled);
			assert.ok(fBindStub.notCalled);

			// SmartFilter exists --> trigger search
			this.oSmartList._bAutoBindingTriggered = false;
			this.oSmartList.setEnableAutoBinding(true);
			this.oSmartList._checkAndTriggerBinding();
			assert.ok(oSmartFilterBar.search.calledOnce);
			assert.ok(this.oSmartList._reBindList.notCalled);
			assert.ok(fBindStub.notCalled);

			// reset sinon spy/stubs
			oSmartFilterBar.search.reset();
			this.oSmartList._reBindList.reset();
			fBindStub.reset();

			// SmartFilter does not exist --> trigger _rebindList
			this.oSmartList._oSmartFilter = null;
			this.oSmartList._bAutoBindingTriggered = false;
			this.oSmartList.setEnableAutoBinding(true);
			this.oSmartList._checkAndTriggerBinding();
			assert.ok(oSmartFilterBar.search.notCalled);
			assert.ok(this.oSmartList._reBindList.calledOnce);
			assert.ok(fBindStub.calledOnce);

			oSmartFilterBar.destroy();
		});

		QUnit.test("test _getRowCount function", function(assert) {
			var currentLength = 10;
			var oRowBinding = {
				getLength: function() {
					return currentLength;
				}
			};
			this.oSmartList._getRowBinding = function() {
				return oRowBinding;
			};

			var oResult = this.oSmartList._getRowCount();

			assert.strictEqual(oResult, 10, "row count has to be returned correctly");

			currentLength = -100;
			oResult = this.oSmartList._getRowCount();
			assert.strictEqual(oResult, 0, "negative row count has to be defaulted to 0");

			currentLength = 10;
			oRowBinding = {
				getTotalSize: function() {
					return currentLength;
				}
			};

			oResult = this.oSmartList._getRowCount();
			assert.strictEqual(oResult, 10, "total size has to be used if available");

			currentLength = "0";
			oResult = this.oSmartList._getRowCount();
			assert.strictEqual(oResult, 0, "row count has to be returned correctly");
			assert.strictEqual(typeof oResult, "number", "row count has to be returned as number");
		});

		QUnit.test("_createToolbar and _createToolbarContent shall create toolbars", function(assert) {
			this.oSmartList._createToolbar();
			this.oSmartList.bIsInitialised = true;
			this.oSmartList._createToolbarContent();
			assert.ok(this.oSmartList._oToolbar, "toolbar should always be created");
			assert.strictEqual(this.oSmartList._oToolbar.getContent().length, 2, "toolbar should contain 2 entries - Spacer and the header");

			assert.ok(this.oSmartList._oToolbar.hasStyleClass("sapMTBHeader-CTX"), "default toolbar height shall be set from 'sapMTBHeader-CTX'");
		});

		QUnit.test("_createToolbar and _createToolbarContent shall create toolbars - custom toolbar", function(assert) {
			this.oSmartList._oToolbar.removeAllContent();
			this.oSmartList._oToolbar.destroy();
			this.oSmartList._oToolbar = null;

			var oToolbar = new OverflowToolbar();
			oToolbar.addContent(new Button({
				text: "dummy"
			}));
			this.oSmartList.insertItem(oToolbar, 0);

			// Test create
			this.oSmartList._createToolbar();
			this.oSmartList.bIsInitialised = true;
			this.oSmartList._createToolbarContent();
			assert.ok(this.oSmartList._oToolbar, "toolbar should always be created");
			assert.strictEqual(this.oSmartList._oToolbar.getContent().length, 3, "custom toolbar should contain 3 entries - Custom button from app, Spacer and the header from SmartList");
			assert.strictEqual(this.oSmartList._oToolbar, oToolbar, "toolbar is same as the one in the content/items aggregation");

			assert.ok(this.oSmartList._oToolbar.hasStyleClass("sapMTBHeader-CTX"), "default toolbar height shall be set from 'sapMTBHeader-CTX'");
		});

		QUnit.test("test header text features", function(assert) {
			this.oSmartList.bIsInitialised = true;

			var sHeaderText = "myTestHeader";
			this.oSmartList.setHeader(sHeaderText);
			assert.equal(this.oSmartList.getHeader(), sHeaderText, "header text has to be equal");

			this.oSmartList.setShowRowCount(true);
			this.oSmartList._createToolbar();
			this.oSmartList._createToolbarContent();
			assert.equal(this.oSmartList.getHeader(), sHeaderText, "header text has to be equal");
			assert.equal(this.oSmartList._headerText.getText(), sHeaderText + " (0)", "header text has to contain row count");
		});

		QUnit.test("test add Spacer", function(assert) {
			this.oSmartList._createToolbar();
			this.oSmartList._addSpacerToToolbar();

			assert.equal(this.oSmartList._oToolbar.getContent().length, 1, "one item has to be added to the toolbar");
			assert.ok(this.oSmartList._oToolbar.getContent()[0] instanceof ToolbarSpacer, "ToolbarSpacer has to be added to toolbar");
		});

		QUnit.test("test getList function", function(assert) {
			var oDummyList = {};
			this.oSmartList._oList = oDummyList;

			assert.equal(this.oSmartList.getList(), oDummyList, "getList should retrieve internal list");
		});

		QUnit.test("test _addFullScreenButton function", function(assert) {
			this.oSmartList.setShowFullScreenButton(true);
			var oAddToToolbar = null;
			this.oSmartList._oToolbar = {
				addContent: function(oObject) {
					oAddToToolbar = oObject;
				}
			};

			this.oSmartList._addFullScreenButton();
			assert.ok(oAddToToolbar instanceof Button, "Fullscreen button should have been added to toolbar");

			oAddToToolbar.firePress();
			assert.equal(oAddToToolbar.getIcon(), "sap-icon://exit-full-screen", "SmartList is in Maximized mode");

			oAddToToolbar.firePress();
			assert.equal(oAddToToolbar.getIcon(), "sap-icon://full-screen", "SmartList is in Minimized mode");
		});

		QUnit.test("test rebindList function", function(assert) {
			var oBindingParameters = null;
			var bBeforeRebindCalled = false;
			var bPreventBinding;

			var fBindStub = sinon.stub(this.oSmartList._oList, "bindItems");

			this.oSmartList._getRowCount = function() {
				return 0;
			};

			this.oSmartList.attachBeforeRebindList(function(oParams) {
				bBeforeRebindCalled = true;
				oParams.getParameter("bindingParams").preventListBind = bPreventBinding;
				oParams.getParameter("bindingParams").parameters["select"] = [
					"foo"
				];
			});

			bPreventBinding = true;
			this.oSmartList.rebindList();

			assert.ok(bBeforeRebindCalled, "before rebind has been called");
			assert.ok(!this.oSmartList._bIsListBound, "list is unbound because of prevent binding");
			// busy handling is done by UI5 ListBase
			assert.ok(this.oSmartList._oList.getEnableBusyIndicator(), "automatic list busy flag is enabled");

			bPreventBinding = false;
			this.oSmartList.rebindList();

			assert.ok(this.oSmartList._bIsListBound, "list has been bound");
			assert.ok(this.oSmartList._oList.getEnableBusyIndicator(), "automatic list busy flag is enabled");
			assert.ok(fBindStub.calledOnce, "binding triggered on the internal list");

			oBindingParameters = fBindStub.args[0][0];

			assert.ok(oBindingParameters, "binding parameters are set");

			oBindingParameters.events.dataReceived();

			assert.ok(this.oSmartList._oList.getEnableBusyIndicator(), "automatic list busy flag is enabled");
		});

		QUnit.test("test _isListBound function", function(assert) {
			assert.ok(!this.oSmartList._isListBound(), "list has not yet been bound");
			// simulate that at least 1 field exists!
			this.oSmartList.attachBeforeRebindList(function(oParams) {
				oParams.getParameter("bindingParams").parameters["select"] = [
					"foo"
				];
			});
			// Set a default template (required for SmartList!)
			this.oSmartList._oTemplate = new StandardListItem();

			// bind via SmartList API
			this.oSmartList.rebindList();
			assert.ok(this.oSmartList._isListBound(), "list has now been bound");
			// unbind the list
			this.oSmartList._bIsListBound = false;
			var oList = this.oSmartList.getList();
			oList.unbindItems();
			assert.ok(!this.oSmartList._isListBound(), "list has not been bound");
			// bind directly to simulate external binding
			oList.bindItems({
				path: "/foo",
				template: this.oSmartList._oTemplate
			});
			assert.ok(this.oSmartList._isListBound(), "list has been bound");
		});

		QUnit.test("test _createList function", function(assert) {
			this.oSmartList.removeAllItems();
			if (this.oSmartList._oList) {
				this.oSmartList._oList.destroy();
			}
			this.oSmartList._oList = null;

			assert.strictEqual(this.oSmartList.getList(), null, "list has not yet been created");

			var oList = new List();
			this.oSmartList.insertItem(oList);

			this.oSmartList._createList();
			assert.strictEqual(this.oSmartList.getList(), oList, "existing list from items was used");

			this.oSmartList.removeAllItems();
			if (this.oSmartList._oList) {
				this.oSmartList._oList.destroy();
			}
			this.oSmartList._oList = null;

			this.oSmartList._createList();
			assert.ok(this.oSmartList.getList() instanceof List, "list has to be created when no list exists in items");
		});

		QUnit.test("test _createList function based on listType", function(assert) {
			this.oSmartList.removeAllItems();
			if (this.oSmartList._oList) {
				this.oSmartList._oList.destroy();
			}
			this.oSmartList._oList = null;

			assert.strictEqual(this.oSmartList.getList(), null, "list has not yet been created");

			this.oSmartList.setListType("Tree");
			var oList = new List();
			this.oSmartList.insertItem(oList);

			this.oSmartList._createList();
			assert.strictEqual(this.oSmartList.getList(), oList, "existing list from items was used, instead of listType");

			this.oSmartList.removeAllItems();
			if (this.oSmartList._oList) {
				this.oSmartList._oList.destroy();
			}
			this.oSmartList._oList = null;

			this.oSmartList._createList();
			assert.ok(this.oSmartList.getList() instanceof Tree, "list has to be created based on listType, when no list exists in items");
		});

		QUnit.test("Destroy for List without binding", function(assert) {
			var bListTemplateDestroyed = false;
			this.oSmartList._oTemplate = {
				destroy: function() {
					bListTemplateDestroyed = true;
				}
			};

			assert.equal(this.oSmartList.bIsDestroyed, undefined);
			assert.ok(!bListTemplateDestroyed, "list template exits");
			this.oSmartList.destroy();
			assert.equal(this.oSmartList._oTemplate, null);
			assert.strictEqual(this.oSmartList.bIsDestroyed, true);
			assert.ok(bListTemplateDestroyed, "list template has to be destroyed");
		});

		QUnit.test("Destroy", function(assert) {
			assert.equal(this.oSmartList.bIsDestroyed, undefined);
			this.oSmartList.destroy();
			assert.equal(this.oSmartList._oList, null);
			assert.strictEqual(this.oSmartList.bIsDestroyed, true);
		});

		QUnit.start();
	});

})();
