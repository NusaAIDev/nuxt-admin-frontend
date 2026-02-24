export type WorkspaceCustomerRole = "primary" | "operator";

export interface WorkspaceCustomerContact {
  id: string;
  organizationId: string;
  fullName: string;
  jobRole: string;
  email: string;
  address: string;
  internalNotes: string;
  roleType: WorkspaceCustomerRole;
  assigned: boolean;
  isActive: boolean;
}

type WorkspaceCustomerStore = Record<string, WorkspaceCustomerContact[]>;

export function useWorkspaceCustomers(organizationId: string) {
  const state = useState<WorkspaceCustomerStore>("workspace-customers", () => ({}));

  const list = computed<WorkspaceCustomerContact[]>(() => state.value[organizationId] || []);

  const initializeFromPrimary = (primary: {
    fullName: string;
    jobRole?: string;
    email?: string;
    address?: string;
    internalNotes?: string;
  }) => {
    if (state.value[organizationId]?.length) return;

    state.value[organizationId] = [
      {
        id: `primary_${organizationId}`,
        organizationId,
        fullName: primary.fullName || "Primary Contact",
        jobRole: primary.jobRole || "",
        email: primary.email || "",
        address: primary.address || "",
        internalNotes: primary.internalNotes || "",
        roleType: "primary",
        assigned: true,
        isActive: true,
      },
      {
        id: `operator_${organizationId}_1`,
        organizationId,
        fullName: "Support Admin 1",
        jobRole: "Customer Support",
        email: "support1@acme.com",
        address: "",
        internalNotes: "",
        roleType: "operator",
        assigned: true,
        isActive: true,
      },
    ];
  };

  const addContact = (payload: Omit<WorkspaceCustomerContact, "id" | "organizationId">) => {
    const contact: WorkspaceCustomerContact = {
      id: `cust_${Date.now()}`,
      organizationId,
      ...payload,
    };
    state.value[organizationId] = [...(state.value[organizationId] || []), contact];
    return contact;
  };

  const findById = (contactId: string) =>
    (state.value[organizationId] || []).find((item) => item.id === contactId) || null;

  const updateContact = (contactId: string, payload: Partial<WorkspaceCustomerContact>) => {
    state.value[organizationId] = (state.value[organizationId] || []).map((item) =>
      item.id === contactId ? { ...item, ...payload, id: item.id, organizationId: item.organizationId } : item,
    );
  };

  const toggleAssigned = (contactId: string) => {
    state.value[organizationId] = (state.value[organizationId] || []).map((item) => {
      if (item.id !== contactId || item.roleType !== "operator") return item;
      const assigned = !item.assigned;
      return { ...item, assigned, isActive: assigned };
    });
  };

  return {
    list,
    initializeFromPrimary,
    addContact,
    findById,
    updateContact,
    toggleAssigned,
  };
}
