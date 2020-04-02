define("allChartTypeScales",[], function(){
return {
    "column": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "donut": [
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set the color palette for sectors"
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "pie": [
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set the color palette for sectors"
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "bar": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "line": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "area": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "stacked_column": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "stacked_bar": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "100_stacked_bar": [
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "100_stacked_column": [
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "100_area": [
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "100_horizontal_area": [
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "mekko": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "horizontal_mekko": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "100_mekko": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "100_horizontal_mekko": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "combination": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "stacked_combination": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "horizontal_stacked_combination": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "dual_bar": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "dual_column": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "dual_line": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "scatter": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set scale for value axis. this property just work on value type axis.",
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of primary data value. Setting null stands for default."
                },
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set scale for value axis2. this property just work on value type axis.",
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of secondary data value. Setting null stands for default."
                },
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "shape",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "circle",
                        "square",
                        "diamond",
                        "triangleUp",
                        "triangleDown",
                        "triangleLeft",
                        "triangleRight",
                        "cross",
                        "intersection"
                    ],
                    "supportedValues": [
                        "circle",
                        "square",
                        "diamond",
                        "triangleUp",
                        "triangleDown",
                        "triangleLeft",
                        "triangleRight",
                        "cross",
                        "intersection"
                    ],
                    "description": "Set marker shape of bubble."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "bubble": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set scale for value axis. this property just work on value type axis.",
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of primary data value. Setting null stands for default."
                },
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set scale for value axis2. this property just work on value type axis.",
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of secondary data value. Setting null stands for default."
                },
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "shape",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "circle",
                        "square",
                        "diamond",
                        "triangleUp",
                        "triangleDown",
                        "triangleLeft",
                        "triangleRight",
                        "cross",
                        "intersection"
                    ],
                    "supportedValues": [
                        "circle",
                        "square",
                        "diamond",
                        "triangleUp",
                        "triangleDown",
                        "triangleLeft",
                        "triangleRight",
                        "cross",
                        "intersection"
                    ],
                    "description": "Set marker shape of bubble."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "trellis_column": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "trellis_donut": [
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set the color palette for sectors"
                }
            }
        }
    ],
    "trellis_pie": [
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set the color palette for sectors"
                }
            }
        }
    ],
    "trellis_bar": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "trellis_line": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "trellis_area": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "trellis_100_area": [
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "trellis_100_horizontal_area": [
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "trellis_stacked_column": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "trellis_stacked_bar": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "trellis_100_stacked_bar": [
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "trellis_100_stacked_column": [
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "trellis_combination": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "trellis_dual_bar": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        }
    ],
    "trellis_dual_column": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        }
    ],
    "trellis_dual_line": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        }
    ],
    "trellis_scatter": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set scale for value axis. this property just work on value type axis.",
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of primary data value. Setting null stands for default."
                },
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set scale for value axis2. this property just work on value type axis.",
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of secondary data value. Setting null stands for default."
                },
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "shape",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "circle",
                        "square",
                        "diamond",
                        "triangleUp",
                        "triangleDown",
                        "triangleLeft",
                        "triangleRight",
                        "cross",
                        "intersection"
                    ],
                    "supportedValues": [
                        "circle",
                        "square",
                        "diamond",
                        "triangleUp",
                        "triangleDown",
                        "triangleLeft",
                        "triangleRight",
                        "cross",
                        "intersection"
                    ],
                    "description": "Set marker shape of bubble."
                }
            }
        }
    ],
    "trellis_bubble": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set scale for value axis. this property just work on value type axis.",
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of primary data value. Setting null stands for default."
                },
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set scale for value axis2. this property just work on value type axis.",
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of secondary data value. Setting null stands for default."
                },
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "shape",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "circle",
                        "square",
                        "diamond",
                        "triangleUp",
                        "triangleDown",
                        "triangleLeft",
                        "triangleRight",
                        "cross",
                        "intersection"
                    ],
                    "supportedValues": [
                        "circle",
                        "square",
                        "diamond",
                        "triangleUp",
                        "triangleDown",
                        "triangleLeft",
                        "triangleRight",
                        "cross",
                        "intersection"
                    ],
                    "description": "Set marker shape of bubble."
                }
            }
        }
    ],
    "horizontal_line": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "horizontal_area": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "trellis_horizontal_line": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "trellis_horizontal_area": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "horizontal_combination": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "trellis_horizontal_combination": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set the color palette for the chart. This is not supported for dual axis charts that have measureNamesDimension bound to the legend."
                }
            }
        }
    ],
    "dual_horizontal_line": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "trellis_dual_horizontal_line": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        }
    ],
    "100_dual_stacked_column": [
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "trellis_100_dual_stacked_column": [
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "100_dual_stacked_bar": [
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "trellis_100_dual_stacked_bar": [
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        }
    ],
    "dual_stacked_column": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "trellis_dual_stacked_column": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        }
    ],
    "dual_stacked_bar": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "trellis_dual_stacked_bar": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        }
    ],
    "treemap": [
        {
            "feed": "color",
            "properties": {
                "description": "Set scale for charts with MBC Legend.",
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [],
                    "description": "Set color palette of the chart. 'palette' takes higher priority than the properties of 'startColor' and 'endColor'. Only take effect when the number of values in the palette array is equal to or larger than MBC legend segment number"
                },
                "startColor": {
                    "supportedValueType": "String",
                    "defaultValue": "#C2E3A9",
                    "description": "Set color of the minimal value in legend."
                },
                "endColor": {
                    "supportedValueType": "String",
                    "defaultValue": "#73C03C",
                    "description": "Set color of the max value in legend."
                },
                "legendValues": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [],
                    "description": "Customize the value range in legend, only applicable when legend type is MBC (Measure Based Color) legend. For example, [10,11,12,13,14,15]. The values in the array should be in ascending order. If the number of values in the array is smaller than the MBC legend segment number, the MBC legend automatically calculates the values according to the data. If the number of values in the legendValues array is larger than MBC legend segment number, then only the first 'segment number + 1' values are used."
                },
                "numOfSegments": {
                    "supportedValueType": "Number",
                    "defaultValue": 5,
                    "description": "Number of markers in the MBC legend. Has to be within 2 to 9"
                },
                "maxNumOfSegments": {
                    "supportedValueType": "Number",
                    "defaultValue": 9,
                    "description": "Max number of markers in the MBC legend.",
                    "access": "internal"
                },
                "nullColor": {
                    "supportedValueType": "String",
                    "defaultValue": "#E0E0E0",
                    "description": "Set color for null value."
                }
            }
        }
    ],
    "heatmap": [
        {
            "feed": "color",
            "properties": {
                "description": "Set scale for charts with MBC Legend.",
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [],
                    "description": "Set color palette of the chart. 'palette' takes higher priority than the properties of 'startColor' and 'endColor'. Only take effect when the number of values in the palette array is equal to or larger than MBC legend segment number"
                },
                "startColor": {
                    "supportedValueType": "String",
                    "defaultValue": "#C2E3A9",
                    "description": "Set color of the minimal value in legend."
                },
                "endColor": {
                    "supportedValueType": "String",
                    "defaultValue": "#73C03C",
                    "description": "Set color of the max value in legend."
                },
                "legendValues": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [],
                    "description": "Customize the value range in legend, only applicable when legend type is MBC (Measure Based Color) legend. For example, [10,11,12,13,14,15]. The values in the array should be in ascending order. If the number of values in the array is smaller than the MBC legend segment number, the MBC legend automatically calculates the values according to the data. If the number of values in the legendValues array is larger than MBC legend segment number, then only the first 'segment number + 1' values are used."
                },
                "numOfSegments": {
                    "supportedValueType": "Number",
                    "defaultValue": 5,
                    "description": "Number of markers in the MBC legend. Has to be within 2 to 9"
                },
                "maxNumOfSegments": {
                    "supportedValueType": "Number",
                    "defaultValue": 9,
                    "description": "Max number of markers in the MBC legend.",
                    "access": "internal"
                },
                "nullColor": {
                    "supportedValueType": "String",
                    "defaultValue": "#E0E0E0",
                    "description": "Set color for null value."
                }
            }
        }
    ],
    "number": [],
    "tagcloud": [
        {
            "feed": "color",
            "properties": {
                "description": "Set scale for charts with MBC Legend.",
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [],
                    "description": "Set color palette of the chart. 'palette' takes higher priority than the properties of 'startColor' and 'endColor'. Only take effect when the number of values in the palette array is equal to or larger than MBC legend segment number"
                },
                "startColor": {
                    "supportedValueType": "String",
                    "defaultValue": "#C2E3A9",
                    "description": "Set color of the minimal value in legend."
                },
                "endColor": {
                    "supportedValueType": "String",
                    "defaultValue": "#73C03C",
                    "description": "Set color of the max value in legend."
                },
                "legendValues": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [],
                    "description": "Customize the value range in legend, only applicable when legend type is MBC (Measure Based Color) legend. For example, [10,11,12,13,14,15]. The values in the array should be in ascending order. If the number of values in the array is smaller than the MBC legend segment number, the MBC legend automatically calculates the values according to the data. If the number of values in the legendValues array is larger than MBC legend segment number, then only the first 'segment number + 1' values are used."
                },
                "numOfSegments": {
                    "supportedValueType": "Number",
                    "defaultValue": 5,
                    "description": "Number of markers in the MBC legend. Has to be within 2 to 9"
                },
                "maxNumOfSegments": {
                    "supportedValueType": "Number",
                    "defaultValue": 9,
                    "description": "Max number of markers in the MBC legend.",
                    "access": "internal"
                },
                "nullColor": {
                    "supportedValueType": "String",
                    "defaultValue": "#E0E0E0",
                    "description": "Set color for null value."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "time_bubble": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set scale for value axis. this property just work on value type axis.",
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of primary data value. Setting null stands for default."
                },
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set scale for value axis2. this property just work on value type axis.",
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of secondary data value. Setting null stands for default."
                },
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "shape",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "circle",
                        "square",
                        "diamond",
                        "triangleUp",
                        "triangleDown",
                        "triangleLeft",
                        "triangleRight",
                        "cross",
                        "intersection"
                    ],
                    "supportedValues": [
                        "circle",
                        "square",
                        "diamond",
                        "triangleUp",
                        "triangleDown",
                        "triangleLeft",
                        "triangleRight",
                        "cross",
                        "intersection"
                    ],
                    "description": "Set marker shape of bubble."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "bullet": [
        {
            "feed": "actualValues",
            "properties": {
                "description": "Set scale for value axis. this property just work on value type axis.",
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of primary data value. Setting null stands for default."
                },
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "ActualColor": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E"
                    ],
                    "description": "Set ActualColor palette for bullet."
                },
                "AdditionalColor": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#A7BFE5",
                        "#CFF9AA",
                        "#FFFF91",
                        "#FFE0AC",
                        "#FF9DAF",
                        "#BBA6D5",
                        "#6DC8E6",
                        "#E9FF7C",
                        "#FFFF9F",
                        "#FFAC8B",
                        "#D983B7",
                        "#3396E4",
                        "#40DB74",
                        "#FFEA50",
                        "#FF8953",
                        "#E560A1",
                        "#6F69C1"
                    ],
                    "description": "Set AdditionalColor color palette for bullet."
                },
                "ForecastColor": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#D5DADC"
                    ],
                    "description": "Set ForecastColor palette for bullet."
                }
            }
        }
    ],
    "vertical_bullet": [
        {
            "feed": "actualValues",
            "properties": {
                "description": "Set scale for value axis. this property just work on value type axis.",
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of primary data value. Setting null stands for default."
                },
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "ActualColor": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E"
                    ],
                    "description": "Set ActualColor palette for bullet."
                },
                "AdditionalColor": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#A7BFE5",
                        "#CFF9AA",
                        "#FFFF91",
                        "#FFE0AC",
                        "#FF9DAF",
                        "#BBA6D5",
                        "#6DC8E6",
                        "#E9FF7C",
                        "#FFFF9F",
                        "#FFAC8B",
                        "#D983B7",
                        "#3396E4",
                        "#40DB74",
                        "#FFEA50",
                        "#FF8953",
                        "#E560A1",
                        "#6F69C1"
                    ],
                    "description": "Set AdditionalColor color palette for bullet."
                },
                "ForecastColor": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#D5DADC"
                    ],
                    "description": "Set ForecastColor palette for bullet."
                }
            }
        }
    ],
    "timeseries_bullet": [
        {
            "feed": "timeAxis",
            "properties": {
                "description": "Set time range for time axis. this property just work on time type axis. Time axis is an special axis support continuous date/time dataset. It is only available in time axis enabled chart, i.e. line chart",
                "start": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the first date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the earliest timestamp in the dataset. It is also supported to set a past date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                },
                "end": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the last date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the lattermost timestamp in the dataset. It is also supported to set a future date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                }
            }
        },
        {
            "feed": "actualValues",
            "properties": {
                "description": "Set scale for value axis. this property just work on value type axis.",
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of primary data value. Setting null stands for default."
                },
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "ActualColor": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E"
                    ],
                    "description": "Set ActualColor palette for bullet."
                },
                "AdditionalColor": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#A7BFE5",
                        "#CFF9AA",
                        "#FFFF91",
                        "#FFE0AC",
                        "#FF9DAF",
                        "#BBA6D5",
                        "#6DC8E6",
                        "#E9FF7C",
                        "#FFFF9F",
                        "#FFAC8B",
                        "#D983B7",
                        "#3396E4",
                        "#40DB74",
                        "#FFEA50",
                        "#FF8953",
                        "#E560A1",
                        "#6F69C1"
                    ],
                    "description": "Set AdditionalColor color palette for bullet."
                }
            }
        }
    ],
    "dual_combination": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "dual_stacked_combination": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "dual_horizontal_combination": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "dual_horizontal_stacked_combination": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "2 Dimension StringArray",
                    "defaultValue": [
                        [
                            "#8FBADD",
                            "#B8D4E9",
                            "#7AAED6",
                            "#A3C7E3",
                            "#3D88C4",
                            "#66A1D0",
                            "#297CBE",
                            "#5295CA",
                            "#005BA3",
                            "#146FB7",
                            "#005395",
                            "#0063B1"
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "Dimension 1 set axis 1 color palette for dual chart, and dimension 2 set axis 2 color palette for dual chart"
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "timeseries_line": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set scale for value axis. this property just work on value type axis.",
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of primary data value. Setting null stands for default."
                },
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "timeAxis",
            "properties": {
                "description": "Set time range for time axis. this property just work on time type axis. Time axis is an special axis support continuous date/time dataset. It is only available in time axis enabled chart, i.e. line chart",
                "start": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the first date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the earliest timestamp in the dataset. It is also supported to set a past date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                },
                "end": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the last date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the lattermost timestamp in the dataset. It is also supported to set a future date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                }
            }
        }
    ],
    "timeseries_column": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set scale for value axis. this property just work on value type axis.",
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of primary data value. Setting null stands for default."
                },
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "timeAxis",
            "properties": {
                "description": "Set time range for time axis. this property just work on time type axis. Time axis is an special axis support continuous date/time dataset. It is only available in time axis enabled chart, i.e. line chart",
                "start": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the first date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the earliest timestamp in the dataset. It is also supported to set a past date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                },
                "end": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the last date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the lattermost timestamp in the dataset. It is also supported to set a future date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                }
            }
        }
    ],
    "timeseries_combination": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "timeAxis",
            "properties": {
                "description": "Set time range for time axis. this property just work on time type axis. Time axis is an special axis support continuous date/time dataset. It is only available in time axis enabled chart, i.e. line chart",
                "start": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the first date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the earliest timestamp in the dataset. It is also supported to set a past date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                },
                "end": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the last date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the lattermost timestamp in the dataset. It is also supported to set a future date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                }
            }
        }
    ],
    "timeseries_stacked_combination": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "timeAxis",
            "properties": {
                "description": "Set time range for time axis. this property just work on time type axis. Time axis is an special axis support continuous date/time dataset. It is only available in time axis enabled chart, i.e. line chart",
                "start": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the first date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the earliest timestamp in the dataset. It is also supported to set a past date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                },
                "end": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the last date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the lattermost timestamp in the dataset. It is also supported to set a future date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                }
            }
        }
    ],
    "dual_timeseries_combination": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "timeAxis",
            "properties": {
                "description": "Set time range for time axis. this property just work on time type axis. Time axis is an special axis support continuous date/time dataset. It is only available in time axis enabled chart, i.e. line chart",
                "start": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the first date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the earliest timestamp in the dataset. It is also supported to set a past date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                },
                "end": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the last date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the lattermost timestamp in the dataset. It is also supported to set a future date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        }
    ],
    "timeseries_scatter": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set scale for value axis. this property just work on value type axis.",
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of primary data value. Setting null stands for default."
                },
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "timeAxis",
            "properties": {
                "description": "Set time range for time axis. this property just work on time type axis. Time axis is an special axis support continuous date/time dataset. It is only available in time axis enabled chart, i.e. line chart",
                "start": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the first date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the earliest timestamp in the dataset. It is also supported to set a past date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                },
                "end": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the last date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the lattermost timestamp in the dataset. It is also supported to set a future date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                }
            }
        },
        {
            "feed": "shape",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "circle",
                        "square",
                        "diamond",
                        "triangleUp",
                        "triangleDown",
                        "triangleLeft",
                        "triangleRight",
                        "cross",
                        "intersection"
                    ],
                    "supportedValues": [
                        "circle",
                        "square",
                        "diamond",
                        "triangleUp",
                        "triangleDown",
                        "triangleLeft",
                        "triangleRight",
                        "cross",
                        "intersection"
                    ],
                    "description": "Set marker shape of bubble."
                }
            }
        }
    ],
    "timeseries_bubble": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set scale for value axis. this property just work on value type axis.",
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of primary data value. Setting null stands for default."
                },
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "timeAxis",
            "properties": {
                "description": "Set time range for time axis. this property just work on time type axis. Time axis is an special axis support continuous date/time dataset. It is only available in time axis enabled chart, i.e. line chart",
                "start": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the first date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the earliest timestamp in the dataset. It is also supported to set a past date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                },
                "end": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the last date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the lattermost timestamp in the dataset. It is also supported to set a future date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                }
            }
        },
        {
            "feed": "shape",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "circle",
                        "square",
                        "diamond",
                        "triangleUp",
                        "triangleDown",
                        "triangleLeft",
                        "triangleRight",
                        "cross",
                        "intersection"
                    ],
                    "supportedValues": [
                        "circle",
                        "square",
                        "diamond",
                        "triangleUp",
                        "triangleDown",
                        "triangleLeft",
                        "triangleRight",
                        "cross",
                        "intersection"
                    ],
                    "description": "Set marker shape of bubble."
                }
            }
        }
    ],
    "waterfall": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "waterfallType",
            "properties": {
                "description": "Set type for waterfall chart category axis."
            }
        }
    ],
    "timeseries_waterfall": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "timeAxis",
            "properties": {
                "description": "Set time range for time axis. this property just work on time type axis. Time axis is an special axis support continuous date/time dataset. It is only available in time axis enabled chart, i.e. line chart",
                "start": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the first date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the earliest timestamp in the dataset. It is also supported to set a past date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                },
                "end": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the last date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the lattermost timestamp in the dataset. It is also supported to set a future date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                }
            }
        }
    ],
    "horizontal_waterfall": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "waterfallType",
            "properties": {
                "description": "Set type for waterfall chart category axis."
            }
        }
    ],
    "stacked_waterfall": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "waterfallType",
            "properties": {
                "description": "Set type for waterfall chart category axis."
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "horizontal_stacked_waterfall": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "waterfallType",
            "properties": {
                "description": "Set type for waterfall chart category axis."
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "radar": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "dataFrame",
            "properties": {
                "description": "Set scale for dataFrame.",
                "currentValue": {
                    "supportedValueType": "Number | String",
                    "defaultValue": null,
                    "description": "Value of the current data frame."
                },
                "domain": {
                    "supportedValueType": "NumberArray | StringArray",
                    "defaultValue": [],
                    "readonly": true,
                    "description": "Values of all available data frames. This property cannot be set through scale api, but calculated automatically according to chart data."
                }
            }
        }
    ],
    "trellis_radar": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        }
    ],
    "combinationEx": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "3 Dimension StringArray or 2 Dimension StringArray",
                    "defaultValue": [
                        [
                            [
                                "#748CB2",
                                "#9CC677",
                                "#EACF5E",
                                "#F9AD79",
                                "#D16A7C",
                                "#8873A2",
                                "#3A95B3",
                                "#B6D949",
                                "#FDD36C",
                                "#F47958",
                                "#A65084",
                                "#0063B1",
                                "#0DA841",
                                "#FCB71D",
                                "#F05620",
                                "#B22D6E",
                                "#3C368E",
                                "#8FB2CF",
                                "#95D4AB",
                                "#EAE98F",
                                "#F9BE92",
                                "#EC9A99",
                                "#BC98BD",
                                "#1EB7B2",
                                "#73C03C",
                                "#F48323",
                                "#EB271B",
                                "#D9B5CA",
                                "#AED1DA",
                                "#DFECB2",
                                "#FCDAB0",
                                "#F5BCB4"
                            ],
                            [
                                "#8FBADD",
                                "#B8D4E9",
                                "#7AAED6",
                                "#A3C7E3",
                                "#3D88C4",
                                "#66A1D0",
                                "#297CBE",
                                "#5295CA",
                                "#005BA3",
                                "#146FB7",
                                "#005395",
                                "#0063B1"
                            ]
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "If the value is a 3 Dimension StringArray, Dimension 1 set axis 1 color palette for single and dual mode, and dimension 2 set axis 2 color palette for dual mode. If the value is a 2 Dimension StringArray, Dimension 1 set axis 1 color palette, and dimension 2 set axis 2 color palette for dual mode."
                }
            }
        }
    ],
    "trellis_combinationEx": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set valueAxis for value axis. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "valueAxis2",
            "properties": {
                "description": "Set valueAxis for value axis2. this property just work on value type axis.",
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis2 data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis2 data value. Setting null stands for disable."
                },
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of ValueAxis2 data value. Setting null stands for default."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "3 Dimension StringArray or 2 Dimension StringArray",
                    "defaultValue": [
                        [
                            [
                                "#748CB2",
                                "#9CC677",
                                "#EACF5E",
                                "#F9AD79",
                                "#D16A7C",
                                "#8873A2",
                                "#3A95B3",
                                "#B6D949",
                                "#FDD36C",
                                "#F47958",
                                "#A65084",
                                "#0063B1",
                                "#0DA841",
                                "#FCB71D",
                                "#F05620",
                                "#B22D6E",
                                "#3C368E",
                                "#8FB2CF",
                                "#95D4AB",
                                "#EAE98F",
                                "#F9BE92",
                                "#EC9A99",
                                "#BC98BD",
                                "#1EB7B2",
                                "#73C03C",
                                "#F48323",
                                "#EB271B",
                                "#D9B5CA",
                                "#AED1DA",
                                "#DFECB2",
                                "#FCDAB0",
                                "#F5BCB4"
                            ],
                            [
                                "#8FBADD",
                                "#B8D4E9",
                                "#7AAED6",
                                "#A3C7E3",
                                "#3D88C4",
                                "#66A1D0",
                                "#297CBE",
                                "#5295CA",
                                "#005BA3",
                                "#146FB7",
                                "#005395",
                                "#0063B1"
                            ]
                        ],
                        [
                            "#F6A09B",
                            "#F9C3C0",
                            "#F58E88",
                            "#F8B1AD",
                            "#F05B52",
                            "#F37D76",
                            "#EE4A40",
                            "#F16C64",
                            "#D92419",
                            "#ED382D",
                            "#C52117",
                            "#EB271B"
                        ]
                    ],
                    "description": "If the value is a 3 Dimension StringArray, Dimension 1 set axis 1 color palette for single and dual mode, and dimension 2 set axis 2 color palette for dual mode. If the value is a 2 Dimension StringArray, Dimension 1 set axis 1 color palette, and dimension 2 set axis 2 color palette for dual mode."
                }
            }
        }
    ],
    "timeseries_stacked_column": [
        {
            "feed": "valueAxis",
            "properties": {
                "description": "Set scale for value axis. this property just work on value type axis.",
                "type": {
                    "supportedValueType": "String",
                    "defaultValue": "linear",
                    "description": "Set type of primary data value. Setting null stands for default."
                },
                "min": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set min of valueAxis data value. Setting null stands for disable."
                },
                "max": {
                    "supportedValueType": "Number | auto",
                    "defaultValue": "auto",
                    "description": "Set max of valueAxis data value. Setting null stands for disable."
                }
            }
        },
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "timeAxis",
            "properties": {
                "description": "Set time range for time axis. this property just work on time type axis. Time axis is an special axis support continuous date/time dataset. It is only available in time axis enabled chart, i.e. line chart",
                "start": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the first date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the earliest timestamp in the dataset. It is also supported to set a past date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                },
                "end": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the last date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the lattermost timestamp in the dataset. It is also supported to set a future date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                }
            }
        }
    ],
    "timeseries_100_stacked_column": [
        {
            "feed": "color",
            "properties": {
                "palette": {
                    "supportedValueType": "StringArray",
                    "defaultValue": [
                        "#748CB2",
                        "#9CC677",
                        "#EACF5E",
                        "#F9AD79",
                        "#D16A7C",
                        "#8873A2",
                        "#3A95B3",
                        "#B6D949",
                        "#FDD36C",
                        "#F47958",
                        "#A65084",
                        "#0063B1",
                        "#0DA841",
                        "#FCB71D",
                        "#F05620",
                        "#B22D6E",
                        "#3C368E",
                        "#8FB2CF",
                        "#95D4AB",
                        "#EAE98F",
                        "#F9BE92",
                        "#EC9A99",
                        "#BC98BD",
                        "#1EB7B2",
                        "#73C03C",
                        "#F48323",
                        "#EB271B",
                        "#D9B5CA",
                        "#AED1DA",
                        "#DFECB2",
                        "#FCDAB0",
                        "#F5BCB4"
                    ],
                    "description": "Set color palette for non-dual chart. Or dual chart's color palette when MND is not fed on legend color."
                }
            }
        },
        {
            "feed": "timeAxis",
            "properties": {
                "description": "Set time range for time axis. this property just work on time type axis. Time axis is an special axis support continuous date/time dataset. It is only available in time axis enabled chart, i.e. line chart",
                "start": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the first date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the earliest timestamp in the dataset. It is also supported to set a past date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                },
                "end": {
                    "supportedValueType": "Date | auto",
                    "defaultValue": "auto",
                    "description": "Set the last date/time on the time axis. It accepts the numeric timestamp in milliseconds as the input. For example, timestamp of Jan 1st, 2014 is 1388534400. If supportedValueType is set as 'auto',  it will use the lattermost timestamp in the dataset. It is also supported to set a future date/time which is not existed in dataset. Specially, Date/Time would be auto truncated if chart is using minimal time level to validate data input like column chart."
                }
            }
        }
    ]
};
});