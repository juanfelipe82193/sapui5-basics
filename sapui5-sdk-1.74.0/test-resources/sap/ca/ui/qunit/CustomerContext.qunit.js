jQuery.sap.require("sap.ca.ui.CustomerContext");
window.addEventListener("load", function () {
    test("Default paths", function () {
        var oData = {
            CustomerCollection: [
                {
                    CustomerName: "Becker Berlin",
                    CustomerID: "0000500098",
                    SalesOrganizationName: "IDES",
                    DistributionChannelName: "IDES America",
                    DivisionName: "Local Distributors"
                },
                {
                    CustomerName: "Clinton Industries",
                    CustomerID: "0000300701",
                    SalesOrganizationName: "AMID",
                    DistributionChannelName: "AMID Europe",
                    DivisionName: "Central shipment"
                },
                {
                    CustomerName: "JNM Manufacturing",
                    CustomerID: "JPMO002",
                    SalesOrganizationName: "CGU",
                    DistributionChannelName: "CGU Asia",
                    DivisionName: "Local Distributors"
                },
                {
                    CustomerName: "Jupp Schmitz & Soehne",
                    CustomerID: "0000500060",
                    SalesOrganizationName: "IDES",
                    DistributionChannelName: "IDES Australia",
                    DivisionName: "Central shipment"
                }
            ]
        };

        var model = new sap.ui.model.json.JSONModel(oData);

        var customerContext = new sap.ca.ui.CustomerContext({
            personalizationPageName: "SRA021_SD_INV_MON",
            showSalesArea: true,
            path: "/CustomerCollection"
        });

        customerContext.setModel(model);

        var i;
        var ccItems = customerContext._oList.getItems();
        for (i = 0; i < 4; i++) {
            strictEqual(ccItems[i].getCustomerName(), oData.CustomerCollection[i].CustomerName, "Customer name doesn't match!");
            strictEqual(ccItems[i].getCustomerID(), oData.CustomerCollection[i].CustomerID, "Customer ID doesn't match!");
            strictEqual(ccItems[i].getDistributionChannelName(), oData.CustomerCollection[i].DistributionChannelName, "DistributionChannelName doesn't match!");
            strictEqual(ccItems[i].getDivisionName(), oData.CustomerCollection[i].DivisionName, "DivisionName doesn't match!");
            strictEqual(ccItems[i].getSalesOrganizationName(), oData.CustomerCollection[i].SalesOrganizationName, "SalesOrganizationName doesn't match!");
        }

        customerContext.destroy();
    });

    test("Custom paths", function () {
        var oData = {
            CustomerCollection: [
                {
                    CName: "Becker Berlin",
                    CustomerNo: "0000500098",
                    SON: "IDES",
                    DCN: "IDES America",
                    DN: "Local Distributors"
                },
                {
                    CName: "Clinton Industries",
                    CustomerNo: "0000300701",
                    SON: "AMID",
                    DCN: "AMID Europe",
                    DN: "Central shipment"
                },
                {
                    CName: "JNM Manufacturing",
                    CustomerNo: "JPMO002",
                    SON: "CGU",
                    DCN: "CGU Asia",
                    DN: "Local Distributors"
                },
                {
                    CName: "Jupp Schmitz & Soehne",
                    CustomerNo: "0000500060",
                    SON: "IDES",
                    DCN: "IDES Australia",
                    DN: "Central shipment"
                }
            ]
        };

        var model = new sap.ui.model.json.JSONModel(oData);

        var customerContext = new sap.ca.ui.CustomerContext({
            personalizationPageName: "SRA021_SD_INV_MON",
            showSalesArea: true,
            path: "/CustomerCollection",
            customerIDProperty: "CustomerNo",
            customerNameProperty: "CName",
            salesOrganizationNameProperty: "SON",
            distributionChannelNameProperty: "DCN",
            divisionNameProperty: "DN"
        });

        customerContext.setModel(model);

        var i;
        var ccItems = customerContext._oList.getItems();
        for (i = 0; i < 4; i++) {
            strictEqual(ccItems[i].getCustomerName(), oData.CustomerCollection[i].CName, "Customer name doesn't match!");
            strictEqual(ccItems[i].getCustomerID(), oData.CustomerCollection[i].CustomerNo, "Customer ID doesn't match!");
            strictEqual(ccItems[i].getDistributionChannelName(), oData.CustomerCollection[i].DCN, "DistributionChannelName doesn't match!");
            strictEqual(ccItems[i].getDivisionName(), oData.CustomerCollection[i].DN, "DivisionName doesn't match!");
            strictEqual(ccItems[i].getSalesOrganizationName(), oData.CustomerCollection[i].SON, "SalesOrganizationName doesn't match!");
        }

        customerContext.destroy();
    });

    test("Filter", function () {
        var oData = {
            CustomerCollection: [
                {
                    CName: "Becker Berlin",
                    CustomerNo: "0000500098",
                    SON: "IDES",
                    DCN: "IDES America",
                    DN: "Local Distributors"
                },
                {
                    CName: "Clinton Industries",
                    CustomerNo: "0000300701",
                    SON: "AMID",
                    DCN: "AMID Europe",
                    DN: "Central shipment"
                },
                {
                    CName: "JNM Manufacturing",
                    CustomerNo: "JPMO002",
                    SON: "CGU",
                    DCN: "CGU Asia",
                    DN: "Local Distributors"
                },
                {
                    CName: "Jupp Schmitz & Soehne",
                    CustomerNo: "0000500060",
                    SON: "IDES",
                    DCN: "IDES Australia",
                    DN: "Central shipment ing"
                }
            ]
        };

        var model = new sap.ui.model.json.JSONModel(oData);

        var customerContext = new sap.ca.ui.CustomerContext({
            personalizationPageName: "SRA021_SD_INV_MON",
            showSalesArea: true,
            path: "/CustomerCollection",
            customerIDProperty: "CustomerNo",
            customerNameProperty: "CName",
            salesOrganizationNameProperty: "SON",
            distributionChannelNameProperty: "DCN",
            divisionNameProperty: "DN"
        });

        customerContext.setModel(model);
        var createEvent = function (value) {
            return {
                newValue: value,
                getParameter: function () {
                    return value;
                }
            };
        };

        customerContext._oDialog.placeAt("customerControl");
        customerContext._oDialog.open();
        sap.ui.getCore().applyChanges();
        customerContext._onLiveSearch(createEvent("in"));
        sap.ui.getCore().applyChanges();
        customerContext._onLiveSearch(createEvent("ing"));
        sap.ui.getCore().applyChanges();

        var ccItems = customerContext._oList.getItems();

        strictEqual(ccItems.length, 2, "filtering on ing should return 2 values");

        var innerText = customerContext._oDialog.$()[0].innerText;
        var i;
        i = 2; // indexOf JNM
        ok(innerText.indexOf(oData.CustomerCollection[i].CName) > -1, "Customer name doesn't match for " + i + "!");
        ok(innerText.indexOf(oData.CustomerCollection[i].CustomerNo) > -1, "Customer ID doesn't match for " + i + "!");
        ok(innerText.indexOf(oData.CustomerCollection[i].DCN) > -1, "DistributionChannelName doesn't match for " + i + "!");
        ok(innerText.indexOf(oData.CustomerCollection[i].DN) > -1, "DivisionName doesn't match for " + i + "!");
        ok(innerText.indexOf(oData.CustomerCollection[i].SON) > -1, "SalesOrganizationName doesn't match for " + i + "!");

        i = 3; // indexOf Jupp
        ok(innerText.indexOf(oData.CustomerCollection[i].CName) > -1, "Customer name doesn't match for " + i + "!");
        ok(innerText.indexOf(oData.CustomerCollection[i].CustomerNo) > -1, "Customer ID doesn't match for " + i + "!");
        ok(innerText.indexOf(oData.CustomerCollection[i].DCN) > -1, "DistributionChannelName doesn't match for " + i + "!");
        ok(innerText.indexOf(oData.CustomerCollection[i].DN) > -1, "DivisionName doesn't match for " + i + "!");
        ok(innerText.indexOf(oData.CustomerCollection[i].SON) > -1, "SalesOrganizationName doesn't match for " + i + "!");

        i = 0; // indexOf Becker Berlin
        ok(innerText.indexOf(oData.CustomerCollection[i].CName) == -1, "Customer name is visible for " + i + "!");

        i = 1; // indexOf Clinton Industries
        ok(innerText.indexOf(oData.CustomerCollection[i].CName) == -1, "Customer name is visible for " + i + "!");

        customerContext.destroy();
    });
});
