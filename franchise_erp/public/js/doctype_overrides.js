(function () {
    const original_save = frappe.ui.form.Form.prototype.save;

    frappe.ui.form.Form.prototype.save = function (action, callback, btn) {
        const frm = this;

        // Call original save
        const result = original_save.call(this, action, callback, btn);

        // Only act on SUBMIT
        if (
            action === "Submit" &&
            frm.meta?.is_submittable
        ) {
            result?.then(() => {
                frappe.set_route("List", frm.doctype);
            });
        }

        return result;
    };
})();
