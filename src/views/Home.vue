<template>
  <div>
  <v-container>

    <v-row no-gutters>
      <v-col align="center">
      </v-col>

      <v-col align="center">
        <v-card tile>
          TITLE: {{ presentingPdfAttributes.title }}
        </v-card>
      </v-col>

      <v-col align="center">
        <v-btn to='/selecter'>
          present YOUR Pdf files
          <v-icon>picture_as_pdf</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    
    <v-row no-gutters>
      <v-col>
        <v-card tile align="center">
          <pdf 
            :src = presentingPdfAttributes.url
            :page = presentingPdfAttributes.currentPage
            style="display: inline-block; width: 80%"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row no-gutters class="primary">
      <v-col>
        <v-card tile align="center">
          {{ presentingPdfAttributes.currentPage }} / {{ presentingPdfAttributes.numPages }}
        </v-card>
      </v-col>
    </v-row>

  </v-container>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    pdf
  },
  created() {
    this.getPresentingData();
  },
  data: () => ({
  }),
  computed: {
    ...mapState([
      'presentingPdfAttributes',
    ]),
  },
  methods: {
    ...mapActions([
      'getPresentingData',
    ]),
  },
};
</script>
