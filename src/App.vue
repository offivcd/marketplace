<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view/>
    </v-main>
    <p v-if="loading">Loading...</p>
  </v-app>
</template>

<script>
import LitJsSdk from 'lit-js-sdk'
import Navbar from "./components/Navbar.vue"

export default {
  name: 'App',
  components: {
    Navbar
  },
  data: () => ({
    loading: false
  }),
  async created() {
    this.loading = true
    const client = new LitJsSdk.LitNodeClient()
    await client.connect()
    console.log(client)
    window.litNodeClient = client
     this.loading = false

    document.addEventListener('lit-ready', function (e) {
      console.log('LIT network is ready')
    }, false)
  }
};
</script>
