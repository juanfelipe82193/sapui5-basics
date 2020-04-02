// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine([], function () {
    "use strict";

    return {
        Double: 'Double',
        Integer: 'Integer',
        String: 'String',
        ImageUrl: 'ImageUrl',
        ImageBlob: 'ImageBlob',
        GeoJson: 'GeoJson', // Variants? 
        Date: 'Date', // Deprecated? Could use timestamp + a new format type instead
        Time: 'Time', // Deprecated? 
        Timestamp: 'Timestamp',
        Group: 'Group'
    };

});
