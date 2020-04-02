// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([], function () {
    "use strict";
    /*global sap */

    function AppStatePersistencyMethod () {
        this.PersonalState = "PersonalState";
        this.ACLProtectedState = "ACLProtectedState";
        this.PublicState = "PublicState";
        this.AuthorizationProtectedState = "AuthorizationProtectedState";
    }

    return new AppStatePersistencyMethod();
});
