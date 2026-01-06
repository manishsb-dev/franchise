frappe.treeview_settings['Item Group'] = {

    method: "franchise_erp.custom.item_group.get_item_group_tree",

    get_label: function (node) {
        // console.log("Node:", node);

        // 🔥 If parent_label is null or undefined → show "All Item Groups"
        const parent_label = node.parent_label || null;

        if (!parent_label) {
            return `<b class="tree-label">All Item Groups</b>`;
        }

        // 🔹 CHILD NODES
        const title = node.data?.title || node.label || "Unnamed Group";
        return `<b>${title}</b>`;
    },

    on_click: function (node) {
        frappe.set_route("Form", "Item Group", node.name);
    },

    expand: true
};

// (function () {
//     frappe.after_ajax(() => {

//         if (!frappe.views || !frappe.views.TreeView) return;
//         if (frappe.views.TreeView.prototype._item_group_addnode) return;
//         frappe.views.TreeView.prototype._item_group_addnode = true;

//         const original = frappe.views.TreeView.prototype.add_node;

//         frappe.views.TreeView.prototype.add_node = function (parent) {
//             if (this.doctype !== "Item Group") {
//                 return original.call(this, parent);
//             }

//             const me = this;

//             const node =
//                 parent ||
//                 me.current_node ||
//                 me.selected_node;

//             const parent_name = node?.data?.value || node?.name;

//             if (!parent_name) {
//                 frappe.msgprint(__("Please select a parent Item Group first"));
//                 return;
//             }

//             const d = new frappe.ui.Dialog({
//                 title: __("New Item Group"),
//                 fields: [
//                     {
//                         fieldtype: "Data",
//                         fieldname: "item_group_name",
//                         label: "Item Group Name",
//                         reqd: 1
//                     },
//                     {
//                         fieldtype: "Check",
//                         fieldname: "custom_is_silhouette",
//                         label: "Is Silhouette"
//                     }
//                 ],
//                 primary_action(values) {
//                     frappe.call({
//                         method: "frappe.client.insert",
//                         args: {
//                             doc: {
//                                 doctype: "Item Group",
//                                 item_group_name: values.item_group_name,
//                                 parent_item_group: parent_name,
//                                 is_group: 1
//                             }
//                         },
//                         callback() {
//                             d.hide();
//                             me.refresh();
//                         }
//                     });
//                 }
//             });

//             d.show();
//         };
//     });
// })();