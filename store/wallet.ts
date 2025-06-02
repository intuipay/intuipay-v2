import {create} from "zustand";

type Props = {
  wallets: Record<string, unknown>;
  setWallet: (walletId: string, wallet: unknown) => void;
}

const useWalletStore = create<Props>((set, get) => {
  function setWallet(walletId: string, wallet: unknown) {
    set((state) => ({
      wallets: {
        ...state.wallets,
        [walletId]: wallet,
      },
    }));
  }

  return {
    wallets: {

    },

    setWallet,
  };
});

export default useWalletStore;
