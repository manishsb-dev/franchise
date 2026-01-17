frappe.ui.form.on("Stock Entry", {
    scan_barcode: function(frm) {
        setTimeout(() => {
            let row = frm.doc.items[frm.doc.items.length - 1];
            if (row && row.qty > 1) {
                frappe.model.set_value(row.doctype, row.name, "qty", 1);
            }
        }, 300);
    }
});
