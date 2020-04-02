define("zen.rt.components.sdk/resources/js/component", [], function() {

	 var Component = function(phxOwner) {
		this.owner = phxOwner;
	
		/**
		 * Override this method if you need to do some initialization after the DOM object is created
		 */
		this.init = function() {
			// Empty default implementation
		};
	
		/**
		 * Override this method if you need to do some clean up operations when the component is deleted. Note the the root
		 * DIV and all its children are automatically removed from DOM after this method.
		 */
		this.componentDeleted = function() {
			// Empty default implementation
		};
	
		/**
		 * This method is called before the properties of the handler are updated.
		 */
		this.beforeUpdate = function() {
			// Empty default implementation
		};
	
		/**
		 * This method is called after the properties of the handler are updated.
		 */
		this.afterUpdate = function() {
			// Empty default implementation
		};
	
		var bIsInPropertyDispatch = false;
	
		this.updateProperty = function(sPropName, aProperties) {
			var getterSetter = this[sPropName];
			if (getterSetter) {
				var newVal = aProperties[sPropName];
				getterSetter.call(this, newVal);
			}
		};
	
		this.dispatchProperties = function(oControlProperties, oComponentProperties) {
			this.beforeUpdate();
			bIsInPropertyDispatch = true;
	
			var sPropName;
			if (oControlProperties) {
				for (sPropName in oControlProperties) {
					this.oControlProperties[sPropName] = oControlProperties[sPropName];
					this.updateProperty(sPropName, oControlProperties);
				}
			}
	
			this.oComponentProperties = oComponentProperties;
			for (sPropName in oComponentProperties) {
				this.updateProperty(sPropName, oComponentProperties);
			}
			bIsInPropertyDispatch = false;
			this.afterUpdate();
		};
	
		this.fireEvent = function(sName) {
			if (!bIsInPropertyDispatch) {
				if (typeof (DSH_deployment) == "undefined") {
					var event = [['EVENT_NAME',sName,0],['BI_COMMAND_TYPE','',0],['COMPONENT_NAME',this.oComponentProperties.id, 0],['COMMAND_INTERPRETER','BIAL',0]];
					sap.zen.request.zenSendCommandArrayWoEventWZenPVT(event);
				}
				else {
					var idToUse = this.oComponentProperties.id;
					var buddhaId = "Buddha";
					
					if (this.oControlProperties.pureId) {
						buddhaId = this.oControlProperties.buddhaId;
						idToUse = this.oControlProperties.pureId; 
					}
					var sCommand = idToUse +  '.runScript\x28\x27' + sName + '\x27\x29\x3b';				
					window.putInQueue(function(){
						window[buddhaId].exec(sCommand);
					});
				}
			}
		};
	
		this.getTargetParam = function() {
			return "TARGET_ITEM_REF";
		};
	
	
		function createCommand(aNames) {
			var command = new sapbi_Command("UPDATE_PROPERTIES");
	
			command.addParameter(new sapbi_Parameter(this.getTargetParam(), this.oComponentProperties.id));
			var changes = new sapbi_Parameter("CHANGES", "");
			var childListChanges = new sapbi_ParameterList();
	
			for (var i = 0; i < aNames.length; i++) {
				var propName = aNames[i];
				var value = this[propName]();
				if (Array.isArray(value) || (typeof value == "object")) {
					value = JSON.stringify(value);
				}
				childListChanges.addParameter(new sapbi_Parameter(propName, value));
			}
	
			changes.setChildList(childListChanges);
			command.addParameter(changes);	
			return command;
		}
		
		
		
		this.firePropertiesChanged = function(aNames) {
			if (!bIsInPropertyDispatch) {
				if (typeof (DSH_deployment) == "undefined") {
					var command = createCommand.call(this, aNames);
					sap.zen.request.zenSendCommandArrayWoEventWZenPVT(command, false, true);
				} else {
					var tempReturnJSON = [];
					for (var i = 0; i < aNames.length; i++) {
						var propName = aNames[i];
						var value = this[propName]();
						tempReturnJSON.push(propName);
						tempReturnJSON.push(value);
					}

					var idToUse = this.oComponentProperties.id;
					var buddhaId = "Buddha";
					
					if (this.oControlProperties.pureId) {
						buddhaId = this.oControlProperties.buddhaId;
						idToUse = this.oControlProperties.pureId; 
					}

					window.putInQueue(function() {
						window[buddhaId].exec(idToUse + '.doSDKPVT(' + JSON.stringify(tempReturnJSON) + ');');
					});
				}
			}
		};
	
		this.firePropertiesChangedAndEvent = function(aNames, sEvent, bNoUndo) {
			if (!bIsInPropertyDispatch){
				if (typeof (DSH_deployment) == "undefined") {
					var command = createCommand.call(this, aNames);
					if (bNoUndo) {
						command.addParameter(new sapbi_Parameter("PREVENT_UNDO", "X"));
					}
					var sequence = new sapbi_CommandSequence();
					sequence.addCommand(command);
					var event = [['EVENT_NAME',sEvent,0],['BI_COMMAND_TYPE','',0],['COMPONENT_NAME',this.oComponentProperties.id, 0],['COMMAND_INTERPRETER','BIAL',0]];			
					var eventCommand = sapbi_createParameterList(event);
					if (bNoUndo) {
						eventCommand.addParameter(new sapbi_Parameter("PREVENT_UNDO", "X"));
					}
					sequence.addCommand(eventCommand);													
					sap.zen.request.zenSendCommandArrayWoEventWZenPVT(sequence, false, true);
				} else {
					this.firePropertiesChanged(aNames);
					this.fireEvent(sEvent);
				}								
			} 
		};
	
		this.$ = function() {
			return this.owner.$();
		};

		this.ztlCallFunction = function(value) {
			if (value === undefined) {
				return this._ztlFunction; 
			} else {
				this._ztlFunction = value;
				return this;
			}
		}; 

		this.ztlCallPayload = function(value) {
			if (value === undefined) {
				return this._ztlPayload; 
			} else {
				this._ztlPayload = value;
				return this;
			}
		}; 

		this.ztlCallResult = function(value) {
			if (value !== undefined && this._ztlCallCallback) {
				this._ztlCallCallback.call(this, JSON.parse(value));
				return this;
			}
		}; 

		this.callZTLFunction = function(sName, fCallback) {
			var args = Array.prototype.slice.apply(arguments); // First convert to normal array
			args = args.slice(2); // now cut the non-needed stuff
			this.ztlCallPayload(JSON.stringify(args)).ztlCallFunction(sName);
			this._ztlCallCallback = fCallback;
			this.firePropertiesChangedAndEvent(["ztlCallPayload", "ztlCallFunction"], "onZtlCall");
		};
		
		this.callZTLFunctionNoUndo = function(sName, fCallback) {
			var args = Array.prototype.slice.apply(arguments); // First convert to normal array
			args = args.slice(2); // now cut the non-needed stuff
			this.ztlCallPayload(JSON.stringify(args)).ztlCallFunction(sName);
			this._ztlCallCallback = fCallback;
			this.firePropertiesChangedAndEvent(["ztlCallPayload", "ztlCallFunction"], "onZtlCall", true);
		};
	};

	Component.makeSubClass = function (cBaseClass) {

		function subClass(sName, fConstructor) {
			var aParts = sName.split(".");
			var lastScope = window;
			for (var i = 0; i < aParts.length - 1; i++) {
				var sPart = aParts[i];
				var newScope = lastScope[sPart] || {};
				lastScope[sPart] = newScope;
				lastScope = newScope;
			}

			var sFunctionName = aParts[i];
			var fConstructorCallingSuper = function() {
				cBaseClass.apply(this, arguments);
				fConstructor.apply(this, arguments);
			};
			lastScope[sFunctionName] = fConstructorCallingSuper;

			return fConstructorCallingSuper;
		}

		return subClass;
	};
	Component.subclass = Component.makeSubClass(Component);

	return Component;	
});

