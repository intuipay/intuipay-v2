import {DonationInfo} from "@/types";

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function createDonationInfo(projectId: number): DonationInfo {
  return {
    address1: '',
    address2: '',
    amount: '',
    dollar: null,
    city: '',
    company_name: '',
    country: '',
    currency: '',
    email: '',
    first_name: '',
    has_tax_invoice: false,
    id: 0,
    is_anonymous: false,
    last_name: '',
    network: '',
    note: '',
    project_id: projectId,
    state: '',
    wallet: '',
    zip: '',
    
    // 奖励相关字段初始值
    selected_reward: null,
    has_selected_reward: false,
    pledge_without_reward: false,
  }
}
