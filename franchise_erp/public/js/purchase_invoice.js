frappe.ui.form.on('Purchase Invoice', {
    before_submit: function(frm) {
        const user_roles = frappe.user_roles;  // correct

        // console.log("User roles:", user_roles);
        // frappe.msgprint("Your roles: " + user_roles.join(", "));

        const is_franchise = user_roles.includes('Franchise Role'); 
        const is_return_invoice = frm.doc.is_return === 1;

        if (is_franchise && is_return_invoice) {
            frappe.msgprint(__('This User cannot submit return Purchase Invoice'));
            frappe.validated = false;
            return;
        }

        if (!is_franchise && !is_return_invoice) {
            frappe.msgprint(__('Supplier cannot submit normal Purchase Invoice'));
            frappe.validated = false;
            return;
        }
    }
});
