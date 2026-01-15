frappe.ui.form.on('Sales Order', {
    custom_scan_product_bundle(frm) {
        if (!frm.doc.custom_scan_product_bundle) return;

        const bundle_serial = frm.doc.custom_scan_product_bundle.trim();

        frappe.call({
            method: "frappe.client.get_value",
            args: {
                doctype: "Product Bundle",
                filters: { custom_bundle_serial_no: bundle_serial },
                fieldname: ["new_item_code"]
            },
            callback(r) {
                if (!r.message?.new_item_code) {
                    frappe.msgprint(__('No Item found for scanned bundle serial'));
                    frm.set_value('custom_scan_product_bundle', '');
                    return;
                }

                let row = frm.doc.items.find(d => !d.item_code) || frm.add_child('items');

                frappe.model.set_value(row.doctype, row.name, 'item_code', r.message.new_item_code);
                frappe.model.set_value(row.doctype, row.name, 'qty', row.qty || 1);

                frm.refresh_field('items');
                frm.set_value('custom_scan_product_bundle', '');
            }
        });
    }
});
