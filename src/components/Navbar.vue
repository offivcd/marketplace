<template>
  <v-app-bar
    app
    color="yellow"
    dark
    class="px-10"
  >
    <router-link :to="{ path: '/'}">
      <img
        class="logo"
        alt="Logo"
        src="../assets/logo.png"
      >
    </router-link>

    <router-link :to="{ path: '/'}" class="nav-link">
      Home
    </router-link>

    <v-spacer></v-spacer>

    <v-btn
      @click="connectToBlockchain()"
    >
      <span class="mr-2">{{ formatWalletAddress(walletAddress) }}</span>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: "Navbar",
  computed: mapGetters(['walletAddress']),
  methods: {
    ...mapActions(['connectToBlockchain']),
    formatWalletAddress(address) {
      if(address) return address.substring(0,8) + "..." + address.substring(34,42);
      else return "Connect Wallet"
    }
  }
}
</script>

<style>
  .logo {
    width: 150px;
    margin-top: .5rem;
    margin-right: 2rem;
  }
  .nav-link {
    text-decoration: none;
    font-size: 1.2rem;
    margin-left: 1rem;
    margin-right: 1rem;
    color: rgb(0, 0, 0) !important;
  }
  
  .nav-link:hover {
     color: rgb(77, 79, 81) !important;
  }
</style>