import frappe
from frappe.utils import cint

def create_po_serials(doc, method):
    for item in doc.items:

        # Skip if already generated
        if item.serial_and_batch_bundle:
            continue

        # Only if item needs serial
        has_serial = frappe.db.get_value(
            "Item", item.item_code, "has_serial_no"
        )

        if not has_serial:
            continue

        qty = cint(item.qty)
        if qty <= 0:
            continue

        serial_nos = []

        # -------------------------
        # Create Serial Numbers
        # -------------------------
        for i in range(qty):
            sn = frappe.new_doc("Serial No")
            sn.item_code = item.item_code
            sn.company = doc.company
            sn.warehouse = item.warehouse
            sn.reference_doctype = "Purchase Order"
            sn.reference_name = doc.name
            sn.insert(ignore_permissions=True)
            serial_nos.append(sn.name)

        # -------------------------
        # Create Serial & Batch Bundle
        # -------------------------
        bundle = frappe.new_doc("Serial and Batch Bundle")
        bundle.company = doc.company
        bundle.item_code = item.item_code
        bundle.voucher_type = "Purchase Order"
        bundle.voucher_no = doc.name
        bundle.is_inward = 1

        for sn in serial_nos:
            bundle.append("entries", {
                "serial_no": sn,
                "qty": 1
            })

        bundle.insert(ignore_permissions=True)
        bundle.submit()

        # -------------------------
        # Link bundle to PO item
        # -------------------------
        frappe.db.set_value(
            "Purchase Order Item",
            item.name,
            "serial_and_batch_bundle",
            bundle.name
        )
