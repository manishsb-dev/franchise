frappe.ui.form.on("Supplier", {
    refresh(frm) {
        frm.set_query("custom_transporter", function() {
            return {
                filters: {
                    is_transporter: 1
                }
            };
        });
    }
});