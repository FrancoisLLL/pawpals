const hbs = require("hbs")


// {{ISSELECTED}} FOR SINGLE-ANSWER SELECT
hbs.registerHelper("isSelected", (lvalue, rvalue, options) => {
    const isArray = Array.isArray(lvalue);
    if (isArray) {
        return lvalue.includes(rvalue.toString()) ? "selected" : ""; 
    } else {
        return lvalue === rvalue ? "selected" : "";
    }
})