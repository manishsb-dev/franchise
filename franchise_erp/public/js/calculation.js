frappe.ui.form.on('Sales Invoice Item', {
    quantity: function(frm, cdt, cdn) {
        calculate_gst_and_margin(frm, cdt, cdn);
    },
    rate: function(frm, cdt, cdn) {
        calculate_gst_and_margin(frm, cdt, cdn);
    },
    discount_percentage: function(frm, cdt, cdn) {
        calculate_gst_and_margin(frm, cdt, cdn);
    }
});

function calculate_gst_and_margin(frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);

    // 1. Realized Sale
    row.realized_sale = row.rate * row.quantity;

    // 2. Output GST Value
    row.output_gst_value = (row.realized_sale * row.tax_rate / 100);

    // 3. Net Sale Value
    row.net_sale_value = row.realized_sale - row.output_gst_value;

    // 4. Margin Value
    let cost = row.purchase_rate * row.quantity; // assume purchase_rate exists
    row.margin_value = row.net_sale_value - cost;

    // 5. Margin %
    row.margin_percent = (row.margin_value / row.net_sale_value) * 100;

    // 6. Input GST Value
    row.input_gst_value = (cost * row.input_gst_rate / 100);

    // 7. Invoice Value (base + input GST)
    row.invoice_value = cost + row.input_gst_value;

    frm.refresh_field('items');
}
