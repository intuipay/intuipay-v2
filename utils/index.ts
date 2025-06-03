import {DonationInfo} from "@/types";

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function createDonationInfo(projectId: number): DonationInfo {
  return {
    address1: '',
    address2: '',
    amount: 1,
    city: '',
    company_name: '',
    country: '',
    currency: 'usdc',
    email: '',
    first_name: '',
    has_tax_invoice: false,
    id: 0,
    is_anonymous: false,
    last_name: '',
    network: 'ethereum',
    note: '',
    project_id: projectId,
    state: '',
    wallet: '',
    zip: '',
  }
}
