import frappe

def execute():
    # Add 'company' field
    if not frappe.db.exists('Custom Field', 'User-company'):
        frappe.get_doc({
            'doctype': 'Custom Field',
            'dt': 'User',
            'fieldname': 'company',
            'label': 'Company',
            'fieldtype': 'Link',
            'options': 'Company',
            'insert_after': 'full_name',
            'no_copy': 0,
            'permlevel': 0
        }).insert(ignore_permissions=True)

    # Add 'franchise_company' field
    if not frappe.db.exists('Custom Field', 'User-franchise_company'):
        frappe.get_doc({
            'doctype': 'Custom Field',
            'dt': 'User',
            'fieldname': 'franchise_company',
            'label': 'Franchise Company',
            'fieldtype': 'Link',
            'options': 'Company',
            'insert_after': 'company',
            'no_copy': 0,
            'permlevel': 0
        }).insert(ignore_permissions=True)
