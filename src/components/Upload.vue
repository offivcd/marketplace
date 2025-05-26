<template>
  <div>
    <h1>Upload</h1>
    <input type="text" v-model="text" placeholder="Enter something">
    <button @click="uploadToIPFS()">Upload To IPFS</button>
    <p>{{ cid }}</p>
  </div>
</template>

<script>
import { NFTStorage, File } from 'nft.storage'

import { NFT_STORAGE_APIKEY } from '../config'

const client = new NFTStorage({ token: NFT_STORAGE_APIKEY })

export default {
  name: 'Upload',
  data: () => ({
    text: "",
    cid: ""
  }),
  methods: {
    async uploadToIPFS() {
      const prepareToUpload = new File(
      [JSON.stringify(
        {
          "Test": this.text
        },
        null,
        2
      )], 'metadata.json')

      const cid = await client.storeDirectory([prepareToUpload])
      console.log(cid)
      this.cid = cid;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
