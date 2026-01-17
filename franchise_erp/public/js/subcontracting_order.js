frappe.ui.form.on('Subcontracting Order', {
    refresh(frm) {
        // sirf submitted document ke liye
        if (frm.doc.docstatus !== 1 || !frm.doc.supplier) return;

        // Supplier master se flag check
        frappe.db.get_value(
            "Supplier",
            frm.doc.supplier,
            "custom_gate_out_applicable",
            (r) => {
                if (r && r.custom_gate_out_applicable) {
                    // ✅ tabhi button add hoga
                    frm.add_custom_button(
                        __('Outgoing Logistics'),
                        () => {
                            frappe.call({
                                method: "franchise_erp.custom.subcontracting_order.get_outgoing_logistics_data",
                                args: {
                                    subcontracting_order: frm.doc.name
                                },
                                callback(r) {
                                    if (r.message) {
                                        frappe.new_doc("Outgoing Logistics", r.message);
                                    }
                                }
                            });
                        },
                        __('Create')
                    );
                }
            }
        );
    }
});
