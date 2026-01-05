import frappe
from frappe.model.naming import make_autoname
from erpnext.selling.doctype.customer.customer import Customer

class CustomCustomer(Customer):
    def autoname(self):
        if not self.custom_company_abbrevation:
            frappe.throw("Company Abbreviation is required for Customer naming")

        self.name = make_autoname(f"{self.custom_company_abbrevation}-.#####")
