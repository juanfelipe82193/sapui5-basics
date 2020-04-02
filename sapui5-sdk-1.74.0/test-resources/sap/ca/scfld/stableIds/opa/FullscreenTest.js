// Copyright (C) 2015 SAP SE or an SAP affiliate company. All rights reserved
sap.ui.define([
    "sap/ui/test/opaQunit"
], function (opaTest) {
    /*global QUnit */
    "use strict";

    QUnit.module("sap.ca.scfld.stableids.opa.FullscreenTest");

    [
        {test: "Edit", url: "fullscreen.edit", generic: "editDetail"},
        {test: "Filter", url: "fullscreen.filter", generic: "filter"},
        {test: "Filter with items", url: "fullscreen.filter&fullscreen.filter.items=a,b,c",
            generic: "filterSelect"},
        {test: "Filter with items - check inherited item ID",
            click: {control: "filterSelect", text: undefined},
            generic: "filterItem",
            id: "scfld_FILTER_SELECT_0",
            text: "a",
            url: "fullscreen.filter&fullscreen.filter.items=a,b,c"},
        {test: "Filter with ID with items - check inherited item ID",
            click: {control: "filterSelect", text: undefined},
            generic: "filterItem",
            id: "bar_SELECT_0",
            text: "a",
            url: "fullscreen.filter&fullscreen.filter.id=bar&fullscreen.filter.items=a,b,c"},
        {test: "Filter with items with ID",
            click: {control: "filterSelect", text: undefined},
            fixId: "IDa",
            generic: "filterItem",
            text: "a",
            url: "fullscreen.filter&fullscreen.filter.items=a:IDa,b,c"},
        {test: "Group", url: "fullscreen.group", generic: "group"},
        {test: "Group with items", url: "fullscreen.group&fullscreen.group.items=a,b,c",
            generic: "groupSelect"},
        {test: "Group with items - check inherited item ID",
            click: {control: "groupSelect", text: undefined},
            generic: "groupItem",
            id: "scfld_GROUP_SELECT_0",
            text: "a",
            url: "fullscreen.group&fullscreen.group.items=a,b,c"},
        {test: "Positive", url: "fullscreen.positive", generic: "positive"},
        {test: "Positive Own ID",
            url: "fullscreen.positive&fullscreen.positive.id=MY_POSITIVE",
            generic: "positive", id: "MY_POSITIVE"},
        {test: "Negative", url: "fullscreen.negative", generic: "negative"},
        {test: "Negative Own ID",
            url: "fullscreen.negative&fullscreen.negative.id=MY_NEGATIVE",
            generic: "negative", id: "MY_NEGATIVE"},
        {test: "Overflow", url: "fullscreen.buttonlist=50", generic: "overflow"},
        {test: "Sort", url: "fullscreen.sort", generic: "sort"},
        {test: "Sort with items", url: "fullscreen.sort&fullscreen.sort.items=a,b,c",
            generic: "sortSelect"},
        {test: "Userbuttons",
            url: "fullscreen.buttonlist=1&fullscreen.buttonlist.0.text=bar" +
                "&fullscreen.buttonlist.0.id=barId",
            id: "barId", generic: "appButton", text: "bar"},
        {test: "Edit Own ID", url: "fullscreen.edit&fullscreen.edit.id=MY_EDIT",
            generic: "editDetail", id: "MY_EDIT"},
        {test: "Filter Own ID", url: "fullscreen.filter&fullscreen.filter.id=MY_FILTER",
            generic: "filter", id: "MY_FILTER"},
        {test: "Filter Own ID with items",
            url: "fullscreen.filter&fullscreen.filter.id=MY_FILTER&" +
                "fullscreen.filter.items=a,b,c",
            generic: "filterSelect", id: "MY_FILTER_SELECT"},
        {test: "Group Own ID with items",
            url: "fullscreen.group&fullscreen.group.id=MY_GROUP&fullscreen.group.items=a,b,c",
            generic: "groupSelect", id: "MY_GROUP_SELECT"},
        {test: "Group Own ID", url: "fullscreen.group&fullscreen.group.id=MY_GROUP",
            generic: "group", id: "MY_GROUP"},
        {test: "Sort Own ID", url: "fullscreen.sort&fullscreen.sort.id=MY_SORT",
            generic: "sort", id: "MY_SORT"},
        {test: "Sort Own ID with items",
            url: "fullscreen.sort&fullscreen.sort.id=MY_SORT&fullscreen.sort.items=a,b,c",
            generic: "sortSelect", id: "MY_SORT_SELECT"},
        {test: "Sort with items - check inherited item ID",
            click: {control: "sortSelect", text: undefined},
            generic: "sortItem",
            id: "scfld_SORT_SELECT_0",
            text: "a",
            url: "fullscreen.sort&fullscreen.sort.items=a,b,c"},
        {test: "Filter Own invalid ID", url: "fullscreen.filter&fullscreen.filter.id=123ABC",
            generic: "filter", id: "scfld_FILTER"},
        {test: "Filter with items and Own invalid ID",
            url: "fullscreen.filter&fullscreen.filter.id=123ABC&fullscreen.filter.items=a,b,c",
            generic: "filterSelect", id: "scfld_FILTER_SELECT"},
        {test: "Userbuttons invalid ID",
            url: "fullscreen.buttonlist=1&fullscreen.buttonlist.0.text=bar" +
                "&fullscreen.buttonlist.0.id=123barId",
            id: undefined, generic: "appButton", text: "bar"},
        {test: "Userbuttons no ID",
            url: "fullscreen.buttonlist=1&fullscreen.buttonlist.0.text=bar",
            id: undefined, generic: "appButton", text: "bar"},
        {test: "Share", url: "", generic: "share"},
        {test: "Email", url: "fullscreen.email", generic: "mail",
            click: {control: "share"}},
        {test: "JAMShare", url: "fullscreen.jamshare", generic: "jam_share",
            click: {control: "share"}},
        {test: "JAMDiscuss", url: "fullscreen.jamdiscuss", generic: "jam_discuss",
            click: {control: "share"}},
        {test: "Save as Tile", url: "", generic: "addbookmark",
            click: {control: "share"}},
        {test: "Additional Share buttons",
            url: "fullscreen.sharebuttons=1&fullscreen.sharebuttons.0.text=MYSHARE",
            text: "MYSHARE", generic: "additionalShare", click: {control: "share"}},
        {test: "Additional Share buttons Own IDs",
            url: "fullscreen.sharebuttons=1&fullscreen.sharebuttons.0.text=MYSHARE&" +
                "fullscreen.sharebuttons.0.id=MYSHAREID", text: "MYSHARE", id: "MYSHAREID",
            generic: "additionalShare", click: {control: "share"}}
    ].forEach(function (oFixture) {
        // regression test
        opaTest(oFixture.test + " - Regression Test", function (Given, When, Then) {
            Given.iStartMyApp(oFixture.url);
            When.onTheDetail.goToFullscreen();
            if (oFixture.click) {
                When.onTheFullscreen.click(oFixture.click.control, oFixture.click.text);
            }
            Then.onTheFullscreen.checkId(true, oFixture.generic, oFixture.id, oFixture.text,
                oFixture.fixId);
            Then.iTeardownMyAppFrame();
        });

        // with stable IDs
        opaTest(oFixture.test + " - with stable IDs", function (Given, When, Then) {
            Given.iStartMyApp("stableIDs=true&" + oFixture.url);
            When.onTheDetail.goToFullscreen();
            if (oFixture.click) {
                When.onTheFullscreen.click(oFixture.click.control, oFixture.click.text);
            }
            Then.onTheFullscreen.checkId(false, oFixture.generic, oFixture.id, oFixture.text,
                oFixture.fixId);
            Then.iTeardownMyAppFrame();
        });
    });
});