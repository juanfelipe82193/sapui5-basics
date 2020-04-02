// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.URLTemplateProcessor
 */
sap.ui.require([
    "sap/ushell/URLTemplateProcessor"
], function (URLTemplateProcessor) {
    "use strict";

    /* global QUnit */

    QUnit.dump.maxDepth = 0;

    QUnit.module("URLTemplateProcessor", {
        beforeEach: function () { },
        afterEach: function () { }
    });

    var oDestinationDefinition = {
        destProtocol: "https",
        destPort: "8080",
        destHost: "{/path/to/systemAliases/U1YCLNT111/https/host}",
        destHttp: "{/path/to/systemAliases/U1YCLNT111/http}",
        destHttps: "{/path/to/systemAliases/U1YCLNT111/https}"
    };

    var oMoreDefinitions = {
        fromMergedDefinitions: "test"
    };

    var oSiteWithSystemAlias = {
        path: {
            to: {
                systemAliases: {
                    "default": {
                       "id": "default",
                       "https": {
                           "id": "",
                           "host": "server.example.com",  // NOTE: this causes protocol to be added to the URL.
                           "port": "",                    // null port
                           "pathPrefix": "/sap/bc2"       // pathPrefix always prepended to URL.
                       }
                    },
                    "U1YCLNT111": {
                        "https": {
                            "id": "U1YCLNT111_HTTPS",
                            "host": "u1y.example.corp.com",
                            "port": 44355,
                            "pathPrefix": ""
                        },
                        "rfc": {
                            "id": "",
                            "systemId": "",
                            "host": "",
                            "service": 32,
                            "loginGroup": "",
                            "sncNameR3": "",
                            "sncQoPR3": ""
                        },
                        "id": "U1YCLNT111",
                        "client": "111",
                        "language": "de"
                    }
                }
            }
        }
    };

    var oFakeSite = {
        reserved: {
            var: {
                definitions: oDestinationDefinition,
                more_definitions: oMoreDefinitions
            }
        },
        path: oSiteWithSystemAlias.path
    };


    [
        {
            testDescription: "inner app route from string",
            payload: {
                parameters: {
                    names: {
                        "appRoute": "/inner/app/route"
                    }
                },
                urlTemplate: "#Action-toappnavsample&{+appRoute}"
            },
            runtime: {
            },
            expected: "#Action-toappnavsample&/inner/app/route"
        },
        {
            testDescription: "actual inner app route",
            payload: {
                parameters: {
                    names: {
                        "appRoute": "{&innerAppRoute:.}"
                    }
                },
                urlTemplate: "#Action-toappnavsample&{+appRoute}"
            },
            runtime: {
                innerAppRoute: "/inner/app/route"
            },
            expected: "#Action-toappnavsample&/inner/app/route"
        },
        {
            testDescription: "actual inner app route with default (defined)",
            payload: {
                parameters: {
                    names: {
                        "appRoute": "{or &innerAppRoute:.,'/path/to/default'}"
                    }
                },
                urlTemplate: "#Action-toappnavsample&{+appRoute}"
            },
            runtime: {
                innerAppRoute: "/inner/app/route"
            },
            expected: "#Action-toappnavsample&/inner/app/route"
        },
        {
            testDescription: "actual inner app route with default (undefined)",
            payload: {
                parameters: {
                    names: {
                        "appRoute": "{or &innerAppRoute:.,'/path/to/default'}"
                    }
                },
                urlTemplate: "#Action-toappnavsample&{+appRoute}"
            },
            runtime: {
                innerAppRoute: "/inner/app/route"
            },
            expected: "#Action-toappnavsample&/inner/app/route"
        },
        {
            testDescription: "simple URL",
            payload: {
                urlTemplate: "http://www.example.com"
            },
            runtime: {},
            expected: "http://www.example.com/"
        },
        {
            testDescription: "URL with parameter",
            payload: {
                urlTemplate: "http://www.example.com/index.htm{?tcode}"
            },
            runtime: {
                params: {
                    tcode: ["SU01"]
                }
            },
            expected: "http://www.example.com/index.htm?tcode=SU01"
        },
        {
            testDescription: "URL with parameter - alternate syntax",
            payload: {
                urlTemplate: "http://www.example.com/index.htm{?tcode}",
                parameters: {
                    names: {
                        tcode: "{&params:tcodeB}"
                    }
                }
            },
            runtime: {
                params: {
                    tcode: ["SU01"],
                    tcodeB: ["SU02"]
                }
            },
            expected: "http://www.example.com/index.htm?tcode=SU02"
        },
        {
            testDescription: "URL with no given parameter",
            payload: {
                urlTemplate: "http://www.example.com/index.htm{?tcode}"
            },
            runtime: {
                /* nothing */
            },
            expected: "http://www.example.com/index.htm"
        },
        {
            testDescription: "URL with empty parameter",
            payload: {
                urlTemplate: "http://www.example.com/index.htm{?tcode}"
            },
            runtime: {
                params: {
                    tcode: ""
                }
            },
            expected: "http://www.example.com/index.htm?tcode="
        },
        {
            testDescription: "URL with multiple value for a given parameter",
            payload: {
                urlTemplate: "http://www.example.com/index.htm{?companyCode}"
            },
            runtime: {
                params: {
                    companyCode: ["1002", "1003"]
                }
            },
            expected: "http://www.example.com/index.htm?companyCode=1002"
        },
        {
            testDescription: "URL with two optional parameters, last existing only",
            payload: {
                urlTemplate: "http://www.example.com/index.htm{?tcode,companyCode}"
            },
            runtime: {
                params: {
                    companyCode: ["1002"]
                }
            },
            expected: "http://www.example.com/index.htm?companyCode=1002"
        },
        {
            testDescription: "URL with parameter determined from parameter definition (OR)",
            payload: {
                parameters: {
                    names: {
                        destA: "http",
                        destB: "https",
                        protocol: "{or &destA,&destB}"
                    }
                },
                urlTemplate: "http://www.example.com/index.htm{?protocol}"
            },
            runtime: {
                params: {
                    companyCode: ["1002"]
                }
            },
            expected: "http://www.example.com/index.htm?protocol=http"
        },
        {
            testDescription: "URL with parameter determined from parameter definition (OR) but empty first value",
            payload: {
                parameters: {
                    names: {
                        destA: "",
                        destB: "https",
                        protocol: "{or &destA,&destB}"
                    }
                },
                urlTemplate: "http://www.example.com/index.htm{?protocol}"
            },
            runtime: {
                params: {
                    companyCode: ["1002"]
                }
            },
            expected: "http://www.example.com/index.htm?protocol="
        },
        {
            testDescription: "URL with parameter determined from parameter definition (OR) but no first value",
            payload: {
                parameters: {
                    names: {
                        /* destA checked from runtime */
                        destB: "https",
                        protocol: "{or &destA,&destB}"
                    }
                },
                urlTemplate: "http://www.example.com/index.htm{?protocol}"
            },
            runtime: {
                params: {
                    companyCode: ["1002"]
                }
            },
            expected: "http://www.example.com/index.htm?protocol=https"
        },
        {
            testDescription: "Mass rename of a parameter",
            payload: {
                parameters: {
                    names: {
                        b: { renameTo: "a", value: "{a}" }
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?a,b,b,b}"
            },
            runtime: {
                params: {
                    a: "A",
                    b: "B"
                }
            },
            expected: "http://www.example.com/index.html?a=A&a=A&a=A&a=A"
        },
        {
            testDescription: "Having a parameter twice, with same name but different value",
            payload: {
                parameters: {
                    names: {
                        d: { renameTo: "a", value: "D" }
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?a,b,c,d}"
            },
            runtime: {
                params: {
                    a: "A",
                    b: "B",
                    c: "C"
                }
            },
            expected: "http://www.example.com/index.html?a=A&b=B&c=C&a=D"
        },
        {
            testDescription: "Parameter with dash",
            payload: {
                parameters: {
                    names: {
                        sapSystem: {
                            value: "{sap-system}",
                            renameTo: "sap-system"
                        }
                    }
                },
                urlTemplate: "http://www.example.com/index.htm{?sapSystem}"
            },
            runtime: {
                params: {
                    companyCode: ["1002"],
                    "sap-system": "UR5"
                }
            },
            expected: "http://www.example.com/index.htm?sap-system=UR5"
        },
        {
            testDescription: "parameter name in a conditional",
            payload: {
                parameters: {
                    names: {
                        p3: "v3",
                        p: "{and &p3,'v1'}"
                    }
                },
                urlTemplate: "http://www.example.com/index.htm{?p}"
            },
            runtime: {
                params: {
                }
            },
            siteApplicationContext : {
                "sap.gui": {
                    transaction: "SU01"
                }
            },
            expected: "http://www.example.com/index.htm?p=v1"
        },
        {
            testDescription: "Parameter relative to the application",
            payload: {
                parameters: {
                    names: {
                        relativeParameterName: "{./sap.gui/transaction}"
                    }
                },
                urlTemplate: "http://www.example.com/index.htm{?relativeParameterName}"
            },
            runtime: {
                params: {
                    companyCode: ["1002"],
                    "sap-system": "UR5"
                }
            },
            siteApplicationContext : {
                "sap.gui": {
                    transaction: "SU01"
                }
            },
            expected: "http://www.example.com/index.htm?relativeParameterName=SU01"
        },
        {
            testDescription: "Put any query parameters at the end",
            payload: {
                parameters: {
                    names: {
                        queryParams: "{*}"
                    }
                },
                urlTemplate: "http://www.example.com/index.htm{?queryParams*}"
            },
            runtime: {
                params: {
                    companyCode: ["1002"],
                    "sap-system": "UR5",
                    countryName: "Italy"
                }
            },
            expected: "http://www.example.com/index.htm?companyCode=1002&sap-system=UR5&countryName=Italy"
        },
        {
            testDescription: "String if query parameters are defined",
            payload: {
                parameters: {
                    names: {
                        queryParams: "{*}",
                        string: "{and &queryParams,'STR'}"
                    }
                },
                urlTemplate: "http://www.example.com/index.htm{?string}"
            },
            runtime: {
                params: {
                    companyCode: ["1002"],
                    "sap-system": "UR5",
                    countryName: "Italy"
                }
            },
            expected: "http://www.example.com/index.htm?string=STR"
        },
        {
            testDescription: "Join on a scope that appears in array format",
            payload: {
                parameters: {
                    names: {
                        string: "{join(-) &params:.}"
                    }
                },
                urlTemplate: "http://www.example.com/index.htm?string={+string}"
            },
            runtime: {
                params: ["a","b","c"]
            },
            expected: "http://www.example.com/index.htm?string=a-b-c"
        },
        {
            testDescription: "Join on a wildcard",
            payload: {
                parameters: {
                    names: {
                        queryParams: "{*}",
                        string: "{join(-) &queryParams}"
                    }
                },
                urlTemplate: "http://www.example.com/index.htm?string={+string}"
            },
            runtime: {
                params: {
                    a: ["1002"],
                    b: "UR5",
                    c: "Italy"
                }
            },
            expected: "http://www.example.com/index.htm?string=a1002-bUR5-cItaly"
        },
        {
            testDescription: "Join on a wildcard plus a regular parameter",
            payload: {
                parameters: {
                    names: {
                        queryParams: "{*}",
                        regular: "literal",
                        string: "{join(-) &queryParams,&regular}"
                    }
                },
                urlTemplate: "http://www.example.com/index.htm?string={+string}"
            },
            runtime: {
                params: {
                    a: ["1002"],
                    b: "UR5",
                    c: "Italy"
                }
            },
            expected: "http://www.example.com/index.htm?string=a1002-bUR5-cItaly-literal"
        },
        {
            testDescription: "Join on a wildcard plus a regular parameter with micro separator",
            payload: {
                parameters: {
                    names: {
                        queryParams: "{*}",
                        regular: "literal",
                        string: "{join(-,_) &queryParams,&regular}"
                    }
                },
                urlTemplate: "http://www.example.com/index.htm?string={+string}"
            },
            runtime: {
                params: {
                    a: ["1002"],
                    b: "UR5",
                    c: "Italy"
                }
            },
            expected: "http://www.example.com/index.htm?string=a_1002-b_UR5-c_Italy-literal"
        },
        {
            testDescription: "Undefined value after disjunction",
            payload: {
                parameters: {
                    names: {
                        param: "{or /nonexisting/path,./nonexisting/relative/path,varName}"
                    }
                },
                urlTemplate: "http://www.example.com/index.htm{?param}"
            },
            runtime: {
                params: { }
            },
            site: {},
            expected: "http://www.example.com/index.htm"
        },
        {
            testDescription: "Value of parameters taken from site section",
            payload: {
                parameters: {
                    names: {
                        clientFromSite: "{/path/to/systemAliases/U1YCLNT111/client}"
                    }
                },
                urlTemplate: "http://www.example.com/index.htm{?clientFromSite}"
            },
            runtime: {
                params: { }
            },
            site: oSiteWithSystemAlias,
            expected: "http://www.example.com/index.htm?clientFromSite=111"
        },
        {
            testDescription: "can merge parameters with definitions from the site",
            payload: {
                parameters: {
                    mergeWith: ["/reserved/var/definitions", "/reserved/var/more_definitions"],
                    names: {
                        fixed: "ABC"
                    }
                },
                urlTemplate: "{destProtocol}://{destHost}:{destPort}/index.htm{?fixed,fromMergedDefinitions}"
            },
            runtime: {
                params: {
                    p1: ["v1"]
                }
            },
            site: oFakeSite,
            expected: "https://u1y.example.corp.com:8080/index.htm?fixed=ABC&fromMergedDefinitions=test"
        },
        {
            testDescription: "ignores merge parameters if their definition path is not specified as an array",
            payload: {
                parameters: {
                    mergeWith: "/reserved/var/definitions",
                    names: {
                        fixed: "ABC"
                    }
                },
                urlTemplate: "{destProtocol}://{destHost}:{destPort}/index.htm{?fixed,fromMergedDefinitions}"
            },
            runtime: {
                params: {
                    p1: ["v1"]
                }
            },
            site: oFakeSite,
            expected: "/index.htm?fixed=ABC"
        },
        {
            testDescription: "Realistic destination definition",
            payload: {
                parameters: {
                    names: {
                        destName: "{or sap-system,/path/to/systemAliases/default/id}",
                        destProtocolHttps: "{and /path/to/systemAliases/{&destName}/https,'https'}",
                        destProtocolHttp: "{and /path/to/systemAliases/{&destName}/http,'http'}",
                        destProtocol: "{or &destProtocolHttps,&destProtocolHttp}",
                        destHost: "{/path/to/systemAliases/{&destName}/{&destProtocol}/host}",
                        destPort: "{/path/to/systemAliases/{&destName}/{&destProtocol}/port}",
                        destPrefix: "{/path/to/systemAliases/{&destName}/{&destProtocol}/pathPrefix}"
                    }
                },
                urlTemplate: "{destProtocol}://{destHost}:{destPort}{+destPrefix}/gui/sap/its/webgui%7etransaction="
            },
            runtime: {
                params: {
                    "sap-system": "U1YCLNT111"
                }
            },
            site: oFakeSite,
            expected: "https://u1y.example.corp.com:44355/gui/sap/its/webgui%7etransaction="
        },
        {
            testDescription: "Realistic destination definition (with fallback to systemAlias)",
            payload: {
                parameters: {
                    names: {
                        destName: "{or sap-system,/path/to/systemAliases/default/id}",
                        destProtocolHttps: "{and /path/to/systemAliases/{&destName}/https,'https'}",
                        destProtocolHttp: "{and /path/to/systemAliases/{&destName}/http,'http'}",
                        destProtocol: "{or &destProtocolHttps,&destProtocolHttp}",
                        destHost: "{/path/to/systemAliases/{&destName}/{&destProtocol}/host}",
                        destPort: "{or /path/to/systemAliases/{&destName}/{&destProtocol}/port,''}",
                        destPrefix: "{/path/to/systemAliases/{&destName}/{&destProtocol}/pathPrefix}"
                    }
                },
                urlTemplate: "{destProtocol}://{destHost}:{destPort}{+destPrefix}/gui/sap/its/webgui%7etransaction="
            },
            runtime: {
                params: {
                }
            },
            site: oFakeSite,
            expected: "https://server.example.com/sap/bc2/gui/sap/its/webgui%7etransaction="
        },
        {
            testDescription: "sap-language parameter definition (no sap-language parameter)",
            payload: {
                parameters: {
                    names: {
                        destName: "{or sap-system,/path/to/systemAliases/default/id}",
                        sapLanguage: "{or sap-language,/path/to/systemAliases/{destName}/language,'en'}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html?sap-language={sapLanguage}"
            },
            runtime: {
                params: {
                }
            },
            site: oFakeSite,
            expected: "http://www.example.com/index.html?sap-language=en"
        },
        {
            testDescription: "sap-language parameter definition (sap-language parameter given)",
            payload: {
                parameters: {
                    names: {
                        destName: "{or sap-system,/path/to/systemAliases/default/id}",
                        sapLanguage: "{or sap-language,/path/to/systemAliases/{destName}/language,'en'}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html?sap-language={sapLanguage}"
            },
            runtime: {
                params: {
                    "sap-language": "zh"
                }
            },
            site: oFakeSite,
            expected: "http://www.example.com/index.html?sap-language=zh"
        },
        {
            testDescription: "sap-language parameter definition (systemAlias specifies language)",
            payload: {
                parameters: {
                    names: {
                        destName: "{or sap-system,/path/to/systemAliases/default/id}",
                        sapLanguage: "{or sap-language,/path/to/systemAliases/{&destName}/language,'en'}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html?sap-language={sapLanguage}"
            },
            runtime: {
                params: {
                    "sap-system": "U1YCLNT111"
                }
            },
            site: oFakeSite,
            expected: "http://www.example.com/index.html?sap-language=de"
        },
        {
            testDescription: "join operation",
            payload: {
                parameters: {
                    names: {
                        name: "{join(.) 'some','thing'}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?name}"
            },
            runtime: {
                /* no params */
            },
            site: oFakeSite,
            expected: "http://www.example.com/index.html?name=some.thing"
        },
        {
            testDescription: "join operation (nonstrings)",
            payload: {
                parameters: {
                    names: {
                        name: "{join(\\,) &differentTypes:bool,&differentTypes:num,&differentTypes:float,&differentTypes:string,&differentTypes:null,&differentTypes:emptyString}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?name}"
            },
            runtime: {
                differentTypes: {
                    bool: true,
                    num: 1234,
                    float: 12.34,
                    string: "string",
                    null: null,
                    emptyString: ""
                }
            },
            site: oFakeSite,
            expected: "http://www.example.com/index.html?name=true%2C1234%2C12.34%2Cstring%2C%2C"
        },
        {
            testDescription: "join operation (without arguments)",
            payload: {
                parameters: {
                    names: {
                        name: "{join 'some','thing'}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?name}"
            },
            runtime: {
                /* no params */
            },
            site: oFakeSite,
            expected: "http://www.example.com/index.html?name=something"
        },
        {
            testDescription: "and only if non-empty (non-empty case)",
            payload: {
                parameters: {
                    names: {
                        var: "something",
                        name: "{and({&var}) 'true','xyz'}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?name}"
            },
            runtime: {
                params: {
                    /* no params */
                }
            },
            site: oFakeSite,
            expected: "http://www.example.com/index.html?name=xyz"
        },
        {
            testDescription: "and only if non-empty (empty case)",
            payload: {
                parameters: {
                    names: {
                        var: "",  // var is empty
                        name: "{and({var}) 'true','xyz'}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?name}"
            },
            runtime: {
                params: {
                    /* no params */
                }
            },
            site: oFakeSite,
            expected: "http://www.example.com/index.html"
        },
        {
            testDescription: "and only if defined (but undefined value)",
            payload: {
                parameters: {
                    names: {
                        name: "{and({foo}) 'true','xyz'}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?name}"
            },
            runtime: {
                params: {
                    /* no params */
                }
            },
            site: oFakeSite,
            expected: "http://www.example.com/index.html"
        },
        {
            testDescription: "not (p1 undefined)",
            payload: {
                parameters: {
                    names: {
                        isP1Undefined: "{not &p1}",
                        yellow: "{and &isP1Undefined,'yellow'}",
                        green: "{and {&p1},'green'}",
                        color: "{or &yellow,&green}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?color}"
            },
            site: oFakeSite,
            runtime: {
                /* no parameters */
            },
            expected: "http://www.example.com/index.html?color=yellow"
        },
        {
            testDescription: "not (p1 defined)",
            payload: {
                parameters: {
                    names: {
                        isP1Undefined: "{not &p1}",
                        yellow: "{and({&isP1Undefined}) 'yellow'}",
                        green: "{and({&p1}) 'green'}",
                        color: "{or &yellow,&green}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?color}"
            },
            site: oFakeSite,
            runtime: {
                params: {
                    p1: "something"
                }
            },
            expected: "http://www.example.com/index.html?color=green"
        },
        {
            testDescription: "join operation using the value of another parameter as the separator",
            payload: {
                parameters: {
                    names: {
                        sep: "-",
                        name: "{join({&sep}) 'some','thing'}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?name}"
            },
            runtime: {
                /* no params */
            },
            site: oFakeSite,
            expected: "http://www.example.com/index.html?name=some-thing"
        },
        {
            testDescription: "match operation on value of individual arguments (no pipe)",
            payload: {
                parameters: {
                    names: {
                        matches: "{match(^$) p1}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?matches}"
            },
            site: oFakeSite,
            runtime: {
                params: {
                    p1: "v1"
                }
            },
            expected: "http://www.example.com/index.html"
        },
        {
            testDescription: "match operation on value of multiple arguments (no pipe)",
            payload: {
                parameters: {
                    names: {
                        matches: "{match(^v) p1,p2,p3}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?matches}"
            },
            site: oFakeSite,
            runtime: {
                params: {
                    p1: "v1",
                    p2: "v2",
                    p3: "p3"
                }
            },
            expected: "http://www.example.com/index.html"
        },
        {
            testDescription: "match operation on value of multiple arguments that match (no pipe)",
            payload: {
                parameters: {
                    names: {
                        matches: "{match(^v) p1,p2,p3}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?matches}"
            },
            site: oFakeSite,
            runtime: {
                params: {
                    p1: "v1",
                    p2: "v2",
                    p3: "v3"
                }
            },
            expected: "http://www.example.com/index.html?matches=true"
        },
        {
            testDescription: "match operation against an object with one match (no pipe)",
            payload: {
                parameters: {
                    names: {
                        matches: "{match(^p) &params:.}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?matches}"
            },
            site: oFakeSite,
            runtime: {
                params: {
                    x1: "v1",
                    p2: "v2",
                    x3: "v3"
                }
            },
            expected: "http://www.example.com/index.html?matches=true"
        },
        {
            testDescription: "match operation against an object with nothing matching (no pipe)",
            payload: {
                parameters: {
                    names: {
                        matches: "{match(^p) &params:.}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?matches}"
            },
            site: oFakeSite,
            runtime: {
                params: {
                    x1: "v1",
                    x2: "v2",
                    x3: "v3"
                }
            },
            expected: "http://www.example.com/index.html"
        },
        {
            testDescription: "filter multiple parameters",
            payload: {
                parameters: {
                    names: {
                        query: "{*|match(^p[2\\,3])}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?query*}"
            },
            runtime: {
                params: {
                    p1: "v1",
                    p2: "v2",
                    p3: "v3"
                }
            },
            site: oFakeSite,
            expected: "http://www.example.com/index.html?p2=v2&p3=v3"
        },
        {
            testDescription: "negative filter of multiple parameters",
            payload: {
                parameters: {
                    names: {
                        query: "{*|match(^(?!p2\\|p1))}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?query*}"
            },
            runtime: {
                params: {
                    p1: "v1",
                    p2: "v2",
                    p3: "v3"
                }
            },
            site: oFakeSite,
            expected: "http://www.example.com/index.html?p3=v3"
        },
        {
            testDescription: "negative filter of parameters",
            payload: {
                parameters: {
                    names: {
                        query: "{*|match(^(?!p2))}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?query*}"
            },
            runtime: {
                params: {
                    p1: "v1",
                    p3: "v3"
                }
            },
            site: oFakeSite,
            expected: "http://www.example.com/index.html?p1=v1&p3=v3"
        },
        {
            testDescription: "filter empty set of parameters",
            payload: {
                parameters: {
                    names: {
                        query: "{*|match(^p[2\\,3])}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?query*}"
            },
            runtime: {
                params: {
                }
            },
            site: oFakeSite,
            expected: "http://www.example.com/index.html"
        },
        {
            testDescription: "filter multiple parameters to the empty set",
            payload: {
                parameters: {
                    names: {
                        query: "{*|not}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?query*}"
            },
            runtime: {
                params: {
                    p1: "v1",
                    p2: "v2",
                    p3: "v3"
                }
            },
            site: oFakeSite,
            expected: "http://www.example.com/index.html"
        },
        {
            testDescription: "double encoded parameter",
            payload: {
                parameters: {
                    names: {
                        date: "{encodeURIComponent datetime}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html{?date}"
            },
            runtime: {
                params: {
                    datetime: "Tue Jan 08 2019 19:29:10 GMT+0100 (Central European Standard Time)"
                }
            },
            site: oFakeSite,
            expected: "http://www.example.com/index.html?date=Tue%2520Jan%252008%25202019%252019%253A29%253A10%2520GMT%252B0100%2520%28Central%2520European%2520Standard%2520Time%29"
        },
        {
            testDescription: "multiple double encoded parameters",
            payload: {
                parameters: {
                    names: {
                        escapedIntentParameters: "{*|encodeURIComponent}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html#O-a{?escapedIntentParameters*}"
            },
            runtime: {
                params: {
                    date: "Tue Jan 08 2019 19:29:10 GMT+0100 (Central European Standard Time)",
                    zval: "some data"
                }
            },
            site: oFakeSite,
            expected: "http://www.example.com/index.html#O-a?date=Tue%2520Jan%252008%25202019%252019%253A29%253A10%2520GMT%252B0100%2520%28Central%2520European%2520Standard%2520Time%29&zval=some%2520data"
        },
        {
            testDescription: "multiple pipes",
            payload: {
                parameters: {
                    names: {
                        escapedIntentParameters: "{*|encodeURIComponent|encodeURIComponent()|encodeURIComponent}"
                    }
                },
                urlTemplate: "http://www.example.com/index.html#O-a{?escapedIntentParameters*}"
            },
            runtime: {
                params: {
                    p1: "100%",
                    p2: "200%"
                }
            },
            site: oFakeSite,
            expected: "http://www.example.com/index.html#O-a?p1=100%25252525&p2=200%25252525"
        },
        {
            testDescription: "test ui5 template",
            payload: {
                parameters: {
                    names: {
                        params: "{*|join(&,=)}",
                        component: "{./sap.ui5/componentName}",
                        hash: "{join(-) ./inbound/semanticObject,./inbound/action}"
                    }
                },
                urlTemplate: "/shells/demo/ui5clpruntime.html{?component,params}{#hash}"
            },
            runtime: {
                params: {
                    p1: "v1",
                    p2: "v2"
                }
            },
            site: oFakeSite,
            siteApplicationContext : {
                "sap.ui5": {
                    componentName: "sap.ushell.demo.FioriSandboxDefaultApp"
                },
                "inbound": {
                    semanticObject: "Object",
                    action: "action"
                }
            },
            expected: "/shells/demo/ui5clpruntime.html?component=sap.ushell.demo.FioriSandboxDefaultApp&params=p1%3Dv1%26p2%3Dv2#Object-action"
        },
        {
            testDescription: "boolean + or",
            payload: {
                parameters: {
                    names: {
                        isA: "{match(^X$) p1}",
                        isB: "{match(^X$) p2}",
                        isC: "{match(^X$) p3}",
                        answerA: "{if({&isA}) 'A'}",
                        answerB: "{if({&isB}) 'B'}",
                        answerC: "{if({&isC}) 'C'}",
                        answer: "{or &answerA,&answerB,&answerC}"
                    }
                },
                urlTemplate: "index.html{?answer}"
            },
            runtime: {
                params: {
                    p1: "J",
                    p2: "X",
                    p3: "K"
                }
            },
            site: oFakeSite,
            siteApplicationContext : {
                "sap.ui5": {
                    componentName: "sap.ushell.demo.FioriSandboxDefaultApp"
                },
                "inbound": {
                    semanticObject: "Object",
                    action: "action"
                }
            },
            expected: "index.html?answer=B"
        },
        {
            testDescription: "bad expression syntax in runtime parameters",
            payload: {
                parameters: {
                    names: {
                        p1: "{*}"
                    }
                },
                urlTemplate: "index.html{?p1*}"
            },
            runtime: {
                params: {
                    "targetParameter": "{{startupParameters}" // bad syntax
                }
            },
            site: oFakeSite,
            siteApplicationContext : {
                // doesn't matter
            },
            expected: "index.html?targetParameter=%7B%7BstartupParameters%7D"
        }
    ].forEach(function (oFixture) {
        QUnit.test("#expand: " + oFixture.testDescription, function (assert) {
            var sUrl = URLTemplateProcessor.expand(oFixture.payload, oFixture.site, oFixture.runtime, oFixture.siteApplicationContext, "params");
            assert.strictEqual(sUrl, oFixture.expected, "got the expected URL");
        });
    });

    QUnit.test("#expand with URL part", function (assert) {
        var oPayload = {
            parameters: {
                names: {
                    p1: "{url()}"
                }
            },
            urlTemplate: "index.html{?p1}"
        };
        var oRuntime = {
            params: {}
        };
        var oApplicationContext = {};
        var sUrl = URLTemplateProcessor.expand(oPayload, oFakeSite, oRuntime, oApplicationContext, "params");
        var bContainsExpectedResult = sUrl.indexOf(".qunit.html") >= 0;
        assert.ok(bContainsExpectedResult, "the returned url contains '.qunit.html'");
    });

    QUnit.test("#expand: UI5 template with another namespace", function (assert) {
        var oPayload = {
            parameters: {
                names: {
                    params: "{*|join(&,=)}",
                    component: "{./sap.ui5/componentName}",
                    hash: "{join(-) ./inbound/semanticObject,./inbound/action}"
                }
            },
            urlTemplate: "/shells/demo/ui5clpruntime.html{?component,params}{#hash}"
        };
        var oRuntime = {
            intentParameter: {
                p1: "v1",
                p2: "v2"
            }
        };

        var oSite = oFakeSite;

        var oSiteApplicationContext = {
            "sap.ui5": {
                componentName: "sap.ushell.demo.FioriSandboxDefaultApp"
            },
            "inbound": {
                semanticObject: "Object",
                action: "action"
            }
        };

        var sExpectedUrl = "/shells/demo/ui5clpruntime.html?component=sap.ushell.demo.FioriSandboxDefaultApp&params=p1%3Dv1%26p2%3Dv2#Object-action";

        var sUrl = URLTemplateProcessor.expand(oPayload, oSite, oRuntime, oSiteApplicationContext, "intentParameter");
        assert.strictEqual(sUrl, sExpectedUrl, "got the expected URL");
    });

    [
        {
            testDescription: "Cyclic dependency",
            payload: {
                urlTemplate: "http://www.example.com/index.htm{?a}",
                parameters: {
                    names: {
                        a: "{&a}"
                    }
                }
            },
            runtime: {
                params: {
                    tcode: ["SU01"]
                }
            },
            expected: "Graph of dependencies contains cyclic references"
        },
        {
            testDescription: "Cyclic dependency (chain)",
            payload: {
                urlTemplate: "http://www.example.com/index.htm{?a}",
                parameters: {
                    names: {
                        a: "{&b}",
                        b: "{&c}",
                        c: "{&a}"
                    }
                }
            },
            runtime: {
                params: {
                    tcode: ["SU01"]
                }
            },
            expected: "Graph of dependencies contains cyclic references"
        }
    ].forEach(function (oFixture) {
        QUnit.test("#expand (error case): " + oFixture.testDescription, function (assert) {
            var sUrl = null;
            try {
                sUrl = URLTemplateProcessor.expand(oFixture.payload, oFixture.site, oFixture.runtime, oFixture.siteApplicationContext);
            } catch (oError) {
                assert.ok(true, "an exception was raised");
                var sMessage = oError.message;
                assert.strictEqual(sMessage, oFixture.expected, "got the expected exception error message");
                return;
            }
            assert.ok(false, "an exception was raised. Got instead " + sUrl);
        });
    });

});
