// Copyright (C) 2015 SAP SE or an SAP affiliate company. All rights reserved
sap.ui.define([
    "sap/ui/test/opaQunit"
], function (opaTest) {
    /*global QUnit */
    "use strict";
    var test = "Master, Detail and Fullscreen title",
        url = "master.title=MY_MASTER_TITLE&master.titleId=MASTER_TITLE_ID"
            + "&detail.title=MY_DETAIL_TITLE&detail.titleId=DETAIL_TITLE_ID"
            + "&fullscreen.title=MY_FULL_TITLE&fullscreen.titleId=FULL_TITLE_ID"

    QUnit.module("sap.ca.scfld.stableids.opa.TitleTest");

    // regression test
    opaTest(test + " - without stable IDs", function (Given, When, Then) {
        Given.iStartMyApp(url);
        Then.onTheMaster.checkId(true, "title", undefined, "MY_MASTER_TITLE");
        Then.onTheDetail.checkId(true, "title", undefined, "MY_DETAIL_TITLE");
        When.onTheDetail.goToFullscreen();
        Then.onTheFullscreen.checkId(true, "title", undefined, "MY_FULL_TITLE");
        Then.iTeardownMyAppFrame();
    });

    // with stable IDs
    opaTest(test + " - with stable IDs", function (Given, When, Then) {
        Given.iStartMyApp("stableIDs=true&" + url);
        Then.onTheMaster.checkId(false, "title", "MASTER_TITLE_ID", "MY_MASTER_TITLE");
        Then.onTheDetail.checkId(false, "title", "DETAIL_TITLE_ID", "MY_DETAIL_TITLE");
        When.onTheDetail.goToFullscreen();
        Then.onTheFullscreen.checkId(false, "title", "FULL_TITLE_ID", "MY_FULL_TITLE");
        Then.iTeardownMyAppFrame();
    });

    // negative test
    opaTest("negative tests", function (Given, When, Then) {
        Given.iStartMyApp("master.title=MY_MASTER_TITLE&master.titleId= " +
                "&detail.title=MY_DETAIL_TITLE&detail.titleId=INVALID%2F-ID");
        Then.onTheMaster.checkId(true, "title", undefined, "MY_MASTER_TITLE");
        Then.onTheDetail.checkId(true, "title", undefined, "MY_DETAIL_TITLE");
        Then.iTeardownMyAppFrame();
    });

});