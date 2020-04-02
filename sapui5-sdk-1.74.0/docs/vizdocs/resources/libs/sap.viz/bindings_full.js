define("allChartTypeBindings",[], function(){
return {
    "info/bar": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/trellis_bar": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/stacked_bar": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/trellis_stacked_bar": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/100_stacked_bar": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/trellis_100_stacked_bar": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/column": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/trellis_column": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/stacked_column": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/trellis_stacked_column": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/100_stacked_column": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/trellis_100_stacked_column": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/line": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/trellis_line": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/horizontal_line": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/dual_horizontal_line": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/trellis_dual_horizontal_line": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/trellis_horizontal_line": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/area": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/horizontal_area": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/trellis_area": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/trellis_horizontal_area": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/100_area": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/trellis_100_area": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/100_horizontal_area": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/trellis_100_horizontal_area": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/combination": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 2,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/trellis_combination": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 2,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/trellis_combinationEx": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": "exclusive",
            "MNDDependency": "valueGroup",
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": "exclusive",
            "MNDDependency": "valueGroup",
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "MNDDependency": "valueGroup",
            "acceptMND": "exclusive",
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "role": "layout.value",
            "groupId": "valueGroup"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "role": "layout.secondValue",
            "groupId": "valueGroup"
        },
        {
            "id": "valueGroup",
            "type": "group",
            "min": 1,
            "max": "Infinity"
        }
    ],
    "info/horizontal_combination": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 2,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/trellis_horizontal_combination": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 2,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/bubble": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.color"
        },
        {
            "id": "shape",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.shape"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.secondValue"
        },
        {
            "id": "bubbleWidth",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "mark.size"
        }
    ],
    "info/trellis_bubble": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.rowCategory"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.color"
        },
        {
            "id": "shape",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.shape"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.secondValue"
        },
        {
            "id": "bubbleWidth",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "mark.size"
        }
    ],
    "info/scatter": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.color"
        },
        {
            "id": "shape",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.shape"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.secondValue"
        }
    ],
    "info/trellis_scatter": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.rowCategory"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.color"
        },
        {
            "id": "shape",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.shape"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.secondValue"
        }
    ],
    "info/dual_column": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/trellis_dual_column": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/dual_stacked_column": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/trellis_dual_stacked_column": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/100_dual_stacked_column": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/trellis_100_dual_stacked_column": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/dual_bar": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/trellis_dual_bar": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/dual_stacked_bar": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/trellis_dual_stacked_bar": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/100_dual_stacked_bar": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/trellis_100_dual_stacked_bar": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/dual_line": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/trellis_dual_line": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/pie": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "size",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "role": "mark.color",
            "acceptMND": true
        }
    ],
    "info/time_bubble": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.color"
        },
        {
            "id": "shape",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.shape"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.secondValue"
        },
        {
            "id": "bubbleWidth",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "mark.size"
        }
    ],
    "info/bullet": [
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.color"
        },
        {
            "id": "actualValues",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "additionalValues",
            "type": "Measure",
            "min": 0,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "targetValues",
            "type": "Measure",
            "min": 0,
            "max": "Infinity",
            "role": "mark.target"
        },
        {
            "id": "forecastValues",
            "type": "Measure",
            "min": 0,
            "max": "Infinity",
            "role": "mark.forecast",
            "description": "This is deprecated"
        }
    ],
    "info/trellis_pie": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.rowCategory"
        },
        {
            "id": "size",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "role": "mark.color",
            "acceptMND": true
        }
    ],
    "info/donut": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "size",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "role": "mark.color",
            "acceptMND": true
        }
    ],
    "info/trellis_donut": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.rowCategory"
        },
        {
            "id": "size",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "role": "mark.color",
            "acceptMND": true
        }
    ],
    "info/treemap": [
        {
            "id": "title",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "role": "layout.tree",
            "acceptMND": false
        },
        {
            "id": "color",
            "type": "Measure",
            "min": 0,
            "max": 1,
            "role": "mark.quantizeColor"
        },
        {
            "id": "weight",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.value"
        }
    ],
    "info/tagcloud": [
        {
            "id": "dataFrame",
            "name": "IDS_DATA_FRAME",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "text",
            "name": "IDS_TEXT",
            "type": "Dimension",
            "min": 1,
            "max": 1,
            "role": "layout",
            "acceptMND": false
        },
        {
            "id": "weight",
            "name": "IDS_WEIGHT",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.value"
        },
        {
            "id": "color",
            "name": "IDS_COLOR",
            "type": "Measure",
            "min": 0,
            "max": 1,
            "role": "mark.quantizeColor"
        }
    ],
    "info/heatmap": [
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "categoryAxis2",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.secondCategory"
        },
        {
            "id": "color",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "mark.quantizeColor"
        }
    ],
    "info/vertical_bullet": [
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.color"
        },
        {
            "id": "actualValues",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "additionalValues",
            "type": "Measure",
            "min": 0,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "targetValues",
            "type": "Measure",
            "min": 0,
            "max": "Infinity",
            "role": "mark.target"
        },
        {
            "id": "forecastValues",
            "type": "Measure",
            "min": 0,
            "max": "Infinity",
            "role": "mark.forecast",
            "description": "This is deprecated"
        }
    ],
    "info/stacked_combination": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 2,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/horizontal_stacked_combination": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 2,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/dual_stacked_combination": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/dual_horizontal_stacked_combination": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/mekko": [
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.mekkoCategory"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.mekko"
        }
    ],
    "info/100_mekko": [
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.mekkoCategory"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.mekko"
        }
    ],
    "info/horizontal_mekko": [
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.mekkoCategory"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.mekko"
        }
    ],
    "info/100_horizontal_mekko": [
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.mekkoCategory"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.mekko"
        }
    ],
    "info/dual_combination": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/dual_horizontal_combination": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": false,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/number": [
        {
            "id": "value",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "mark.size"
        }
    ],
    "info/timeseries_line": [
        {
            "id": "timeAxis",
            "type": "Dimension",
            "min": 1,
            "max": 1,
            "acceptMND": false,
            "continuous": true,
            "sort": true,
            "role": "layout.time"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/timeseries_scatter": [
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.color"
        },
        {
            "id": "shape",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.shape"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.value"
        },
        {
            "id": "timeAxis",
            "type": "Dimension",
            "min": 1,
            "max": 1,
            "acceptMND": false,
            "continuous": true,
            "sort": false,
            "role": "layout.time"
        }
    ],
    "info/timeseries_bubble": [
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.color"
        },
        {
            "id": "shape",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.shape"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "layout.value"
        },
        {
            "id": "timeAxis",
            "type": "Dimension",
            "min": 1,
            "max": 1,
            "acceptMND": false,
            "continuous": true,
            "sort": false,
            "role": "layout.time"
        },
        {
            "id": "bubbleWidth",
            "type": "Measure",
            "min": 1,
            "max": 1,
            "role": "mark.size"
        }
    ],
    "info/timeseries_column": [
        {
            "id": "timeAxis",
            "type": "Dimension",
            "min": 1,
            "max": 1,
            "acceptMND": false,
            "continuous": true,
            "sort": true,
            "role": "layout.time"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/timeseries_combination": [
        {
            "id": "timeAxis",
            "name": "IDS_TIME_AXIS",
            "type": "Dimension",
            "min": 1,
            "max": 1,
            "acceptMND": false,
            "continuous": true,
            "sort": true,
            "configurable": false,
            "role": "layout.time"
        },
        {
            "id": "color",
            "name": "IDS_COLOR",
            "type": "Dimension",
            "min": 1,
            "max": 1,
            "MNDOnly": true,
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "name": "IDS_VALUE_AXIS",
            "type": "Measure",
            "min": 2,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/dual_timeseries_combination": [
        {
            "id": "timeAxis",
            "name": "IDS_TIME_AXIS",
            "type": "Dimension",
            "min": 1,
            "max": 1,
            "acceptMND": false,
            "continuous": true,
            "sort": true,
            "configurable": false,
            "role": "layout.time"
        },
        {
            "id": "color",
            "name": "IDS_COLOR",
            "type": "Dimension",
            "min": 1,
            "max": 1,
            "MNDOnly": true,
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "name": "IDS_VALUE_AXIS",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "valueAxis2",
            "name": "IDS_VALUE_AXIS2",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.secondValue"
        }
    ],
    "info/timeseries_stacked_combination": [
        {
            "id": "timeAxis",
            "name": "IDS_TIME_AXIS",
            "type": "Dimension",
            "min": 1,
            "max": 1,
            "acceptMND": false,
            "continuous": true,
            "sort": true,
            "role": "layout.time"
        },
        {
            "id": "color",
            "name": "IDS_COLOR",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "name": "IDS_VALUE_AXIS",
            "type": "Measure",
            "min": 2,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/timeseries_stacked_column": [
        {
            "id": "timeAxis",
            "type": "Dimension",
            "min": 1,
            "max": 1,
            "acceptMND": false,
            "continuous": true,
            "sort": true,
            "role": "layout.time"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/timeseries_100_stacked_column": [
        {
            "id": "timeAxis",
            "type": "Dimension",
            "min": 1,
            "max": 1,
            "acceptMND": false,
            "continuous": true,
            "sort": true,
            "role": "layout.time"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/timeseries_waterfall": [
        {
            "id": "timeAxis",
            "type": "Dimension",
            "min": 1,
            "max": 1,
            "acceptMND": false,
            "continuous": true,
            "sort": true,
            "role": "layout.time"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        }
    ],
    "info/waterfall": [
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "waterfallType",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "mark.waterfallType",
            "description": "Not recommend to use together with MND enabled on category axis"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/stacked_waterfall": [
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "waterfallType",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "mark.waterfallType"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/horizontal_waterfall": [
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "waterfallType",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "mark.waterfallType",
            "description": "Not recommend to use together with MND enabled on category axis"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/horizontal_stacked_waterfall": [
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "waterfallType",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "mark.waterfallType"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/radar": [
        {
            "id": "dataFrame",
            "type": "Dimension",
            "min": 0,
            "max": 1,
            "acceptMND": false,
            "role": "frame.data"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/trellis_radar": [
        {
            "id": "trellisColumn",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.columnCategory"
        },
        {
            "id": "trellisRow",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "trellis.rowCategory"
        },
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "acceptMND": true,
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        }
    ],
    "info/timeseries_bullet": [
        {
            "id": "timeAxis",
            "type": "Dimension",
            "min": 1,
            "max": 1,
            "acceptMND": false,
            "continuous": true,
            "sort": true,
            "role": "layout.time"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": false,
            "role": "mark.color"
        },
        {
            "id": "actualValues",
            "type": "Measure",
            "min": 1,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "additionalValues",
            "type": "Measure",
            "min": 0,
            "max": "Infinity",
            "role": "layout.value"
        },
        {
            "id": "targetValues",
            "type": "Measure",
            "min": 0,
            "max": "Infinity",
            "role": "mark.target"
        }
    ],
    "info/combinationEx": [
        {
            "id": "categoryAxis",
            "type": "Dimension",
            "min": 1,
            "max": "Infinity",
            "MNDDependency": "valueGroup",
            "acceptMND": "exclusive",
            "role": "layout.category"
        },
        {
            "id": "color",
            "type": "Dimension",
            "min": 0,
            "max": "Infinity",
            "acceptMND": true,
            "role": "mark.color"
        },
        {
            "id": "valueAxis",
            "type": "Measure",
            "role": "layout.value",
            "groupId": "valueGroup"
        },
        {
            "id": "valueAxis2",
            "type": "Measure",
            "role": "layout.secondValue",
            "groupId": "valueGroup"
        },
        {
            "id": "valueGroup",
            "type": "group",
            "min": 1,
            "max": "Infinity"
        }
    ]
};
});