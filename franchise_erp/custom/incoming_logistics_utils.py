from datetime import datetime
import frappe


def get_financial_year_suffix():
    today = datetime.today()
    year = today.year
    month = today.month

    if month >= 4:
        return f"{str(year)[-2:]}-{str(year+1)[-2:]}"
    else:
        return f"{str(year-1)[-2:]}-{str(year)[-2:]}"


def generate_il_series():
    fy = get_financial_year_suffix()
    prefix = "TPL-IL-"

    last = frappe.db.sql(
        """
        SELECT name FROM `tabIncoming Logistics`
        WHERE name LIKE %s
        ORDER BY creation DESC
        LIMIT 1
        """,
        (f"{prefix}%-{fy}",),
        as_dict=True
    )

    new_no = int(last[0].name.split("-")[2]) + 1 if last else 1
    return f"{prefix}{str(new_no).zfill(5)}-{fy}"
