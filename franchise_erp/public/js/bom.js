frappe.ui.form.on("BOM", {
    setup(frm) {
        frm.set_query("custom_service_item", function () {
            return {
                filters: {
                    is_stock_item: 0
                }
            };
        });
    }
});
