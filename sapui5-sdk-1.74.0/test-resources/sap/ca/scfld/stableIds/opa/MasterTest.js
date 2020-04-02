// Copyright (C) 2015 SAP SE or an SAP affiliate company. All rights reserved
sap.ui.define([
    "sap/ui/test/opaQunit"
], function (opaTest) {
    /*global QUnit */
    "use strict";

    QUnit.module("sap.ca.scfld.stableids.opa.MasterTest");

    [
        {test: "Add", url: "master.add", generic: "add"},
        {test: "Back", url: "master.buttonlist=3", generic: "back"},
        {test: "Edit", url: "master.edit", generic: "edit"},
        {test: "Filter", url: "master.filter", generic: "filter"},
        {test: "Filter with items", url: "master.filter&master.filter.items=a,b,c",
            generic: "filterSelect"},
        {test: "Filter with items - check inherited item ID",
            click: {control: "filterSelect", text: undefined},
            generic: "filterItem",
            id: "scfld_FILTER_SELECT_0",
            text: "a",
            url: "master.filter&master.filter.items=a,b,c"},
        {test: "Filter with ID with items - check inherited item ID",
            click: {control: "filterSelect", text: undefined},
            generic: "filterItem",
            id: "bar_SELECT_0",
            text: "a",
            url: "master.filter&master.filter.id=bar&master.filter.items=a,b,c"},
        {test: "Filter with items with ID",
            click: {control: "filterSelect", text: undefined},
            fixId: "IDa",
            generic: "filterItem",
            text: "a",
            url: "master.filter&master.filter.items=a:IDa,b,c"},
        {test: "Group", url: "master.group", generic: "group"},
        {test: "Group with items", url: "master.group&master.group.items=a,b,c",
            generic: "groupSelect"},
        {test: "Group with items - check inherited item ID",
            click: {control: "groupSelect", text: undefined},
            generic: "groupItem",
            id: "scfld_GROUP_SELECT_0",
            text: "a",
            url: "master.group&master.group.items=a,b,c"},

        {test: "Overflow", url: "master.buttonlist=3", generic: "overflow"},
        {test: "Search", url: "", generic: "search"},
        {test: "Sort", url: "master.sort", generic: "sort"},
        {test: "Sort with items", url: "master.sort&master.sort.items=a,b,c",
            generic: "sortSelect"},
        {test: "Userbuttons",
            url: "master.buttonlist=1&master.buttonlist.0.text=bar" +
                "&master.buttonlist.0.id=barId",
            id: "barId", generic: "appButton", text: "bar"},
        {test: "Add Own ID", url: "master.add&master.add.id=MY_ADD",
            generic: "add", id: "MY_ADD"},
        {test: "Edit Own ID", url: "master.edit&master.edit.id=MY_EDIT",
            generic: "edit", id: "MY_EDIT"},
        {test: "Filter Own ID", url: "master.filter&master.filter.id=MY_FILTER",
            generic: "filter", id: "MY_FILTER"},
        {test: "Filter Own ID with items",
            url: "master.filter&master.filter.id=MY_FILTER&master.filter.items=a,b,c",
            generic: "filterSelect", id: "MY_FILTER_SELECT"},
        {test: "Group Own ID with items",
            url: "master.group&master.group.id=MY_GROUP&master.group.items=a,b,c",
            generic: "groupSelect", id: "MY_GROUP_SELECT"},
        {test: "Group Own ID", url: "master.group&master.group.id=MY_GROUP",
            generic: "group", id: "MY_GROUP"},
        {test: "Sort Own ID", url: "master.sort&master.sort.id=MY_SORT",
            generic: "sort", id: "MY_SORT"},
        {test: "Sort Own ID with items",
            url: "master.sort&master.sort.id=MY_SORT&master.sort.items=a,b,c",
            generic: "sortSelect", id: "MY_SORT_SELECT"},
        {test: "Sort with items - check inherited item ID",
            click: {control: "sortSelect", text: undefined},
            generic: "sortItem",
            id: "scfld_SORT_SELECT_0",
            text: "a",
            url: "master.sort&master.sort.items=a,b,c"},
        {test: "Filter Own invalid ID", url: "master.filter&master.filter.id=123ABC",
            generic: "filter", id: "scfld_FILTER"},
        {test: "Filter with items and Own invalid ID",
            url: "master.filter&master.filter.id=123ABC&master.filter.items=a,b,c",
            generic: "filterSelect", id: "scfld_FILTER_SELECT"},
        {test: "Userbuttons invalid ID",
            url: "master.buttonlist=1&master.buttonlist.0.text=bar" +
                "&master.buttonlist.0.id=123barId",
            id: undefined, generic: "appButton", text: "bar"},
        {test: "Userbuttons no ID",
            url: "master.buttonlist=1&master.buttonlist.0.text=bar",
            id: undefined, generic: "appButton", text: "bar"}
    ].forEach (function (oFixture) {
        // regression test
        opaTest(oFixture.test + " - Regression Test", function (Given, When, Then) {
            Given.iStartMyApp(oFixture.url);
            if (oFixture.click) {
                When.onTheMaster.click(oFixture.click.control, oFixture.click.text);
            }
            Then.onTheMaster.checkId(true, oFixture.generic, oFixture.id, oFixture.text,
                oFixture.fixId);
            Then.iTeardownMyAppFrame();
        });

        // with stable IDs
        opaTest(oFixture.test + " - with stable IDs", function (Given, When, Then) {
            Given.iStartMyApp("stableIDs=true&" + oFixture.url);
            if (oFixture.click) {
                When.onTheMaster.click(oFixture.click.control, oFixture.click.text);
            }
            Then.onTheMaster.checkId(false, oFixture.generic, oFixture.id, oFixture.text,
                oFixture.fixId);
            Then.iTeardownMyAppFrame();
        });
    });

    [
        {test: "Filter", url: "master.buttonlist=4&master.filter", generic: "filter"},
        {test: "Filter with items",
            url: "master.buttonlist=4&master.filter&master.filter.items=a,b,c",
            generic: "filter"},
        {test: "Group", url: "master.buttonlist=4&master.group", generic: "group"},
        {test: "Group with items",
            url: "master.buttonlist=4&master.group&master.group.items=a,b,c",
            generic: "group"},
        {test: "Sort", url: "master.buttonlist=4&master.sort", generic: "sort"},
        {test: "Sort with items", url: "master.buttonlist=4&master.sort&master.sort.items=a,b,c",
            generic: "sort"},
        {test: "Userbuttons",
            url: "master.buttonlist=4&master.buttonlist.3.text=bar" +
                "&master.buttonlist.3.id=barId",
            id: "barId", generic: "appButton", text: "bar"},
        {test: "Filter Own ID",
            url: "master.buttonlist=4&master.filter&master.filter.id=MY_FILTER",
            generic: "filter", id: "MY_FILTER"},
        {test: "Filter Own ID with items",
            url: "master.buttonlist=4&master.filter&master.filter.id=MY_FILTER" +
                "&master.filter.items=a,b,c",
            generic: "filter", id: "MY_FILTER"},
        {test: "Group Own ID with items",
            url: "master.buttonlist=4&master.group&master.group.id=MY_GROUP" +
                "&master.group.items=a,b,c",
            generic: "group", id: "MY_GROUP"},
        {test: "Group Own ID", url: "master.buttonlist=4&master.group&master.group.id=MY_GROUP",
            generic: "group", id: "MY_GROUP"},
        {test: "Sort Own ID", url: "master.buttonlist=4&master.sort&master.sort.id=MY_SORT",
            generic: "sort", id: "MY_SORT"},
        {test: "Sort Own ID with items",
            url: "master.buttonlist=4&master.sort&master.sort.id=MY_SORT&master.sort.items=a,b,c",
            generic: "sort", id: "MY_SORT"},
        {test: "Filter Own invalid ID",
            url: "master.buttonlist=4&master.filter&master.filter.id=123ABC",
            generic: "filter", id: "scfld_FILTER"},
        {test: "Filter with items and Own invalid ID",
            url: "master.buttonlist=4&master.filter&master.filter.id=123ABC" +
                "&master.filter.items=a,b,c",
            generic: "filter", id: "scfld_FILTER"},
        {test: "Userbuttons invalid ID",
            url: "master.buttonlist=4&master.buttonlist.3.text=bar" +
                "&master.buttonlist.3.id=123barId",
            id: undefined, generic: "appButton", text: "bar"},
        {test: "Userbuttons no ID",
            url: "master.buttonlist=4&master.buttonlist.3.text=bar",
            id: undefined, generic: "appButton", text: "bar"}
    ].forEach(function (oFixture) {
        // regression test
        opaTest(oFixture.test + "- in Overflow - Regression Test", function (Given, When, Then) {
            Given.iStartMyApp(oFixture.url);
            When.onTheMaster.click("overflow", undefined);
            Then.onTheMaster.checkIdInOverflow(true, oFixture.generic, oFixture.id,
                oFixture.text);
            Then.iTeardownMyAppFrame();
        });

        // with stable IDs
        opaTest(oFixture.test + "- in Overflow - with stable IDs", function (Given, When, Then) {
            Given.iStartMyApp("stableIDs=true&" + oFixture.url);
            When.onTheMaster.click("overflow", undefined);
            Then.onTheMaster.checkIdInOverflow(false, oFixture.generic, oFixture.id,
                oFixture.text);
            Then.iTeardownMyAppFrame();
        });
    });
});