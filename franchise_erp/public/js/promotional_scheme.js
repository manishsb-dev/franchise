frappe.ui.form.on("Promotional Scheme Price Discount", {
    custom_get_1_free(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        if (row.custom_get_1_free && row.custom_get_50_off) {
            row.custom_get_1_free = 0;
            frappe.msgprint({
                title: __("Validation Error"),
                message: __("To keep this checked, please uncheck the Buy n Get 50% off field."),
                indicator: "red"
            });
            frm.refresh_field("price_discount_slabs");
        }
    },

    custom_get_50_off(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        if (row.custom_get_50_off && row.custom_get_1_free) {
            row.custom_get_50_off = 0;
            frappe.msgprint({
                title: __("Validation Error"),
                message: __("To keep this checked, please uncheck the Buy n Get 1 Free field."),
                indicator: "red"
            });
            frm.refresh_field("price_discount_slabs");
        }
    },
    custom_enter_1: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        // Only validate if the checkbox is checked
        if (row.custom_get_1_free) {
            if (!row.custom_enter_1 || row.custom_enter_1 < 1) {
                frappe.msgprint(__('Please enter a valid number of items for Buy X Get 1 Free.'));
                // Reset the field so user must re-enter a valid number
                frappe.model.set_value(cdt, cdn, 'custom_enter_1', 1);
            }
        }
    },
    custom_enter_50: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        // Only validate if the checkbox is checked
        if (row.custom_get_50_off) {
            if (!row.custom_enter_50 || row.custom_enter_50 < 1) {
                frappe.msgprint(__('Please enter a valid number of items for Buy X Get 50% Off.'));
                // Reset the field to blank so user must re-enter
                frappe.model.set_value(cdt, cdn, 'custom_enter_50', 1);
            }
        }
    }
});
