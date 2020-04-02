// Copyright (C) 2015 SAP SE or an SAP affiliate company. All rights reserved
sap.ui.define([
    "sap/ui/test/opaQunit"
], function (opaTest) {
    /*global QUnit */
    "use strict";

    QUnit.module("sap.ca.scfld.stableids.opa.DetailTest");

    [
        {test: "Edit", url: "detail.edit", generic: "editDetail"},
        {test: "Edit Own ID", url: "detail.edit&detail.edit.id=MY_EDIT", generic: "editDetail",
            id: "MY_EDIT"},
        {test: "Positive", url: "detail.positive", generic: "positive"},
        {test: "Positive Own ID", url: "detail.positive&detail.positive.id=MY_POSITIVE",
            generic: "positive", id: "MY_POSITIVE"},
        {test: "Negative", url: "detail.negative", generic: "negative"},
        {test: "Negative Own ID", url: "detail.negative&detail.negative.id=MY_NEGATIVE",
            generic: "negative", id: "MY_NEGATIVE"},
        {test: "Overflow", url: "detail.buttonlist=100", generic: "overflow"},
        {test: "Userbuttons",
            url: "detail.buttonlist=1&detail.buttonlist.0.text=bar" +
                "&detail.buttonlist.0.id=barId",
            id: "barId", generic: "appButton", text: "bar"},
        {test: "Userbuttons invalid ID",
            url: "detail.buttonlist=1&detail.buttonlist.0.text=bar" +
                "&detail.buttonlist.0.id=123barId",
            id: undefined, generic: "appButton", text: "bar"},
        {test: "Userbuttons no ID",
            url: "detail.buttonlist=1&detail.buttonlist.0.text=bar",
            id: undefined, generic: "appButton", text: "bar"},
        {test: "Share", url: "", generic: "share"},
        {test: "Email", url: "detail.email", generic: "mail",
            click: {control: "share"}},
        {test: "JAMShare", url: "detail.jamshare", generic: "jam_share",
            click: {control: "share"}},
        {test: "JAMDiscuss", url: "detail.jamdiscuss", generic: "jam_discuss",
            click: {control: "share"}},
        {test: "Save as Tile", url: "", generic: "addbookmark",
            click: {control: "share"}},
        {test: "Additional Share buttons",
            url: "detail.sharebuttons=1&detail.sharebuttons.0.text=MYSHARE", text: "MYSHARE",
            generic: "additionalShare", click: {control: "share"}},
        {test: "Additional Share buttons Own IDs",
            url: "detail.sharebuttons=1&detail.sharebuttons.0.text=MYSHARE&" +
                "detail.sharebuttons.0.id=MYSHAREID", text: "MYSHARE", id: "MYSHAREID",
            generic: "additionalShare", click: {control: "share"}}
    ].forEach(function (oFixture) {
        // regression test
        opaTest(oFixture.test + " - Regression Test", function (Given, When, Then) {
            Given.iStartMyApp(oFixture.url);
            if (oFixture.click) {
                When.onTheDetail.click(oFixture.click.control, oFixture.click.text);
            }
            Then.onTheDetail.checkId(true, oFixture.generic, oFixture.id, oFixture.text,
                oFixture.fixId);
            Then.iTeardownMyAppFrame();
        });

        // with stable IDs
        opaTest(oFixture.test + " - with stable IDs", function (Given, When, Then) {
            Given.iStartMyApp("stableIDs=true&" + oFixture.url);
            if (oFixture.click) {
                When.onTheDetail.click(oFixture.click.control, oFixture.click.text);
            }
            Then.onTheDetail.checkId(false, oFixture.generic, oFixture.id, oFixture.text,
                oFixture.fixId);
            Then.iTeardownMyAppFrame();
        });
    });
});