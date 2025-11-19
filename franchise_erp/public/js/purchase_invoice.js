frappe.ui.form.on("Purchase Invoice", {
    before_submit(frm) {

        // ---- PRINT ROLE PROFILES IN CONSOLE ----
        console.log("User Full Doc:", frappe.user_doc);  
        console.log("Role Profile Child Table:", frappe.user_doc?.role_profiles);

        // Extract only the role_profile names
        let role_profiles = (frappe.user_doc?.role_profiles || []).map(r => r.role_profile);

        // Print role names
        console.log("Extracted Role Profiles:", role_profiles); 

        // ------------------------------------------

        const has_franchise_profile = role_profiles.includes("Franchise Role");
        const is_return_invoice = frm.doc.is_return == 1;

        if (has_franchise_profile && is_return_invoice) {
            frappe.msgprint("Franchise user cannot submit Return Purchase Invoice");
            frappe.validated = false;
            return;
        }

        if (!has_franchise_profile && !is_return_invoice) {
            frappe.msgprint("Supplier cannot submit Normal Purchase Invoice");
            frappe.validated = false;
            return;
        }
    }
});
