/* globals QUnit, sinon */

QUnit.config.autostart = false;

sap.ui.define([], function() {
	"use strict";

	sap.ui.require([
		'sap/ui/comp/variants/VariantItem',
		'sap/ui/comp/smartvariants/SmartVariantManagement',
		'sap/ui/comp/smartvariants/PersonalizableInfo',
		'sap/ui/fl/Change',
		'sap/ui/fl/apply/api/SmartVariantManagementApplyAPI',
		'sap/ui/fl/apply/api/FlexRuntimeInfoAPI',
		'sap/ui/fl/write/api/SmartVariantManagementWriteAPI',
		'sap/ui/core/Control'

	], function(
		VariantItem,
		SmartVariantManagement,
		PersonalizableInfo,
		Change,
		FlexApplyAPI,
		FlexRuntimeInfoAPI,
		FlexWriteAPI,
		Control
	) {

		function createChangeStub(sName, oContent) {
			var oObj = {
				fileName: sName,
				fileType: "fileType",
				changeType: "changeType",
				layer: "USER",
				originalLanguage: "DE",
				texts: {
					variantName: {
						value: "",
						type: ""
					}
				},
				content: oContent || {}
			};

			var oChange = new Change(oObj, function(assert) {
			});
			sinon.stub(oChange, "isReadOnly").returns(false);
			sinon.stub(oChange, "isVariant").returns(true);

			return oChange;
		}

		function createChangeStubs() {
			var mChanges = {};
			var oChange1 = createChangeStub("1");
			sinon.stub(oChange1, "getText").returns("ONE");
			mChanges[oChange1.getId()] = oChange1;

			var oChange2 = createChangeStub("2");
			oChange2.setContent({
				data: "TEST",
				standardvariant: true
			});
			sinon.stub(oChange2, "getText").returns("TWO");
			mChanges[oChange2.getId()] = oChange2;

			var oChange3 = createChangeStub("3");
			oChange3.setContent({
				executeOnSelection: true
			});
			sinon.stub(oChange3, "getText").returns("THREE");
			mChanges[oChange3.getId()] = oChange3;

			return mChanges;
		}

		var oStubGetChange;
		var oStubAddChange;
		var oStubGetExecuteOnSelect;
		var oStubLoadChanges;
		var oStubIsVariantSharingEnabled;
		var oStubIsApplicationVariant;
		var oStubSave;
		var oStubGetDefaultVariantId;
		function stubGetChange(oControl, mChanges) {
			if (!(FlexApplyAPI && FlexApplyAPI.getChangeById && FlexApplyAPI.getChangeById.displayName === "getChangeById")) {
				oStubGetChange = sinon.stub(FlexApplyAPI, "getChangeById");
			}
			Object.keys(mChanges).forEach(function (sKey) {
				oStubGetChange.withArgs({control: oControl, id: sKey}).returns(mChanges[sKey]);
			});
		}

		function stubLoadChanges(oValue) {
			if (!(FlexApplyAPI && FlexApplyAPI.loadChanges && FlexApplyAPI.loadChanges.displayName === "loadChanges")) {
				oStubLoadChanges = sinon.stub(FlexApplyAPI, "loadChanges");
			}
			oStubLoadChanges.returns(oValue);
		}

		function stubIsVariantSharingEnabled(bValue) {
			if (!(FlexApplyAPI && FlexApplyAPI.isVariantSharingEnabled && FlexApplyAPI.isVariantSharingEnabled.displayName === "isVariantSharingEnabled")) {
				oStubIsVariantSharingEnabled = sinon.stub(FlexApplyAPI, "isVariantSharingEnabled");
			}
			oStubIsVariantSharingEnabled.returns(bValue);
		}

		function stubIsApplicationVariant(bValue) {
			if (!(FlexApplyAPI && FlexApplyAPI.isApplicationVariant && FlexApplyAPI.isApplicationVariant.displayName === "isApplicationVariant")) {
				oStubIsApplicationVariant = sinon.stub(FlexApplyAPI, "isApplicationVariant");
			}
			oStubIsApplicationVariant.returns(bValue);
		}

		function stubAddChange(sNewId) {
			if (!(FlexWriteAPI && FlexWriteAPI.add && FlexWriteAPI.add.displayName === "add")) {
				oStubAddChange = sinon.stub(FlexWriteAPI, "add");
			}
			oStubAddChange.returns(sNewId);
		}

		function stubSave(oValue) {
			if (!(FlexWriteAPI && FlexWriteAPI.save && FlexWriteAPI.save.displayName === "save")) {
				oStubSave = sinon.stub(FlexWriteAPI, "save");
			}
			oStubSave.returns(oValue);
		}

		function stubGetExecuteOnSelect(bValue) {
			if (!(FlexApplyAPI && FlexApplyAPI.getExecuteOnSelect && FlexApplyAPI.getExecuteOnSelect.displayName === "getExecuteOnSelect")) {
				oStubGetExecuteOnSelect = sinon.stub(FlexApplyAPI, "getExecuteOnSelect");
			}
			oStubGetExecuteOnSelect.returns(bValue);
		}

		function stubGetDefaultVariantId(bValue) {
			if (!(FlexApplyAPI && FlexApplyAPI.getExecuteOnSelect && FlexApplyAPI.getDefaultVariantId.displayName === "getDefaultVariantId")) {
				oStubGetDefaultVariantId = sinon.stub(FlexApplyAPI, "getDefaultVariantId");
			}
			oStubGetDefaultVariantId.returns(bValue);
		}
		function fakeResolved(value) {
			// return Promise.resolve(value);
			return {
				then: function(callback, fail) {
					var oObj = value;
					callback(oObj);
				},
				fail: function(callback) {
					callback();
				}
			};
		}

		var ControlForTest = Control.extend("sap.ui.ControlForTest", {
			metadata: {
				_sOwnerId: "testId",
				properties: {
					key: "string",
					persistencyKey: "string"
				},
				events: {
					beforeVariantSave: {},
					afterVariantLoad: {
						parameters: {
							sContext: {
								type: "string"
							}
						}
					}
				}
			},
			fetchVariant: function() {
				return {
					id: "ID",
					test: "TEST"
				};
			},
			applyVariant: function(oVariant, sContext) {
				this._applyedData = oVariant;

				var oEvent = {
					context: sContext
				};
				this.fireEvent("afterVariantLoad", oEvent);
			},

			_getApplyedData: function() {
				return this._applyedData;
			},

			_initialized: function() {
			},

			fireBeforeVariantSave: function(s) {
				var oEvent = {
					context: s
				};
				this.fireEvent("beforeVariantSave", oEvent);
			}
		});

		function createControlInfo(oVariantManagement, sKey, bDoNotStub) {

			if (!sKey) {
				sKey = "4711";
			}

			if (!bDoNotStub) {
				oVariantManagement._oPersistencyPromise = Promise.resolve();
				sinon.stub(oVariantManagement, "_handleGetChanges");
			}

			var oControl = new ControlForTest({
				key: sKey,
				persistencyKey: "SmartVariant"
			});
			var oPersControlInfo = new PersonalizableInfo({
				type: "TYPE",
				dataSource: "DATA_SOURCE",
				keyName: "key"
			});
			oPersControlInfo.setControl(oControl);

			oVariantManagement.addPersonalizableControl(oPersControlInfo);

			return oPersControlInfo;
		}

		QUnit.module("sap.ui.comp.smartvariants.SmartVariantManagement", {
			beforeEach: function() {
				this.oVariantManagement = new SmartVariantManagement({
					showShare: true
				});
				stubIsApplicationVariant(false);
				sinon.stub(FlexRuntimeInfoAPI, "isFlexSupported").returns(true);
			},
			afterEach: function() {
				this.oVariantManagement.destroy();
				FlexRuntimeInfoAPI.isFlexSupported.restore();
				FlexApplyAPI.isApplicationVariant.restore();
			}
		});

		QUnit.test("Shall be instantiable", function(assert) {
			assert.ok(this.oVariantManagement);
		});

		QUnit.test("Exit shall be called", function(assert) {
			var oVariantManagement = new SmartVariantManagement();
			sinon.spy(oVariantManagement, "exit");
			oVariantManagement.destroy();
			assert.ok(oVariantManagement.exit.called, "expecting 'exit' to be called");
		});

		QUnit.test("check _dataReceived", function(assert) {

			var done = assert.async();

			var mChanges = createChangeStubs();
			var oPersControlInfo = createControlInfo(this.oVariantManagement);
			var oControl = sap.ui.getCore().getControl(oPersControlInfo.getControl());

			var aArray = null;
			var fCallBack = function(oEvent) {
				aArray = oEvent.getParameters().variantKeys;
			};

			this.oVariantManagement.attachInitialise(fCallBack);

			var sContext = null;
			var fBeforeSave = function(oEvent) {
				sContext = oEvent.getParameters().context;
			};
			oControl.attachBeforeVariantSave(fBeforeSave);

			sinon.stub(this.oVariantManagement, "_getExecuteOnSelectOnStandardVariant").returns(null);
			sinon.spy(this.oVariantManagement, "getStandardVariant");
			sinon.spy(this.oVariantManagement, "_createVariantEntries");
			sinon.spy(this.oVariantManagement, "fireEvent");
			stubGetDefaultVariantId("*standard*");
			stubAddChange("newId");

			// Move the follwoing part at the end of the async processing
			setTimeout(function() {
				stubGetChange(oControl, mChanges);
				this.oVariantManagement._dataReceived(mChanges, false, this.oVariantManagement._getControlWrapper(this.oVariantManagement._oPersoControl));

				assert.ok(sContext === "STANDARD");

				assert.ok(this.oVariantManagement._createVariantEntries.called, "expecting '_createVariantEntries' to be called");
				assert.ok(this.oVariantManagement.getVariantItems());
				assert.equal(this.oVariantManagement.getVariantItems().length, 3, "expecting three entries");

				assert.ok(this.oVariantManagement.fireEvent.calledOnce); // initialise
				assert.ok(aArray);
				assert.equal(aArray.length, 3);
				assert.equal(aArray[0], "1");
				assert.equal(aArray[1], "2");
				assert.equal(aArray[2], "3");

				assert.ok(!this.oVariantManagement.getShowShare());
				done();
			}.bind(this), 0);
		});

		QUnit.test("check getVariantContent/_getExecuteOnSelection", function(assert) {
			var mChanges = createChangeStubs();
			var oPersControlInfo = createControlInfo(this.oVariantManagement);
			var oControl = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			//Give some time to load flex
			return this.oVariantManagement._loadFlex().then(function() {
				stubGetChange(oControl, mChanges);

				var oObj = this.oVariantManagement.getVariantContent(oControl, "2");

				assert.ok(oObj);
				assert.equal(oObj.data, "TEST");

				var v = this.oVariantManagement._getChange("2");
				assert.equal(this.oVariantManagement._getExecuteOnSelection(v), false);

				v = this.oVariantManagement._getChange("3");
				assert.equal(this.oVariantManagement._getExecuteOnSelection(v), true);
			}.bind(this));
		});

		QUnit.test("check fetch/apply standard variant without promises", function(assert) {

			var oPersControlInfo = createControlInfo(this.oVariantManagement);
			var oControl = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			return this.oVariantManagement._loadFlex().then(function() {
				sinon.spy(oControl, "fetchVariant");
				sinon.spy(oControl, "applyVariant");

				sinon.stub(this.oVariantManagement, "_createVariantEntries");
				sinon.stub(this.oVariantManagement, "_getExecuteOnSelectOnStandardVariant").returns(null);
				sinon.stub(this.oVariantManagement, "_getDefaultVariantKey").returns("*standard*");
				this.oVariantManagement._dataReceived({}, null, this.oVariantManagement._getControlWrapper(this.oVariantManagement._oPersoControl));

				this.oVariantManagement.fireSelect({
					key: this.oVariantManagement.STANDARDVARIANTKEY
				}); // apply

				assert.ok(oControl.fetchVariant.calledOnce);
				assert.ok(oControl.applyVariant.calledOnce);

				var oObj = oControl._getApplyedData();
				assert.equal(oObj.id, "ID");
				assert.equal(oObj.test, "TEST");
			}.bind(this));
		});

		QUnit.test("check fireSave", function(assert) {

			sinon.stub(this.oVariantManagement, "_newVariant");
			sinon.stub(this.oVariantManagement, "_updateVariant");

			var bCalled = false;
			this.oVariantManagement.attachSave(function() {
				bCalled = true;
			});

			this.oVariantManagement.fireSave({
				overwrite: true,
				key: "1",
				name: "V1"
			});

			assert.ok(bCalled);
			assert.ok(this.oVariantManagement._updateVariant.calledOnce);
			assert.ok(!this.oVariantManagement._newVariant.called);


			this.oVariantManagement._newVariant.reset();
			this.oVariantManagement._updateVariant.reset();

			bCalled = false;
			this.oVariantManagement.fireSave({
				overwrite: false,
				key: "1",
				name: "V1"
			});
			assert.ok(bCalled);
			assert.ok(!this.oVariantManagement._updateVariant.called);
			assert.ok(this.oVariantManagement._newVariant.calledOnce);
		});

		QUnit.test("check fireSave with standard variant", function(assert) {

			sinon.stub(this.oVariantManagement, "_newVariant");
			sinon.stub(this.oVariantManagement, "_updateVariant");
			sinon.stub(this.oVariantManagement, "_save");

			this.oVariantManagement.fireSave({
				overwrite: true,
				key: this.oVariantManagement.STANDARDVARIANTKEY,
				name: "V1"
			});

			assert.ok(!this.oVariantManagement._newVariant.called);
			assert.ok(!this.oVariantManagement._updateVariant.called);
			assert.ok(!this.oVariantManagement._save.called);
		});

		QUnit.test("check fireSelect", function(assert) {
			createControlInfo(this.oVariantManagement);

			var oVariant = {
				getContent: function() {
					return "CONTENT";
				}
			};

			sinon.stub(this.oVariantManagement, "_getChange").returns(oVariant);
			sinon.stub(this.oVariantManagement, "_applyVariant");
			sinon.stub(this.oVariantManagement, "getStandardVariant");

			this.oVariantManagement.fireSelect({
				key: "1"
			});

			assert.ok(this.oVariantManagement._applyVariant.calledOnce);
			assert.ok(!this.oVariantManagement.getStandardVariant.called);
		});

		QUnit.test("check fireSelect with standard variant", function(assert) {
			createControlInfo(this.oVariantManagement);

			sinon.stub(this.oVariantManagement, "_getChange");
			sinon.stub(this.oVariantManagement, "_applyVariant");
			sinon.stub(this.oVariantManagement, "getStandardVariant").returns({});

			this.oVariantManagement.fireSelect({
				key: this.oVariantManagement.STANDARDVARIANTKEY
			});

			assert.ok(this.oVariantManagement._applyVariant.calledOnce);
			assert.ok(this.oVariantManagement.getStandardVariant.calledOnce);
			assert.ok(!this.oVariantManagement._getChange.called);
		});

		QUnit.test("check fireManage", function(assert) {
			createControlInfo(this.oVariantManagement);

			var bManageFired = false;
			this.oVariantManagement.attachManage(function(oEvent) {
				bManageFired = true;
			});

			sinon.stub(this.oVariantManagement, "_renameVariant");
			sinon.stub(this.oVariantManagement, "_deleteVariants");
			sinon.stub(this.oVariantManagement, "_setDefaultVariantKey");
			sinon.stub(this.oVariantManagement, "_save");

			var oInfo = {
				deleted: [
					{
						key: "1"
					}
				],
				renamed: [
					{
						key: "2",
						name: "V1"
					}
				],
				def: [
					{
						key: "1"
					}
				]
			};

			var bCalled = false;
			this.oVariantManagement.attachSave(function() {
				bCalled = true;
			});

			this.oVariantManagement.fireManage(oInfo);

			assert.ok(!bCalled);
			assert.ok(this.oVariantManagement._renameVariant.calledOnce);
			assert.ok(this.oVariantManagement._deleteVariants.calledOnce);
			assert.ok(this.oVariantManagement._setDefaultVariantKey.calledOnce);

			assert.ok(bManageFired);
		});

		QUnit.test("check addPersonalizableControl ", function(assert) {

			var oSetPersControler = sinon.stub(this.oVariantManagement, "setPersControler");

			var oControl = new ControlForTest({
				key: "4711"
			});
			var oPersControlInfo = new PersonalizableInfo({
				type: "TYPE",
				dataSource: "DATA_SOURCE",
				keyName: "key"
			});
			oPersControlInfo.setControl(oControl);

			this.oVariantManagement.addPersonalizableControl(oPersControlInfo);

			assert.ok(oSetPersControler.calledOnce);
		});

		QUnit.test("check getVariantContent  ", function(assert) {

			var mChanges = createChangeStubs();
			var oPersControlInfo = createControlInfo(this.oVariantManagement);
			var oControl = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			return this.oVariantManagement._loadFlex().then(function() {
				this.oVariantManagement._oPersoControl = oControl;
				stubGetChange(oControl, mChanges);
				var oContent = this.oVariantManagement.getVariantContent(oControl, "2");
				assert.ok(oContent);
				assert.ok(oContent.data);
				assert.equal(oContent.data, "TEST");
			}.bind(this));
		});

		QUnit.test("check fireSave: _updateVariant", function(assert) {

			var mChanges = createChangeStubs();
			var oPersControlInfo = createControlInfo(this.oVariantManagement);
			var oControl = sap.ui.getCore().getControl(oPersControlInfo.getControl());

			return this.oVariantManagement._loadFlex().then(function() {
				this.oVariantManagement._oPersoControl = oControl;
				stubGetChange(oControl, mChanges);
				sinon.stub(oControl, "fetchVariant").returns({
					data: "MY TEST"
				});
				sinon.stub(this.oVariantManagement, "_save");

				var oItem = {
					getExecuteOnSelection: function(sKey) {
						return true;
					}
				};

				sinon.stub(this.oVariantManagement, "getItemByKey").returns(oItem);

				var oInfo = {
					key: "2",
					overwrite: true
				};
				this.oVariantManagement.fireSave(oInfo);
				var oContent = this.oVariantManagement.getVariantContent(oControl, oInfo.key);
				assert.ok(oContent);
				assert.ok(oContent.data);
				assert.equal(oContent.data, "MY TEST");
				assert.equal(oContent.executeOnSelection, true);

				assert.ok(this.oVariantManagement._save.calledOnce);
			}.bind(this));
		});

		QUnit.test("check fireSave: _newVariant ", function(assert) {

			var mChanges = createChangeStubs();
			var oPersControlInfo = createControlInfo(this.oVariantManagement);
			var oControl = sap.ui.getCore().getControl(oPersControlInfo.getControl());

			return this.oVariantManagement._loadFlex().then(function() {
				this.oVariantManagement._oPersoControl = oControl;
				stubGetChange(oControl, mChanges);
				var oVariantContent = {
					data: "MY NEW TEST",
					executeOnSelection : true
				};
				stubAddChange("newId");
				oStubGetChange.withArgs({control: oControl, id: "newId"}).returns({
					getContent : function () {
						return oVariantContent;
					},
					setRequest : function () {
						return;
					},
					getNamespace : function () {
						return "sampleNamespace";
					}
				});
				sinon.stub(oControl, "fetchVariant").returns(oVariantContent);
				sinon.stub(this.oVariantManagement, "_save");

				sinon.stub(this.oVariantManagement, "_setDefaultVariantKey");

				var oInfo = {
					key: "oldId",
					lifecyclePackage: "PACKAGE",
					lifecycleTransportId: "TRANSPORT_ID",
					exe: true,
					def: true
				};

				var oVariantItem = new VariantItem({
					key: oInfo.key,
					lifecycleTransportId: oInfo.lifecycleTransportId,
					lifecyclePackage: oInfo.lifecyclePackage
				});
				this.oVariantManagement.addVariantItem(oVariantItem);

				this.oVariantManagement.fireSave(oInfo);

				assert.ok(oVariantItem.getKey() !== oInfo.key);

				var oContent = this.oVariantManagement.getVariantContent(oControl, oVariantItem.getKey());
				assert.ok(oContent);
				assert.ok(oContent.data);
				assert.equal(oContent.data, "MY NEW TEST");

				assert.ok(oContent.executeOnSelection);
				assert.equal(oContent.executeOnSelection, true);

				assert.ok(this.oVariantManagement._save.calledOnce);
				assert.ok(this.oVariantManagement._setDefaultVariantKey.calledOnce);
			}.bind(this));

		});

		QUnit.test("check fireSave: _newVariant with invalid key", function(assert) {

			var oPersControlInfo = createControlInfo(this.oVariantManagement);
			var oControl = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			sinon.stub(oControl, "fetchVariant").returns({
				data: "MY NEW TEST"
			});
			sinon.stub(this.oVariantManagement, "_save");
			sinon.stub(this.oVariantManagement, "_setDefaultVariantKey");

			var oInfo = {
				key: "oldId",
				implicit: true,
				def: true
			};

			assert.equal(this.oVariantManagement.getVariantItems().length, 0);
			this.oVariantManagement.fireSave(oInfo);

			assert.equal(this.oVariantManagement.getVariantItems().length, 1);
			assert.ok(this.oVariantManagement.getVariantItems()[0].getKey() !== oInfo.key);

		});

		QUnit.test("check fireSave: _newVariant implicit", function(assert) {

			var oPersControlInfo = createControlInfo(this.oVariantManagement);
			var oControl = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			sinon.stub(oControl, "fetchVariant").returns({
				data: "MY NEW TEST"
			});
			sinon.stub(this.oVariantManagement, "_save");
			sinon.stub(this.oVariantManagement, "_setDefaultVariantKey");

			var oInfo = {
				key: undefined, //or null
				implicit: true,
				def: true
			};

			assert.equal(this.oVariantManagement.getVariantItems().length, 0);
			assert.ok(!this.oVariantManagement.getCurrentVariantId());
			this.oVariantManagement.fireSave(oInfo);

			assert.equal(this.oVariantManagement.getVariantItems().length, 1);
			assert.ok(this.oVariantManagement.getVariantItems()[0].getKey() !== oInfo.key);
			assert.ok(this.oVariantManagement.getCurrentVariantId());
		});

		QUnit.test("check fireSave: _save", function(assert) {
			return this.oVariantManagement._loadFlex().then(function() {
				createControlInfo(this.oVariantManagement);
				stubSave(fakeResolved());
				this.oVariantManagement._save();

				assert.ok(oStubSave.calledOnce);
			}.bind(this));
		});

		QUnit.test("check fireManage: _deleteVariants", function(assert) {
			createControlInfo(this.oVariantManagement);

			var sDefaultKey = null;
			this.oVariantManagement._setDefaultVariantKey = function(sKey) {
				sDefaultKey = sKey;
			};
			sinon.stub(this.oVariantManagement, "_getDefaultVariantKey").returns("2");
			sinon.stub(this.oVariantManagement, "_getChangeMap").returns({});

			var oChange = createChangeStub("1");
			var oChangeDefault = createChangeStub("2");
			var stub = sinon.stub(this.oVariantManagement, "_getChange");
			stub.withArgs("1").returns(oChange);
			stub.withArgs("2").returns(oChangeDefault);
			stub.withArgs("3").returns(oChange);

			sinon.stub(this.oVariantManagement, "_appendLifecycleInformation");

			var oInfo = {
				deleted: [
					"1", "2", "3"
				]
			};

			this.oVariantManagement.fireManage(oInfo);

			assert.ok(sDefaultKey === "");

			assert.ok(this.oVariantManagement._appendLifecycleInformation.calledThrice);
		});

		QUnit.test("check fireManage: _renameVariant", function(assert) {
			createControlInfo(this.oVariantManagement);

			var oChange1 = createChangeStub("1");
			var oChange2 = createChangeStub("2");
			var stub = sinon.stub(this.oVariantManagement, "_getChange");
			stub.withArgs("1").returns(oChange1);
			stub.withArgs("2").returns(oChange2);

			sinon.stub(this.oVariantManagement, "_appendLifecycleInformation");

			var oInfo = {
				renamed: [
					{
						key: "1",
						name: "ONE"
					}, {
						key: "2",
						name: "TWO"
					}
				]
			};

			this.oVariantManagement.fireManage(oInfo);

			assert.equal(oChange1.getText("variantName"), "ONE");
			assert.equal(oChange2.getText("variantName"), "TWO");
		});

		QUnit.test("check fireManage: _setExecuteOnSelections", function(assert) {
			createControlInfo(this.oVariantManagement);

			var oChange1 = createChangeStub("1");
			var oChange2 = createChangeStub("2");
			var stub = sinon.stub(this.oVariantManagement, "_getChange");
			stub.withArgs("1").returns(oChange1);
			stub.withArgs("2").returns(oChange2);

			sinon.stub(this.oVariantManagement, "_appendLifecycleInformation");

			var oInfo = {
				exe: [
					{
						key: "1",
						exe: true
					}, {
						key: "2",
						exe: false
					}
				]
			};

			this.oVariantManagement.fireManage(oInfo);

			assert.equal(oChange1.getContent().executeOnSelection, true);
			assert.equal(oChange2.getContent().executeOnSelection, false);
		});

		QUnit.test("check fireManage: _appendLifecycleInformation", function(assert) {
			createControlInfo(this.oVariantManagement);

			var oChange = createChangeStub("1");
			sinon.stub(this.oVariantManagement, "_getChange").returns(oChange);

			var oVariantItem = new VariantItem({
				key: oChange.getId(),
				lifecycleTransportId: "4711t",
				lifecyclePackage: "4711p"
			});
			this.oVariantManagement.addVariantItem(oVariantItem);

			this.oVariantManagement._appendLifecycleInformation(oChange, "1");

			assert.equal(oChange.getRequest(), "4711t");

		});

		QUnit.test("check getVariantsInfo", function(assert) {
			var mChanges = createChangeStubs();

			return this.oVariantManagement._loadFlex().then(function() {
				stubLoadChanges(fakeResolved(mChanges));

				var aVariantsInfo = null;
				var fCallBack = function (aArray) {
					aVariantsInfo = aArray;
				};

				this.oVariantManagement.getVariantsInfo(fCallBack);
				assert.ok(aVariantsInfo);
				assert.equal(aVariantsInfo.length, 3, "expecting three entries");

				assert.equal(aVariantsInfo[0].key, "1");
				assert.equal(aVariantsInfo[0].text, "ONE");

				assert.equal(aVariantsInfo[1].key, "2");
				assert.equal(aVariantsInfo[1].text, "TWO");

				assert.equal(aVariantsInfo[2].key, "3");
				assert.equal(aVariantsInfo[2].text, "THREE");
				oStubLoadChanges.restore();
			}.bind(this));
		});

		QUnit.test("check getCurrentVariantId STANDARD", function(assert) {

			var sKey = this.oVariantManagement.getCurrentVariantId();
			assert.equal(sKey, "");
		});

		QUnit.test("check getCurrentVariantId not STANDARD", function(assert) {

			var mChanges = createChangeStubs();
			return this.oVariantManagement._loadFlex().then(function() {
				var oControl = createControlInfo(this.oVariantManagement);
				stubGetChange(oControl, mChanges);
				stubAddChange("newId");
				stubGetExecuteOnSelect(true);
				sinon.stub(this.oVariantManagement, "_getDefaultVariantKey").returns("3");

				this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(this.oVariantManagement._oPersoControl));

				var sKey = this.oVariantManagement.getCurrentVariantId();
				assert.equal(sKey, "3");
			}.bind(this));
		});

		QUnit.test("check setCurrentVariantId STANDARD", function(assert) {

			var aArray = [];
			aArray.push({
				control: {}
			});
			sinon.stub(this.oVariantManagement, "_getAllPersonalizableControls").returns(aArray);

			this.oVariantManagement._oPersoControl = {};

			sinon.stub(this.oVariantManagement, "_applyVariant");
			sinon.stub(this.oVariantManagement, "getVariantContent").returns("STANDARD");
			var spy = sinon.spy(this.oVariantManagement, "_setSelectionByKey");
			spy.withArgs(this.oVariantManagement.STANDARDVARIANTKEY);

			this.oVariantManagement._oStandardVariant = {};
			this.oVariantManagement._bIsInitialized = true;

			this.oVariantManagement.setCurrentVariantId("");

			assert.ok(spy.withArgs(this.oVariantManagement.STANDARDVARIANTKEY).calledOnce);
			assert.ok(this.oVariantManagement._applyVariant.calledOnce);

		});

		QUnit.test("check setCurrentVariantId not STANDARD", function(assert) {
			var mChanges = createChangeStubs();
			createControlInfo(this.oVariantManagement);

			var that = this;
			var fCallBack = function(oEvent) {
				that.oVariantManagement.setCurrentVariantId("2");
			};
			this.oVariantManagement.attachInitialise(fCallBack);

			sinon.stub(this.oVariantManagement, "_getDefaultVariantKey").returns("3");
			sinon.stub(this.oVariantManagement, "_getChangeContent").withArgs("2").returns({});

			this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(this.oVariantManagement._oPersoControl));

			var sKey = this.oVariantManagement.getCurrentVariantId();
			assert.equal(sKey, "2");
		});

		QUnit.test("check _setErrorValueState", function(assert) {

			assert.ok(!this.oVariantManagement.getInErrorState());

			this.oVariantManagement._setErrorValueState("TEXT");

			assert.ok(this.oVariantManagement.getInErrorState());

		});

		QUnit.test("check initialise with app variant", function(assert) {
			return this.oVariantManagement._loadFlex().then(function() {
				var mChanges = createChangeStubs();
				var oPersControlInfo = createControlInfo(this.oVariantManagement);
				var oControl = sap.ui.getCore().getControl(oPersControlInfo.getControl());

				var aArray = null;
				var fCallBack = function(oEvent) {
					aArray = oEvent.getParameters().variantKeys;
				};

				this.oVariantManagement.attachInitialise(fCallBack);

				stubIsApplicationVariant(true);
				sinon.stub(this.oVariantManagement, "_getDefaultVariantKey").returns("*standard*");
				sinon.stub(this.oVariantManagement, "_getExecuteOnSelectOnStandardVariant").returns(null);
				sinon.stub(this.oVariantManagement, "_getChange").withArgs(oControl, "2").returns(mChanges["2"]);

				this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(this.oVariantManagement._oPersoControl));
				assert.ok(aArray);

				assert.ok(this.oVariantManagement.getStandardVariantKey(), "2");
			}.bind(this));
		});

		QUnit.test("check initialise with app variant and merging", function(assert) {

			var mChanges = createChangeStubs();
			var oPersControlInfo = createControlInfo(this.oVariantManagement);
			var oControl = sap.ui.getCore().getControl(oPersControlInfo.getControl());

			var aArray = null;
			var fCallBack = function(oEvent) {
				aArray = oEvent.getParameters().variantKeys;
			};

			this.oVariantManagement.attachInitialise(fCallBack);

			stubIsApplicationVariant(true);
			sinon.stub(this.oVariantManagement, "_getChange").withArgs(oControl, "2").returns(mChanges["2"]);

			this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(this.oVariantManagement._oPersoControl));
			assert.ok(aArray);

			assert.ok(this.oVariantManagement.getStandardVariantKey(), "2");
		});

		QUnit.test("check _createVariantEntries without standard variant flag", function(assert) {

			var mChanges = createChangeStubs();

			sinon.stub(this.oVariantManagement, "_getExecuteOnSelection").returns(false);

			var oCurrentControlInfo = {
				control: {}
			};
			var aVariants = this.oVariantManagement._createVariantEntries(mChanges, oCurrentControlInfo);
			assert.ok(aVariants);
			assert.equal(aVariants.length, 3);

			assert.ok(!oCurrentControlInfo.standardvariantkey);
		});

		QUnit.test("check _createVariantEntries with standard variant flag in a non template app", function(assert) {

			var mChanges = createChangeStubs();

			sinon.stub(this.oVariantManagement, "_getExecuteOnSelection").returns(false);

			var oCurrentControlInfo = {
				control: {}
			};
			var aVariants = this.oVariantManagement._createVariantEntries(mChanges, oCurrentControlInfo);
			assert.ok(aVariants);
			assert.equal(aVariants.length, 3);

			assert.ok(!oCurrentControlInfo.standardvariantkey);
		});

		QUnit.test("check _createVariantEntries with standard variant flag in a template app", function(assert) {

			var mChanges = createChangeStubs();

			sinon.stub(this.oVariantManagement, "_getExecuteOnSelection").returns(false);
			stubIsApplicationVariant(true);

			this.oVariantManagement._oPersoControl = {};

			var oCurrentControlInfo = {
				control: {}
			};
			var aVariants = this.oVariantManagement._createVariantEntries(mChanges, oCurrentControlInfo);
			assert.ok(aVariants);
			assert.equal(aVariants.length, 3);

			assert.equal(this.oVariantManagement._sAppStandardVariantKey, "2");
		});

		QUnit.test("check isPageVariant", function(assert) {

			assert.ok(!this.oVariantManagement.isPageVariant());

			sinon.stub(this.oVariantManagement, "_handleGetChanges");
			this.oVariantManagement.setPersistencyKey("DUMMY");

			assert.ok(this.oVariantManagement.isPageVariant());

		});

		QUnit.test("check initialise with page variant: later registry; early data retrieval", function(assert) {

			sinon.stub(this.oVariantManagement, "_handleGetChanges");
			this.oVariantManagement.setPersistencyKey("DUMMY");
			sinon.stub(this.oVariantManagement, "_getExecuteOnSelectOnStandardVariant").returns(null);

			var nCount = 0;
			var mChanges = createChangeStubs();
			this.oVariantManagement._oControlPromise = fakeResolved(mChanges);

			var oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
			var oControl1 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			oControl1.fCallback = function(oEvent) {
				++nCount;
			};

			this.oVariantManagement._dataReceived(mChanges, true, {
				control: oControl1,
				fInitCallback: oControl1.fCallback,
				loaded: {
					resolve: function() {
					}
				}
			});

			assert.equal(nCount, 1);

			oPersControlInfo = createControlInfo(this.oVariantManagement, "4712", true);
			var oControl2 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			oControl2.fCallback = function(oEvent) {
				++nCount;
			};

			this.oVariantManagement._dataReceived(mChanges, true, {
				control: oControl2,
				fInitCallback: oControl2.fCallback,
				loaded: {
					resolve: function() {
					}
				}
			});

			assert.equal(nCount, 2);
		});

		QUnit.test("check initialise with page variant: later registry; late data retrieval", function(assert) {
			var nCount = 0, mChanges = createChangeStubs();
			var fCallBack1, oPromiseCallback1 = new Promise(function(fResolve) {
				fCallBack1 = fResolve;
			});
			var fCallBack2, oPromiseCallback2 = new Promise(function(fResolve) {
				fCallBack2 = fResolve;
			});

			var done = assert.async();

			stubLoadChanges(Promise.resolve(mChanges));

			this.oVariantManagement.setPersistencyKey("DUMMY");

			sinon.stub(this.oVariantManagement, "_getExecuteOnSelectOnStandardVariant").returns(null);

			var oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
			var oControl1 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			oControl1.fCallback = function(oEvent) {
				++nCount;
				fCallBack1();
			};

			this.oVariantManagement._oMetadataPromise = Promise.resolve();

			this.oVariantManagement.initialise(oControl1.fCallback, oControl1);
			assert.equal(nCount, 0);

			oPersControlInfo = createControlInfo(this.oVariantManagement, "4712");
			var oControl2 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			oControl2.fCallback = function(oEvent) {
				++nCount;
				fCallBack2();
			};

			this.oVariantManagement.initialise(oControl2.fCallback, oControl2);
			assert.equal(nCount, 0);

			Promise.all([
				oPromiseCallback1, oPromiseCallback2
			]).then(function() {
				assert.equal(nCount, 2);

				oStubLoadChanges.restore();

				done();
			});
		});

		QUnit.test("check initialise with page variant: STANDARD", function(assert) {

			sinon.stub(this.oVariantManagement, "_handleGetChanges");
			this.oVariantManagement.setPersistencyKey("DUMMY");

			sinon.stub(this.oVariantManagement, "_getExecuteOnSelectOnStandardVariant").returns(null);

			var mChanges = createChangeStubs();
			var oStdCtr1 = {
				a: "A",
				b: "B",
				c: "C"
			};

			var oStdCtr2 = {
				y: "Y",
				z: "Z"
			};

			var oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
			var oControl1 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			oControl1.fCallback = function() {
			};
			sinon.stub(oControl1, "fetchVariant").returns(oStdCtr1);

			oPersControlInfo = createControlInfo(this.oVariantManagement, "4712", true);
			var oControl2 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			oControl2.fCallback = function() {
			};
			sinon.stub(oControl2, "fetchVariant").returns(oStdCtr2);

			this.oVariantManagement._dataReceived(mChanges, true, {
				control: oControl1,
				fInitCallback: oControl1.fCallback,
				loaded: {
					resolve: function() {
					}
				}
			});

			this.oVariantManagement._dataReceived(mChanges, true, {
				control: oControl2,
				fInitCallback: oControl2.fCallback,
				loaded: {
					resolve: function() {
					}
				}
			});

			var oExpectResult = {};
			oExpectResult[this.oVariantManagement._getControlPersKey(oControl1)] = oStdCtr1;
			oExpectResult[this.oVariantManagement._getControlPersKey(oControl2)] = oStdCtr2;

			var oResult = this.oVariantManagement.getStandardVariant();
			assert.strictEqual(JSON.stringify(oResult), JSON.stringify(oExpectResult));
			assert.strictEqual(this.oVariantManagement.getStandardVariant(oControl1), oStdCtr1);
			assert.strictEqual(this.oVariantManagement.getStandardVariant(oControl2), oStdCtr2);
		});

		QUnit.test("check initialise with page variant: APP STANDARD", function(assert) {

			sinon.stub(this.oVariantManagement, "_handleGetChanges");
			this.oVariantManagement.setPersistencyKey("DUMMY");

			sinon.stub(this.oVariantManagement, "_getExecuteOnSelectOnStandardVariant").returns(null);

			var mChanges = createChangeStubs();

			var oStdCtr1 = {
				a: "A",
				b: "B",
				c: "C"
			};

			var oStdCtr2 = {
				y: "Y",
				z: "Z"
			};

			sinon.stub(this.oVariantManagement, "_getExecuteOnSelection").returns(false);
			stubIsApplicationVariant(true);

			var oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
			var oControl1 = sap.ui.getCore().getControl(oPersControlInfo.getControl());

			oPersControlInfo = createControlInfo(this.oVariantManagement, "4712", true);
			var oControl2 = sap.ui.getCore().getControl(oPersControlInfo.getControl());

			var oAppStandard = {};
			oAppStandard[this.oVariantManagement._getControlPersKey(oControl1)] = oStdCtr1;
			oAppStandard[this.oVariantManagement._getControlPersKey(oControl2)] = oStdCtr2;

			sinon.stub(this.oVariantManagement, "_getChange").returns({
				getContent: function() {
					return oAppStandard;
				},
				getLayer: function() {
					return "";
				}
			});
			sinon.stub(this.oVariantManagement, "_isReadOnly").returns(false);
			sinon.stub(this.oVariantManagement, "_isVendorLayer").returns(false);
			sinon.stub(this.oVariantManagement, "_isApplicationVariant").returns(true);

			// In "_dataReceived" a copy of the Variant is created. "executeOnSelection" is added later...
			oStdCtr1["executeOnSelection"] = undefined;
			oStdCtr2["executeOnSelection"] = undefined;

			this.oVariantManagement._oPersoControl = this.oVariantManagement;
			this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(oControl1));
			this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(oControl2));

			assert.equal(this.oVariantManagement._sAppStandardVariantKey, "2");
			assert.equal(this.oVariantManagement.getDefaultVariantKey(), "2");

			var oResult = this.oVariantManagement.getStandardVariant();
			assert.deepEqual(JSON.stringify(oResult), JSON.stringify(oAppStandard));
			assert.deepEqual(this.oVariantManagement.getStandardVariant(oControl1), oStdCtr1);
			assert.deepEqual(this.oVariantManagement.getStandardVariant(oControl2), oStdCtr2);

			this.oVariantManagement._oPersoControl = null;
		});

		QUnit.test("check initialise with page variant: apply", function(assert) {

			sinon.stub(this.oVariantManagement, "_handleGetChanges");
			this.oVariantManagement.setPersistencyKey("DUMMY");

			var mChanges = createChangeStubs();

			var oStdCtr1 = {
				a: "A",
				b: "B",
				c: "C"
			};

			var oStdCtr2 = {
				y: "Y",
				z: "Z"
			};

			var oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
			var oControl1 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			sinon.spy(oControl1, "applyVariant");

			oPersControlInfo = createControlInfo(this.oVariantManagement, "4712", true);
			var oControl2 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			sinon.spy(oControl2, "applyVariant");

			this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(oControl1));
			this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(oControl2));

			var oApplyData = {};
			oApplyData[this.oVariantManagement._getControlPersKey(oControl1)] = oStdCtr1;
			oApplyData[this.oVariantManagement._getControlPersKey(oControl2)] = oStdCtr2;

			this.oVariantManagement._applyVariants(oApplyData);

			assert.ok(oControl1.applyVariant.calledOnce);
			assert.ok(oControl2.applyVariant.calledOnce);

			assert.strictEqual(oControl1._getApplyedData(), oStdCtr1);
			assert.strictEqual(oControl2._getApplyedData(), oStdCtr2);

		});

		QUnit.test("check initialise with page variant: fetch", function(assert) {

			sinon.stub(this.oVariantManagement, "_handleGetChanges");

			this.oVariantManagement.setPersistencyKey("DUMMY");

			sinon.stub(this.oVariantManagement, "_getExecuteOnSelectOnStandardVariant").returns(null);

			var mChanges = createChangeStubs();
			var oStdCtr1 = {
				a: "A",
				b: "B",
				c: "C"
			};

			var oStdCtr2 = {
				y: "Y",
				z: "Z"
			};

			var oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
			var oControl1 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			sinon.stub(oControl1, "fetchVariant").returns(oStdCtr1);

			oPersControlInfo = createControlInfo(this.oVariantManagement, "4712", true);
			var oControl2 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			sinon.stub(oControl2, "fetchVariant").returns(oStdCtr2);

			this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(oControl1));
			this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(oControl2));

			var oResult = this.oVariantManagement._fetchContent();

			var oExpectResult = {};
			oExpectResult[this.oVariantManagement._getControlPersKey(oControl1)] = oStdCtr1;
			oExpectResult[this.oVariantManagement._getControlPersKey(oControl2)] = oStdCtr2;

			assert.strictEqual(JSON.stringify(oResult), JSON.stringify(oExpectResult));

			assert.ok(oControl1.fetchVariant.calledTwice); // 2x because of Standard
			assert.ok(oControl2.fetchVariant.calledTwice);
		});

		QUnit.test("check initialise with page variant: STANDARD - one perso; backward compatible", function(assert) {

			sinon.stub(this.oVariantManagement, "_handleGetChanges");

			this.oVariantManagement.setPersistencyKey("DUMMY");

			sinon.stub(this.oVariantManagement, "_getExecuteOnSelectOnStandardVariant").returns(null);

			var mChanges = createChangeStubs();

			var oStdCtr1 = {
				a: "A",
				b: "B",
				c: "C"
			};

			var oPersControlInfo = createControlInfo(this.oVariantManagement, "DUMMY", true);
			var oControl1 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			oControl1.fCallback = function() {
			};
			sinon.stub(oControl1, "fetchVariant").returns(oStdCtr1);

			this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(oControl1));

			var oExpectResult = oStdCtr1;

			var oResult = this.oVariantManagement.getStandardVariant();
			assert.strictEqual(JSON.stringify(oResult), JSON.stringify(oExpectResult));
			assert.strictEqual(this.oVariantManagement.getStandardVariant(oControl1), oStdCtr1);
		});

		QUnit.test("check initialise with page variant: APP STANDARD - one perso; backward compatible", function(assert) {

			sinon.stub(this.oVariantManagement, "_handleGetChanges");
			this.oVariantManagement.setPersistencyKey("DUMMY");

			sinon.stub(this.oVariantManagement, "_getExecuteOnSelectOnStandardVariant").returns(null);

			var mChanges = createChangeStubs();

			var oStdCtr1 = {
				a: "A",
				b: "B",
				c: "C"
			};

			stubIsApplicationVariant(true);
			sinon.stub(this.oVariantManagement, "_getExecuteOnSelection").returns(false);

			var oPersControlInfo = createControlInfo(this.oVariantManagement, "DUMMY", true);
			var oControl1 = sap.ui.getCore().getControl(oPersControlInfo.getControl());

			var oAppStandard = oStdCtr1;

			sinon.stub(this.oVariantManagement, "_getChange").returns({
				getContent: function() {
					return oAppStandard;
				},
				getLayer: function() {
					return "";
				}
			});
			sinon.stub(this.oVariantManagement, "_isReadOnly").returns(false);
			sinon.stub(this.oVariantManagement, "_isVendorLayer").returns(false);
			sinon.stub(this.oVariantManagement, "_isApplicationVariant").returns(true);

			// In "_dataReceived" a copy of the Variant is created. "executeOnSelection" is added later...
			oStdCtr1["executeOnSelection"] = undefined;

			this.oVariantManagement._oPersoControl = oControl1;
			this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(oControl1));

			assert.equal(this.oVariantManagement._sAppStandardVariantKey, "2");
			assert.equal(this.oVariantManagement.getDefaultVariantKey(), "2");

			var oResult = this.oVariantManagement.getStandardVariant();
			assert.deepEqual(JSON.stringify(oResult), JSON.stringify(oAppStandard));
			assert.deepEqual(this.oVariantManagement.getStandardVariant(oControl1), oStdCtr1);

			this.oVariantManagement._oPersoControl = null;
		});

		QUnit.test("check initialise with page variant: apply  - one perso; backward compatible", function(assert) {

			sinon.stub(this.oVariantManagement, "_handleGetChanges");
			this.oVariantManagement.setPersistencyKey("DUMMY");

			var mChanges = createChangeStubs();
			var oStdCtr1 = {
				a: "A",
				b: "B",
				c: "C"
			};

			var oPersControlInfo = createControlInfo(this.oVariantManagement, "DUMMY", true);
			var oControl1 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			sinon.spy(oControl1, "applyVariant");

			this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(oControl1));

			var oApplyData = oStdCtr1;

			this.oVariantManagement._applyVariants(oApplyData);

			assert.ok(oControl1.applyVariant.calledOnce);

			assert.strictEqual(oControl1._getApplyedData(), oStdCtr1);
		});

		QUnit.test("check initialise with page variant: fetch  - one perso; backward compatible", function(assert) {

			sinon.stub(this.oVariantManagement, "_handleGetChanges");
			this.oVariantManagement.setPersistencyKey("DUMMY");

			sinon.stub(this.oVariantManagement, "_getExecuteOnSelectOnStandardVariant").returns(null);

			var mChanges = createChangeStubs();
			var oStdCtr1 = {
				a: "A",
				b: "B",
				c: "C"
			};

			var oPersControlInfo = createControlInfo(this.oVariantManagement, "DUMMY", true);
			var oControl1 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			sinon.stub(oControl1, "fetchVariant").returns(oStdCtr1);

			this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(oControl1));

			var oResult = this.oVariantManagement._fetchContent();

			var oExpectResult = oStdCtr1;

			assert.strictEqual(JSON.stringify(oResult), JSON.stringify(oExpectResult));

			assert.ok(oControl1.fetchVariant.calledTwice);

		});

		QUnit.test("check variantsInitialized ", function(assert) {

			var mChanges = createChangeStubs();
			var oPersControlInfo = createControlInfo(this.oVariantManagement);
			var oControl = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			oControl.variantsInitialized = sinon.stub();

			sinon.stub(this.oVariantManagement, "_getChange");

			this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(oControl));

			assert.ok(oControl.variantsInitialized.calledOnce);

		});

		QUnit.test("check _applyVariants", function(assert) {

			sinon.stub(this.oVariantManagement, "_handleGetChanges");
			this.oVariantManagement.setPersistencyKey("DUMMY");

			sinon.stub(this.oVariantManagement, "_getExecuteOnSelectOnStandardVariant").returns(null);

			sinon.stub(this.oVariantManagement, "_applyControlVariant");

			var mChanges = createChangeStubs();

			var oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
			var oControl1 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			oControl1.fCallback = function(oEvent) {
			};

			oPersControlInfo = createControlInfo(this.oVariantManagement, "4712", true);
			var oControl2 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			oControl2.fCallback = function(oEvent) {
			};

			this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(oControl2));
			this.oVariantManagement._applyVariants({}, null);
			assert.ok(this.oVariantManagement._applyControlVariant.calledOnce);

			this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(oControl1));
			assert.ok(this.oVariantManagement._applyControlVariant.calledTwice);

			this.oVariantManagement._applyControlVariant.reset();
			this.oVariantManagement._applyVariants({}, null);
			assert.ok(this.oVariantManagement._applyControlVariant.calledTwice);

		});

		QUnit.test("check _selectVariant", function(assert) {
			sinon.spy(this.oVariantManagement, "fireSelect");
			sinon.stub(this.oVariantManagement, "_triggerSelectVariant");

			this.oVariantManagement._oPersoControl = {};
			this.oVariantManagement._selectVariant("4711");

			assert.ok(this.oVariantManagement.fireSelect.calledOnce);
			assert.ok(this.oVariantManagement._triggerSelectVariant.calledOnce);

		});

		QUnit.test("check _isVariantDownport", function(assert) {
			return this.oVariantManagement._loadFlex().then(function() {
				sinon.stub(FlexApplyAPI, "isVariantDownport").returns(true);

				assert.ok(this.oVariantManagement._isVariantDownport());
				FlexApplyAPI.isVariantDownport.restore();
			}.bind(this));
		});

		QUnit.test("XCheck if all properties defined in the class of the control are declared in designtime metadata (there are also inherited properties)", function(assert) {
			var mProperties = this.oVariantManagement.getMetadata()._mProperties;
			assert.ok(mProperties);

			var done = assert.async();

			this.oVariantManagement.getMetadata().loadDesignTime().then(function(oDesignTimeMetadata) {
				var aProperties = Object.keys(mProperties);

				aProperties.forEach(function(element) {
					assert.ok(oDesignTimeMetadata.properties[element]);
				});
				done();
			});

		});

		QUnit.test("check afterVariantLoad event no event", function(assert) {

			sinon.stub(this.oVariantManagement, "_handleGetChanges");
			this.oVariantManagement.setPersistencyKey("DUMMY");

			sinon.stub(this.oVariantManagement, "_getExecuteOnSelectOnStandardVariant").returns(null);

			var mChanges = createChangeStubs();

			var oPersControlInfo = createControlInfo(this.oVariantManagement, "DUMMY", true);
			var oControl1 = sap.ui.getCore().getControl(oPersControlInfo.getControl());

			var sContext = null;
			oControl1.attachAfterVariantLoad(function(e) {
				sContext = e.getParameters().context;
			});

			sinon.stub(this.oVariantManagement, "_getChangeContent").returns({
				DUMMY: {}
			});

			this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(oControl1));

			assert.ok(!sContext);

		});

		QUnit.test("check afterVariantLoad event with default variant", function(assert) {

			sinon.stub(this.oVariantManagement, "_handleGetChanges");
			this.oVariantManagement.setPersistencyKey("DUMMY");

			sinon.stub(this.oVariantManagement, "_getExecuteOnSelectOnStandardVariant").returns(null);

			var mChanges = createChangeStubs();

			var oPersControlInfo = createControlInfo(this.oVariantManagement, "DUMMY", true);
			var oControl1 = sap.ui.getCore().getControl(oPersControlInfo.getControl());

			var sContext = null;
			oControl1.attachAfterVariantLoad(function(e) {
				sContext = e.getParameters().context;
			});

			sinon.stub(this.oVariantManagement, "getSelectionKey").returns("default");
			sinon.stub(this.oVariantManagement, "_getChangeContent").returns({
				DUMMY: {}
			});

			this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(oControl1));

			assert.equal(sContext, "INIT");

		});

		QUnit.test("check afterVariantLoad event with app variant", function(assert) {

			sinon.stub(this.oVariantManagement, "_handleGetChanges");
			stubIsApplicationVariant(true);

			this.oVariantManagement.setPersistencyKey("DUMMY");

			sinon.stub(this.oVariantManagement, "_getExecuteOnSelectOnStandardVariant").returns(null);

			var mChanges = createChangeStubs();
			var oStdCtr1 = {
				a: "A",
				b: "B",
				c: "C"
			};

			var oPersControlInfo = createControlInfo(this.oVariantManagement, "DUMMY", true);
			var oControl1 = sap.ui.getCore().getControl(oPersControlInfo.getControl());

			var sContext = null;
			oControl1.attachAfterVariantLoad(function(e) {
				sContext = e.getParameters().context;
			});

			sinon.stub(this.oVariantManagement, "_getChange").returns({
				getContent: function() {
					return {
						DUMMY: {}
					};
				},
				getLayer: function() {
					return "";
				}
			});
			sinon.stub(this.oVariantManagement, "_isReadOnly").returns(false);
			sinon.stub(this.oVariantManagement, "_isVendorLayer").returns(false);
			sinon.stub(this.oVariantManagement, "_isApplicationVariant").returns(true);

			// In "_dataReceived" a copy of the Variant is created. "executeOnSelection" is added later...
			oStdCtr1["executeOnSelection"] = undefined;

			this.oVariantManagement._oPersoControl = this.oVariantManagement;
			this.oVariantManagement._dataReceived(mChanges, true, this.oVariantManagement._getControlWrapper(oControl1));

			assert.equal(sContext, "INIT");

			this.oVariantManagement._oPersoControl = null;
		});

		QUnit.test("check removeAllPersonalizableControls", function(assert) {

			var oControl = new Control();

			sinon.stub(this.oVariantManagement, "_handleGetChanges");

			assert.equal(this.oVariantManagement.getPersonalizableControls().length, 0);
			assert.equal(this.oVariantManagement._aPersonalizableControls.length, 0);

			this.oVariantManagement.addPersonalizableControl(new PersonalizableInfo({
				type: "chart",
				dataSource: "TODO",
				keyName: "persistencyKey",
				control: oControl
			}));

			assert.equal(this.oVariantManagement.getPersonalizableControls().length, 1);
			assert.equal(this.oVariantManagement._aPersonalizableControls.length, 1);

			this.oVariantManagement.removeAllPersonalizableControls();

			assert.equal(this.oVariantManagement.getPersonalizableControls().length, 0);
			assert.equal(this.oVariantManagement._aPersonalizableControls.length, 0);

			this.oVariantManagement.addPersonalizableControl(new PersonalizableInfo({
				type: "chart",
				dataSource: "TODO",
				keyName: "persistencyKey",
				control: oControl
			}));

			assert.equal(this.oVariantManagement.getPersonalizableControls().length, 1);
			assert.equal(this.oVariantManagement._aPersonalizableControls.length, 1);

			this.oVariantManagement.removeAllPersonalizableControls();

			assert.equal(this.oVariantManagement.getPersonalizableControls().length, 0);
			assert.equal(this.oVariantManagement._aPersonalizableControls.length, 0);

		});

		QUnit.test("check search on standard variant", function(assert) {

			var oControlWrapper = {
				loaded: {
					resolve: function() {
					}
				},
				control: {
					search: function() {
					}
				}
			};

			sinon.spy(oControlWrapper.control, "search");

			sinon.stub(this.oVariantManagement, "_getCurrentVariantId").returns(this.oVariantManagement.STANDARDVARIANTKEY);

			sinon.stub(this.oVariantManagement, "_setStandardVariant");

			this.oVariantManagement._initialize({}, oControlWrapper);
			assert.ok(!oControlWrapper.control.search.called);

			sinon.stub(this.oVariantManagement, "getExecuteOnSelectForStandardVariant").returns(true);
			this.oVariantManagement._initialize({}, oControlWrapper);
			assert.ok(oControlWrapper.control.search.called);

			oControlWrapper.control.search.restore();
			this.oVariantManagement._getCurrentVariantId.restore();
			sinon.stub(this.oVariantManagement, "_getCurrentVariantId").returns("");

			sinon.spy(oControlWrapper.control, "search");
			this.oVariantManagement._initialize({}, oControlWrapper);
			assert.ok(!oControlWrapper.control.search.called);

		});

		QUnit.test("check removePersonalizableControl", function(assert) {

			var oControl1 = new Control();
			var oControl2 = new Control();

			sinon.stub(this.oVariantManagement, "_handleGetChanges");

			assert.equal(this.oVariantManagement.getPersonalizableControls().length, 0);
			assert.equal(this.oVariantManagement._aPersonalizableControls.length, 0);

			var oPers1 = new PersonalizableInfo({
				type: "chart",
				dataSource: "TODO",
				keyName: "persistencyKey",
				control: oControl1
			});

			var oPers2 = new PersonalizableInfo({
				type: "chart",
				dataSource: "TODO",
				keyName: "persistencyKey",
				control: oControl2
			});

			this.oVariantManagement.addPersonalizableControl(oPers1);
			this.oVariantManagement.addPersonalizableControl(oPers2);

			assert.equal(this.oVariantManagement.getPersonalizableControls().length, 2);
			assert.equal(this.oVariantManagement._aPersonalizableControls.length, 2);

			this.oVariantManagement.removePersonalizableControl(oPers1);

			assert.equal(this.oVariantManagement.getPersonalizableControls().length, 1);
			assert.equal(this.oVariantManagement._aPersonalizableControls.length, 1);

			this.oVariantManagement.removePersonalizableControl(oPers2);
			assert.equal(this.oVariantManagement.getPersonalizableControls().length, 0);
			assert.equal(this.oVariantManagement._aPersonalizableControls.length, 0);

		});

		QUnit.test("check removePersonalizableControlById", function(assert) {

			var oControl1 = new Control();
			var oControl2 = new Control();

			sinon.stub(this.oVariantManagement, "_handleGetChanges");

			assert.equal(this.oVariantManagement.getPersonalizableControls().length, 0);
			assert.equal(this.oVariantManagement._aPersonalizableControls.length, 0);

			var oPers1 = new PersonalizableInfo({
				type: "chart",
				dataSource: "TODO",
				keyName: "persistencyKey",
				control: oControl1
			});

			var oPers2 = new PersonalizableInfo({
				type: "chart",
				dataSource: "TODO",
				keyName: "persistencyKey",
				control: oControl2
			});

			this.oVariantManagement.addPersonalizableControl(oPers1);
			this.oVariantManagement.addPersonalizableControl(oPers2);

			assert.equal(this.oVariantManagement.getPersonalizableControls().length, 2);
			assert.equal(this.oVariantManagement._aPersonalizableControls.length, 2);

			this.oVariantManagement.removePersonalizableControlById(oControl1);

			assert.equal(this.oVariantManagement.getPersonalizableControls().length, 1);
			assert.equal(this.oVariantManagement._aPersonalizableControls.length, 1);

			this.oVariantManagement.removePersonalizableControlById(oControl2);
			assert.equal(this.oVariantManagement.getPersonalizableControls().length, 0);
			assert.equal(this.oVariantManagement._aPersonalizableControls.length, 0);

		});

		QUnit.test("check initialize with error main promise", function(assert) {
			return this.oVariantManagement._loadFlex().then(function() {
				stubLoadChanges(Promise.resolve({}));
				var oPersControlInfo = createControlInfo(this.oVariantManagement, "", true);
				var oControl = sap.ui.getCore().getControl(oPersControlInfo.getControl());
				oControl.variantsInitialized = sinon.stub();
				oControl.fFunc = sinon.stub();

				sinon.stub(this.oVariantManagement, "_getChange");

				this.oVariantManagement._oPersistencyPromise = Promise.reject();

				this.oVariantManagement.initialise(oControl.fFunc, oControl);

				this.oVariantManagement._oPersistencyPromise.then(function() {
				}, function(err) {
					assert.ok(oControl.fFunc.calledOnce);
					assert.ok(oControl.variantsInitialized.calledOnce);
				});
			}.bind(this));
		});

		QUnit.test("check initialize with error", function(assert) {
			var done = assert.async();

			var oPersControlInfo = createControlInfo(this.oVariantManagement);
			var oControl = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			oControl.variantsInitialized = sinon.stub();
			oControl.fFunc = sinon.stub();

			sinon.stub(this.oVariantManagement, "_getChange");

			this.oVariantManagement.initialise(oControl.fFunc, oControl);

			this.oVariantManagement._oPersistencyPromise.then(function() {

				this.oVariantManagement._oMetadataPromise = Promise.reject();
				this.oVariantManagement._oControlPromise = Promise.reject();

				Promise.all([
					this.oVariantManagement._oMetadataPromise, this.oVariantManagement._oControlPromise
				]).then(function(aArray) {
				}, function(err) {
					assert.ok(oControl.fFunc.calledOnce);
					assert.ok(oControl.variantsInitialized.calledOnce);
					done();
				});
			}.bind(this));

		});

		QUnit.test("check registerSelectionVariantHandler/unregisterSelectionVariantHandler", function(assert) {

			var oHandler1 = {
				callback: function() {
				},
				handler: {}
			};

			var oHandler2 = {
				callback: function() {
				},
				handler: {}
			};

			oHandler1.handler = oHandler1;
			oHandler2.handler = oHandler2;

			assert.equal(Object.keys(this.oVariantManagement._oSelectionVariantHandler).length, 0);

			this.oVariantManagement.registerSelectionVariantHandler(oHandler1, "#");
			this.oVariantManagement.registerSelectionVariantHandler(oHandler2, "@");
			assert.equal(Object.keys(this.oVariantManagement._oSelectionVariantHandler).length, 2);

			this.oVariantManagement.unregisterSelectionVariantHandler("@");
			assert.equal(Object.keys(this.oVariantManagement._oSelectionVariantHandler).length, 1);
			assert.equal(Object.keys(this.oVariantManagement._oSelectionVariantHandler), "#");

			this.oVariantManagement.registerSelectionVariantHandler(oHandler2, "@");
			assert.equal(Object.keys(this.oVariantManagement._oSelectionVariantHandler).length, 2);
			assert.equal(this.oVariantManagement._oSelectionVariantHandler["#"], oHandler1);
			assert.equal(this.oVariantManagement._oSelectionVariantHandler["@"], oHandler2);

			this.oVariantManagement.unregisterSelectionVariantHandler(oHandler1);
			assert.equal(Object.keys(this.oVariantManagement._oSelectionVariantHandler).length, 1);
			assert.equal(Object.keys(this.oVariantManagement._oSelectionVariantHandler), "@");

			this.oVariantManagement.unregisterSelectionVariantHandler(oHandler2);
			assert.equal(Object.keys(this.oVariantManagement._oSelectionVariantHandler).length, 0);

		});

		QUnit.test("check fireSelect with SelectionVariantHandler", function(assert) {

			var oHandler = {
				callback: function(key, context) {
					return {};
				},
				handler: {}
			};
			oHandler.handler = oHandler;
			this.oVariantManagement.registerSelectionVariantHandler(oHandler, "#");
			sinon.spy(oHandler, "callback");

			this.oVariantManagement._oPersoControl = sinon.stub();
			sinon.stub(this.oVariantManagement, "_applyVariant");

			sinon.spy(this.oVariantManagement, "_triggerGeneralSelectVariant");
			sinon.spy(this.oVariantManagement, "_triggerSpecialSelectVariant");

			this.oVariantManagement.fireSelect({
				key: "HUGO"
			});
			assert.ok(this.oVariantManagement._triggerGeneralSelectVariant.called);
			assert.ok(!this.oVariantManagement._triggerSpecialSelectVariant.called);
			assert.ok(!oHandler.callback.called);

			this.oVariantManagement._triggerGeneralSelectVariant.restore();
			this.oVariantManagement._triggerSpecialSelectVariant.restore();

			sinon.spy(this.oVariantManagement, "_triggerGeneralSelectVariant");
			sinon.spy(this.oVariantManagement, "_triggerSpecialSelectVariant");

			this.oVariantManagement.fireSelect({
				key: "#HUGO"
			});
			assert.ok(!this.oVariantManagement._triggerGeneralSelectVariant.called);
			assert.ok(this.oVariantManagement._triggerSpecialSelectVariant.called);
			assert.ok(oHandler.callback.called);

		});

		QUnit.test("check _isReadOnly", function(assert) {

			var bReadOnly = false, bOtherSystem = false;
			var oChange = {
				isReadOnly: function() {
					return bReadOnly;
				},
				getOwnerId: function() {
					return "TEST";
				},
				isChangeFromOtherSystem: function() {
					return bOtherSystem;
				}
			};
			var sUser = "TEST";
			var oUser = {
				getId: function() {
					return sUser;
				}
			};

			assert.ok(!this.oVariantManagement._isReadOnly(oChange));

			bReadOnly = true;
			sinon.stub(this.oVariantManagement, "_getUser").returns(oUser);
			assert.ok(!this.oVariantManagement._isReadOnly(oChange));

			sUser = "HUGO";
			assert.ok(this.oVariantManagement._isReadOnly(oChange));

			// check also for case sensitive
			sUser = "test";
			assert.equal(this.oVariantManagement._isReadOnly(oChange), false, "Independent of the case is the user is correct than readonly is false");

			bOtherSystem = true;
			assert.ok(this.oVariantManagement._isReadOnly(oChange));

		});

		QUnit.test("check getTransportSelection/_getTransportSelection", function(assert) {

			sinon.spy(this.oVariantManagement, "getTransportSelection");

			var done = assert.async();
			this.oVariantManagement._getTransportSelection().then(function(oTransportSelection) {
				assert.ok(oTransportSelection);
				assert.ok(oTransportSelection.selectTransport);
				assert.ok(this.oVariantManagement.getTransportSelection.calledOnce);
				done();
			}.bind(this));
		});

		QUnit.test("check fireSave with tile", function(assert) {
			createControlInfo(this.oVariantManagement);

			sinon.stub(this.oVariantManagement, "_newVariant");
			sinon.stub(this.oVariantManagement, "_save");

			var bWithTile;
			this.oVariantManagement.attachSave(function(oEvent) {
				if (oEvent && (oEvent.mParameters.tile !== undefined)) {
					bWithTile = oEvent.mParameters.tile;
				}

			});

			this.oVariantManagement.fireSave({});
			assert.ok(bWithTile === undefined);

			this.oVariantManagement.fireSave({
				tile: true
			});
			assert.ok(bWithTile);

			this.oVariantManagement.fireSave({
				tile: false
			});
			assert.ok(!bWithTile);

		});

		QUnit.test("check _applyDefaultFavorites", function(assert) {
			var oObj = {
				fileName: "1",
				fileType: "variant",
				changeType: "changeType",
				layer: "USER",
				originalLanguage: "DE",
				support: {
					user: "TESTER"
				},
				texts: {
					variantName: {
						value: "",
						type: ""
					}
				},
				content: {}
			};

			var oObj2 = {
						fileName: "2",
						fileType: "variant",
						changeType: "changeType",
						layer: "VENDOR",
						originalLanguage: "DE",
						support: {
							user: "TESTER"
						},
						texts: {
							variantName: {
								value: "",
								type: ""
							}
						},
						content: {}
					};

			var oChange = new Change(oObj);
			var oChange2 = new Change(oObj2);

			var sUser = "TESTER";
			var oUser = {
				getId: function() {
					return sUser;
				}
			};

			var bFavorite = false;
			var oVariantItem = {
				setFavorite: function(b) {
					bFavorite = b;
				}
			};

			sinon.stub(this.oVariantManagement, "_getChange").returns(oChange);
			sinon.stub(this.oVariantManagement, "getItemByKey").returns(oVariantItem);
			sinon.stub(this.oVariantManagement, "_getUser").returns(oUser);

			assert.ok(!this.oVariantManagement.getStandardFavorite());
			assert.ok(!bFavorite);
			this.oVariantManagement._applyDefaultFavorites([
				"1"
			]);

			assert.ok(this.oVariantManagement.getStandardFavorite());
			assert.ok(bFavorite);

			this.oVariantManagement._getChange.restore();
			sinon.stub(this.oVariantManagement, "_getChange").returns(oChange2);
			this.oVariantManagement._applyDefaultFavorites([
				"2"
			]);

			assert.ok(bFavorite);

			this.oVariantManagement._getChange.restore();
			sinon.stub(this.oVariantManagement, "_getChange").returns(oChange);

			this.oVariantManagement._sAppStandardVariantKey = {};

			bFavorite = false;
			oObj.layer = "CUSTOMER";
			oChange = new Change(oObj);
			this.oVariantManagement._applyDefaultFavorites([
				"1"
			]);
			assert.ok(!bFavorite);

			bFavorite = false;
			oObj.layer = "CUSTOMER";
			oObj.support.user = "TESTER2";
			oChange = new Change(oObj);
			this.oVariantManagement._applyDefaultFavorites([
				"1"
			]);
			assert.ok(!bFavorite);

			oObj.layer = "VENDOR";
			bFavorite = false;
			oChange = new Change(oObj);
			this.oVariantManagement._applyDefaultFavorites([
				"1"
			]);
			assert.ok(bFavorite);

		});

		QUnit.test("check initialize ok", function(assert) {
			return this.oVariantManagement._loadFlex().then(function() {
				var mChanges = createChangeStubs();

				stubLoadChanges(Promise.resolve(mChanges));
				stubIsVariantSharingEnabled(true);

				this.oVariantManagement.setPersistencyKey("DUMMY");

				var oPersControlInfo = createControlInfo(this.oVariantManagement);
				var oControl = sap.ui.getCore().getControl(oPersControlInfo.getControl());
				oControl.fFunc = sinon.stub();

				sinon.stub(this.oVariantManagement, "_dataReceived");

				this.oVariantManagement.initialise(oControl.fFunc, oControl);

				return this.oVariantManagement._oPersistencyPromise.then(function() {

					this.oVariantManagement._oMetadataPromise = Promise.resolve();

					return Promise.all([
						this.oVariantManagement._oMetadataPromise, this.oVariantManagement._oControlPromise
					]).then(function(aArray) {
						assert.ok(this.oVariantManagement._dataReceived.called);
					}.bind(this));
				}.bind(this));

			}.bind(this));
		});

		QUnit.test("check initialize with failed metadata load", function(assert) {
			return this.oVariantManagement._loadFlex().then(function() {
				var mChanges = createChangeStubs();
				stubLoadChanges(Promise.resolve(mChanges));
				stubIsVariantSharingEnabled(true);
				this.oVariantManagement.setPersistencyKey("DUMMY");

				var oPersControlInfo = createControlInfo(this.oVariantManagement);
				var oControl = sap.ui.getCore().getControl(oPersControlInfo.getControl());
				oControl.fFunc = sinon.stub();

				sinon.stub(this.oVariantManagement, "_dataReceived");

				this.oVariantManagement._oMetadataPromise = new Promise(function(resolve, reject) {
					reject();
				});

				this.oVariantManagement.initialise(oControl.fFunc, oControl);

				return Promise.all([
					this.oVariantManagement._oMetadataPromise, this.oVariantManagement._oControlPromise
				]).then(function(aArray) {
				}, function(err) {
					assert.ok(!this.oVariantManagement._dataReceived.called);
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("check initialize with failed lrep load", function(assert) {
			return this.oVariantManagement._loadFlex().then(function() {
				stubLoadChanges(Promise.reject());
				stubIsVariantSharingEnabled(true);
				this.oVariantManagement.setPersistencyKey("DUMMY");

				var oPersControlInfo = createControlInfo(this.oVariantManagement);
				var oControl = sap.ui.getCore().getControl(oPersControlInfo.getControl());
				oControl.fFunc = sinon.stub();

				sinon.stub(this.oVariantManagement, "_dataReceived");

				this.oVariantManagement._oMetadataPromise = new Promise(function(resolve, reject) {
					resolve();
				});

				this.oVariantManagement.initialise(oControl.fFunc, oControl);

				return Promise.all([
					this.oVariantManagement._oMetadataPromise, this.oVariantManagement._oControlPromise
				]).then(function(aArray) {
				}, function(err) {
					assert.ok(!this.oVariantManagement._dataReceived.called);
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("check setEntitySet and model", function(assert) {

			sinon.stub(this.oVariantManagement, "_onMetadataInitialised");

			assert.ok(!this.oVariantManagement._oMetadataPromise);

			this.oVariantManagement.setEntitySet("ENTITY_SET");
			assert.ok(!this.oVariantManagement._oMetadataPromise);

			var done = assert.async();

			var oPromise = jQuery.Deferred();

			var oModel = {
				getMetaModel: function() {
					return {
						loaded: function() {
							return oPromise;
						}
					};
				}

			};

			this.oVariantManagement.setModel(oModel);
			assert.ok(this.oVariantManagement._oMetadataPromise);

			oPromise.resolve();

			oPromise.then(function() {
				assert.ok(this.oVariantManagement._onMetadataInitialised.calledOnce);
				done();
			}.bind(this));

		});

		QUnit.test("check _onMetadataInitialised", function(assert) {

			this.oVariantManagement._onMetadataInitialised();
			assert.ok(!this.oVariantManagement._oAdapter);

			this.oVariantManagement.setEntitySet("ENTITY_SET");
			this.oVariantManagement._onMetadataInitialised();
			assert.ok(this.oVariantManagement._oAdapter);
		});

		QUnit.test("check applyVariant/setUiStateAsVariant", function(assert) {

			var oAdapter = {
				getUiState: function() {
					return {};
				}
			};

			sinon.stub(this.oVariantManagement, "_triggerGeneralSelectVariant").returns({});
			sinon.stub(this.oVariantManagement, "_getAdapter").returns(oAdapter);

			var oPersControlInfo = createControlInfo(this.oVariantManagement, "Key");
			var oControl = sap.ui.getCore().getControl(oPersControlInfo.getControl());

			var oControlWrapper = this.oVariantManagement._getControlWrapper(oControl);
			assert.ok(oControlWrapper);
			oControlWrapper.loaded.resolve();

			oControl.applyVariant = sinon.stub();
			oControl.setUiStateAsVariant = sinon.stub();

			this.oVariantManagement.fireSelect({
				key: "One"
			});
			assert.ok(oControl.applyVariant.called);
			assert.ok(!oControl.setUiStateAsVariant.called);

			oControl.applyVariant.reset();
			oControl.setUiStateAsVariant.reset();

			this.oVariantManagement.fireSelect({
				key: "#One"
			});

			assert.ok(!oControl.applyVariant.called);
			assert.ok(oControl.setUiStateAsVariant.called);

		});

		QUnit.test("check mixed sync/async fetchVariant for new variant", function(assert) {

			var done = assert.async();

			var oContent1 = { test: "Control1" };
			var oContent2 = { test: "Control2" };
			var mChanges = createChangeStubs();
			mChanges["newId"] = createChangeStub("newId", {key1: oContent1, key2: oContent2});
			sinon.spy(this.oVariantManagement, "_newVariant");
			sinon.spy(this.oVariantManagement, "_updateVariant");

			stubLoadChanges(Promise.resolve(mChanges));
			stubIsVariantSharingEnabled(true);
			stubGetDefaultVariantId("*standard*");
			stubAddChange("newId");
			stubGetChange(this.oVariantManagement, mChanges);
			var fResolve;
			var oAfterSavePromise = new Promise(function(resolve, reject) {
				fResolve = resolve;
			});

			this.oVariantManagement.attachAfterSave(function(oEvent) {
				fResolve();
			});

			var oVariantInfo = {
				key: "2",
				text: "TWO"
			 };

			this.oVariantManagement.setPersistencyKey("DUMMY");

			sinon.stub(this.oVariantManagement, "_getExecuteOnSelectOnStandardVariant").returns(null);

			var oPersControlInfo = createControlInfo(this.oVariantManagement, "key1", true);
			var oControl1 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			oControl1.fCallback = sinon.stub();
			oControl1.fetchVariant = function() {
				return oContent1;
			};

			this.oVariantManagement.initialise(oControl1.fCallback, oControl1);

			oPersControlInfo = createControlInfo(this.oVariantManagement, "key2", true);
			var oControl2 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			oControl2.fCallback = oControl1.fCallback = sinon.stub();
			oControl2.fetchVariant = function() {

				var fTest, oPromise = new Promise(function(resolve, reject) {
					fTest = resolve;
				});
				setTimeout(function() {
					fTest(oContent2);
				}, 1000);

				return oPromise;
			};

			this.oVariantManagement.initialise(oControl2.fCallback, oControl2);

			this.oVariantManagement._oFlLibrary.then(function() {
				stubSave(Promise.resolve());

				assert.ok(!this.oVariantManagement._newVariant.called);
				assert.ok(!this.oVariantManagement._updateVariant.called);

				this.oVariantManagement.fireSave(oVariantInfo);

				oAfterSavePromise.then(function() {

					var oVariantItem = null;

					this.oVariantManagement.getVariantItems().some(function(oItem) {
						if (oItem.getText() === oVariantInfo.text) {
							oVariantItem = oItem;
						}

						return oVariantItem !== null;
					});

					assert.ok(oVariantItem);

					var oChange = this.oVariantManagement._getChange(oVariantItem.getKey());
					assert.ok(oChange);

					//var oChange = this.oVariantManagement._oControlPersistence._oChangePersistence._mVariantsChanges[this.oVariantManagement.getPersistencyKey()][oVariantItem.getKey()];
					var oContent = oChange.getContent();
					assert.ok(oContent);

					assert.deepEqual(oContent.key1, oContent1);
					assert.deepEqual(oContent.key2, oContent2);

					assert.ok(this.oVariantManagement._newVariant.calledOnce);
					assert.ok(!this.oVariantManagement._updateVariant.called);

					done();
				}.bind(this));
			}.bind(this));

		});


		QUnit.test("check mixed sync/async fetchVariant for update variant", function(assert) {

			var done = assert.async();

			var oContent1 = { test: "Control1" };
			var oContent2 = { test: "Control2" };
			var mChanges = createChangeStubs();
			mChanges["newId"] = createChangeStub("newId", {key1: oContent1, key2: oContent2});

			sinon.spy(this.oVariantManagement, "_newVariant");
			sinon.spy(this.oVariantManagement, "_updateVariant");
			stubLoadChanges(Promise.resolve(mChanges));
			stubIsVariantSharingEnabled(true);
			stubGetDefaultVariantId("*standard*");
			stubAddChange("newId");
			stubGetChange(this.oVariantManagement, mChanges);
			var fResolve;
			var oAfterSavePromise = new Promise(function(resolve, reject) {
				fResolve = resolve;
			});

			this.oVariantManagement.attachAfterSave(function(oEvent) {
				fResolve();
			});

			var oVariantInfo = {
				key: "2",
				text: "TWO",
				overwrite: true
			 };

			this.oVariantManagement.setPersistencyKey("DUMMY");

			sinon.stub(this.oVariantManagement, "_getExecuteOnSelectOnStandardVariant").returns(null);

			var oPersControlInfo = createControlInfo(this.oVariantManagement, "key1", true);
			var oControl1 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			oControl1.fCallback = sinon.stub();
			oControl1.fetchVariant = function() {
				return oContent1;
			};

			this.oVariantManagement.initialise(oControl1.fCallback, oControl1);

			oPersControlInfo = createControlInfo(this.oVariantManagement, "key2", true);
			var oControl2 = sap.ui.getCore().getControl(oPersControlInfo.getControl());
			oControl2.fCallback = oControl1.fCallback = sinon.stub();
			oControl2.fetchVariant = function() {

				var fTest, oPromise = new Promise(function(resolve, reject) {
					fTest = resolve;
				});
				setTimeout(function() {
					fTest(oContent2);
				}, 1000);

				return oPromise;
			};

			this.oVariantManagement.initialise(oControl2.fCallback, oControl2);

			this.oVariantManagement._oFlLibrary.then(function() {
				stubSave(Promise.resolve());
				assert.ok(!this.oVariantManagement._newVariant.called);
				assert.ok(!this.oVariantManagement._updateVariant.called);

				this.oVariantManagement.fireSave(oVariantInfo);

				oAfterSavePromise.then(function() {

					var oVariantItem = null;

					this.oVariantManagement.getVariantItems().some(function(oItem) {
						if (oItem.getText() === oVariantInfo.text) {
							oVariantItem = oItem;
						}

						return oVariantItem !== null;
					});

					assert.ok(oVariantItem);


					var oChange = this.oVariantManagement._getChange(oVariantItem.getKey());
					assert.ok(oChange);

					var oContent = oChange.getContent();
					assert.ok(oContent);


					assert.deepEqual(oContent.key1, oContent1);
					assert.deepEqual(oContent.key2, oContent2);

					assert.ok(!this.oVariantManagement._newVariant.called);
					assert.ok(this.oVariantManagement._updateVariant.calledOnce);

					done();
				}.bind(this));
			}.bind(this));

		});


		QUnit.start();
	});
});
