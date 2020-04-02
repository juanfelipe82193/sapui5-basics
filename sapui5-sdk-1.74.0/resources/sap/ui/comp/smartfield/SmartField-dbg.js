/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/core/library",
	"sap/ui/comp/library",
	"./JSONControlFactory",
	"./ODataControlFactory",
	"./BindingUtil",
	"./SideEffectUtil",
	"./ODataHelper",
	"sap/ui/core/Control",
	"sap/ui/model/ParseException",
	"sap/ui/model/ValidateException",
	"sap/ui/model/json/JSONModel",
	"sap/base/strings/capitalize",
	"sap/base/Log"
], function(
	coreLibrary,
	library,
	JSONControlFactory,
	ODataControlFactory,
	BindingUtil,
	SideEffectUtil,
	ODataHelper,
	Control,
	ParseException,
	ValidateException,
	JSONModel,
	capitalize,
	Log
) {
	"use strict";

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;

	var TextInEditModeSource = library.smartfield.TextInEditModeSource;

	// shortcut for sap.ui.core.TextAlign
	var TextAlign = coreLibrary.TextAlign;

	// shortcut for sap.ui.comp.smartfield.ControlContextType
	var ControlContextType = library.smartfield.ControlContextType;

	// shortcut for sap.ui.comp.smartfield.ControlProposalType
	var ControlProposalType = library.smartfield.ControlProposalType;

	/**
	 * Constructor for a new <code>sap.ui.comp.smartfield.SmartField</code>.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * @class The <code>SmartField</code> control interprets metadata that represents entity-relationship models, data types,
	 * service capabilities, and annotations in OData services to automatically generate the underlying inner controls
	 * and reduce the amount of code needed for developing applications.
	 * In some cases, the OData entity is derived from the control's binding context. The OData entity's property that
	 * is changed or displayed with the control is derived from the control's <code>value</code> property.
	 *
	 * <h3>Accessibility</h3>
	 * For interoperability and accessibility reasons, the <code>SmartField</code> control must be labeled
	 * by the <code>sap.ui.comp.smartfield.SmartLabel</code> control instead of the <code>sap.m.Label</code> control, as
	 * the <code>sap.m.Label</code> control does not know of the inner structure of a <code>SmartField</code> control.
	 * If the <code>SmartField</code> control is rendered inside a smart container control, for example, the <code>SmartForm</code>
	 * control, the <code>SmartLabel</code> control is automatically generated to reduce the amount of code needed on
	 * the application side.
	 * However, in other scenarios when <code>SmartField</code> is used stand-alone or outside a smart container
	 * control, for example, a <code>SimpleForm</code> control, the <code>SmartLabel</code> control is not automatically
	 * generated in these cases.
	 * Although the <code>sap.ui.comp.smartfield.SmartLabel</code> is a private/internal control, the following basic use
	 * is allowed by applications for labeling the <code>SmartField</code> control.
	 *
	 * <i>XML Example of a <code>SmartField</code> control labeled by a <code>SmartLabel</code> control</i>
	 *
	 * <pre>
	 * &lt;sap.ui.comp.smartfield.SmartLabel labelFor=&quot;IDProduct&quot;/&gt;
	 * &lt;sap.ui.comp.smartfield.SmartField id=&quot;IDProduct&quot; value=&quot;{ProductId}&quot;/&gt;
	 * </pre>
	 *
	 * @extends sap.ui.core.Control
	 * @implements sap.ui.core.IFormContent
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smartfield.SmartField
	 * @see {@link topic:4864403f08c64ca08a2b0ee1fa9cb5e2 Smart Field}
	 * @ui5-metamodel This control will also be described in the UI5 (legacy) design time meta model
	 */
	var SmartField = Control.extend("sap.ui.comp.smartfield.SmartField", /** @lends sap.ui.comp.smartfield.SmartField.prototype */ {
		metadata: {
			interfaces : ["sap.ui.core.IFormContent"],
			library: "sap.ui.comp",
			designtime: "sap/ui/comp/designtime/smartfield/SmartField.designtime",
			properties: {

				/**
				 * The binding path expression used to determine the bound Entity Data Model (EDM) property.
				 *
				 * <b>Note:</b> Composite binding expressions for this property are not supported.
				 * <b>Note:</b> Custom formatters for this property are not supported.
				 * The <code>SmartField</code> control usually creates its own data type based on the service
				 * metadata for the formatting of values.
				 * Also, when a custom formatter is specified for a property, the binding mode is automatically
				 * switched to one-way binding mode.
				 * <b>Note:</b> Named models are not supported, only the default model (named undefined) is supported.
				 * For example, when the binding path expression contains a <code>&gt;</code> sign, the string
				 * preceding it is a named model and the remainder after the <code>&gt;</code> is the binding path.
				 *
				 * @example <caption>Common Scenario with the <code>value</code> Control Property Bound to a <code>CategoryName</code> EDM Property</caption>
				 *
				 * // Extract of an EDM property of a service metadata document:
				 * <Property Name="CategoryName" Type="Edm.String"/>
				 *
				 * // Extract of a definition of a SmartField control in an XML view:
				 * <SmartField value="{CategoryName}"/>
				 */
				value: {
					type: "any",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Indicates whether the user can interact with the control or not. <b>Note:</b> Disabled controls cannot be focused and they are out
				 * of the tab order.
				 */
				enabled: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * The name of an entity set for which the control manages values. This is an optional property.
				 *
				 * If this property is left empty, the entity set is computed by parsing the binding context path,
				 * for example, <code>Tasks('id-1428419016778-51')</code> is parsed to <code>Tasks</code>.
				 */
				entitySet: {
					type: "string",
					group: "Misc",
					defaultValue: ""
				},

				/**
				 * Indicates whether the control is in display or edit mode.
				 *
				 * <b>Note:</b> The <code>SmartField</code> control is metadata-driven, and this control
				 * property can be ignored if the following applies:
				 *
				 * <ul>
				 * <li>The bound Entity Data Model (EDM) property or its entity set are annotated with the
				 * OData V2 <code>sap:updatable</code> annotation.</li>
				 * <li>The bound EDM property or its entity set are annotated with the <code>sap:creatable</code>
				 * annotation.</li>
				 * <li>The entity set of the bound EDM property is annotated with the OData V2
				 * <code>sap:updatable-path</code> annotation.</li>
				 * <li>The entity set of the bound EDM property is annotated with the OData V4
				 * <code>Org.OData.Capabilities.V1.InsertRestrictions</code> annotation.</li>
				 * <li>The bound EDM property is annotated with the
				 * <code>com.sap.vocabularies.Common.v1.FieldControl</code> annotation.</li>
				 * <li>The entity set of the bound EDM property is annotated with the OData V4
				 * <code>Org.OData.Capabilities.V1.UpdateRestrictions</code> annotation.</li>
				 * </ul>
				 *
				 * @example <caption>Scenario with Computed <code>editable</code> Value of <code>false</code></caption>
				 *
				 * // Extract of an EDM property of a service metadata document:
				 * <Property Name="ProductId" Type="Edm.String" sap:updatable="false"/>
				 *
				 * // Extract of a definition of a SmartField control in an XML view:
				 * <SmartField value="{ProductId}" editable="true"/>
				 *
				 * @example <caption>Scenario with Computed <code>editable</code> Value of <code>false</code></caption>
				 *
				 * // Extract of an EDM property of a service metadata document:
				 * <Property Name="ProductId" Type="Edm.String" sap:creatable="false"/>
				 *
				 * // Extract of a definition of a SmartField control in an XML view:
				 * <SmartField value="{ProductId}" editable="true"/>
				 */
				editable: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Notifies the control whether controls using the <code>SmartField</code> control are editable.
				 *
				 * @since 1.32.0
				 */
				contextEditable: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Defines the width of the control.
				 */
				width: {
					type: "sap.ui.core.CSSSize",
					group: "Misc",
					defaultValue: ""
				},

				/**
				 * Horizontal alignment of the text.
				 */
				textAlign: {
					type: "sap.ui.core.TextAlign",
					group: "Misc",
					defaultValue: TextAlign.Initial
				},

				/**
				 * Text shown when no value available.
				 */
				placeholder: {
					type: "string",
					group: "Misc",
					defaultValue: ""
				},

				/**
				 * To be used in the HTML code (for example, for HTML forms that send data to the server via 'submit').
				 */
				name: {
					type: "string",
					group: "Misc",
					defaultValue: ""
				},

				/**
				 * Visualizes the validation state of the control, e.g. <code>Error</code>, <code>Warning</code>,
				 * <code>Success</code>, <code>Information</code>.
				 *
				 * <b>Note:</b> This method is public because of an implementation side effect and should not be used
				 * for validation purposes as it may conflict with the <code>SmartField</code> control's own binding
				 * type validation logic based on the underlying metadata of the bound Entity Data Model (EDM)
				 * property.
				 * Invoking the <code>.setValueState()</code> and/or <code>.setValueStateText()</code> methods in a
				 * <code>change</code> event handle to set an error state does not prevent an invalid value from
				 * being stored in the binding/model in two-way data binding scenarios.
				 * In addition, it does not fire the <code>validationError</code> event, which is usually required by
				 * some upstream modules, for example, the message manager.
				 *
				 * Custom validation logic must be implemented in a custom binding type rather than in a
				 * <code>change</code> event handler.
				 */
				valueState: {
					type: "sap.ui.core.ValueState",
					group: "Appearance",
					defaultValue: ValueState.None
				},

				/**
				 * Defines the text of the value state message popup.
				 *
				 * <b>Note:</b> This method is public because of an implementation side effect and should not be used
				 * for validation purposes as it may conflict with the <code>SmartField</code> control's own binding
				 * type validation logic based on the underlying metadata of the bound Entity Data Model (EDM)
				 * property.
				 * Invoking the <code>.setValueState()</code> and/or <code>.setValueStateText()</code> methods in a
				 * <code>change</code> event handle to set an error state does not prevent an invalid value from
				 * being stored in the binding/model in two-way data binding scenarios.
				 * In addition, it does not fire the <code>validationError</code> event, which is usually required by
				 * some upstream modules, for example, the message manager.
				 *
				 * Custom validation logic must be implemented in a custom binding type rather than in a
				 * <code>change</code> event handler.
				 */
				valueStateText: {
					type: "string",
					group: "Appearance",
					defaultValue: ""
				},

				/**
				 * Defines whether the value state message is shown or not.
				 */
				showValueStateMessage: {
					type: "boolean",
					group: "Appearance",
					defaultValue: true
				},

				/**
				 * Data types to be used, if the <code>SmartField</code> control is interacting with a JSON model. If the value property of the
				 * control is bound to a property of an OData entity set, this property is not taken into consideration.
				 *
				 * @deprecated Since 1.31.0
				 */
				jsontype: {
					type: "sap.ui.comp.smartfield.JSONType",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Indicates whether user input is required.
				 *
				 * <b>Note:</b> The <code>SmartField</code> control is metadata-driven and this property can
				 * be ignored if the following applies:
				 *
				 * <ul>
				 * <li>The bound Entity Data Model (EDM) property is annotated with the <code>Nullable</code>
				 * annotation. The <code>Nullable</code> annotation is a capability of the OData service that
				 * specifies whether a value is mandatory, hence it overrules the control's API settings.
				 * Therefore, if the <code>Nullable</code> attribute is specified as <code>Nullable="false"</code>,
				 * a value is mandatory.</li>
				 * <li>The bound EDM property is annotated with the <code>com.sap.vocabularies.Common.v1.FieldControl</code>
				 * annotation.</li>
				 * </ul>
				 *
				 * @example <caption>Scenario with Computed <code>mandatory</code> Value of <code>true</code></caption>
				 *
				 * // Extract of an EDM property of a service metadata document:
				 * <Property Name="ProductId" Type="Edm.String" Nullable="false"/>
				 *
				 * // Extract of a definition of a SmartField control in an XML view:
				 * <SmartField value="{ProductId}" mandatory="false"/>
				 *
				 * @example <caption>Scenario with Computed <code>mandatory</code> Value of <code>true</code></caption>
				 *
				 * // Extract of an EDM property of a service metadata document:
				 * <Property Name="Name" Type="Edm.String">
				 *     <Annotation Term="com.sap.vocabularies.Common.v1.FieldControl" EnumMember="com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"/>
			     * </Property>
				 *
				 * // Extract of a definition of a SmartField control in an XML view:
				 * <SmartField value="{Name}" mandatory="false"/>
				 */
				mandatory: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * Defines the highest possible number of permitted input characters that the user can enter
				 * into the text input field.
				 *
				 * <h3>Computed <code>maxLength</code></h3>
				 * If the specified <code>maxLength</code> value is greater than the <code>maxLength</code>
				 * value specified for the underlying bound Entity Data Model (EDM) property in the service
				 * metadata document, the <code>maxLength</code> value of the EDM property takes precedence.
				 * Likewise, if the application code provides a binding data type for the <code>value</code>
				 * property of the <code>SmartField</code> control and the binding data type has
				 * <code>maxLength</code> constraints defined, this <code>maxLength</code> is also taken into
				 * consideration to compute the final <code>maxLength</code> value.
				 *
				 * <h3>Validation Behavior</h3>
				 * By design, the <code>SmartField</code> control does not restrict/validate the highest
				 * number of permitted input characters for every keystroke, but only when the text input
				 * field has changed, and the browser focus leaves the text input field or the ENTER key is
				 * pressed. The <code>SmartField</code> control is used more generically in broader contexts,
				 * and adding a <code>maxLength</code> attribute to the HTML text input control may break data
				 * type formatting in two-way data-binding scenarios.
				 * Let's say the <code>maxLength</code> property is set to 3, but the text input control has
				 * a formatter function attached to it to format the entered value "DE" to "Germany (DE)".
				 * In this case, the formatted value will be truncated by the <code>maxLength</code> setting.
				 *
				 * @example <caption>Scenario with Computed <code>maxLength</code> Value of 3</caption>
				 *
				 * // Extract of an EDM property of a service metadata document:
				 * <Property Name="ProductId" Type="Edm.String"/>
				 *
				 * // Extract of a definition of a SmartField control in an XML view:
				 * <SmartField value="{ProductId}" Type="Edm.String" maxLength="3"/>
				 *
				 * @example <caption>Scenario with Computed <code>maxLength</code> Value of 2</caption>
				 *
				 * // Extract of an EDM property of a service metadata document:
				 * <Property Name="ProductId" Type="Edm.String" MaxLength="3"/>
				 *
				 * // Extract of a definition of a SmartField control in an XML view:
				 * <SmartField value="{ProductId}" Type="Edm.String" maxLength="2"/>
				 *
				 * @example <caption>Scenario with Computed <code>maxLength</code> Value of 3 Instead of 4</caption>
				 *
				 * // Extract of an EDM property of a service metadata document:
				 * <Property Name="ProductId" Type="Edm.String" MaxLength="3"/>
				 *
				 * // Extract of a definition of a SmartField control in an XML view:
				 * <SmartField value="{ProductId}" Type="Edm.String" maxLength="4"/>
				 */
				maxLength: {
					type: "int",
					group: "Misc",
					defaultValue: 0
				},

				/**
				 * If set to <code>true</code>, the suggestion feature for a hosted control is enabled, if the hosted control supports it.
				 */
				showSuggestion: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * If set to <code>true</code>, a value help indicator will be displayed inside the hosted control, if the hosted control supports
				 * this.
				 */
				showValueHelp: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * If set to <code>false</code> the label is not displayed.
				 */
				showLabel: {
					type: "boolean",
					group: "Appearance",
					defaultValue: true
				},

				/**
				 * This property contains the text of an associated <code>SmartLabel</code>.
				 */
				textLabel: {
					type: "string",
					group: "Misc",
					defaultValue: ""
				},

				/**
				 * This property contains the tool tip of the associated <code>SmartLabel</code> control.
				 */
				tooltipLabel: {
					type: "string",
					group: "Misc",
					defaultValue: ""
				},

				/**
				 * Indicates whether the unit of measure field is visible.
				 *
				 * <b>Note:</b> This control property is only valid if the <code>SmartField</code> control
				 * addresses a unit of measure composite field, for example, an amount field and its associated
				 * currency field. The field must then be annotated with one of the following annotations:
				 *
				 * <ul>
				 * <li>The bound Entity Data Model (EDM) property or its entity set are annotated with the
				 * OData V2 <code>sap:unit</code> annotation.</li>
				 * <li>The entity set of the bound EDM property is annotated with the OData V4
				 * <code>Org.OData.Measures.V1.ISOCurrency</code> annotation.</li>
				 * <li>The entity set of the bound EDM property is annotated with the OData V4
				 * <code>Org.OData.Measures.V1.Unit</code> annotation.</li>
				 * </ul>
				 *
				 * <b>Note:</b> The <code>SmartField</code> control is metadata-driven, and this property can
				 * be ignored if the bound EDM property is annotated with the <code>com.sap.vocabularies.Common.v1.FieldControl</code>
				 * annotation.
				 */
				uomVisible: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Indicates whether the unit of measure field is in display or edit mode.
				 *
				 * <b>Note:</b> This control property is only valid if the <code>SmartField</code> control
				 * addresses a unit of measure composite field, for example, an amount field and its associated
				 * currency field. The field must then be annotated with one of the following annotations:
				 *
				 * <ul>
				 * <li>The bound Entity Data Model (EDM) property or its entity set are annotated with the
				 * OData V2 <code>sap:unit</code> annotation.</li>
				 * <li>The entity set of the bound EDM property is annotated with the OData V4
				 * <code>Org.OData.Measures.V1.ISOCurrency</code> annotation.</li>
				 * <li>The entity set of the bound EDM property is annotated with the OData V4
				 * <code>Org.OData.Measures.V1.Unit</code> annotation.</li>
				 * </ul>
				 *
				 * <b>Note:</b> The <code>SmartField</code> control is metadata-driven, and this control
				 * property can be ignored if the following applies:
				 *
				 * <ul>
				 * <li>The bound Entity Data Model (EDM) property or its entity set are annotated with the
				 * OData V2 <code>sap:updatable</code> annotation.</li>
				 * <li>The bound EDM property or its entity set are annotated with the <code>sap:creatable</code>
				 * annotation.</li>
				 * <li>The entity set of the bound EDM property is annotated with the OData V2
				 * <code>sap:updatable-path</code> annotation.</li>
				 * <li>The entity set of the bound EDM property is annotated with the OData V4
				 * <code>Org.OData.Capabilities.V1.InsertRestrictions</code> annotation.</li>
				 * <li>The bound EDM property is annotated with the
				 * <code>com.sap.vocabularies.Common.v1.FieldControl</code> annotation.</li>
				 * <li>The entity set of the bound EDM property is annotated with the OData V4
				 * <code>Org.OData.Capabilities.V1.UpdateRestrictions</code> annotation.</li>
				 * </ul>
				 */
				uomEditable: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Enabled state of the unit, if the <code>SmartField</code> control addresses unit of measure use cases, for example, an amount and
				 * its associated currency.
				 */
				uomEnabled: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Contains a URL which is used to render a link. The link is rendered, if the OData property, to which the value property of the
				 * control is bound, is of type <code>Edm.String</code> and the <code>SmartField</code> is in display mode.
				 */
				url: {
					type: "string",
					group: "Misc",
					defaultValue: ""
				},

				/**
				 * This property is for internal use only.
				 *
				 * @since 1.32.0
				 * @private
				 */
				uomEditState: {
					type: "int",
					group: "Misc",
					defaultValue: -1
				},

				/**
				 * Defines the context in which the layout of the <code>SmartField</code> control has to be interpreted.
				 *
				 * @since 1.32.0
				 */
				controlContext: {
					type: "sap.ui.comp.smartfield.ControlContextType",
					group: "Misc",
					defaultValue: ControlContextType.None
				},

				/**
				 * Proposes a control to be rendered. The <code>SmartField</code> control can ignore the proposal.
				 *
				 * @deprecated Since 1.32.0
				 * @since 1.32.0
				 */
				proposedControl: {
					type: "sap.ui.comp.smartfield.ControlProposalType",
					group: "Misc",
					defaultValue: ControlProposalType.None
				},

				/**
				 * Indicates whether the control break lines (in display mode) to prevent overflow.
				 *
				 * @since 1.36.6
				 */
				wrapping: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Determines if the mandatory check happens on the client side <code>true</code> or on the server side
				 * <code>false</code>.
				 *
				 * <b>Note:</b> If the {@link sap.ui.comp.smartfield.SmartField#value} property of the
				 * <code>SmartField</code> control is bound to an Entity Data Model (EDM) property annotated as
				 * <code>Nullable="false"</code>, the mandatory validation is performed on the client side regardless of
				 * the <code>clientSideMandatoryCheck</code> setting.
				 *
				 * <i>Example:</i>
				 *
				 * <pre>
				 *     &lt;Property Name=&quot;CategoryID&quot; Type=&quot;Edm.String&quot; Nullable=&quot;false&quot;/&gt;
				 * </pre>
				 *
				 * @since 1.38.3
				 */
				clientSideMandatoryCheck: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Indicates whether the value list collection is fetched in display mode from the resource path
				 * specified in the <code>com.sap.vocabularies.Common.v1.ValueList</code> annotation.
				 *
				 * This collection data is used to infer a descriptive text for the value of the <code>SmartField</code>
				 * control. However, fetching the value list collection for every <code>SmartField</code> instance
				 * individually may not be ideal in some performance-critical scenarios.
				 * To optimize this default behavior, you can set this property to <code>false</code> and provide the
				 * <code>com.sap.vocabularies.Common.v1.Text</code> annotation, which is used to specify the URL path
				 * name to the Entity Data Model (EDM) property from which the descriptive text for the value of the
				 * <code>SmartField</code> control is fetched, for example, LT (Laptop).
				 *
				 * <b>Note:</b> Setting this property to <code>false</code> only has an effect if the <code>value</code>
				 * property of the <code>SmartField</code> control is bound to an Entity Data Model (EDM) property typed
				 * as <code>Edm.String</code>. In addition, applications or frameworks have to make sure the descriptive
				 * text is fetched, for example, by expanding a navigation property.
				 *
				 * @since 1.42.0
				 */
				fetchValueListReadOnly: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Indicates if entities related to navigation properties inside the metadata are requested.
				 * If set to <code>true</code>, then these related entities are loaded with an <code>$expand</code> request.
				 *
				 * Annotations that can have navigation properties are the following:
				 * <ul>
				 * 	<li> <code>com.sap.vocabularies.Common.v1.Text</code> for text arrangements
				 * 	<li> <code>Org.OData.Measures.V1.Unit</code> and <code>Org.OData.Measures.V1.ISOCurrency</code> for units
				 * 	<li> <code>com.sap.vocabularies.Common.v1.FieldControl</code> for field control
				 * </ul>
				 *
				 * <b>Note:</b> Independent of the <code>fetchValueListReadOnly</code> value, setting this flag to <code>true</code>
				 * requests data from the backend.
				 *
				 * <b>Note:</b> The back-end request to expand the navigation properties is sent only if the entity to which
				 * <code>SmartField</code> is bound is persisted.
				 * For transient entities, there is no back-end request since no such data is available.
				 *
				 * @experimental Since 1.48.
				 * @since 1.48
				 */
				expandNavigationProperties: {
					type: "boolean",
					group: "Behavior",
					defaultValue: false
				},

				/**
				 * Sets the source from which text descriptions for <code>IDs</code> are fetched in edit mode, for example,
				 * for LT (Laptop).
				 *
				 * <b>Note</b>: The <code>sap.ui.comp.smartfield.TextInEditModeSource.NavigationProperty</code> and
				 * <code>sap.ui.comp.smartfield.TextInEditModeSource.ValueList</code> enumeration members are only supported if the
				 * following applies:
				 *
				 * <ul>
				 * <li>The <code>value</code> property of the <code>SmartField</code> control instance
				 * is bound to an Entity Data Model (EDM) property typed as <code>Edm.String</code> or <code>Edm.Guid</code>.</li>
				 * <li>The <code>com.sap.vocabularies.UI.v1.TextArrangement</code> annotation for the bound EDM property or entity
				 * type is specified in the service metadata document or annotation file.</li>
				 * <li>The binding mode for the <code>value</code> property of the <code>SmartField</code> control is the two-way binding
				 * mode.</li>
				 * <li>The field from which the description is fetched is filterable.</li>
				 * </ul>
				 *
				 * <b>Note</b>: In addition, the <code>sap.ui.comp.smartfield.TextInEditModeSource.NavigationProperty</code> enumeration
				 * member is only supported if the following applies:
				 *
				 * <ul>
				 * <li>The EDM navigation property association is defined in the service metadata document.</li>
				 * <li>The <code>com.sap.vocabularies.Common.v1.Text</code> annotation for the bound EDM property is specified in the
				 * service metadata document or annotation file whose <code>Path</code> attribute points to a EDM navigation property
				 * of a lookup entity set/type whose single key property is the <code>ID</code>, which contains (among other properties)
				 * the descriptive value.</li>
				 * <li>The lookup entity must be loaded. The lookup entity can be loaded by expanding the EDM navigation property via
				 * a <code>$expand</code> query parameter.</li>
				 * <li>The EDM navigation property association defines a referential constraint that ties values of the dependent editable
				 * entity type/set to the lookup entity type/set in the service metadata document.</li>
				 * <li>The EDM navigation property association end multiplicity of the lookup entity type/set is defined as <code>1</code>
				 * in the service metadata document. There must be a single-valued navigation from the editable entity set/type
				 * to the lookup entity set/type.</li>
				 * <li>The lookup entity type/set from which the descriptive value is fetched contains a single-key EDM property.</li>
				 * </ul>
				 *
				 * @experimental Since 1.54.
				 * @since 1.54
				 */
				textInEditModeSource: {
					type: "sap.ui.comp.smartfield.TextInEditModeSource",
					group: "Behavior",
					defaultValue: TextInEditModeSource.None
				}
			},
			aggregations: {
				/**
				 * The content aggregation is used to hold the control that is hosted by the <code>SmartField</code> control.
				 */
				_content: {
					type: "sap.ui.core.Control",
					multiple: false,
					visibility: "hidden"
				},

				/**
				 * Optional configuration for <code>SmartField</code>.
				 *
				 * <b>Note</b>: By default, the value of the <code>displayBehaviour</code> property is not evaluated
				 * in edit mode. To enable this feature in edit mode, set the <code>textInEditModeSource</code> control property
				 * to a non-default value.
				 */
				configuration: {
					type: "sap.ui.comp.smartfield.Configuration",
					multiple: false
				},

				/**
				 * Proposes a control to be rendered. The <code>SmartField</code> control can ignore the proposal.
				 *
				 * @since 1.32.0
				 * @deprecated Since 1.34.0
				 */
				controlProposal: {
					type: "sap.ui.comp.smartfield.ControlProposal",
					multiple: false
				},

				/**
				 * Collects the texts to be used for the ARIA labels.<br>
				 * The InvisibleText controls will be added to the DOM by the <code>SmartField</code> control.
				 *
				 * @since 1.34.2
				 */
				_ariaLabelInvisibleText: {
					type: "sap.ui.core.InvisibleText",
					multiple: true,
					visibility: "hidden"
				},

				/**
				 * The Semantic Object Controller allows the user to specify and overwrite functionality for semantic object navigation.
				 */
				semanticObjectController: {
					type: "sap.ui.comp.navpopover.SemanticObjectController",
					multiple: false
				}
			},
			associations: {
				/**
				 * Association to controls / IDs which label this control (see WAI-ARIA attribute <code>aria-labelledby</code>).
				 *
				 * @since 1.34.2
				 */
				ariaLabelledBy: {
					type: "sap.ui.core.Control",
					multiple: true,
					singularName: "ariaLabelledBy"
				}
			},
			events: {

				/**
				 * The OData entity set is either derived from the control's binding context or from control's entity set property, if a value for it
				 * is specified. In both cases this event is fired.
				 */
				entitySetFound: {
					parameters: {

						/**
						 * The path to the found entity set
						 */
						entitySet: {
							type: "string"
						}
					}
				},

				/**
				 * The event is fired after the text in the field has been changed and the focus leaves the field, or after the Enter key has been
				 * pressed.
				 *
				 * <b>Note:</b> This event is fired even if the value of the text input field is subject to data type constraints and
				 * the constraints are violated. Also, the invalid value is not stored in the binding/model.
				 */
				change: {
					parameters: {

						/**
						 * The current value inside the text field
						 *
						 * <b>Note:</b> This value is the formatted value, and in some cases it might differ from the value stored in the binding/model.
						 * Usually, the value that is sent to the back-end system should be the value stored in the binding/model, which is
						 * the parsed and validated value.
						 */
						value: {
							type: "string"
						},

						/**
						 * The new value inside the text field
						 */
						newValue: {
							type: "string"
						}
					}
				},

				/**
				 * The event is fired after the smart field has calculated its metadata.
				 *
				 */
				initialise: {},

				/**
				 * The event is fired after the visibility of the control has changed.
				 */
				visibleChanged: {
					parameters: {

						/**
						 * If <code>true</code>, the control is visible
						 */
						visible: {
							type: "boolean"
						}
					}
				},

				/**
				 * The event is fired after the value of editable property of the control has changed.
				 *
				 * @since 1.30.0
				 */
				editableChanged: {
					parameters: {

						/**
						 * If <code>true</code>, the control is in edit mode
						 */
						editable: {
							type: "boolean"
						}
					}
				},

				/**
				 * The event is fired after the context editable property of the control has changed.
				 *
				 * @since 1.32.0
				 */
				contextEditableChanged: {
					parameters: {

						/**
						 * The value of the context editable property of the control
						 */
						editable: {
							type: "boolean"
						}
					}
				},

				/**
				 * The event is fired after the inner controls have been created. The created controls can be obtained via oControl.getInnerControls().
				 */
				innerControlsCreated: {},

				/**
				 * The event is fired when after selection of values with value help or auto-suggest, the model is updated with the selected data.
				 *
				 * @since 1.31.0
				 *
				 */
				valueListChanged: {
					parameters: {

						/**
						 * An array of selected values
						 */
						changes: {
							type: "sap.ui.core.Control[]"
						}
					}
				},

				/**
				 * Fires when the user triggers the link control or taps/clicks on an active title of the object identifier control.
				 *
				 *
				 * @since 1.36.0
				 */
				press: {}
			}
		},
		/**
		 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
		 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered.
		 * @private
		 * @since 1.34.0
		 */
		renderer: function(oRm, oControl) {
			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.addClass("sapUiCompSmartField");
			oRm.writeClasses();
			oRm.write(">");
			oRm.renderControl(oControl.getContent());
			if (oControl.getAggregation("_ariaLabelInvisibleText")) {
				oControl.getAggregation("_ariaLabelInvisibleText").forEach(function(oInvisibleText) {
					oRm.renderControl(oInvisibleText);
				});
			}
			oRm.write("</div>");
		}
	});

	SmartField.prototype.init = function() {
		this._sAnnotationLabel = "";
		this._bInDestroy = false;
		this._oSideEffects = new SideEffectUtil(this);
		this._oFactory = null;

		this._oControl = {
			display: null,
			"display_uom": null,
			edit: null,
			current: null
		};

		this._oValue = {
			display: null,
			edit: null,
			uom: null,
			uomset: null
		};

		this._oError = {
			bComplex: false,
			bFirst: false,
			bSecond: false
		};

		this._sBindingContextPath = "";
		this._oUtil = new BindingUtil();
		this._bSuppressToggleControl = false;
	};

	/**
	 * Sets a new value for the <code>visible</code> property.
	 *
	 * @see {@link sap.ui.core.Control#setVisible setVisible} for more documentation.
	 *
	 * <b>Note:</b> The <code>SmartField</code> control is metadata-driven, and this property can
	 * be ignored if the bound EDM property is annotated with the <code>com.sap.vocabularies.Common.v1.FieldControl</code>
	 * annotation.
	 *
	 * @example <caption>Scenario with Computed <code>visible</code> Value of <code>false</code></caption>
	 *
	 * // Extract of an EDM property of a service metadata document:
	 * <Property Name="ID" Type="Edm.Guid">
	 *     <Annotation Term="com.sap.vocabularies.Common.v1.FieldControl" EnumMember="com.sap.vocabularies.Common.v1.FieldControlType/Hidden"/>
	 * </Property>
	 *
	 * // Extract of a definition of a SmartField control in an XML view:
	 * <SmartField value="{ID}"/>
	 *
	 * @example <caption>Scenario with Computed <code>visible</code> Value of <code>false</code></caption>
	 *
	 * // Extract of an EDM property of a service metadata document:
	 * <Property Name="ID" Type="Edm.Guid">
	 *     <Annotation Term="com.sap.vocabularies.Common.v1.FieldControl" EnumMember="com.sap.vocabularies.Common.v1.FieldControlType/Hidden"/>
	 * </Property>
	 *
	 * // Extract of a definition of a SmartField control in an XML view:
	 * <SmartField value="{ID}" visible="true"/>
	 */
	SmartField.prototype.setVisible = function(bVisible, bSuppressInvalidate) {
		var bOldVisible = this.getVisible();
		Control.prototype.setVisible.apply(this, arguments);
		bVisible = this.getVisible();

		if (bVisible !== bOldVisible) {
			this.fireVisibleChanged({
				visible: bVisible
			});
		}

		return this;
	};

	/**
	 *  @private
	 *  @sap-restricted sap.ui.comp.smartLabel.SmartLabel,
	 *  				sap.ui.comp.smartForm.GroupElement
	 *  				sap.ui.comp.smartField.ODataControlFactory
	 */
	SmartField.prototype.getComputedTextLabel = function() {
		return this.getProperty("textLabel") || this._sAnnotationLabel;
	};

	SmartField.prototype.setEditable = function(bEditable) {
		return this.setEditableProperty("editable", bEditable, true);
	};

	SmartField.prototype.setContextEditable = function(bContextEditable) {
		return this.setEditableProperty("contextEditable", bContextEditable, true);
	};

	SmartField.prototype.setEditableProperty = function(sPropertyName, bEditable, bSuppressInvalidate) {
		var sPropertyNameCapitalized = capitalize(sPropertyName),
			fnGetEditable = this["get" + sPropertyNameCapitalized].bind(this),
			bOldEditable = fnGetEditable();

		this.setProperty(sPropertyName, bEditable, bSuppressInvalidate);
		bEditable = fnGetEditable();
		this._bPendingEditableState = false;

		var bEditableStateChanged = bEditable !== bOldEditable,
			bModelUpdate = this.isPropertyBeingUpdatedByModel(sPropertyName);

		// toggle the inner control only when the editable state has changed and the state
		// change was not caused by the deletion of the bound entity
		if (
			(bEditableStateChanged && !bModelUpdate) ||
			(bEditableStateChanged && bModelUpdate && this._boundEntityExists()) ||

			// except when the inner control for the current mode has not being created
			!this._oControl[this.getMode()]
		) {
			this._toggleInnerControlIfRequired();
		}

		if (bEditableStateChanged) {
			var sEventName = "fire" + sPropertyNameCapitalized + "Changed";
			this[sEventName]({
				editable: bEditable
			});
		}

		return this;
	};

	// Indicates whether the property is currently being updated by the framework due to a property binding
	// change e.g., by calling .updateProperty(sPropertyName)
	SmartField.prototype.isPropertyBeingUpdatedByModel = function(sPropertyName) {
		var oBindingInfo = this.getBindingInfo(sPropertyName);
		return !!(oBindingInfo && oBindingInfo.skipModelUpdate);
	};

	SmartField.prototype._boundEntityExists = function(vBindingContext) {
		vBindingContext = vBindingContext || this.getBindingContext();
		return !!(vBindingContext && vBindingContext.getObject());
	};

	SmartField.prototype.setUomEditable = function(bUomEditable) {
		this.setProperty("uomEditable", bUomEditable, true);
		var oUoMNestedSmartField = this._getEmbeddedSmartField();

		if (oUoMNestedSmartField) {
			oUoMNestedSmartField.setEditable(this.getUomProperty("editable"));
		}

		return this;
	};

	SmartField.prototype.setUomEnabled = function(bUomEnabled) {
		this.setProperty("uomEnabled", bUomEnabled, true);
		var oUoMNestedSmartField = this._getEmbeddedSmartField();

		if (oUoMNestedSmartField) {
			oUoMNestedSmartField.setEnabled(this.getUomEnabled());
		}

		return this;
	};

	SmartField.prototype.setUomVisible = function(bUomVisible) {
		this.setProperty("uomVisible", bUomVisible, true);
		var oUoMNestedSmartField = this._getEmbeddedSmartField();

		if (oUoMNestedSmartField) {
			bUomVisible = this.getUomProperty("visible");
			oUoMNestedSmartField.setVisible(bUomVisible);
			var oMeasureField = this._oFactory && this._oFactory.oMeasureField;

			if (oMeasureField) {
				oMeasureField.toggleStyleClass("smartFieldPaddingRight", bUomVisible);
			}
		}

		return this;
	};

	SmartField.prototype.setMandatory = function(bMandatory) {
		this.setProperty("mandatory", bMandatory, false);
		this._setPropertyOnControls("required", this.getMandatory());
		return this;
	};

	SmartField.prototype.setWidth = function(sWidth) {
		this.setProperty("width", sWidth, true);
		this._setOnInnerControl();
		return this;
	};

	SmartField.prototype.setWrapping = function(bWrapping) {
		this.setProperty("wrapping", bWrapping, true);
		this._setOnInnerControl();
		return this;
	};

	SmartField.prototype.setTextAlign = function(sTextAlign) {
		this.setProperty("textAlign", sTextAlign, true);
		this._setOnInnerControl();
		return this;
	};

	SmartField.prototype.setPlaceholder = function(sPlaceholder) {
		this.setProperty("placeholder", sPlaceholder, true);
		this._setOnInnerControl();
		return this;
	};

	SmartField.prototype.setName = function(sName) {
		this.setProperty("name", sName, true);
		this._setOnInnerControl();
		return this;
	};

	SmartField.prototype.setMaxLength = function(iMaxLength) {
		this.setProperty("maxLength", iMaxLength, true);
		this._setOnInnerControl();
		return this;
	};

	SmartField.prototype.setShowValueHelp = function(bValueHelp) {
		var bPreviousValueHelp = this.getShowValueHelp();
		this.setProperty("showValueHelp", bValueHelp, true);
		var oChild = this.getContent();

		if (oChild && (typeof oChild.setShowValueHelp === "function")) {
			bValueHelp = this.getShowValueHelp();
			var bValueHelpStateChanged = bValueHelp !== bPreviousValueHelp,
				oFactory = this._oFactory;

			if (bValueHelpStateChanged && oFactory) {

				if (bValueHelp) {

					if (oFactory.shouldCreateValueHelpForControl(oChild)) {
						oFactory._createValueHelp();
					}
				} else {
					oFactory.destroyValueHelp();
				}
			}

			oChild.setShowValueHelp(bValueHelp);
		}

		return this;
	};

	SmartField.prototype.setShowSuggestion = function(bShowSuggestion) {
		var bPreviousShowSuggestion = this.getShowSuggestion();
		this.setProperty("showSuggestion", bShowSuggestion, true);
		var oChild = this.getContent();

		if (oChild && (typeof oChild.setShowSuggestion === "function")) {
			bShowSuggestion = this.getShowSuggestion();
			var bShowSuggestionStateChanged = bShowSuggestion !== bPreviousShowSuggestion,
				oFactory = this._oFactory;

			if (bShowSuggestionStateChanged && oFactory) {

				if (bShowSuggestion) {

					if (oFactory.shouldCreateValueHelpForControl(oChild)) {
						oFactory._createValueHelp();
					}
				} else {
					oFactory.destroyValueHelp();
				}
			}

			oChild.setShowSuggestion(bShowSuggestion);
		}

		return this;
	};

	SmartField.prototype.setConfiguration = function(oConfig) {
		var oOldConfig = this.getConfiguration(),
			oReturn = this.setAggregation("configuration", oConfig, true);
		oConfig = this.getConfiguration();

		var bConfigAggregationChanged = !!((oConfig && (oOldConfig === null)) || (oOldConfig && (oConfig === null))),
			bHasContent = !!this.getContent();

		if (bHasContent &&
			(bConfigAggregationChanged ||
				(oConfig && oOldConfig &&
					(
						(oConfig.getControlType() !== oOldConfig.getControlType()) ||
						(oConfig.getDisplayBehaviour() !== oOldConfig.getDisplayBehaviour())
					)
				)
			)
		) {

			this._destroyControls();
			this._toggleInnerControlIfRequired();
		}

		return oReturn;
	};

	SmartField.prototype.setTextInEditModeSource = function(sTextInEditModeSource) {
		var sOldTextInEditModeSource = this.getTextInEditModeSource();
		this.setProperty("textInEditModeSource", sTextInEditModeSource, false);
		sTextInEditModeSource = this.getTextInEditModeSource();

		if (sTextInEditModeSource !== sOldTextInEditModeSource) {
			this._destroyControls();
			this._toggleInnerControlIfRequired();
		}

		return this;
	};

	SmartField.prototype.setTooltip = function(vTooltip) {
		this._refreshTooltipBaseDelegate(vTooltip);
		this.setAggregation("tooltip", vTooltip, true);
		var oChild = this.getFirstInnerControl();

		if (oChild) {
			oChild.setTooltip(vTooltip);
		}

		return this;
	};

	/**
	 * Sets the SmartField's width to the inner control
	 *
	 * @return {sap.ui.comp.smartfield.SmartField} <code>this</code> to allow method chaining
	 * @private
	 */
	SmartField.prototype._setOnInnerControl = function() {
		var oChild = this.getContent();

		if (oChild) {

			if (typeof oChild.setWidth === "function") {
				var sWidth = this.getWidth();

				// set the width if and only if a value other than the default is available (default is "")
				// the problem is that some controls (e.g. sap.m.Select and sap.m.ComboBox) have a width set during creation
				// we do not want to invalidate this.
				// if there are problems, always check these controls.
				if (sWidth) {
					oChild.setWidth(sWidth);
				}
			}

			this._setPropertyOnControls("wrapping", this.getWrapping());

			if (typeof oChild.setName === "function") {
				oChild.setName(this.getName());
			}

			if (typeof oChild.setPlaceholder === "function" && this.getPlaceholder() !== "") {
				oChild.setPlaceholder(this.getPlaceholder());
			}

			if (typeof oChild.setTextAlign === "function") {
				oChild.setTextAlign(this.getTextAlign());
			}

			this._setPropertyOnControls("required", this.getMandatory());

			var oUoMNestedSmartField = this._getEmbeddedSmartField();

			if (oUoMNestedSmartField) {

				if (!this.isPropertyInitial("uomEditable")) {
					oUoMNestedSmartField.setEditable(this.getUomProperty("editable"));
				}

				if (!this.isPropertyInitial("uomEnabled")) {
					oUoMNestedSmartField.setEnabled(this.getUomEnabled());
				}

				if (!this.isPropertyInitial("uomVisible")) {
					oUoMNestedSmartField.setVisible(this.getUomProperty("visible"));
				}
			}
		}

		return this;
	};

	SmartField.prototype.getUomProperty = function(sPropertyName) {
		var oUoMNestedSmartField = this._getEmbeddedSmartField(),
			oUoMNestedSmartFieldFactory = oUoMNestedSmartField && oUoMNestedSmartField.getControlFactory(),
			oUoMFieldControl = oUoMNestedSmartFieldFactory && oUoMNestedSmartFieldFactory._oFieldControl,
			sPropertyNameCapitalized = capitalize(sPropertyName),
			sUoMMutatorGetterName = "getUom" + sPropertyNameCapitalized,
			bUoMPropertyValue = this[sUoMMutatorGetterName]();

		if (oUoMNestedSmartField.isBound(sPropertyName) && oUoMFieldControl) {
			var oUoMFieldMetaData = oUoMNestedSmartFieldFactory.getMetaData();

			if (oUoMFieldMetaData) {
				var oBindingInfo = oUoMFieldControl._oStoredBindings[sPropertyName],
					oUoMFormatter = oUoMFieldControl["_get" + sPropertyNameCapitalized](oUoMFieldMetaData, oBindingInfo, sPropertyName);

				oUoMFormatter.path();
				var vState = oUoMFormatter.formatter.call(oUoMNestedSmartField, bUoMPropertyValue);
				return vState;
			}
		}

		return bUoMPropertyValue;
	};

	SmartField.prototype._setPropertyOnControls = function(sProperty, vValue, aControls) {
		aControls = aControls || this.getInnerControls();

		aControls.forEach(function(oControl) {
			var sMutator = "set" + capitalize(sProperty);

			if (typeof oControl[sMutator] === "function") {
				oControl[sMutator](this._convertValueForControl(sProperty, vValue, oControl));
			}
		}, this);
	};

	/**
	 * Gets the converted value for the given inner control instance.
	 *
	 * @param {string} sProperty The property name
	 * @param {string} vValue The value to convert
	 * @param {sap.ui.core.Control} oControl The control instance where the value is propagated
	 * @returns {boolean|string} The converted value for <code>sProperty</code> of <code>oControl</code>
	 * @private
	 * @since 1.56
	 */
	SmartField.prototype._convertValueForControl = function(sProperty, vValue, oControl) {
		var oProperty;

		if (oControl) {
			oProperty = oControl.getMetadata().getProperty(sProperty);
		}

		if (oProperty) {

			switch (sProperty) {
				case "wrapping":

					switch (oProperty.type) {
						case "boolean":
							return vValue;

						case "sap.ui.core.Wrapping":
							var mWrappingMode = coreLibrary.Wrapping;

							if (vValue) {
								return mWrappingMode.Soft;
							}

							return mWrappingMode.None;

						// no default
					}

				// no default
			}
		}

		return vValue;
	};

	/**
	 * Setter for property <code>url</code>. Default value is <code>null</code>.
	 *
	 * @param {string} sValue The new value for property <code>url</code>
	 * @return {sap.ui.comp.smartfield.SmartField} <code>this</code> to allow method chaining
	 * @since 1.29
	 * @public
	 */
	SmartField.prototype.setUrl = function(sValue) {
		this.setProperty("url", sValue, true);
		return this;
	};

	SmartField.prototype.setEntitySet = function(sValue) {
		this.setProperty("entitySet", sValue, true);
		this.fireEntitySetFound({
			entitySet: sValue
		});
		return this;
	};

	/*
	 * If set to <code>false</code>, creation of inner controls is suspended until editable or contextEditable is set.
	 * As the default for editable is <code>true</code> the edit control would be created even in display scenarios.
	 * The method is used by the SmartTable control for performance reasons.
	 */
	SmartField.prototype._setPendingEditState = function(bDisplayState) {
		this.data("pendingEditableState", !bDisplayState);
	};

	SmartField.prototype.applySettings = function(mSettings) {

		if (mSettings && mSettings.customData) {
			for (var i = 0; i < mSettings.customData.length; i++) {
				var oCustomData = mSettings.customData[i];

				if (oCustomData && oCustomData.mProperties && oCustomData.mProperties.key === "pendingEditableState") {
					this._bPendingEditableState = oCustomData.mProperties.value;
				}
			}
		}

		return Control.prototype.applySettings.apply(this, arguments);
	};

	SmartField.prototype.setEnabled = function(bValue) {
		this.setProperty("enabled", bValue, true);
		this._toggleInnerControlIfRequired();
		return this;
	};

	SmartField.prototype.setContent = function(vContent) {
		return this.setAggregation("_content", vContent);
	};

	SmartField.prototype.getContent = function() {
		return this.getAggregation("_content");
	};

	/*
	 * Gets the control factory object.
	 *
	 * @returns {sap.ui.comp.smartfield.ControlFactoryBase} The control factory object
	 * @protected
	 * @since 1.48
	 */
	SmartField.prototype.getControlFactory = function() {
		return this._oFactory;
	};

	SmartField.prototype.getValue = function() {

		// as two-way-binding cannot be assumed to be a prerequisite,
		// check for a call-back and return the current value.
		var fnProp = this.getInnerValueFunction();

		if (fnProp) {
			return fnProp();
		}

		// as fall-back return the property value.
		return this.getProperty("value");
	};

	SmartField.prototype.getInnerValueFunction = function() {

		if (this._oValue && (typeof this._oValue[this.getMode()] === "function")) {
			return this._oValue[this.getMode()];
		}

		return null;
	};

	SmartField.prototype.getValueState = function() {
		var aChildren = this.getInnerControls(),
			iIndex = this._getMaxSeverity(aChildren);

		if (iIndex > -1) {
			return aChildren[iIndex].getValueState();
		}

		return ValueState.None;
	};

	/**
	 * Setter for property <code>valueState</code>. Default value is <code>None</code>.
	 *
	 * @param {sap.ui.core.ValueState} sValueState The new value for property <code>valueState</code>
	 * @return {sap.ui.comp.smartfield.SmartField} <code>this</code> to allow method chaining
	 * @since 1.30.0
	 * @public
	 */
	SmartField.prototype.setValueState = function(sValueState) {
		this.setProperty("valueState", sValueState, true);

		var aChildren = this.getInnerControls(),
			oChild,
			sMethod = "setSimpleClientError";

		if (aChildren && aChildren.length) {
			oChild = aChildren[0];

			if (aChildren.length > 1) {
				sMethod = "setComplexClientErrorFirstOperand";
			}
		}

		// forward the value state to the child control.
		// in unit of measure use cases and generally, if more than one control is hosted,
		// set a possible error on the first child.
		if (oChild && (typeof oChild.setValueState === "function")) {
			oChild.setValueState(sValueState);
			this[sMethod](sValueState === ValueState.Error);
		}

		return this;
	};

	SmartField.prototype.getValueStateText = function() {
		var aChildren = this.getInnerControls(),
			iIndex = this._getMaxSeverity(aChildren);

		if (iIndex > -1) {
			return aChildren[iIndex].getValueStateText();
		}

		return this.getProperty("valueStateText");
	};

	/**
	 * Setter for property <code>valueStateText</code>. Default value is empty/<code>undefined</code>.
	 *
	 * @param {string} sText The new value for property <code>valueStateText</code>
	 * @return {sap.ui.comp.smartfield.SmartField} <code>this</code> to allow method chaining
	 * @since 1.29
	 * @public
	 */
	SmartField.prototype.setValueStateText = function(sText) {
		this.setProperty("valueStateText", sText, true);

		var aChildren = this.getInnerControls(),
			oChild;

		if (aChildren && aChildren.length) {
			oChild = aChildren[0];
		}

		// forward the value state to the child control.
		// in unit of measure use cases and generally, if more than one control is hosted,
		// set a possible error on the first child.
		if (oChild && (typeof oChild.setValueStateText === "function")) {
			oChild.setValueStateText(sText);
		}

		return this;
	};

	/**
	 * Calculates the index of the child control with the most severe message.
	 *
	 * @param {array} aChildren The currently available child controls
	 * @returns {int} The index of the child control with the most severe message, can be <code>-1</code>
	 * @private
	 */
	SmartField.prototype._getMaxSeverity = function(aChildren) {
		var oState,
			oChild,
			i,
			len,
			iState = 0,
			iIndex = -1,
			mState = {
				"Error": 3,
				"Warning": 2,
				"Success": 1,
				"None": 0
			};

		len = aChildren.length;

		for (i = 0; i < len; i++) {
			oChild = aChildren[i];

			if (oChild.getValueState) {
				oState = oChild.getValueState();

				if (oState && mState[oState] > iState) {
					iState = mState[oState];
					iIndex = i;
				}
			}
		}

		return iIndex;
	};

	/**
	 * Returns the DOM element that gets the focus.
	 *
	 * @returns {sap.ui.core.Element} The DOM element that should get the focus, can be <code>null</code>
	 * @public
	 */
	SmartField.prototype.getFocusDomRef = function() {
		var aChildren = this.getInnerControls(),
			oChild,
			len = aChildren.length;

		if (len > 0) {
			oChild = aChildren[0];
		}

		if (oChild && oChild.getFocusDomRef) {
			return oChild.getFocusDomRef();
		}

		return Control.prototype.getFocusDomRef.apply(this, arguments);
	};

	/**
	 * Gets the ID of the control to which the label should point.
	 *
	 * @returns {string} The ID of the inner control if it exists, otherwise the ID of the <code>SmartField</code> control
	 * @public
	 */
	SmartField.prototype.getIdForLabel = function() {
		var aChildren = this.getInnerControls(),
			oChild,
			iLen = aChildren.length;

		if (iLen > 0) {
			oChild = aChildren[0];
		}

		if (oChild && (typeof oChild.getIdForLabel === "function")) {
			return oChild.getIdForLabel();
		}

		return this.getId();
	};

	SmartField.prototype.updateBindingContext = function(bSkipLocal, sFixedModelName, bUpdateAll) {
		Control.prototype.updateBindingContext.apply(this, arguments);

		if (this._bInDestroy) {
			return;
		}

		this._init(sFixedModelName);

		if (this._oFactory) {

			if (this.getBindingContext()) {
				this._sBindingContextPath = this.getBindingContext().getPath();
			}

			if (typeof this._oFactory.bind === "function") {
				this._oFactory.bind();

				// also check for field group annotation.
				this._checkFieldGroups();
			} else {
				this._toggleInnerControlIfRequired();
			}
		}
	};

	SmartField.prototype.bindProperty = function(sPropertyName, oBindingInfo) {
		var bIsValuePropertyName = sPropertyName === "value";

		if (!bIsValuePropertyName || this.isPropertyInitial("value")) {
			return Control.prototype.bindProperty.apply(this, arguments);
		}

		var vOldValueBindingPath = this.getBindingPath("value"),
			vOldBindingContext = this.getBindingContext(),
			vOldBindingContextPath = vOldBindingContext && vOldBindingContext.getPath();

		Control.prototype.bindProperty.apply(this, arguments);

		var vValueBindingPath = this.getBindingPath("value"),
			vBindingContext = this.getBindingContext(),
			vBindingContextPath = vBindingContext && vBindingContext.getPath();

		if ((vValueBindingPath !== vOldValueBindingPath) ||
			(vBindingContextPath !== vOldBindingContextPath)) {

			this._destroyFactory();
			this._init();
			var oFactory = this._oFactory;

			if (oFactory && (typeof oFactory.bind === "function")) {
				oFactory.bind();
			}
		}

		return this;
	};

	SmartField.prototype.unbindProperty = function(sPropertyName, bSuppressReset) {
		Control.prototype.unbindProperty.apply(this, arguments);
		var aInnerControls = this.getAllInnerControls();

		aInnerControls.forEach(function(oInnerControl) {
			var sControlName = oInnerControl.getMetadata().getName();
			var vPropertiesNamesOfInnerControls = ODataControlFactory.getBoundPropertiesMapInfoForControl(sControlName, {
				propertyName: sPropertyName
			});

			if (Array.isArray(vPropertiesNamesOfInnerControls)) {
				vPropertiesNamesOfInnerControls.forEach(function(sPropertyNameOfInnerControl) {
					oInnerControl.unbindProperty(sPropertyNameOfInnerControl, bSuppressReset);
				});
			}
		});

		return this;
	};

	/**
	 * Returns the current SmartField's edit mode
	 *
	 * @returns {string} Returns "edit" or "display" or "display_uom"
	 * @protected
	 */
	SmartField.prototype.getMode = function() {
		var bEditable = this.getEditable(),
			bEnabled = this.getEnabled(),
			bContextEditable = this.getContextEditable();

		// check for configuration.
		if (this.getControlContext() === "responsiveTable" && this.data("suppressUnit") !== "true") {

			// somehow the control is disabled
			if (!bEditable || !bContextEditable || !bEnabled || (this.getProperty("uomEditState") === 0)) {
				return "display_uom";
			}
		}

		// context editable in smart form is on parent's parent in UOM for unit.
		if (bContextEditable && this.data("configdata") &&
			this.data("configdata").configdata.isUOM &&
			this.data("configdata").configdata.isInnerControl &&
			this.data("configdata").configdata.getContextEditable) {
			bContextEditable = this.data("configdata").configdata.getContextEditable();
		}

		return bEditable && bEnabled && bContextEditable ? "edit" : "display";
	};

	SmartField.prototype.isInEditMode = function() {
		return this.getMode() === "edit";
	};

	/**
	 * Toggles the current control, depending on <code>displayMode</code> and the binding of the <code>value</code>
	 * property of the current control. If necessary a control is created.
	 *
	 * @private
	 */
	SmartField.prototype._toggleInnerControlIfRequired = function() {

		if (this._bPendingEditableState || this._bSuppressToggleControl || (!this._oFactory || this._oFactory.bPending)) {
			return;
		}

		var sMode = this.getMode();

		if ((sMode === "edit") || (sMode === "display_uom")) {
			this._createControlIfRequired(sMode);
		} else {
			var oValue = this.getProperty("value"),
				bCreate = true;

			// optimization for table use cases only, if it is not a table, no configuration data set
			var oConfig = this.data("configdata");

			if (oConfig && oConfig.configdata && !oConfig.configdata.isUOM) {

				if (oValue === null || oValue === "") {
					bCreate = false;
				}
			}

			// in display mode, create control only if value is not empty
			if (bCreate) {
				this._createControlIfRequired(sMode);
			} else {

				// if value is empty, the content aggregation has to be set to null
				this.setContent(null);

				// set the current mode, otherwise toggling the controls gets out-of-sync
				this._oControl.current = "display";
			}
		}
	};

	SmartField.prototype.setValue = function(sValue) {
		var sOldValue = this.getProperty("value");
		this.setProperty("value", sValue, true);

		if (!this.isPropertyBeingUpdatedByModel("value")) {
			var oInnerControl = this.getFirstInnerControl();

			if (oInnerControl) {
				var sControlMetadataName = oInnerControl.getMetadata().getName();
				var sBoundPropertyNameOfInnerControl = ODataControlFactory.getBoundPropertiesMapInfoForControl(sControlMetadataName, {
					propertyName: "value"
				})[0];

				this._setPropertyOnControls(sBoundPropertyNameOfInnerControl, sValue, [oInnerControl]);
			}
		}

		var oFactory = this._oFactory;

		if (!oFactory) {
			return this;
		}

		if (!oFactory.bPending) {
			this._toggleInnerControlIfRequired();
		}

		sValue = this.getProperty("value");

		if (oFactory.oTextArrangementDelegate) {
			oFactory.oTextArrangementDelegate.setValue(sValue, sOldValue);
		}

		return this;
	};

	SmartField.prototype.isTextInEditModeSourceNotNone = function() {
		return (this.getTextInEditModeSource() !== TextInEditModeSource.None);
	};

	/**
	 * Creates the actual control depending on the current edit mode and sets it to the SmartField's content
	 *
	 * @param {string} sEditMode The current edit mode, either "edit" or "display"
	 * @private
	 */
	SmartField.prototype._createControlIfRequired = function(sEditMode) {

		if (!this._oFactory) {
			return;
		}

		var vControlForCurrentMode = this._oControl[sEditMode];

		// suppress toggling of the inner control when the mode remains unchanged,
		// except when the inner control for the current mode has not being created
		if ((sEditMode !== this._oControl.current) || !vControlForCurrentMode) {

			if (!vControlForCurrentMode) {
				var oControl = this._oFactory.createControl();

				if (oControl) {
					this._oControl[sEditMode] = oControl.control;
					this._placeCallBacks(oControl, sEditMode);
				}
			}

			this._oControl.current = sEditMode;
			this.setContent(this._oControl[sEditMode]);
			this._setOnInnerControl();
			this.fireInnerControlsCreated(this.getInnerControls());

		} else if (!this.getContent()) {
			this.setContent(this._oControl[sEditMode]);
		}
	};

	/**
	 * Sets the available call-backs after successful control creation.
	 *
	 * @param {sap.ui.core.Control} oControl The given control
	 * @param {string} sMode The current mode, either "edit" or "display"
	 * @private
	 */
	SmartField.prototype._placeCallBacks = function(oControl, sMode) {

		// set the value call-back.
		if (oControl.params && oControl.params.getValue) {
			this._oValue[sMode] = oControl.params.getValue;
		}

		// set the unit-of-measure-get call-back.
		if (oControl.params && oControl.params.uom) {
			this._oValue.uom = oControl.params.uom;
		}

		// set the unit-of-measure-set call-back.
		if (oControl.params && oControl.params.uomset) {
			this._oValue.uomset = oControl.params.uomset;
		}
	};

	/**
	 * Initializes the control, if it has not already been initialized.
	 *
	 * @param {string} [sModelName] The name of the model currently used
	 * @private
	 */
	SmartField.prototype._init = function(sModelName) {
		var oModel,
			oConfig;

		// destroy factory if entity type changed
		if (this._oFactory && this._sBindingContextPath && this.getBindingContext() &&
			(this._sBindingContextPath !== this.getBindingContext().getPath())) {
			this._destroyFactory();
		}

		if (!this._oFactory) {
			oConfig = this.data("configdata");

			if (!oConfig) {
				oModel = this.getModel(sModelName);
			}

			var sBindingPath = this.getBindingPath("value"),
				bDefaultModelName = sModelName === undefined;

			if (bDefaultModelName && sBindingPath) {

				if (oConfig || oModel) {
					this._oFactory = this._createFactory(sModelName, oModel, sBindingPath, oConfig);
				}
			} else if (oModel && !(oModel instanceof JSONModel)) {

				if (this.getBindingInfo("url") || this.getUrl()) {

					if (oConfig || oModel) {
						this._oFactory = this._createFactory(sModelName, oModel, sBindingPath, oConfig);
					}
				}
			}
		}
	};

	/**
	 * Destroys the control factory and the existing inner controls.
	 *
	 * @private
	 */
	SmartField.prototype._destroyFactory = function() {
		this._bSuppressToggleControl = true;
		this._bSideEffects = false;

		if (this._oFactory) {
			this._oFactory.destroy();
		}

		this._oFactory = null;
		this._bSuppressToggleControl = false;
		this._destroyControls();
	};

	SmartField.prototype._destroyControls = function() {

		if (this._oControl) {

			if (this._oControl.display) {
				this._oControl.display.destroy();
			}

			if (this._oControl["display_uom"]) {
				this._oControl["display_uom"].destroy();
			}

			if (this._oControl.edit) {
				this._oControl.edit.destroy();
			}

			this._oControl.display = null;
			this._oControl["display_uom"] = null;
			this._oControl.edit = null;
			this._oControl.current = null;
		}

		this._oValue = {
			display: null,
			edit: null,
			uom: null,
			uomset: null
		};

		this.destroyAggregation("_content");
	};

	/**
	 * Creates the control factory and returns it. If the variable <code>oModel</code> is <code>null</code>
	 * or <code>undefined</code>, <code>null</code> is returned.
	 *
	 * @param {string} sModelName The name of the model currently used
	 * @param {sap.ui.model.Model} oModel The model currently used
	 * @param {string} sBindingPath The binding path for the <code>value</code> property
	 * @param {object} oConfig Optional control configuration
	 * @returns {sap.ui.comp.smartfield.ControlFactoryBase} the new control factory instance
	 * @private
	 */
	SmartField.prototype._createFactory = function(sModelName, oModel, sBindingPath, oConfig) {

		if (oModel && oModel instanceof JSONModel) {
			return new JSONControlFactory(oModel, this, {
				model: sModelName,
				path: sBindingPath
			});
		}

		var sEntitySet;

		if (!oConfig) {
			sEntitySet = this._getEntitySet(sModelName);
		}

		if (sEntitySet || oConfig) {
			var oParam;

			if (oConfig) {
				oParam = oConfig.configdata;
			} else {
				oParam = {
					entitySet: sEntitySet,
					model: sModelName,
					path: sBindingPath
				};
			}

			return new ODataControlFactory(oModel, this, oParam);
		}

		return null;
	};

	/**
	 * Calculates the <code>entitySet</code> that is interpreted by this control.
	 * The calculation uses either the <code>bindingContext</code> of this control or
	 * alternatively the property <code>entitySet</code>.
	 *
	 * @param {string} sModelName The name of the model currently used
	 * @returns {string} The <code>entitySet</code> that is interpreted by this control
	 * @private
	 */
	SmartField.prototype._getEntitySet = function(sModelName) {
		var sEntitySet = this.getEntitySet(),
			bIsEntitySetControlPropertySet = sEntitySet !== "";

		if (bIsEntitySetControlPropertySet && !sModelName) {
			return sEntitySet;
		}

		var oBindingContext = this.getBindingContext(sModelName);

		if (oBindingContext) {
			var sBindingContextPath = oBindingContext.getPath();

			// check for an invalid binding context path
			if ((sBindingContextPath === "") ||
				(sBindingContextPath === undefined) ||
				(sBindingContextPath === "/undefined")
			) {
				return "";
			}

			// parse the binding context path string to extract the entity set
			sEntitySet = this._oUtil.correctPath(sBindingContextPath);

			this.fireEntitySetFound({
				entitySet: sEntitySet
			});

			return sEntitySet;
		}

		return "";
	};

	/**
	 * Returns the EDM data type of the OData property to which the value property of the control is bound.
	 * If no model or no OData property is available <code>null</code> is returned.
	 *
	 * @returns {string} The data type to which the value property is bound.
	 * @public
	 */
	SmartField.prototype.getDataType = function() {
		var oProp;

		if (this._oFactory) {

			// only ODataControlFactory has the method getDataType.
			if (this._oFactory.getDataProperty) {
				oProp = this._oFactory.getDataProperty();

				if (oProp) {
					return oProp.property.type;
				}
			}

			return this.getJsonType();
		}

		return null;
	};

	/**
	 * Returns the OData property to which the <code>value</code> property of the control is bound.
	 *
	 * @returns {object} The OData property.
	 * @public
	 */
	SmartField.prototype.getDataProperty = function() {

		if (this._oFactory) {

			// only ODataControlFactory has the method getDataProperty.
			if (this._oFactory.getDataProperty) {
				return this._oFactory.getDataProperty();
			}

			return null;
		}

		return null;
	};

	/**
	 * If the OData property to which the control's value property is bound semantically represents
	 * a unit of measure, the value of the current unit of measure is returned.
	 * Otherwise <code>null</code> is returned.
	 *
	 * @returns {any} The current unit of measure is returned, which can be <code>null</code
	 * @public
	 */
	SmartField.prototype.getUnitOfMeasure = function() {

		if (this._oValue.uom) {
			return this._oValue.uom();
		}

		return null;
	};

	/**
	 * If the OData property the control's value property is bound to semantically represents a
	 * unit of measure, the value of the current unit of measure can be changed.
	 *
	 * @param {string} sUnit The new unit of measure to be set.
	 * @public
	 */
	SmartField.prototype.setUnitOfMeasure = function(sUnit) {
		if (sUnit && this._oValue.uomset) {
			this._oValue.uomset(sUnit);
		}
	};

	/**
	 * Marks the <code>SmartField</code> control as having a client error.
	 *
	 * @param {boolean} bError If set to <code>true</code> the field is marked as having an error
	 * @private
	 */
	SmartField.prototype.setSimpleClientError = function(bError) {
		this._oError.bFirst = bError;
	};

	/**
	 * Marks the <code>SmartField</code> control and the first inner control as having a client error.
	 *
	 * @param {boolean} bError If set to <code>true</code> the field is marked as having an error
	 * @private
	 */
	SmartField.prototype.setComplexClientErrorFirstOperand = function(bError) {
		this._oError.bComplex = true;
		this._oError.bFirst = bError;
	};

	/**
	 * Marks the <code>SmartField</code> control and the second inner control as having a client error.
	 *
	 * @param {boolean} bError If set to <code>true</code> the field is marked as having an error
	 * @private
	 */
	SmartField.prototype.setComplexClientErrorSecondOperand = function(bError) {
		this._oError.bComplex = true;
		this._oError.bSecond = bError;
	};

	/**
	 * Marks the hosting <code>SmartField</code> control as having a client error.
	 *
	 * @param {boolean} bError If set to <code>true</code> the field is marked as having an error
	 * @private
	 */
	SmartField.prototype.setComplexClientErrorSecondOperandNested = function(bError) {
		var oParent = this.getParent().getParent();
		oParent.setComplexClientErrorSecondOperand(bError);
	};

	/**
	 * Returns whether a client error has been detected.
	 *
	 * @returns {boolean} <code>true</code>, if a client error has been detected, <code>false</code> otherwise
	 * @private
	 */
	SmartField.prototype._hasClientError = function() {

		if (this._oError.bComplex) {
			return this._oError.bFirst || this._oError.bSecond;
		}

		return this._oError.bFirst;
	};

	/**
	 * Checks whether a client error has been detected in edit mode. Additionally the error message is shown,
	 * if this is not the case already.
	 *
	 * This method is typically used to check whether the value of every inner text
	 * input field in edit mode is subject to data type constraints and whether the constraints
	 * are fulfilled.
	 *
	 * A data type constraint for a bound Entity Data Model (EDM) property can be violated
	 * in many ways, for example:
	 *
	 * <ul>
	 * <li>The <code>Nullable</code> constraint for an EDM property typed as <code>Edm.String</code>
	 * is violated.</li>
	 * <li>A user input is invalid for the bound EDM property typed as <code>Edm.DateTime</code>.</li>
	 * </ul>
	 *
	 * If this happens, the following applies:
	 *
	 * <ul>
	 * <li>A validation error state is set on the text input field.</li>
	 * <li>A validation error message is displayed for the text input field.</li>
	 * <li>The validation error message (possibly generated by a user input) is added to a
	 * <code>sap.ui.core.message.MessageManager</code> object instance if, for example, a view object
	 * instance is registered to it.</li>
	 * <li>The inner private text input field fires a {@link sap.ui.base.EventProvider#event:validationError},
	 * or {@link sap.ui.base.EventProvider#event:parseError} event.</li>
	 * </ul>
	 *
	 * @param {object} [oSettings] Settings
	 * @param {boolean} [oSettings.handleSuccess = false] Indicates whether client error checks are performed for the current value regardless of the current error state of the control. If the <code>handleSuccess</code> setting is set to <code>true</code>, the text input field fires a {@link sap.ui.base.EventProvider#event:validationSuccess} if its validation passes.
	 * @returns {boolean} <code>true</code>, if a client error has been detected, <code>false</code> otherwise
	 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
	 * @public
	 */
	SmartField.prototype.checkClientError = function (oSettings) {
		oSettings = Object.assign({ handleSuccess: false }, oSettings);
		var ERROR_MESSAGE = "The sap.ui.comp.smartfield.SmartField#checkClientError method is deprecated. " +
			"Please use the sap.ui.comp.smartfield.SmartField#checkValuesValidity method instead.";

		Log.warning(ERROR_MESSAGE, this.getMetadata().getName());

		if (this.getMode() === "display") {
			return false;
		}

		if (this._hasClientError() && !oSettings.handleSuccess) {
			return true;
		}

		this.getInnerControls().forEach(function(oInnerControl) {
			this._checkErrors(oInnerControl, { checkClientErrorsOnly: true, handleSuccess: oSettings.handleSuccess });
		}.bind(this));

		// check for a possibly detected error when calling the ._checkErrors() method
		return this._hasClientError();
	};

	/**
	 * Checks whether the value of every inner text input field in edit mode is valid.
	 *
	 * This method is typically used to check whether the value of every inner text
	 * input field in edit mode is subject to data type constraints and whether the constraints
	 * are fulfilled.
	 *
	 * <b>Note:</b> In some scenarios, invoking this method may also trigger a back-end request
	 * to check whether the value is valid.
	 *
	 * A data type constraint for a bound Entity Data Model (EDM) property can be violated
	 * in many ways, for example:
	 *
	 * <ul>
	 * <li>The <code>Nullable</code> constraint for an EDM property typed as <code>Edm.String</code>
	 * is violated.</li>
	 * <li>A user input is invalid for the bound EDM property typed as <code>Edm.DateTime</code>.</li>
	 * </ul>
	 *
	 * If this happens, the following applies:
	 *
	 * <ul>
	 * <li>A validation error state is set on the text input field.</li>
	 * <li>A validation error message is displayed for the text input field.</li>
	 * <li>The validation error message (possibly generated by a user input) is added to a
	 * <code>sap.ui.core.message.MessageManager</code> object instance if, for example, a view object
	 * instance is registered to it.</li>
	 * <li>The inner private text input field fires a {@link sap.ui.base.EventProvider#event:validationError},
	 * or {@link sap.ui.base.EventProvider#event:parseError} event. Note that the events are fired
	 * synchronously if the value is validated on client side or asynchronously if, for example, the value
	 * is validated on back-end side.</li>
	 * </ul>
	 *
	 * The inner private text input field fires a {@link sap.ui.base.EventProvider#event:validationSuccess} if its validation passes.
	 *
	 * <b>Note:</b> In display mode, this method always returns a fulfilled <code>Promise</code> object.
	 *
	 * <b>Note:</b> In two-way data binding scenarios, it is usually not necessary to invoke this method
	 * explicitly to validate user input, as the data type validation is done automatically when the value
	 * in the input field has changed and the focus leaves the text input field or the enter key is pressed.
	 * However, in two-way data binding scenarios, this method may be used to check whether a value is
	 * valid before submitting it to the back-end system.
	 *
	 * @example <caption>Example usage of <code>sap.ui.comp.smartfield.SmartField#checkValuesValidity</code> method</caption>
	 *	var oPromise = oSmartField.checkValuesValidity();
	 *
	 *	oPromise.then(function() {
	 *		// the value is valid and pending model changes can be submitted to the back-end system
	 *	}).catch(function() {
	 *		// the value is invalid
	 *	});
	 *
	 * @returns {Promise} A fulfilled <code>Promise</code> object or a <code>Promise</code> object to be
	 * fulfilled if the value of every text input field is valid, otherwise a rejected <code>Promise</code>
	 * object or a <code>Promise</code> object to be rejected
	 * @public
	 * @since 1.64
	 */
	SmartField.prototype.checkValuesValidity = function(oSettings /** for internal use only */) {

		if (this.getMode() === "display") {
			return Promise.resolve();
		}

		oSettings = oSettings || {};

		var oDefaultSettings = {
			handleSuccess: true,
			innerControls: this.getInnerControls(),
			rawValues: []
		};

		oSettings = Object.assign(oDefaultSettings, oSettings);

		return new Promise(function(fnResolve, fnReject) {
			var oCheckErrorsSettings = {
				rawValues: oSettings.rawValues,
				handleSuccess: oSettings.handleSuccess
			};

			var aPromises = oSettings.innerControls.map(function(oInnerControl) {
				return this._checkErrors(oInnerControl, oCheckErrorsSettings);
			}, this);

			Promise.all(aPromises).then(function() {
				fnResolve();
			}).catch(function(oReason) {
				fnReject();
			});
		}.bind(this));
	};

	/**
	 * Checks for a client-side and back-end side error on the given control.
	 * Additionally the error message is shown, if this is not the case already.
	 *
	 * @param {sap.ui.core.Control} oControl The control to be checked
	 * @param {object} [oSettings] Additional settings
	 * @param {boolean} [oSettings.checkClientErrorsOnly=false] Indicates whether only client side errors are checked
	 * @param {boolean} [oSettings.handleSuccess = true] Indicates whether {@link sap.ui.base.EventProvider#event:validationSuccess} should be fired
	 * @param {any} [oSettings.rawValues] Raw values used for validation of currency field
	 * @returns {Promise} A fulfilled <code>Promise</code> object or a <code>Promise</code> object to be
	 * fulfilled if the value of every text input field is valid, otherwise a rejected <code>Promise</code>
	 * object or a <code>Promise</code> object to be rejected
	 * @private
	 */
	SmartField.prototype._checkErrors = function(oControl, oSettings) {
		oSettings = Object.assign({ checkClientErrorsOnly: false, handleSuccess: true }, oSettings);

		var oBinding,
			sParam;

		if (oControl) {
			var aValuesPropertyMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(oControl.getMetadata().getName(), {
				propertyName: "value"
			});
			sParam = aValuesPropertyMap && aValuesPropertyMap[0];
		}

		if (sParam) {
			oBinding = oControl.getBinding(sParam);
		}

		if (!oBinding) {
			return Promise.resolve();
		}

		var sValue;

		function handleException(oException) {
			var mParameters = {
				element: oControl,
				property: sParam,
				type: oBinding.getType(),
				newValue: sValue,
				oldValue: oBinding.getValue(),
				exception: oException,
				message: oException.message
			};

			if (oException instanceof ParseException) {
				oControl.fireParseError(mParameters);
			} else if (oException instanceof ValidateException) {
				oControl.fireValidationError(mParameters);
			} else {
				throw oException;
			}
		}

		function handleSuccess() {

			if (oSettings.handleSuccess && oBinding.hasValidation()) {

				var mSuccessParameters = {
					element: oControl,
					property: sParam,
					type: oBinding.getType(),
					newValue: sValue,
					oldValue: oBinding.getValue()
				};

				var bAllowPreventDefault = false,
					bEnableEventBubbling = true;

				oControl.fireValidationSuccess(mSuccessParameters, bAllowPreventDefault, bEnableEventBubbling);
			}
		}

		try {
			var sMutator = "get" + capitalize(sParam),
				oType = oBinding.getType(),
				sInternalType = oBinding.sInternalType;

			sValue = oControl[sMutator]();

			if (sInternalType && oType) {

				// If the type is async, probably the value has to be validated on the back-end side.
				// In such cases, when checkClientErrorsOnly=true, the validation is skipped.
				if (oSettings.checkClientErrorsOnly && oType.async) {
					var ERROR_MESSAGE = "The deprecated sap.ui.comp.smartfield.SmartField#checkClientError method can not be " +
										 "used with async types. Please use sap.ui.comp.smartfield.SmartField#checkValuesValidity " +
										 "method instead.";
					Log.error(ERROR_MESSAGE, this.getMetadata().getName());
					this.setSimpleClientError(true);
					return Promise.reject();
				}

				// optimization to prevent an unnecessary HTTP request in case the entered
				// value did pass the type validation
				if (oType.async) {
					var oDataState = oBinding.getDataState();
					var sDataStateFormattedValue = oType.formatValue(oDataState.getValue(), sInternalType);

					// FIXME: Currently, the oDataState.isControlDirty() method only works with sync
					// binding data types. So, in the future the if statement below can be simplified
					// to if (!oDataState.isControlDirty()) ...
					if (!oDataState.isControlDirty() && (sDataStateFormattedValue === sValue)) {
						handleSuccess();
						return Promise.resolve();
					}
				}

				var vRawValues = oSettings.rawValues || oBinding.getValue(),
					vParseValueReturn = oType.parseValue(sValue, oBinding.sInternalType, vRawValues),
					vValidateValueReturn;

				if (vParseValueReturn && (vParseValueReturn instanceof Promise)) {
					vValidateValueReturn = vParseValueReturn.then(function(vValue) {
						return oType.validateValue(vValue);
					}).then(handleSuccess);

					vValidateValueReturn.catch(handleException);
					return vValidateValueReturn;
				}

				vValidateValueReturn = oType.validateValue(vParseValueReturn);

				if (vValidateValueReturn instanceof Promise) {
					vValidateValueReturn.catch(handleException);
					return vValidateValueReturn.then(handleSuccess);
				}
			}
		} catch (oException) {
			handleException(oException);
			return Promise.reject();
		}

		handleSuccess();
		return Promise.resolve();
	};

	/*
	 * Returns whether the current control context points to a table.
	 *
	 * @returns {boolean} <code>true</code> if the current <code>SmartField</code> control is used inside a table,
	 * <code>false</code> otherwise
	 * @protected
	 */
	SmartField.prototype.isContextTable = function() {
		return (this.getControlContext() === "responsiveTable" || this.getControlContext() === "table");
	};

	/*
	 * Determines whether the <code>SmartField</code> is displayed in the form context by explicitly setting the
	 * <code>controlContext</code> property.
	 *
	 * @returns {boolean} <code>true</code> if the <code>controlContext</code> control property is set to "form" or
	 * "smartFormGrid", <code>false</code> otherwise
	 * @since 1.54
	 * @protected
	 */
	SmartField.prototype.isFormContextType = function() {
		var sSmartFieldControlContext = this.getControlContext(),
			mControlContextType = library.smartfield.ControlContextType;
		return (sSmartFieldControlContext === mControlContextType.Form) ||
				(sSmartFieldControlContext === mControlContextType.SmartFormGrid);
	};

	/**
	 * Resolves the controls hosted currently by this <code>SmartField</code> control.
	 *
	 * @returns {array} The controls hosted currently by this <code>SmartField</code>
	 * @protected
	 */
	SmartField.prototype.getInnerControls = function() {
		var oContent,
			fContent,
			mComplex = {
			"sap.m.HBox": function(oControl) {
				var oChild,
					aItems,
					len = 0;

				aItems = oControl.getItems();

				if (aItems) {
					len = aItems.length;
				}

				if (len === 0) {
					return [];
				}

				if (len === 1) {
					return [
						aItems[0]
					];
				}

				oChild = aItems[1].getContent();

				if (oChild) {

					return [
						aItems[0], oChild
					];
				}

				return [
					aItems[0]
				];
			},
			"sap.ui.comp.navpopover.SmartLink": function(oControl) {
				var oItem = oControl.getAggregation("innerControl");

				if (oItem) {
					return [
						oItem
					];
				}

				return [
					oControl
				];
			}
		};

		oContent = this.getContent();

		if (oContent) {
			fContent = mComplex[oContent.getMetadata()._sClassName];
		}

		if (fContent) {
			return fContent(oContent);
		}

		if (oContent) {
			return [
				oContent
			];
		}

		return [];
	};

	SmartField.prototype.getAllInnerControls = function() {
		var aInnerControls = [],
			oControls = this._oControl;

		if (oControls) {

			for (var sProperty in oControls) {

				if (oControls.hasOwnProperty(sProperty)) {
					var oControl = oControls[sProperty];

					if (oControl && (oControl instanceof Object)) {
						aInnerControls.push(oControl);
					}
				}
			}
		}

		return aInnerControls;
	};

	/**
	 * Gets the embedded <code>SmartField</code> control instance.
	 *
	 * @returns {sap.ui.comp.smartfield.SmartField | null} The embedded <code>SmartField</code> control instance if
	 * exists, otherwise <code>null</code>.
	 * @private
	 */
	SmartField.prototype._getEmbeddedSmartField = function() {
		var aContent = this.getContent();

		if (aContent) {

			if (aContent.isA("sap.m.HBox")) {
				var aHBoxContent = aContent.getItems();

				if (aHBoxContent) {

					for (var j = 0; j < aHBoxContent.length; j++) {

						if (aHBoxContent[j] instanceof SmartField) {
							return aHBoxContent[j];
						}
					}
				}
			}
		}

		return null;
	};

	/**
	 * The function is called when the rendering of the control is completed.
	 *
	 * @private
	 */
	SmartField.prototype.onAfterRendering = function() {
		Control.prototype.onAfterRendering.apply(this, arguments);

		// also check for field group annotation.
		this._checkFieldGroups();
	};

	SmartField.prototype.onBeforeRendering = function() {
		Control.prototype.onBeforeRendering.apply(this, arguments);

		var aFields = this.getInnerControls();
		var that = this;

		if (this.getAriaLabelledBy().length > 0) {
			aFields.forEach(function(oField) {

				if (oField.addAriaLabelledBy && oField.getAriaLabelledBy) {

					if (oField.getAriaLabelledBy().length === 0) {
						oField.addAriaLabelledBy(that.getAriaLabelledBy()[0]);
					}
				}
			});
		}
	};

	SmartField.prototype.getFirstInnerControl = function() {
		var aControls = this.getInnerControls();

		if (aControls.length) {
			return aControls[0] || null;
		}

		return null;
	};

	/**
	 * Checks whether field groups can be set.
	 *
	 * @private
	 */
	SmartField.prototype._checkFieldGroups = function() {
		var oView,
			oMetaData,
			sMode = this.getMode();

		if (this.getBindingContext() && this._oFactory && this._oFactory.getMetaData &&
			(sMode === "edit") && !this._bSideEffects) {

			// check whether the meta data for the smart field has already been calculated.
			oMetaData = this._oFactory.getMetaData();

			if (oMetaData && !oMetaData.property || (oMetaData.property && !oMetaData.property.property)) {
				return;
			}

			// view should be available.
			oView = this._getView();

			// now set the field group ids.
			if (oView && oMetaData) {
				this._setFieldGroup(oMetaData, oView);
			}
		}
	};

	/**
	 * Sets the field group ID according to the side effects annotation.
	 *
	 * @param {object} oMetaData the meta data used to create the control
	 * @param {object} oMetaData.entitySet the OData entity set definition
	 * @param {object} oMetaData.entityType the OData entity type definition
	 * @param {object} oMetaData.property the OData property definition
	 * @param {string} oMetaData.path the binding path
	 * @param {sap.ui.core.mvc.View} oView the current view
	 * @private
	 */
	SmartField.prototype._setFieldGroup = function(oMetaData, oView) {
		var aControls,
			aIDs = this._oSideEffects.getFieldGroupIDs(oMetaData, oView);

		if (aIDs) {
			aControls = this.getInnerControls();

			if (aControls.length) {
				this._bSideEffects = true;
				aControls[0].setFieldGroupIds(aIDs);
			}
		}
	};

	/**
	 * Returns the current view instance.
	 *
	 * @returns {sap.ui.core.mvc.View} the current view instance or <code>null</code>
	 * @private
	 */
	SmartField.prototype._getView = function() {
		var oObj = this.getParent();

		while (oObj) {
			if (oObj.isA("sap.ui.core.mvc.View")) {
				return oObj;
			}

			oObj = oObj.getParent();
		}

		return null;
	};

	/**
	 * Event handler for data state changes.
	 *
	 * @param {string} sName The name of the property
	 * @param {object} oDataState the new data state.
	 * @private
	 */
	SmartField.prototype.refreshDataState = function(sName, oDataState) {
		var oBindingContext,
			oObject;

		if (sName === "value") {

			if (oDataState.isLaundering()) {

				if (this.getEditable()) {
					oBindingContext = this.getBindingContext();

					if (oBindingContext && oBindingContext.getObject) {
						oObject = oBindingContext.getObject();

						if (oObject && oObject.__metadata && oObject.__metadata.created) {
							this._checkCreated = true;
							return;
						}
					}
				}
			}

			// server has accepted the new instance and it is persistent now.
			if (this._checkCreated && !oDataState.isLaundering() && !oDataState.isDirty()) {
				this._oFactory.rebindOnCreated();
				delete this._checkCreated;
			}
		}
	};

	SmartField.prototype.exit = function() {

		this._bInDestroy = true;
		var oInactiveInnerControl = null;

		if (this._oSideEffects) {
			this._oSideEffects.destroy();
		}

		if (this._oUtil) {
			this._oUtil.destroy();
		}

		if (this._oFactory) {
			this._oFactory.destroy();
		}

		var oControl = this._oControl;

		// destroy only inactive control
		// active control will be destroyed via content aggregation
		if (oControl) {

			if (oControl.current === "edit") {
				oInactiveInnerControl = oControl["display"] || oControl["display_uom"];
			} else {
				oInactiveInnerControl = oControl["edit"];
			}

			// content can be null for performance reasons => destroy control here
			if (oControl[oControl.current] && !oControl[oControl.current].getParent()) {
				oControl[oControl.current].destroy();
			}
		}

		if (oInactiveInnerControl && (typeof oInactiveInnerControl.destroy === "function")) {
			oInactiveInnerControl.destroy();
		}

		this._oUtil = null;
		this._oError = null;
		this._oValue = null;
		this._oFactory = null;
		this._oControl = null;
		this._oSideEffects = null;
		this._sBindingContextPath = "";
		this._sAnnotationLabel = "";
	};

	/**
	 * Calculates the paths to the annotations used by the <code>SmartField</code> control.
	 *
	 * @param {sap.ui.model.odata.ODataMetaModel} oMetaModel The given OData meta model
	 * @param {object} oEntitySet The given entity set
	 * @param {string} sValueBinding The path identifying the OData property to which the value property
	 * of the <code>SmartField</code> control is bound
	 * @param {boolean} bNavigationPathsOnly If set to <code>true</code>, no properties are returned
	 * @returns {array} The resulting paths are returned
	 * @public
	 */
	SmartField.getSupportedAnnotationPaths = function(oMetaModel, oEntitySet, sValueBinding, bNavigationPathsOnly) {
		var oConfig,
			oUOM,
			aResult = [],
			oMetaData;

		if (oMetaModel && oEntitySet && sValueBinding) {

			// prepare the meta data.
			oMetaData = {
				entitySet: oEntitySet,
				entityType: oMetaModel.getODataEntityType(oEntitySet.entityType),
				path: sValueBinding
			};

			// get the config.
			oConfig = {
				helper: new ODataHelper(null, null, oMetaModel)
			};

			if (bNavigationPathsOnly) {
				oConfig.navigationPathOnly = bNavigationPathsOnly;
			}

			// complete the meta data.
			oConfig.helper.getProperty(oMetaData);

			// get the annotations from the entity set.
			SmartField._getFromEntitySet(aResult, oMetaData, oConfig);

			// get the annotations from the property.
			SmartField._getFromProperty(aResult, oMetaData, oConfig);

			// get the annotations from a unit of measure.
			oUOM = oConfig.helper.getUnitOfMeasure2(oMetaData);

			if (oUOM) {
				SmartField._getFromProperty(aResult, oUOM, oConfig);
			}

			// destroy the helper class.
			oConfig.helper.destroy();
		}

		return aResult;
	};

	/**
	 * Calculates the paths to the annotations on entity set.
	 *
	 * @param {array} aResult The resulting paths
	 * @param {object} oMetaData The given meta data
	 * @param {object} oMetaData.entitySet The OData entity set definition
	 * @param {object} oMetaData.entityType The OData entity type definition
	 * @param {object} oMetaData.property The OData property definition
	 * @param {object} oConfig The given configuration
	 * @param {sap.ui.comp.smartfield.ODataHelper} oConfig.helper The given helper
	 * @param {boolean} oConfig.navigationPathOnly If set to <code>true</code>, no properties will be returned
	 * @private
	 */
	SmartField._getFromEntitySet = function(aResult, oMetaData, oConfig) {
		var sPath;

		if (oMetaData.entitySet) {
			sPath = oConfig.helper.oAnnotation.getUpdateEntitySetPath(oMetaData.entitySet);
			SmartField._push(sPath, aResult, oMetaData, oConfig);
		}
	};

	/**
	 * Pushes a path, if it is not null.
	 *
	 * @param {string} sPath The given path
	 * @param {array} aResult The resulting paths
	 * @param {object} oMetaData The given meta data
	 * @param {object} oMetaData.entitySet The OData entity set definition
	 * @param {object} oMetaData.entityType The OData entity type definition
	 * @param {object} oMetaData.property The OData property definition
	 * @param {object} oConfig The given configuration
	 * @param {sap.ui.comp.smartfield.ODataHelper} oConfig.helper The given helper
	 * @param {boolean} oConfig.navigationPathOnly If set to <code>true</code>, no properties will be returned
	 * @private
	 */
	SmartField._push = function(sPath, aResult, oMetaData, oConfig) {
		var aPath,
			sPart,
			len,
			sOut,
			oResult = {};

		if (sPath) {
			if (oConfig.navigationPathOnly) {
				aPath = sPath.split("/");
				len = aPath.length;
				oResult.entityType = oMetaData.entityType;

				while (len--) {
					sPart = aPath.shift();

					if (sPart === "") {
						continue;
					}

					oResult = oConfig.helper.getNavigationProperty(oResult.entityType, sPart);

					if (!oResult.entitySet) {
						break;
					}

					if (sOut) {
						sOut = sOut + "/" + sPart;
					} else {
						sOut = sPart;
					}
				}
			} else {
				sOut = sPath;
			}
		}

		if (sOut) {

			if (oMetaData.navigationPath) {
				aResult.push(oMetaData.navigationPath + "/" + sOut);
			} else {
				aResult.push(sOut);
			}
		}
	};

	/**
	 * Calculates the paths to the annotations on property.
	 *
	 * @param {array} aResult The resulting path.
	 * @param {object} oMetaData The given meta data
	 * @param {object} oMetaData.entitySet The OData entity set definition
	 * @param {object} oMetaData.entityType The OData entity type definition
	 * @param {object} oMetaData.property The OData property definition
	 * @param {object} oConfig The given configuration
	 * @param {sap.ui.comp.smartfield.ODataHelper} oConfig.helper The given helper
	 * @param {boolean} oConfig.navigationPathOnly If set to <code>true</code>, no properties will be returned
	 * @private
	 */
	SmartField._getFromProperty = function(aResult, oMetaData, oConfig) {
		var sPath;

		if (oMetaData.property.property) {
			sPath = oConfig.helper.oAnnotation.getText(oMetaData.property.property);
			SmartField._push(sPath, aResult, oMetaData, oConfig);

			sPath = oConfig.helper.oAnnotation.getUnit(oMetaData.property.property);
			SmartField._push(sPath, aResult, oMetaData, oConfig);

			sPath = oConfig.helper.oAnnotation.getFieldControlPath(oMetaData.property.property);
			SmartField._push(sPath, aResult, oMetaData, oConfig);
		}
	};

	SmartField.prototype.addAssociation = function(sAssociationName, sId, bSuppressInvalidate) {

		if (sAssociationName === "ariaLabelledBy") {
			this.getInnerControls().forEach(function(oControl) {

				if (oControl.addAriaLabelledBy) {
					oControl.addAriaLabelledBy(sId);
				}
			});
		}

		return Control.prototype.addAssociation.apply(this, arguments);
	};

	SmartField.prototype.removeAssociation = function(sAssociationName, vObject, bSuppressInvalidate) {
		var sId = Control.prototype.removeAssociation.apply(this, arguments);

		if (sAssociationName === "ariaLabelledBy" && sId) {
			this.getInnerControls().forEach(function(oControl) {
				if (oControl.removeAriaLabelledBy) {
					oControl.removeAriaLabelledBy(sId);
				}
			});
		}

		return sId;
	};

	SmartField.prototype.getAccessibilityInfo = function() {
		var oControl = this.getContent();
		return oControl && oControl.getAccessibilityInfo ? oControl.getAccessibilityInfo() : null;
	};

	/*
	 * If SmartFiels is inside of a Form use Forms aria logic for label
	 */
	SmartField.prototype.enhanceAccessibilityState = function(oElement, mAriaProps) {
		var oParent = this.getParent();

		if (oParent && oParent.enhanceAccessibilityState) {
			// use SmartField as control, but aria proprties of rendered inner control.
			oParent.enhanceAccessibilityState(this, mAriaProps);
		}
	};

	/**
	 * Gets the value of the <code>mandatory</code> property.
	 *
	 * This function is needed as the "mandatory" feature is named "required" in a lot of other controls
	 * (like <code>Label</code> or <code>Form</code>).
	 * @returns {boolean} the true if the <code>SmartField</code> should be marked as required
	 * @since 1.48.0
	 * @protected
	 */
	SmartField.prototype.getRequired = function() {

		if (this.getContextEditable() && this.getEditable()) {
			return this.getMandatory();
		} else {
			return false;
		}
	};

	/**
	 * Gets binding mode of <code>sProperty</code>.
	 *
	 * @param {string} sProperty The name of the property
	 * @returns {string|undefined} The binding mode of <code>sProperty</code>
	 * @since 1.67
	 */
	SmartField.prototype.getBindingMode = function(sProperty) {
		var oBindingInfo = this.getBindingInfo(sProperty);
		return oBindingInfo ? oBindingInfo.parts[0].mode : undefined;
	};

	/**
	 * Sets a new value for property <code>uomEditState</code>.
	 *
	 * @name sap.ui.comp.smartfield.SmartField#setUomEditState
	 * @function
	 * @type void
	 * @private
	 */

	/**
	 * Gets current value of property <code>uomEditState</code>.
	 *
	 * @name sap.ui.comp.smartfield.SmartField#setUomEditState
	 * @function
	 * @type void
	 * @private
	 */

	return SmartField;
}, true);
