// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

const fnCopyText = () => {
    "use strict";
    let copyText = document.getElementById("resultArea");
    copyText.select();
    document.execCommand("copy");

    document.getElementById("resultArea").value = "";
    document.getElementById("inputArea").value = "";
};

document.getElementById("copyBtn").addEventListener("click", fnCopyText);

const updateResult = (sText) => {
    "use strict";
    document.getElementById("resultArea").value = sText;
};

const hasRenameTo = (signature) => {
    "use strict";
    let {parameters} = signature,
        aParametersList = Object.values(parameters);

    return aParametersList.some(parameter => !!parameter.renameTo);
};

const formatValue = (value, format) => {
    "use strict";
    if (value === undefined) {
        return "";
    }

    let result = "";
    switch (format) {
        case "reference":
            result = `@${value}@`;
            break;
        case "regexp":
            result = `/${value}/`;
            break;
        case "plain":
        default:
            result = `${value}`;
            break;
    }
    return result;
};

const encodeFilterValue = (filterValue) => {
    "use strict";
    return filterValue ? formatValue(filterValue.value, filterValue.format) : "";
};

const encodeDefaultValue = (defaultValue) => {
    "use strict";
    return defaultValue ? `[${formatValue(defaultValue.value, defaultValue.format)}]` : "";
};

const encodeParameters = (parameters) => {
    "use strict";
    let keys = Object.keys(parameters);
    if (keys.length === 0) {
        return "<no params>";
    }

    return keys.map((key) => {
        let {filter, defaultValue, required} = parameters[key];
        let sPrm = `${key}:${encodeFilterValue(filter)}${encodeDefaultValue(defaultValue)}`;
        return required ? sPrm : `[${sPrm}]`;
    }).join(",");
};


const encodeAdditionalParameters = (additionalParameters) => {
    "use strict";
    switch (additionalParameters) {
        case "allowed":
            return "<+>";
        case "ignored":
            return "<o>";
        case "notallowed":
            return "<->";
        default:
            //do nothing
    }
    return "<?>";
};

const encodeSignature = (oSignature) => {
    "use strict";
    let { parameters, additionalParameters} = oSignature;
    return encodeParameters(parameters) + encodeAdditionalParameters(additionalParameters);
};

const getExtraParameters = (oInbound) => {
    "use strict";
    const aAllowedParameters = ["title", "permanentKey"];
    let oExtraParameters = aAllowedParameters.reduce((result, sParameter) => {
        if (oInbound.hasOwnProperty(sParameter)) {
            result[sParameter] = oInbound[sParameter];
        }
        return result;
    }, {});

    return Object.keys(oExtraParameters).length > 0 ? JSON.stringify(oExtraParameters, null, "\t") : "";

};

const encodeInbound = (oInbound) => {
    "use strict";
    let {semanticObject, action, signature, resolutionResult} = oInbound;
    if (hasRenameTo(signature)) {
        return "Can not transform, because there is renameTo parameter.";
    }
    let sExtraParameters = getExtraParameters(oInbound);
    if (sExtraParameters) {
        return `mkInb("#${semanticObject}-${action}{${encodeSignature(signature)}}", ${JSON.stringify(resolutionResult, null, "\t")}, ${sExtraParameters})`;
    }
    return `mkInb("#${semanticObject}-${action}{${encodeSignature(signature)}}", ${JSON.stringify(resolutionResult, null, "\t")})`;
};


const onInputChange = (event) => {
    "use strict";
    let oInbound;
    try {
        oInbound = JSON.parse(event.currentTarget.value);
    } catch (err) {
        updateResult("Input should be JSON");
        return;
    }
    updateResult(encodeInbound(oInbound));
};

document.getElementById("inputArea").addEventListener("change", onInputChange);