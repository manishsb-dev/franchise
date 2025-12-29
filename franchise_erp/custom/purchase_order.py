import frappe

def validate_purchase_order(doc, method):

    if doc.custom_agent_supplier and doc.custom_agent_supplier != doc.supplier:
        pass  # allowed

    if doc.custom_transporter and doc.custom_transporter != doc.supplier:
        pass  # allowed