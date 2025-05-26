<template>
   <v-container>
    <v-row>
      <v-col>
        <v-card class="mb-2">
          <v-card-text class="template-card font-weight-bold">
            <h2 class="mb-2">{{ ipfsData.title }}</h2>
            <p>{{ ipfsData.description }}</p>
            <p>Price: 1 MATIC</p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="template.isBrought"
              color="yellow"
              @click="downloadFile()"
            >
              Download Code
            </v-btn>
            <v-btn
              v-else
              color="yellow"
              @click="purchase()"
            >
              Purchase and Mint
            </v-btn>
          </v-card-actions>
          <p v-if="tx">tx: {{ tx }}</p>
        </v-card>
      </v-col>
        <v-col
      >
        <img src="https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHdlYnNpdGV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60" alt="Webiste" class="website-image">
      </v-col>
    </v-row>
   </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { saveAs } from "file-saver"
import LitJsSdk from 'lit-js-sdk'

import { dataURItoBlob } from '../helpers/convertMethods'

export default {
  name: "TemplateDetail",
  data: () => ({
    template: {},
    ipfsData: {},
    tx: ""
  }),
  computed: mapGetters(['wtmContract']),
  methods: {
    async purchase() {
      const transaction = await this.wtmContract.mintTemplate(this.$route.params.id)
      const tx = await transaction.wait()
      console.log(tx);
       this.tx = tx.transactionHash

      const template = await this.wtmContract.listOfTemplate(this.$route.params.id)
      this.template = template
    },
    async downloadFile() {
      try{
        const chain = 'mumbai'
        const authSig = await LitJsSdk.checkAndSignAuthMessage({chain})
        const accessControlConditions = [
          {
            contractAddress: '',
            standardContractType: '',
            chain: 'mumbai',
            method: 'eth_getBalance',
            parameters: [':userAddress', 'latest'],
            returnValueTest: {
              comparator: '>=',
              value: '0',  // 0 ETH, so anyone can open
            },
          },
        ];

        const toDecrypt = LitJsSdk.uint8arrayToString(new Uint8Array(this.ipfsData.encryptedSymmetricKey), 'base16')
        console.log("toDecrypt:", toDecrypt);

        const _symmetricKey = await window.litNodeClient.getEncryptionKey({
          accessControlConditions,
          toDecrypt,
          chain,
          authSig
        })

      console.warn("_symmetricKey:", _symmetricKey);

        const decryptedFile = await LitJsSdk.decryptFile({
          file: dataURItoBlob(this.ipfsData.encryptedFile),
          symmetricKey: _symmetricKey
        });

        console.warn("decryptedFile:", decryptedFile)

        const imageblob = new Blob([decryptedFile])
        console.warn(imageblob)

        saveAs(imageblob, "website.html");
      } catch(error) {
        console.log(error)
        this.loading = false
      }
    }
  },
  async created() {
    const template = await this.wtmContract.listOfTemplate(this.$route.params.id)
    this.template = template

    let data = await fetch(`https://${template.cid}.ipfs.nftstorage.link/metadata.json`)
    data = await data.json()
    console.log(data)
    
    this.ipfsData = data
    console.log(this.template)
  }
}
</script>

<style>
  .template-card {
    height: 250px;
  }
  .website-image {
    width: 100%;
    height: 300px;
  }
</style>