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

frappe.ui.form.on("Sales Order", {
    customer(frm) {
        if (!frm.doc.customer) return;

        // wait for ERPNext to populate sales_team
        setTimeout(() => {
            (frm.doc.sales_team || []).forEach(row => {
                set_incentive_from_sales_person(frm, row);
            });
        }, 500);
    },

    refresh(frm) {
        // handles reload / back navigation
        (frm.doc.sales_team || []).forEach(row => {
            if (!row.incentives) {
                set_incentive_from_sales_person(frm, row);
            }
        });
    }
});

function set_incentive_from_sales_person(frm, row) {
    if (!row.sales_person) return;

    frappe.db.get_value(
        "Sales Person",
        row.sales_person,
        "custom_commission_amount"
    ).then(r => {
        if (r && r.message && r.message.custom_commission_amount != null) {
            frappe.model.set_value(
                row.doctype,
                row.name,
                "incentives",
                r.message.custom_commission_amount
            );
        }
    });
}


frappe.ui.form.on("Sales Team", {
    sales_person(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        set_incentive_from_sales_person(frm, row);
    }
});












frappe.ui.form.on("Sales Order Item", {
    item_code(frm, cdt, cdn) {
        check_mrp_rsp_price(frm, cdt, cdn);
    },
    rate(frm, cdt, cdn) {
        check_mrp_rsp_price(frm, cdt, cdn);
    }
});

function check_mrp_rsp_price(frm, cdt, cdn) {
    let row = locals[cdt][cdn];

    if (!row.item_code || !row.rate) return;

    let price_list = frm.doc.selling_price_list;

    // Sirf MRP / RSP ke liye
    if (!["MRP", "RSP"].includes(price_list)) {
        return;
    }

    frappe.call({
        method: "franchise_erp.api.get_item_price",
        args: {
            item_code: row.item_code,
            price_list: price_list
        },
        callback: function (r) {
            if (!r.message) return;

            let system_rate = parseFloat(r.message);
            let so_rate = parseFloat(row.rate);

            if (system_rate !== so_rate) {
                frappe.confirm(
                    `
                    <b>Price Mismatch Found</b><br><br>
                    Item: ${row.item_code}<br>
                    Price List: ${price_list}<br>
                    System Price: ${system_rate}<br>
                    Sales Order Price: ${so_rate}<br><br>
                    Do you want to update Item Price?
                    `,
                    function () {
                        // YES → Update Item Price
                        frappe.call({
                            method: "franchise_erp.api.update_item_price",
                            args: {
                                item_code: row.item_code,
                                price_list: price_list,
                                new_rate: so_rate
                            },
                            callback: function () {
                                frappe.msgprint("Item Price updated successfully.");
                            }
                        });
                    },
                    function () {
                        // NO → Bypass
                        frappe.msgprint("Item Price not updated. Sales Order will continue.");
                    }
                );
            }
        }
    });
}
