const hbs = require("hbs")


// {{ISSELECTED}} FOR SINGLE-ANSWER SELECT
hbs.registerHelper("isSelected", (lvalue, rvalue) => {
    const isArray = Array.isArray(lvalue);
    if (isArray) {
        return lvalue.includes(rvalue.toString()) ? "selected" : ""; 
    } else {
        return lvalue === rvalue ? "selected" : "";
    }
})

hbs.registerHelper("isChecked", (lvalue, rvalue) => {
    const isArray = Array.isArray(lvalue);
    if (isArray) {
        return lvalue.includes(rvalue.toString()) ? "checked" : ""; 
    } else {
        return lvalue === rvalue ? "checked" : "";
    }
})