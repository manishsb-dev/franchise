import frappe

# @frappe.whitelist()
# def fetch_invoices(company, from_date, to_date):

#     invoices = frappe.db.sql("""
#         SELECT 
#             si.name,
#             si.posting_date,
#             si.customer,
#             si.grand_total,
#             sii.item_code,
#             sii.qty,
#             sii.rate,
#             sii.distributed_discount_amount,
#             sii.net_amount
#         FROM `tabSales Invoice` si
#         JOIN `tabSales Invoice Item` sii ON sii.parent = si.name
#         WHERE 
#             si.company = %s
#             AND si.posting_date BETWEEN %s AND %s
#             AND si.docstatus = 1
#         ORDER BY si.posting_date
#     """, (company, from_date, to_date), as_dict=True)

#     return {
#         "invoice_list": invoices,
#         "message": f"{len(invoices)} invoice items found."
#     }

@frappe.whitelist()
def fetch_invoices(company, from_date, to_date):

    invoices = frappe.db.sql("""
    SELECT 
        si.name,
        si.posting_date,
        si.customer,
        si.grand_total,
        si.additional_discount_percentage,
        sii.item_code,
        sii.qty,
        sii.rate,
        sii.distributed_discount_amount,
        sii.net_amount
    FROM `tabSales Invoice` si
    JOIN `tabSales Invoice Item` sii ON sii.parent = si.name
    WHERE 
        si.company = %s
        AND si.posting_date BETWEEN %s AND %s
        AND si.docstatus = 1
        AND si.additional_discount_percentage > 10
    ORDER BY si.posting_date
""", (company, from_date, to_date), as_dict=True)


    return {
        "invoice_list": invoices,
        "message": f"{len(invoices)} invoice items found with discount > 10%."
    }

# @frappe.whitelist()
# def create_debit_note(company, from_date, to_date):

#     # Get company abbreviation
#     company_abbr = frappe.db.get_value("Company", company, "abbr")

#     # Get Debit Note % from SIS Configuration
#     debit_note_percent = frappe.db.get_value(
#         "SIS Configuration",
#         {"company": company},
#         "debit_note_percent"
#     )

#     if not debit_note_percent:
#         frappe.throw(
#             f"Debit Note % not configured. Please set it in SIS Configuration for {company}."
#         )

#     # Get dynamic penalty expense account
#     penalty_account = frappe.db.get_value(
#         "Account",
#         {
#             "company": company,
#             "root_type": "Expense",
#             "name": ["like", f"SIS Penalty%{company_abbr}"]
#         },
#         "name"
#     )

#     if not penalty_account:
#         frappe.throw(
#             f"No Penalty Expense account found for {company}. "
#             f"Please create an account like 'SIS Penalty Exp - {company_abbr}'"
#         )

#     # Fetch invoices
#     invoices = frappe.db.sql("""
#         SELECT 
#             si.name AS invoice,
#             sii.net_amount,
#             sii.discount_percentage
#         FROM `tabSales Invoice` si
#         JOIN `tabSales Invoice Item` sii ON sii.parent = si.name
#         WHERE 
#             si.company = %s
#             AND si.posting_date BETWEEN %s AND %s
#             AND si.docstatus = 1
#     """, (company, from_date, to_date), as_dict=True)

#     if not invoices:
#         return {"message": "No invoices found in the selected range."}

#     # Create Journal Entry
#     je = frappe.new_doc("Journal Entry")
#     je.posting_date = frappe.utils.today()
#     je.company = company
#     je.voucher_type = "Credit Note"

#     total_penalty = 0

#     # Add each invoice credit line
#     for inv in invoices:
#         penalty_amount = (inv.net_amount * float(debit_note_percent)) / 100
#         total_penalty += penalty_amount

#         je.append("accounts", {
#             "account": penalty_account,
#             "credit_in_account_currency": penalty_amount,
#             "custom_penalty_invoice": inv.invoice
#         })

#     # Add balancing Debit line
#     je.append("accounts", {
#         "account": penalty_account,
#         "debit_in_account_currency": total_penalty,
#         "custom_penalty_invoice": "Penalty Summary"
#     })

#     je.insert(ignore_permissions=True)
#     # je.submit()     # Enable if you want auto submit

#     return {
#         "message": f"Journal Entry Created Successfully: {je.name}",
#         "journal_entry": je.name
#     }

@frappe.whitelist()
def create_debit_note(company, from_date, to_date):

    # -------------------------------
    # 1️⃣ Get Company Abbreviation
    # -------------------------------
    company_abbr = frappe.db.get_value("Company", company, "abbr")

    # -------------------------------
    # 2️⃣ Read Dynamic Credit Note % from SIS Configuration
    # -------------------------------
    auto_credit_note_percent = frappe.db.get_value(
        "SIS Configuration",
        {"company": company},
        "auto_credit_note_percent"
    )

    if not auto_credit_note_percent:
        frappe.throw("Please set Auto Credit Note Percent in SIS Configuration.")

    # -------------------------------
    # 3️⃣ Get Dynamic Penalty Expense Account
    # Example: SIS Penalty Exp - F1
    # -------------------------------
    penalty_account = frappe.db.get_value(
        "Account",
        {
            "company": company,
            "root_type": "Expense",
            "name": ["like", f"SIS Penalty%{company_abbr}"]
        },
        "name"
    )

    if not penalty_account:
        frappe.throw(
            f"No Penalty Expense account found for {company}. "
            f"Please create an account like 'SIS Penalty Exp - {company_abbr}'."
        )

    # -------------------------------
    # 4️⃣ Fetch invoices where discount > allowed %
    # Using additional_discount_percentage from Sales Invoice
    # -------------------------------
    invoices = frappe.db.sql("""
        SELECT 
            si.name AS invoice,
            si.additional_discount_percentage,
            si.total AS invoice_amount
        FROM `tabSales Invoice` si
        WHERE 
            si.company = %s
            AND si.posting_date BETWEEN %s AND %s
            AND si.docstatus = 1
            AND si.additional_discount_percentage > %s
    """, (company, from_date, to_date, auto_credit_note_percent), as_dict=True)

    if not invoices:
        return {
            "message": f"No invoices found with discount > {auto_credit_note_percent}%."
        }

    # -------------------------------
    # 5️⃣ Create Journal Entry
    # -------------------------------
    je = frappe.new_doc("Journal Entry")
    je.posting_date = frappe.utils.today()
    je.company = company
    je.voucher_type = "Credit Note"

    total_penalty = 0

    # -------------------------------
    # 6️⃣ Add rows for each penalty
    # -------------------------------
    for inv in invoices:
        penalty_amount = (inv.invoice_amount * auto_credit_note_percent) / 100
        total_penalty += penalty_amount

        je.append("accounts", {
            "account": penalty_account,
            "credit_in_account_currency": penalty_amount,
            "custom_penalty_invoice": inv.invoice
        })

    # -------------------------------
    # 7️⃣ Add balancing DEBIT row
    # -------------------------------
    je.append("accounts", {
        "account": penalty_account,
        "debit_in_account_currency": total_penalty,
        "custom_penalty_invoice": "Penalty Summary"
    })

    # -------------------------------
    # 8️⃣ Save Journal Entry
    # -------------------------------
    je.insert(ignore_permissions=True)
    # je.submit()   # Enable when ready

    return {
        "message": f"Journal Entry Created Successfully: {je.name}",
        "journal_entry": je.name
    }
