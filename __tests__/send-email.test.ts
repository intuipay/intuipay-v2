import { describe, it, expect } from "vitest";
import { getDonationProps } from '@/lib/send-email';
import { ProjectInfo } from "@/types";

describe('Test Send Email', () => {
    describe('sendDonationEmail', () => {
        it('should construct send donation email props', () => {
            const projectDetail: ProjectInfo = {
                accepts: '1',
                backers: '7',
                banner: 'https://assets.intuipay.xyz/projects/images/1751303115029-1.webp.webp',
                banners: '["https://assets.intuipay.xyz/intuipay-demo.webp"]',
                campaign: 'This is an awesome project.\'<--! separator -->\'No risk this time!',
                category: '1',
                email: '',
                end_at: '2025-10-01 00:00:00',
                github: '',
                id: '120002',
                location: 'China',
                org_contact: 'China',
                org_description: 'Intuipay is great.',
                org_email: '',
                org_location: 'China mainland',
                org_logo: 'https://intuipay.xyz/images/logo.svg',
                org_name: 'Intuipay',
                org_networks: '["ethereum-sepolia", "solana-devnet", "pharos-testnet"]',
                org_slug: 'intuipay',
                org_social_links: '{}',
                org_title: '',
                org_tokens: '{"ethereum-sepolia": ["eth", "usdc"], "pharos-testnet": ["phrs", "usdc"], "solana-devnet": ["sol", "usdc"]}',
                org_type: '1',
                org_wallets: '{"ethereum-sepolia": "0xE62868F9Ae622aa11aff94DB30091B9De20AEf86", "pharos-testnet": "0xfFe4b50BC2885e4708544477B6EeD4B32e4d82BF", "solana-devnet": "Ft7m7qrY3spLNKo6aMAHMArAT3oLSSy4DnJ3y3SF1DP1"}',
                org_website: 'https://intuipay.xyz/',
                project_name: 'Intuipay 2nd demo',
                project_subtitle: 'Another great project',
                rewards: '[{"address": null, "amount": 1, "count": null, "description": "Everyone will get this", "destinations": null, "id": 1, "image": "https://assets.intuipay.xyz/dr-zaiton-sameon.webp", "month": null, "number": 0, "ship_method": 3, "title": "One time reward", "year": null}, {"address": "Guangzhou, China", "amount": 2, "count": null, "description": "Tier 1 with time limit", "destinations": null, "id": 2, "image": "https://assets.intuipay.xyz/dr-noraini-binti-syed.webp", "month": 8, "number": 100, "ship_method": 2, "title": "Tier 1", "year": 2025}, {"address": null, "amount": 3, "count": null, "description": "Tier 2 without time limit", "destinations": [{"cost": 100, "country": "China"}], "id": 3, "image": "https://assets.intuipay.xyz/sarah-chen-wei-lin.webp", "month": null, "number": 20, "ship_method": 1, "title": "Tier 2", "year": null}]',
                social_links: '{"discord": "", "facebook": "", "github": "", "instagram": "", "linkedin": "", "reddit": "", "telegram": "", "twitter": "", "website": "https://intuipay.xyz", "youtube": ""}',
                status: '10',
                tags: '["intuipay"]',
                website: '',
                amount: 40300,
                goal_amount: 10000000,
                type: 101,
                project_slug: 'intuipay-2nd-demo',
                campaign_id: undefined,
                networks: ['ethereum-sepolia'],
                tokens: { 'ethereum- sepolia': ['usdc'] },
                wallets: {
                    'ethereum-sepolia': '0xbDE5c24B7c8551f93B95a8f27C6d926B3bCcF5aD'
                }
            };

            // 测试捐款 1 USDC
            const donationInfo = { id: 1560001, "address1": "beijing", "address2": "haidian", "dollar": 1, "city": "beijing", "company_name": "", "country": "China", "currency": "usdc", "email": "joey.xf@gmail.com", "first_name": "joey", "has_tax_invoice": 0, "is_anonymous": 0, "last_name": "xie", "network": "ethereum-sepolia", "note": "keep the greate work", "project_id": "120002", "state": "Beijing", "wallet": "metamask", "zip": "100001", "amount": "1000000", "account": "", "method": 1, "status": 3, "tx_hash": "0x6fcc7abe58c6323e4e05f403fc2cbc837f5909aede2c1bae18bbe5aca18cbc25", "wallet_address": "0x7e727520B29773e7F23a8665649197aAf064CeF1", "project_slug": "intuipay-2nd-demo", "reward_id": "1" };

            const donateProps = getDonationProps(projectDetail, donationInfo);

            // console.log('donate props', donateProps);

            expect(donateProps).toEqual({
                to: 'joey.xf@gmail.com',
                amount: '1000000',
                creator: 'Intuipay',
                currency: 'usdc',
                deliveryMethod: 'Digital delivery',
                deliveryTime: 'To be determined',
                reward: 'reward name',
                dollar: 1,
                endAt: '2025-10-01 00:00:00',
                from: 'Intuipay',
                id: 1560001,
                index: 1560001,
                projectName: 'Intuipay 2nd demo',
                status: 'successful',
                txHash: '0x6fcc7abe58c6323e4e05f403fc2cbc837f5909aede2c1bae18bbe5aca18cbc25'
            });
        });
    })
});
