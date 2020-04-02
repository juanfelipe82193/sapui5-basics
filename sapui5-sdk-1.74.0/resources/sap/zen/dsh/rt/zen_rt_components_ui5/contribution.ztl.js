var com_sap_ip_bi_FormattedTextView = {
setHtmlText: function(htmlText) {
    this.htmlText = htmlText;
  },
getHtmlText: function() {
    return this.htmlText;
  }
};
var com_sap_ip_bi_FragmentGallery = {
getSelectedId: function() {
    return this.selectedId;
  },
setSelectedId: function(id) {
    this.selectedId = id;
  },
addItem: function(info) {
    if (info != undefined && info != null) {
      var key = info.id;
      var text = info.title;
      var image = info.imageUrl;
      var description = info.description;

      var itemDef = "{\"key\": \"" + key + "\", \"text\" : \"" + text + "\", \"image\" : \"" + image + "\", \"description\" : \"" + description + "\"}";
      var itemArray = JSON.parse("[" + itemDef + "]");
      var found = false;
      if (this.items === undefined || this.items === "") {
        this.items = JSON.stringify(itemArray);
      } else {
        var itemsArray = JSON.parse(this.items);
        for (var i = 0; i < itemsArray.length; i++) {
          if (itemsArray[i].key == key) {
            found = true;
          }
        }
        if (!found) {
          this.items = JSON.stringify(itemsArray.concat(itemArray));
        }
      }
    }
  },
addItems: function(array) {
    for (var i = 0; i < array.length; i++) {
      addItem(array[i]);
    }
  },
removeItem: function(id) {
    var itemArray = JSON.parse(this.items);
    var index = -1;
    for (var i = 0; i < itemArray.length; i++) {
      if (id != null && id != undefined) {
        if (itemArray[i].key == id){
          index = i;
        }
      } else {
        if (itemArray[i].id == this.selectedId) {
          index = i;
        }
      }
    }

    if (index > -1) {
      itemArray.splice(index, 1);
    }

    this.items = JSON.stringify(itemArray);
  },
removeAllItems: function() {
    var itemArray = [];
    this.items = JSON.stringify(itemArray);
  }
};
var com_sap_ip_bi_DataSourceBrowser = {
getRootFolders: function(browseType) {
      return COMPONENTS[this.owner].getRootFolders(browseType);
  },
getChildren: function(parent) {
      return COMPONENTS[this.owner].getChildren(parent);
  },
searchDataSources: function(searchPattern) {
      return COMPONENTS[this.owner].searchDataSources(searchPattern);
  },
close: function(arg) {
      COMPONENTS[this.owner].dialogClosed(arg);
  }
};
var com_sap_ip_bi_SelectionTable = {
setDataSelection: function(selection) {
    this.data = this.stringifySelection(selection);
  },
getVisualSelection: function() {
    return this.visSelection;
  },
setVisualSelection: function(selection) {
    this.visSelection = this.stringifySelection(selection);
  },
getSelectedMember: function(dimension) {
    var jsonVisSelection = {};
    if (this.visSelection) {
      jsonVisSelection= JSON.parse(this.visSelection);
    }
    var member = jsonVisSelection[dimension];
    return this.createMember(dimension, member);
  },
setSelectionShape: function(shape) {
    this.selectionShape = shape;
  },
getCurrentSelectionShape: function() {
    return this.currrentSelectionShape;
  },
getDataSourceNames: function() {
     var dss= APPLICATION.getDataSources();
     return dss.map(function(val) {
       return val.get_VariableName();
     });
  },
getDataSourceByName: function(name) {
     var dataSource = COMPONENTS[name];
     if (dataSource.loadDataSource) {
       dataSource.loadDataSource();
     }
     return dataSource;
  }
};
var IconBackgroundShapeEnumfield = {
};
var IconBackgroundShape = {
RECTANGLE: "RECTANGLE",
ELLIPSIS: "ELLIPSIS",
NONE: "NONE"
};
var com_sap_ip_bi_Icon = {
getBackgroundColor: function() {
    return this.backgroundColor;
  },
setBackgroundColor: function(backgroundColor) {
      this.backgroundColor = backgroundColor;
  },
getColor: function() {
    return this.color;
  },
setColor: function(color) {
      this.color = color;
  },
getIconUri: function() {
    return this.iconUri;
  },
setIconUri: function(iconUri) {
    this.iconUri = iconUri;
  },
getSizeFactor: function() {
    return this.sizeFactor;
  },
setSizeFactor: function(sizeFactor) {
    this.sizeFactor = sizeFactor;
  },
getBackgroundShape: function() {
    return this.backgroundShape;
  },
setBackgroundShape: function(backgroundShape) {
    this.backgroundShape = backgroundShape;
  },
getTooltip: function() {
    return this.tooltip;
  },
setTooltip: function(tooltip) {
    this.tooltip = tooltip;
  }
};
var SwitchModeEnumfield = {
};
var SwitchMode = {
OnOff: "OnOff",
Blank: "Blank",
AcceptReject: "AcceptReject"
};
var com_sap_ip_bi_Switch = {
isEnabled: function() {
		return this.enabled;
	},
setEnabled: function(newEnabled) {
		this.enabled = newEnabled;
	},
getTooltip: function() {
		return this.tooltip;
	},
setTooltip: function(newTooltip) {
		this.tooltip = newTooltip;
	},
getMode: function() {
		return this.mode;
	},
setMode: function(newMode) {
		this.mode = newMode;
	},
isOn: function() {
		return this.state;
	},
setOn: function(newState) {
		this.state = newState;
	}
};
var LinkStyleEnumfield = {
};
var LinkStyle = {
Normal: "Normal",
Subtle: "Subtle",
Emphasized: "Emphasized"
};
var com_sap_ip_bi_Link = {
setText: function(text) {
		this.text = text;
	},
getText: function() {
		return this.text;
	},
setEnabled: function(enabled) {
		this.enabled = enabled;
	},
isEnabled: function() {
		return this.enabled;
	},
setTooltip: function(value) {
		this.tooltip = value;
	},
getTooltip: function() {
		return this.tooltip;
	},
setUrl: function(url) {
		this.url = url;
	},
getUrl: function() {
		return this.url;
	},
setStyle: function(val) {
		this.style = val;
	},
getStyle: function() {
		return this.style;
	}
};
var ProgressIndicatorStateEnumfield = {
};
var ProgressIndicatorState = {
None: "None",
Error: "Error",
Warning: "Warning",
Success: "Success"
};
var com_sap_ip_bi_ProgressIndicator = {
getText: function() {
		return this.text;
	},
setText: function(val) {
		this.text = val;
	},
getState: function() {
		return this.state;
	},
setState: function(val) {
		this.state = val;
	},
getPercentValue: function() {
		return this.percentValue;
	},
setPercentValue: function(val) {
		this.percentValue = val;
	},
getTooltip: function() {
		return this.tooltip;
	},
setTooltip: function(val) {
		this.tooltip = val;
	}
};
var com_sap_ip_bi_TextArea = {
setValue: function(value) {
		this.value = value;
	},
getValue: function() {
		return this.value;
	},
setEnabled: function(enabled) {
		this.enabled = enabled;
	},
isEnabled: function() {
		return this.enabled;
	},
setEditable: function(editable) {
		this.editable = editable;
	},
isEditable: function() {
		return this.editable;
	},
setTooltip: function(value) {
		this.tooltip = value;
	},
getTooltip: function() {
		return this.tooltip;
	}
};
var com_sap_ip_bi_SegmentedButton = {
getSelectedText: function() {
		return this.selectedText;
	},
getSelectedValue: function() {
		return this.selectedValue;
	},
setSelectedValue: function(value) {
		this.selectedValue = value;
	},
removeAllItems: function() {
		this.ButtonItems = [];
	},
removeItem: function(value) {
		var arr = this.ButtonItems;

		for(var i = arr.length-1; i > 0; i--) {
			if(arr[i].value == value) {  
				arr.splice(i, 1);
			}	
		}
		this.ButtonItems = arr;
	},
setItemEnabled: function(value, enabled) {
		var arr = this.ButtonItems;

		for(var i = 0; i< arr.length; i++) {
			if(arr[i].value == value) {  
				arr[i] = {
						value: arr[i].value,
						text: arr[i].text,
						image: arr[i].icon ,
						disabled : !enabled
				};
			}
		}
		this.ButtonItems = arr;
	},
isItemEnabled: function(value) {
		var arr = this.ButtonItems;

		for(var i = 0; i< arr.length; i++) {
			if(arr[i].value == value) {  
				return !arr[i].disabled;
			}
		}
	},
addItem: function(value, text, icon, index) {
		var arr = this.ButtonItems  || [];

		if(index == null || index == undefined ) {
			arr.push({
				value: value,
				text: text == null|| text == undefined ? "": text,
						image: icon == null|| icon == undefined? "": icon ,
								enabled : true
			});
		} else {
			arr.splice(index,0,{
				value: value,
				text: text == null|| text == undefined ? "": text,
						image: icon == null|| icon == undefined? "": icon ,
								enabled : true
			});
		}
		this.ButtonItems = arr;
	}
};
