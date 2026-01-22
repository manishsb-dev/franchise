import frappe

#for 2 get 1 free item
def set_promo_group_id(doc, method=None):
    # Agar koi free item hi nahi hai → koi promo nahi
    has_free_item = any(item.is_free_item for item in doc.items)

    if not has_free_item:
        return

    for item in doc.items:
        # ✅ Sirf PAID items par checkbox set hoga
        if not item.is_free_item and item.rate > 0:
            item.custom_is_promo_scheme = 1   # CHECKBOX ✅


#for 2 buy 1 item discount like 20%

def set_percent_off_promo_flags(doc, method=None):
    discounted_items = []

    # Step 1: sirf ACTUAL discounted item pakdo
    for item in doc.items:
        if (
            item.price_list_rate
            and item.rate
            and item.rate < item.price_list_rate
        ):
            discounted_items.append(item)

    # Agar koi discounted item nahi → scheme nahi lagi
    if not discounted_items:
        return

    # Step 2: sab PAID items promo ka part
    for item in doc.items:
        if item.rate > 0:
            item.custom_is_promo_scheme = 1
            item.custom_promo_discount_percent = 0  # reset

    # Step 3: SIRF discounted item me % set
    for item in discounted_items:
        item.custom_promo_discount_percent = round(
            (1 - (item.rate / item.price_list_rate)) * 100,
            2
        )
