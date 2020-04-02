// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine([], function () {
    "use strict";

    var module = {};

    module.searchRequest = {
        "d": {
            "Id": "1",
            "QueryOptions": {
                "SearchTerms": "",
                "Top": 10,
                "Skip": 0,
                "SearchType": "",
                "ClientSessionID": "",
                //"ClientCallTimestamp": "", // "\/Date(1496917054000)\/"
                "ClientServiceName": "",
                "ClientLastExecutionID": ""
            },
            "DataSources": [],
            "OrderBy": [],
            "ResultList": {
                "SearchResults": [{
                    "HitAttributes": [],
                    "Attributes": []
                }]
            },
            "ExecutionDetails": [],
            "MaxFacetValues": 5,
            "Facets": [{
                "Values": []
            }]
        }
    };

    module.nlqSearchRequest = {
        "d": {
            "Id": "1",
            "ActivateNLQ": true,
            "QueryOptions": {
                "SearchTerms": "",
                "Top": 10,
                "Skip": 0,
                "SearchType": "",
                "ClientSessionID": "",
                //"ClientCallTimestamp": "", // "\/Date(1496917054000)\/"
                "ClientServiceName": "",
                "ClientLastExecutionID": ""
            },
            "DataSources": [],
            "OrderBy": [],
            "ResultList": {
                "SearchResults": [{
                    "HitAttributes": [],
                    "Attributes": []
                }],
                "NLQQueries": [{
                    "NLQConnectorQueries": [{
                        "SearchFilter": {
                            "SubFilters": [{
                                "SubFilters": [{
                                    "SubFilters": [{
                                        "SubFilters": [{
                                            "SubFilters": [{
                                                "SubFilters": [

                                                ]
                                            }]
                                        }]
                                    }]
                                }]
                            }]
                        }
                    }]
                }]
            },
            "ExecutionDetails": [],
            "MaxFacetValues": 5,
            "Facets": [{
                "Values": []
            }]
        }
    };

    module.chartRequest = {
        "d": {
            "Id": "1",
            "DataSources": [],
            "QueryOptions": {
                "SearchTerms": "",
                "Skip": 0,
                "SearchType": "F"
            },
            "FacetRequests": [], //conditionGroupsByAttributes
            "MaxFacetValues": 5,
            "Facets": [{
                "Values": []
            }],
            "ExecutionDetails": []
        }
    };

    module.valueHelperRequest = {
        "d": {
            "Id": "1",
            "ValueHelpAttribute": "",
            "ValueFilter": "",
            "DataSources": [],
            "QueryOptions": {
                //"SearchTerms" : "",
                "Top": 1000,
                "Skip": 0,
                "SearchType": "V"
            },
            "ValueHelp": []
        }
    };

    module.suggestionRequest = {
        "d": {
            "Id": "1",
            "SuggestionInput": "",
            "IncludeAttributeSuggestions": false,
            "IncludeHistorySuggestions": false,
            "IncludeDataSourceSuggestions": false,
            "DetailLevel": 1,
            "QueryOptions": {
                "Top": 0,
                "Skip": 0,
                "SearchType": "S",
                "SearchTerms": ""
            },
            "Filter": {},
            "DataSources": [],
            "Suggestions": [],
            "ExecutionDetails": []
        }
    };

    module.objectSuggestionRequest = {
        "d": {
            "Id": "1",
            "IncludeAttributeSuggestions": true,
            "QueryOptions": {
                "SearchTerms": "a",
                "Top": 10,
                "Skip": 0
            },
            "DataSources": [{
                "Id": "UIA000~EPM_BPA_DEMO~",
                "Type": "View"
            }],
            "ObjectSuggestions": {
                "SearchResults": [{
                    "HitAttributes": [

                    ],
                    "Attributes": [

                    ]
                }]
            },
            "ExecutionDetails": [

            ]
        }
    };

    //    module.getConfigurationRequest = {
    //        "SearchConfiguration": {
    //            "Action": "Get",
    //            "Data": {
    //                "PersonalizedSearch": {}
    //            }
    //        }
    //    };
    //
    //    module.saveConfigurationRequest = {
    //        "SearchConfiguration": {
    //            "Action": "Update",
    //            "Data": {
    //                "PersonalizedSearch": {
    //                    "SessionUserActive": true
    //                }
    //            }
    //        }
    //    };
    //
    //    module.resetPersonalizedSearchDataRequest = {
    //        "SearchConfiguration": {
    //            "Action": "Update",
    //            "Data": {
    //                "PersonalizedSearch": {
    //                    "ResetUserData": true
    //                }
    //            }
    //        }
    //    };

    module.navigationEvent = {
        "SemanticObjectType": "",
        "Intent": "",
        "System": "",
        "Client": "",
        "Parameters": [
            //{
            //"Name": "",
            //"Value": ""
            //}
        ]
    };

    return module;
});
