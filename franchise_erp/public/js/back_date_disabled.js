// // DocType: Sales Invoice
// frappe.ui.form.on('Sales Invoice', {
//     // Trigger on load and validate
//     onload: function(frm) {
//         disable_back_date(frm);
//     },
//     validate: function(frm) {
//         disable_back_date(frm);
//     },
//     posting_date: function(frm) {
//         disable_back_date(frm);
//     }
// });

// // DocType: Purchase Invoice
// frappe.ui.form.on('Purchase Invoice', {
//     onload: function(frm) {
//         disable_back_date(frm);
//     },
//     validate: function(frm) {
//         disable_back_date(frm);
//     },
//     posting_date: function(frm) {
//         disable_back_date(frm);
//     }
// });


// // Common function
// function disable_back_date(frm) {
//     const today = frappe.datetime.get_today(); // current date YYYY-MM-DD

//     if (frm.doc.posting_date && frm.doc.posting_date < today) {
//         frappe.msgprint(__('Back-dating is not allowed. Posting Date set to today.'));
//         frm.set_value('posting_date', today); // auto reset to today
//     }
// }
frappe.ui.form.on(['Sales Invoice','Purchase Invoice'], {
    validate(frm) {
        let doc_date = new Date(frm.doc.posting_date);
        let today = new Date(frappe.datetime.get_today());

        if (doc_date < today) {
            frappe.throw("Back-dated entries are not allowed.");
        }
    }
});
