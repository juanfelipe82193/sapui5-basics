sap.zen.initSdkControl = function(oZtlClass, component, aProperties) {

	if (oZtlClass) {
		for ( var key in oZtlClass) {
			if (oZtlClass.hasOwnProperty(key)) {
				var f = oZtlClass[key];
				component[key] = f;
			}
		}

		aProperties.forEach(function(oProperty) {
			if (oProperty.type === "boolean") {

				Object.defineProperty(component, oProperty.name, {
					set : function(newValue) {
						component.getPageObject().setBooleanProperty(
								oProperty.name, newValue);
					},
					get : function() {
						return component.getPageObject()
								.getBooleanPropertyWithDefault(oProperty.name,
										false);
					}
				});
			} else if (oProperty.type === "int") {

				Object.defineProperty(component, oProperty.name, {
					set : function(newValue) {
						component.getPageObject().setIntProperty(
								oProperty.name, newValue);
					},
					get : function() {
						return component.getPageObject()
								.getIntPropertyWithDefault(oProperty.name, 0);
					}
				});
			} else if (oProperty.type === "float") {

				Object.defineProperty(component, oProperty.name, {
					set : function(newValue) {
						component.getPageObject().setDoubleProperty(
								oProperty.name, newValue);
					},
					get : function() {
						return component.getPageObject()
								.getDoublePropertyWithDefault(oProperty.name,
										0.0);
					}
				});
			} else if (oProperty.type === "Object") {

				Object.defineProperty(component, oProperty.name, {
					set : function(newValue) {
						component.getPageObject().setJsonProperty(
								oProperty.name, newValue);
					},
					get : function() {
						return component.getPageObject()
								.getJsonProperty(oProperty.name);
					}
				});
			} else  {

				Object.defineProperty(component, oProperty.name, {
					set : function(newValue) {
						component.getPageObject().setStringProperty(
								oProperty.name, newValue);
					},
					get : function() {
						return component.getPageObject()
								.getStringPropertyWithDefault(oProperty.name,
										"");
					}
				});
			}
		});

	}
};
