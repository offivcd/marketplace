import Vue from 'vue'
import Vuex from 'vuex'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

import { CONTRACT_ADDRESS }  from '../config'
import WebsiteTemplateMarketplace from '../artifacts/contracts/WebsiteTemplateMarketplace.sol/WebsiteTemplateMarketplace.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    walletAddress: "",
    wtmContract: null,
  },
  getters: {
    walletAddress: state => state.walletAddress,
    wtmContract: state => state.wtmContract,
  },
  mutations: {
    setWalletAddress: (state, walletAddress) => (state.walletAddress = walletAddress),
    setContract: (state, wtmContract) => (state.wtmContract = wtmContract),
  },
  actions: {
    async connectToBlockchain({ commit }) {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);  
      console.log(provider);
  
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      commit('setWalletAddress', address);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, WebsiteTemplateMarketplace.abi, signer);
      commit('setContract', contract);
    }
  },
  modules: {
  }
})
