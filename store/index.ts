import { create } from 'zustand';
import { PaymentMethods, PaymentMethodsOther} from "@/data";
import {PaymentMethod, TransferRate} from "@/types";

type Props = {
  amount: number;
  isLoading: boolean;
  source: string;
  target: string;
  paymentMethodList: PaymentMethod[];
  paymentMethodOtherList: PaymentMethod[];
  transferRate: TransferRate;
  // 添加 wagmi 状态
  isWagmiReady: boolean;

  updateAllMethods: (source: string, target: string, amt: number) => Promise<void>;
  // 添加设置 wagmi 状态的方法
  setWagmiReady: (ready: boolean) => void;
}

const useStore = create<Props>((set, get) => {
  async function fetchAmount(source: string, target: string, amt: number) {
    let currencies = ''
    if (source === target) {
      if (source === 'USD') {
        currencies = ''
      } else {
        currencies = 'USD'
      }
    } else {
      currencies = `USD,${target}`
    }
    console.log(currencies)
    if (currencies === '') {
      set({
        amount: amt,
        source,
        target,
        transferRate: {
          value: amt,
          usd: amt,
          rate: 1,
          usdRate: 1,
          usdTargetRate: 1,
        }
      });
      return;
    } else {
      set({ isLoading: true });
      const params = new URLSearchParams({ target, source });
      const response = await fetch(`/api/waitlist?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        if (target === source) {
          set({
            amount: amt,
            isLoading: false,
            source,
            target,
            transferRate: {
              value: amt,
              usd: (data.quotes[`${source}USD`] * amt),
              rate: 1,
              usdRate: data.quotes[`${source}USD`],
              usdTargetRate: data.quotes[`${source}USD`],
            },
          });
        } else {
          set({
            amount: amt,
            isLoading: false,
            source,
            target,
            transferRate: {
              value: (data.quotes[`${source}${target}`] * amt), // 目标货币金额
              usd: source === 'USD' ? amt : (data.quotes[`${source}USD`] * amt), // 美元金额
              rate: data.quotes[`${source}${target}`], // 目标货币对汇款货币汇率
              usdRate: source === 'USD' ? 1 : data.quotes[`${source}USD`], // 目标货币对美元汇率
              usdTargetRate: source === 'USD' ? data.quotes[`${source}${target}`] : (data.quotes[`${source}${target}`] / data.quotes[`${source}USD`]) // 汇款货币对美元汇率
            },
          });
        }
      }
    }
  }
  function getAmountRange(item: PaymentMethod, transferRate: TransferRate) {
    const {
      processingFee = [],
      fxMarkupRate = [],
      additionalFee = [],
    } = item;
    const fees = [ processingFee, fxMarkupRate, additionalFee];
    const minRate = fees.reduce((acc, item) => {
      return !item.length || item[2] ? acc : (acc + item[0]);
    }, 0);
    const maxRate = fees.reduce((acc, item) => {
      return !item.length || item[2] ? acc : (acc + item[1]);
    }, 0);
    const minAdd = fees.reduce((acc, item) => {
      return !item.length || !item[2] ? acc : (acc + item[0]) * transferRate.usdRate;
    }, 0);
    const maxAdd = fees.reduce((acc, item) => {
      return !item.length || !item[2] ? acc : (acc + item[1]) * transferRate.usdRate;
    }, 0);
    const minFee = transferRate.value + transferRate.value * minRate / 100 + minAdd;
    const maxFee = transferRate.value + transferRate.value * maxRate / 100 + maxAdd;
    return [minFee, maxFee];
  }
  async function updateAllMethods(to: string, from: string, amt: number) {
    await fetchAmount(to, from, amt);
    const { transferRate } = get();
    const paymentMethodList = PaymentMethods.map(item => {
      const range = getAmountRange(item, transferRate);
      return {
        ...item,
        symbol: from,
        amountRange: range,
      };
    });
    const baseRange = paymentMethodList[0].amountRange;
    const paymentMethodOtherList = PaymentMethodsOther
      .filter(item => !item.currency || item.currency.includes(from))
      .map(item => {
        const range = getAmountRange(item, transferRate);
        return {
          ...item,
          symbol: from,
          amountRange: range,
          diffAmountRange: [range[0] - baseRange[0], range[1] - baseRange[1]],
        };
      }).sort((a, b) => {
        const diff0 = a.amountRange[0] - b.amountRange[0];
        return diff0 ? diff0 : a.amountRange[1] - b.amountRange[1];
      });
    set({
      paymentMethodList,
      paymentMethodOtherList,
    });
  }

  return {
    amount: 0,
    isLoading: false,
    source: '',
    target: '',
    paymentMethodList: [],
    paymentMethodOtherList: [],
    transferRate: {
      value: 0,
      usd: 0,
      rate: 1,
      usdRate: 1,
      usdTargetRate: 1,
    },
    isWagmiReady: false, // 初始化 wagmi 状态

    updateAllMethods,
    // 添加设置 wagmi 状态的方法
    setWagmiReady: (ready: boolean) => set({ isWagmiReady: ready }),
  };
});

export default useStore;
