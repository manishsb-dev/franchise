import frappe

@frappe.whitelist()
def get_item_group_parents(child_group):
    result = {
        "department": None,
        "collection": None,
        "main_group": None
    }

    if not child_group:
        frappe.logger().info(result)
        return result

    # Level 1 → Kurta
    parent_1 = frappe.db.get_value("Item Group", child_group, "parent_item_group")
    result["department"] = parent_1

    # Level 2 → Summer
    parent_2 = frappe.db.get_value("Item Group", parent_1, "parent_item_group") if parent_1 else None
    result["collection"] = parent_2

    # Level 3 → Womens Ethnic
    parent_3 = frappe.db.get_value("Item Group", parent_2, "parent_item_group") if parent_2 else None
    result["main_group"] = parent_3

    frappe.logger().info(f"Item Group Parents: {result}")
    return result


def set_custom_group_name(doc, method):
    if doc.item_group_name:
        doc.custom_group_name = doc.item_group_name



# # franchise_erp/franchise_erp/custom/item_group.py
# import frappe

# def allow_child_duplicates(doc, method):
#     """
#     Skip ERPNext duplicate check for Item Group children.
#     Only check duplicates for parent groups.
#     """
#     if doc.is_group == 0:
#         # child node: skip duplicate validation
#         return
#     else:
#         # parent node: ERPNext will automatically check duplicates
#         pass
