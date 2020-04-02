// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/services/UserInfo",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/base/Log"
], function (UserInfo, AppRuntimeService, Log) {
    "use strict";

    function UserInfoProxy (oAdapter, oContainerInterface) {
        UserInfo.call(this, oAdapter, oContainerInterface);

        this.getUser = function () {
            Log.warning("'UserInfo.getUser' is private API and should not be called");
        };

        this.getThemeList = function () {
            Log.warning("'UserInfo.getThemeList' is private API and should not be called");
        };

        this.updateUserPreferences = function () {
            Log.warning("'UserInfo.updateUserPreferences' is private API and should not be called");
        };

        this.getLanguageList = function () {
            Log.warning("'UserInfo.getLanguageList' is private API and should not be called");
        };
    }

    UserInfoProxy.prototype = Object.create(UserInfo.prototype);
    UserInfoProxy.hasNoAdapter = UserInfo.hasNoAdapter;

    return UserInfoProxy;
}, true);
