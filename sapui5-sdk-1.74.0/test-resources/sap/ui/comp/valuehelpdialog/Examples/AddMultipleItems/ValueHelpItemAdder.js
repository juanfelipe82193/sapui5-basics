sap.ui.define([
    'sap/ui/core/Element',
    'sap/ui/base/ManagedObject',
    'sap/ui/comp/valuehelpdialog/ValueHelpDialog',
    'sap/ui/comp/smartfilterbar/SmartFilterBar',
    'sap/ui/Device',
    'sap/ui/layout/HorizontalLayout',
    'sap/ui/model/json/JSONModel'
], function (Element, ManagedObject, ValueHelpDialog, SmartFilterBar, Device, HorizontalLayout, JSONModel) {
    "use strict";

    var ValueHelpItemAdder = Element.extend("sap.ui.comp.valuehelpdialog.example.AddMultipleItems.ValueHelpItemAdder", {

        oValueHelpDialog: null,
        pValueLists: null,
        VIEW: null,
        PATH: null,

        /**
         * Creates a ValueHelpItemAdder
         *
         * @param {object} oView the view where this ValueHelpItemAdder is used in
         * @param {String} sPropertyPath The path to the property that shall be filled/selected
         */
        constructor: function (oView, sPropertyPath) {
            Element.apply(this /* No arguments as they do not match the "normal" Element structure */);
            this.VIEW = oView;
            this.PATH = sPropertyPath;
            this.VIEW.addDependent(this);
            this.VIEW.getModel().getMetaModel().loaded().then(function () {
                this.pValueLists = this.VIEW.getModel().getMetaModel().getODataValueLists(this.VIEW.getModel().getMetaModel().getMetaContext(this.PATH));
            }.bind(this));
        }
    });


    /**
     * Opens the ValueHelp Dialog according to the given data
     *
     * @param {String} [sValueListQualifier] Qualifier of the ValueList Annotation that shall be used
     * @param {Map} [mFilterValues] Values for filter fields that shall be prefilled (e.g. IN parameter) NOT IMPLEMENTED
     * @param {Array} [aPreselectedKeys] An array of keys of values (rows) that shall be selected directly NOT IMPLEMENTED
     *
     * @returns {Promise} Resolves with an array of the selected entries or is rejected when user cancels the operation
     *
     * @public
     */
    ValueHelpItemAdder.prototype.open = function (sValueListQualifier /* , mFilterValues, aPreselectedKeys */) {

        return this.pValueLists.then(function (oValueListAnnotations) {
            if (sValueListQualifier == undefined || sValueListQualifier == null) {
                sValueListQualifier = "";
            }
            var oValueHelpDialog = this.getValueHelpDialog(oValueListAnnotations[sValueListQualifier]);

            return new Promise(function (fnResolve, fnReject) {
                oValueHelpDialog.attachOk(function () {
                    //TODO may break on m.Table -> mobile Use Case
                    var aIndices = oValueHelpDialog.getTable().getSelectedIndices();
                    var aReturnData = [];
                    var oContext;
                    for (var i = 0; i < aIndices.length; i++){
                        oContext = oValueHelpDialog.getTable().getContextByIndex(aIndices[i]);
                        //TODO Provide the selected Items according to the ValueList definition (OUT Parameters)

                        aReturnData.push({
                            Id: oContext.getModel().getObject(oContext.getPath()).Id
                        });

                    }
                    oValueHelpDialog.close();

                    fnResolve(aReturnData);
                });

                oValueHelpDialog.attachCancel(function () {
                    oValueHelpDialog.close();
                    fnReject();
                });

                oValueHelpDialog.open();
            });
        }.bind(this));
    };


    /**
     * Returns a ValueHelpDialog
     *
     * @private
     */
    ValueHelpItemAdder.prototype.getValueHelpDialog = function (oValueList) {

        if (this.oValueHelpDialog == null || this._oValueList != oValueList) {

            this._oValueList = oValueList;
            if (this.oValueHelpDialog){
                this.oValueHelpDialog.destroy();
            }

            // Create ValueHelpDialog
            this.oValueHelpDialog = new ValueHelpDialog({
                title: oValueList.Label.String,
                key: "Id",
                stretch: Device.system.desktop
            });
            this.VIEW.addDependent(this.oValueHelpDialog);
            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.VIEW, this.oValueHelpDialog);
            jQuery.sap.syncStyleClass("sapUiSizeCozy", this.VIEW, this.oValueHelpDialog);

            //Create SmartFilterBar
            var oSmartFilterBar = new SmartFilterBar(this.oValueHelpDialog.getId() + "-smartFilterBar", {
                entitySet: oValueList.CollectionPath.String,
                enableBasicSearch: (oValueList.SearchSupported && oValueList.SearchSupported.Bool === "true"),
                advancedMode: true,
                showGoOnFB: !sap.ui.Device.system.phone,
                search: function () {
                    this._rebindTable(oSmartFilterBar, oValueList.CollectionPath.String);
                }.bind(this)
            });

            oSmartFilterBar.isRunningInValueHelpDialog = true;
            this.oValueHelpDialog.setFilterBar(oSmartFilterBar);

            //Set up table
            var aColumns = [];
            for (var i = 0; i < oValueList.Parameters.length; i++){
                if (oValueList.Parameters[i].RecordType == "com.sap.vocabularies.Common.v1.ValueListParameterInOut") {
                    aColumns.push({
                        label: oValueList.Parameters[i].ValueListProperty.String,
                        template: oValueList.Parameters[i].ValueListProperty.String
                    });
                } else if (oValueList.Parameters[i].RecordType == "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly") {
                    aColumns.push({
                        label: oValueList.Parameters[i].ValueListProperty.String,
                        template: oValueList.Parameters[i].ValueListProperty.String
                    });
                }
            }

            var oColModel = new JSONModel();
            oColModel.setData({
                cols: aColumns
            });

            this.oValueHelpDialog.getTable().setModel(oColModel, "columns");
        }

        return this.oValueHelpDialog;
    };

    /**
	 * Binds the table taking current filters and parameters into account
     *
     * @param {object} oSmartFilterBar
     * @param {string} sEntitySetName
     *
	 * @private
	 */
    ValueHelpItemAdder.prototype._rebindTable = function (oSmartFilterBar, sEntitySetName) {
        var mBindingParams, oTable;

        mBindingParams = {
            path: "/" + sEntitySetName,
            filters: oSmartFilterBar.getFilters(),
            events: {
                dataReceived: function (oEvt) {
                    oTable.setBusy(false);
                    var oBinding = oEvt.getSource(), iBindingLength;
                    if (oBinding && this.oValueHelpDialog && this.oValueHelpDialog.isOpen()) {
                        iBindingLength = oBinding.getLength();
                        if (iBindingLength) {
                            this.oValueHelpDialog.update();
                        }
                    }
                }.bind(this)
            }
        };

        oTable = this.oValueHelpDialog.getTable();
        oTable.setShowOverlay(false);
        oTable.setBusy(true);
        if (oTable instanceof sap.m.Table) {
            mBindingParams.factory = function (sId, oContext) {
                var aCols = oTable.getModel("columns").getData().cols;
                return new sap.m.ColumnListItem({
                    cells: aCols.map(function (column) {
                        var colname = column.template;
                        return new sap.m.Label({
                            text: "{" + colname + "}"
                        });
                    })
                });
            };
            oTable.bindItems(mBindingParams);
        } else {
            oTable.bindRows(mBindingParams);
        }
    };


    /**
     * Destroys the ValueHelpItemAdder and all its children
     *
     * @public
     */
    ValueHelpItemAdder.prototype.destroy = function () {
        this.oValueHelpDialog.destroy();
    };

    return ValueHelpItemAdder;
}, true);