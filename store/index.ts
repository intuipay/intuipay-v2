import { create } from 'zustand';
import {CurrencyList, PaymentMethods, PaymentMethodsOther} from "@/data";
import {PaymentMethod, TransferRate} from "@/types";

type Props = {
  amount: number;
  isLoading: boolean;
  source: string;
  target: string;
  paymentMethodList: PaymentMethod[];
  paymentMethodOtherList: PaymentMethod[];
  transferRate: TransferRate;

  updateAllMethods: (source: string, target: string, amt: number) => Promise<void>;
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
      const response = await fetch(`https://apilayer.net/api/live?access_key=c00b1d196651f1245a3e4410df9863db&currencies=USD,${target}&source=${source}`);
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
        }
        else {
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
  async function updateAllMethods(to: string, from: string, amt: number) {
    await fetchAmount(to, from, amt);
    const { transferRate } = get();
    const anotherSymbol = CurrencyList.find(item => item.code === from)?.anotherSymbol;
    const paymentMethodList = PaymentMethods.map(item => {
      item = {...item};
      if (item.fee === 0) {
        item.amount = transferRate.value * (1 + (+item.fee))
        item.symbol = anotherSymbol;
      } else {
        item.amount = (transferRate.value * (1 + (+item.fee)));
        item.symbol = anotherSymbol;
      }
      return item;
    });
    const paymentMethodOtherList = PaymentMethodsOther.map(item => {
      item = {...item};
      item.amount = (transferRate.value * (1 + (+item.fee))) + ((item.extra_fee || 0) * transferRate.usdTargetRate);
      item.symbol = anotherSymbol;
      return item;
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

    updateAllMethods,
  }
});

export default useStore;
