import frappe
from frappe.utils import flt

def create_subcontracting_bom(doc, method=None):
    # 1. Validate service item
    if not doc.custom_service_item:
        return

    # 2. Prevent duplicate Subcontracted BOM
    if frappe.db.exists(
        "Subcontracting BOM",
        {"finished_good_bom": doc.name}
    ):
        return

    # 🔹 Get Finished Good UOM
    finished_good_uom = frappe.db.get_value(
        "Item",
        doc.item,
        "stock_uom"
    )

    # 🔹 Get Service Item UOM
    service_item_uom = frappe.db.get_value(
        "Item",
        doc.custom_service_item,
        "stock_uom"
    )

    # 3. Create Subcontracted BOM
    sc_bom = frappe.new_doc("Subcontracting BOM")
    sc_bom.finished_good = doc.item
    sc_bom.finished_good_bom = doc.name
    sc_bom.finished_good_uom = finished_good_uom
    sc_bom.finished_good_qty = doc.quantity
    sc_bom.service_item = doc.custom_service_item
    sc_bom.service_item_qty = 1
    sc_bom.service_item_uom = service_item_uom

    # 5. Save & Submit
    sc_bom.flags.ignore_permissions = True
    sc_bom.insert()