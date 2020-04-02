sap.ui.define([
    "sap/ushell/utils",
    "sap/ushell/services/Personalization"
], function (utils, Personalization) {
    "use strict";
    /* global sinon */

    function createPersonalizationAdapterMock (AdapterContainerMock) {
        var PersonalizationAdapterMock = function (oSystem) {
            this._sCONTAINER_PREFIX = "sap.ushell.personalization#";
            this._oContainerMap = new utils.Map();
            this._oErrorMap = new utils.Map(); // has to be outside the container
        };

        PersonalizationAdapterMock.prototype.setErrorProvocation = function (sContainerKey) {
            this._oErrorMap.put(this._sCONTAINER_PREFIX + sContainerKey, true);
        };

        PersonalizationAdapterMock.prototype.resetErrorProvocation = function (sContainerKey) {
            this._oErrorMap.put(this._sCONTAINER_PREFIX + sContainerKey, false);
        };


        // ---- Container ----
        PersonalizationAdapterMock.prototype.getAdapterContainer = function (sContainerKey) {
            var oContainer = {};

            if (this._oContainerMap.containsKey(sContainerKey)) {
                oContainer = this._oContainerMap.get(sContainerKey);
            } else {
                oContainer = new AdapterContainerMock(sContainerKey);
                oContainer._oErrorMap = this._oErrorMap; // dirty injection to keep the API of all adapters the same
                this._oContainerMap.put(sContainerKey, oContainer);
            }
            return oContainer;
        };

        PersonalizationAdapterMock.prototype.delAdapterContainer = function (sContainerKey) {
            var oDeferred = new jQuery.Deferred();

            this._oContainerMap.get(sContainerKey);
            if (this._oErrorMap.get(sContainerKey)) {
                oDeferred.reject();
            } else {
                oDeferred.resolve();
            }
            this._oContainerMap.remove(sContainerKey);
            return oDeferred.promise();
        };

        return PersonalizationAdapterMock;
    }

    function ensureSapUshellContainer () {
        sap = sap || {};
        sap.ushell = sap.ushell || {};
        sap.ushell.Container = sap.ushell.Container || { getService: function () {} };
    }

    function mockGetService() {
        ensureSapUshellContainer();

        var oGetServiceStub = sinon.stub(sap.ushell.Container, "getService");
        oGetServiceStub.withArgs("AppLifeCycle").returns({
            getCurrentApplication: sinon.stub().returns(undefined) /* important, see ContextContainer#_init */
        });
        oGetServiceStub.returns({});
    }

    function restoreGetService() {
        sap.ushell.Container.getService.restore();
    }

    /**
     * Creates the personalization service instance based on a certain
     * configuration (e.g., mocked adapters).
     *
     * @param {object} oConfig
     *   A build configuration like:
     *   <pre>
     *   {
     *      adapterContainerConstructor: <function>
     *   }
     *   </pre>
     *
     * @returns {object}
     *   The personalization service.
     * @private
     */
    function createPersonalizationService(oConfig) {
        var PersonalizationAdapterMock = createPersonalizationAdapterMock(oConfig.adapterContainerConstructor);

        var oAdapter = new PersonalizationAdapterMock({} /* oSystem */);
        var oService = new Personalization(oAdapter);

        return oService;
    }

    return {
        createPersonalizationAdapterMock: createPersonalizationAdapterMock,
        ensureSapUshellContainer: ensureSapUshellContainer,
        mockGetService: mockGetService,
        restoreGetService: restoreGetService,
        createPersonalizationService: createPersonalizationService
    };

}, false /* bExport */);
