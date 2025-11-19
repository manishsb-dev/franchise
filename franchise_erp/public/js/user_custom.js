frappe.ui.form.on('User', {
    refresh(frm) {
        frm.add_field({
            fieldname: "company",
            label: "Company",
            fieldtype: "Link",
            options: "Company",
            insert_after: "full_name"
        });

        frm.add_field({
            fieldname: "franchise_company",
            label: "Franchise Company",
            fieldtype: "Link",
            options: "Company",
            insert_after: "company"
        });
    }
});
