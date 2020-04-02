// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([], function () {
    "use strict";
    /*global sap */

    function AppStatePersistencySettings (sCreatorUserID, aSelectedUserIDs, aRetrievalMapping, tsExpiration) {
        this.CreatorUserID = sCreatorUserID;
        this.SelectedUserIDs = aSelectedUserIDs; //array of Strings
        this.RetrievalMapping = aRetrievalMapping; //array of Objects
        this.Expiration = tsExpiration; //timestamp
    }

    return AppStatePersistencySettings;
});
