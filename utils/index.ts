import {DonationInfo} from "@/types";

export function createDonationInfo(projectId: number): DonationInfo {
  return {
    address1: '',
    address2: '',
    amount: 0,
    city: '',
    company_name: '',
    country: '',
    email: '',
    first_name: '',
    has_tax_invoice: false,
    id: 0,
    is_anonymous: false,
    last_name: '',
    note: '',
    project_id: projectId,
    state: '',
    zip: '',
  }
}
