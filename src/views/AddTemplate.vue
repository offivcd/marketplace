<template>
  <v-container>
    <v-card
      class="mx-auto my-5 pt-3"
      elevation="2"
      max-width="600"
    >
      <v-card-text>
        <h1>Add Your Website Template</h1>
        
        <form class="mt-4">
          <v-text-field
            v-model="title"
            label="Title"
            outlined
            dense
            clearable
          ></v-text-field>

          <v-textarea
            solo
            class="mb-0"
            rows="3"
            label="Description"
            v-model="description"
          ></v-textarea>

          <label for="code"><strong>Upload your Code</strong></label>
          <br>
          <input
            id="code"
            class="mb-4"
            type="file"
            label="Upload Image"
            outlined
            dense
            prepend-icon="mdi-camera"
            @change="previewFiles">

          <v-btn
            v-if="!loading"
            class="mb-4"
            @click="uploadToIPFS()"
            block
            color="yellow"
            :disabled=isDisabled
          >
            Create
          </v-btn>

          <div class="text-center" v-else>
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>

          <p v-if="cid">ipfs://{{ cid }}</p>
          <p v-if="tx">tx: {{ tx }}</p>
        </form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { NFTStorage, File } from 'nft.storage'
import { mapGetters } from 'vuex'
import LitJsSdk from 'lit-js-sdk'

import { NFT_STORAGE_APIKEY } from '../config'
import { blobToDataURI } from '../helpers/convertMethods'

const client = new NFTStorage({ token: NFT_STORAGE_APIKEY })

export default {
  name: "AddTemplate",
  data: () => ({
    loading: false,
    title: "",
    description: "",
    file: null,
    cid: "",
    tx: ""
  }),
  computed: {
    ...mapGetters(['wtmContract']),
    isDisabled() {
      return !this.title || !this.description || !this.wtmContract
    },
  },
  methods: {
    previewFiles(event) {
      this.file = event.target.files
    },
    async uploadToIPFS() {
      try{
        const count = await this.wtmContract.templateIds();
        console.log(count.toString());
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

        const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({ file: this.file[0] })
        console.warn("symmetricKey:", symmetricKey)

        const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
          accessControlConditions,
          symmetricKey,
          authSig,
          chain
        });

        console.warn("encryptedSymmetricKey:", encryptedSymmetricKey)
        console.warn("encryptedFile:", encryptedFile)

        const toDecrypt = LitJsSdk.uint8arrayToString(encryptedSymmetricKey, 'base16')
        console.log("toDecrypt:", toDecrypt);

        const _symmetricKey = await window.litNodeClient.getEncryptionKey({
          accessControlConditions,
          toDecrypt,
          chain,
          authSig
        })

        console.warn("_symmetricKey:", _symmetricKey)

        const prepareToUpload = new File(
        [JSON.stringify(
          {
            title: this.title,
            description: this.description,
            encryptedSymmetricKey: Array.from(encryptedSymmetricKey),
            encryptedFile: await blobToDataURI(encryptedFile)
          },
          null,
          2
        )], 'metadata.json')

        const cid = await client.storeDirectory([prepareToUpload])
        console.log(cid)
        this.cid = cid;

        const transaction = await this.wtmContract.createTemplate(cid)
        const tx = await transaction.wait()
        console.log(tx)
        this.tx = tx.transactionHash
      } catch(error) {
        console.log(error)
        this.loading = false
      }
    }
  }
}
</script>

<style>
  .flexRow {
    display: flex !important;
  }

  .v-input--selection-controls {
    margin-top: 5px;
    margin-left: 7px;
  }
</style>