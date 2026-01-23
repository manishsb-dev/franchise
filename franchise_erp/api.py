import frappe

def round_to_nearest_9(rate):
    """
    Rule:
    - Agar last digit 9 hai → no change
    - Agar last digit <= 5 → pichla 9
    - Agar last digit > 5 → agla 9
    """

    if not rate:
        return rate

    rate = int(round(rate))
    last_digit = rate % 10

    # Already 9 hai, kuch change nahi
    if last_digit == 9:
        return rate

    # 5 ya kam → pichla 9
    if last_digit <= 5:
        return rate - last_digit - 1

    # 5 se zyada → agla 9
    return rate + (9 - last_digit)


def apply_rounding_on_doc(doc):
    """
    Ye function Sales documents ke items par rounding apply karega
    """
    for item in doc.items:
        old_rate = item.rate
        new_rate = round_to_nearest_9(item.rate)
        item.rate = new_rate

        frappe.logger().info(
            f"Pricing Round Utility | {item.item_code} : {old_rate} -> {new_rate}"
        )










def on_change(doc, method):


    apply_rounding_on_doc(doc)




import frappe

def apply_scheme_on_dn(doc, method):
   
    pass


import frappe

# def create_selling_price_from_po(doc, method):
#     SELLING_PRICE_LISTS = ["MRP", "RSP"]

#     for row in doc.items:
#         if not row.item_code or not row.rate:
#             continue

#         for price_list in SELLING_PRICE_LISTS:
#             item_price_name = frappe.db.get_value(
#                 "Item Price",
#                 {
#                     "item_code": row.item_code,
#                     "price_list": price_list
#                 },
#                 "name"
#             )

#             if item_price_name:
#                 # Update existing selling price
#                 frappe.db.set_value(
#                     "Item Price",
#                     item_price_name,
#                     {
#                         "price_list_rate": row.rate,
#                         "valid_from": doc.transaction_date
#                     }
#                 )
#             else:
#                 # Create new selling price
#                 frappe.get_doc({
#                     "doctype": "Item Price",
#                     "item_code": row.item_code,
#                     "price_list": price_list,
#                     "price_list_rate": row.rate,
#                     "valid_from": doc.transaction_date
#                 }).insert(ignore_permissions=True)






import frappe

def create_selling_price_from_po(doc, method):
    # Active Pricing Rule nikaalo
    pricing_rule = frappe.db.get_value(
        "Pricing Rule",
        {
            "disable": 0
        },
        ["name", "custom_mrp_will_taken_as"],
        as_dict=True
    )

    

    price_list_type = pricing_rule.custom_mrp_will_taken_as
    # price_list_type = "MRP" ya "RSP" aana chahiye


    for row in doc.items:
        if not row.item_code or not row.rate:
            continue

        # Check karo item price already hai ya nahi
        item_price_name = frappe.db.get_value(
            "Item Price",
            {
                "item_code": row.item_code,
                "price_list": price_list_type
            },
            "name"
        )

        if item_price_name:
            # Update existing
            frappe.db.set_value(
                "Item Price",
                item_price_name,
                {
                    "price_list_rate": row.rate,
                    "valid_from": doc.transaction_date
                }
            )
        else:
            # Create new
            frappe.get_doc({
                "doctype": "Item Price",
                "item_code": row.item_code,
                "price_list": price_list_type,
                "price_list_rate": row.rate,
                "valid_from": doc.transaction_date
            }).insert(ignore_permissions=True)
