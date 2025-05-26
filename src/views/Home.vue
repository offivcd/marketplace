<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-4">
      <h1>List of Website Templates</h1>
      <v-btn
        class="mb-3 float-left"
        color="orange"
        elevation="2"
        @click="goToFormPage()"
      >
        Add Template
      </v-btn>
    </div>
    
    <v-row >
      <v-col
        sm="12"
        md="4"
        v-bind:key="template.tokenId" v-for="template of templates"
      >
        <v-card
          class="pa-2"
          outlined
          tile
        >
          <v-img
            height="250"
            src="https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHdlYnNpdGV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
          ></v-img>
          <h2>Template {{ template.tokenId }}</h2>
          <v-card-actions>
            <v-btn
              color="yellow"
              block
              @click="goToDetailpage(template.tokenId)"
            >
              View
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  data: () => ({
    templates: [],
  }),
  computed: mapGetters(['wtmContract']),
  methods: {
    goToFormPage() {
      this.$router.push('/add-template')
    },
    goToDetailpage(id) {
      this.$router.push('/template/' + id);
    }
  },
  watch: {
    wtmContract: async function () {
      let count = await this.wtmContract.templateIds()
      count = count.toString()

      let _templates = []
      for(let i = 0; i < +count; i++){
          const templates = await this.wtmContract.listOfTemplate(i + 1)
          _templates.push(templates)
      }
      this.templates = _templates
      console.log(this.templates)
    }
  },
  async created() {
     let count = await this.wtmContract.templateIds()
      count = count.toString()

      let _templates = []
      for(let i = 0; i < +count; i++){
          const templates = await this.wtmContract.listOfTemplate(i + 1)
          _templates.push(templates)
      }
      this.templates = _templates
      console.log(this.templates)
  }
}
</script>
