frappe.ui.form.on("Purchase Invoice", {
    before_submit(frm) {

        // Fetch role profile list (child table inside User doc)
        const role_profiles = frappe.user_doc?.role_profiles || [];

        // Extract only the names → ["Franchise Role", "HR", ...]
        const profile_names = role_profiles.map(p => p.role_profile);

        console.log("User Role Profiles:", profile_names);

        const has_franchise_profile = profile_names.includes("Franchise Role");
        const is_return_invoice = frm.doc.is_return === 1;

        // Case 1: Franchise user cannot submit return PI
        if (has_franchise_profile && is_return_invoice) {
            frappe.msgprint(__('Franchise user cannot submit Return Purchase Invoice'));
            frappe.validated = false;
            return;
        }

        // Case 2: Supplier (no franchise profile) cannot submit normal PI
        if (!has_franchise_profile && !is_return_invoice) {
            frappe.msgprint(__('Supplier cannot submit Normal Purchase Invoice'));
            frappe.validated = false;
            return;
        }

        // Case 3: Allowed
    }
});
