frappe.ui.form.on("Purchase Order", {
    supplier(frm) {
        if (!frm.doc.supplier) {
            frm.set_value("custom_agent_supplier", null);
            frm.set_value("custom_transporter_supplier", null);
            return;
        }

        frappe.db.get_value(
            "Supplier",
            frm.doc.supplier,
            ["custom_is_agent", "is_transporter","custom_agent_supplier","custom_transporter_supplier"],
            (r) => {
                console.log("tst------------",r)
                // If the supplier is an agent, then set the Agent as the Supplier as well.
                if (r.custom_is_agent) {
                    frm.set_value("custom_agent_supplier", r.custom_agent_supplier);
                } else {
                    frm.set_value("custom_agent_supplier", null);
                }

                // If the supplier is a transporter, then set the Transporter as the Supplier.
                if (r.is_transporter) {
                    frm.set_value("custom_transporter_supplier", r.custom_transporter_supplier);
                } else {
                    frm.set_value("custom_transporter_supplier", null);
                }
            }
        );
    }
});
