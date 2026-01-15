frappe.ui.form.on("Markup Rule Template", {
    onload(frm) {

        // MRP / RSP rule interpretation (ALWAYS shown)
        frm.set_value(
            "mrp_rule_interpretation",
            "While making any 'Stock In' type of entry, if user does not maintain 91.83% " +
            "Markup margin between Effective cost and RSP, then the system will Warn / " +
            "Block / Ignore based on the user profile. Margin will be calculated as Net of Tax. " +
            "This rule is ACTIVE.\n" +
            "Formula Basis Markup: Effective cost + 91.83% of Effective cost > RSP"
        );

        // WSP rule interpretation (ALWAYS shown)
        frm.set_value(
            "wsp_rule_interpretation",
            "While making any 'Stock In' type of entry, if user does not maintain 10% " +
            "Markup margin between Effective cost and WSP, then the system will Warn / " +
            "Block / Ignore based on the user profile. Margin will be calculated as Gross of Tax. " +
            "This rule is ACTIVE.\n" +
            "Formula Basis Markup: Effective cost + 10% of Effective cost > WSP"
        );
    }
});
