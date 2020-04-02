// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine, window */
sinaDefine(['./SinaObject'], function (SinaObject) {
    "use strict";

    return SinaObject.derive({

        _meta: {
            properties: {
                targetUrl: {
                    required: true
                },
                label: {
                    required: true
                },
                target: { // as in <a href="" target="_blank">...</a>
                    required: false
                }
            }
        },

        performNavigation: function (params) {
            params = params || {};
            var trackingOnly = params.trackingOnly || false;
            if (!trackingOnly) {
                if (this.target) {
                    window.open(this.targetUrl, this.target);
                } else {
                    window.open(this.targetUrl);
                }
            }
        },

        isEqualTo: function (otherNavigationObject) {
            if (!otherNavigationObject) {
                return false;
            }
            return this.targetUrl == otherNavigationObject.targetUrl;
        }
    });
});
