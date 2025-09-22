import { create } from 'zustand';

const useUserStore = create((set) => ({
    loggedInUser: null,
    setLoggedInUser: (userData) => set({ loggedInUser: userData }),
    clearLoggedInUser: () => set({ loggedInUser: null }),
}));

export default useUserStore;
