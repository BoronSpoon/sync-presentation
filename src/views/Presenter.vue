<template>
  <div>
  <v-container>

    <v-row no-gutters>
      <v-col align="center">
        <v-btn to='/'>
          exit
          <v-icon>exit_to_app</v-icon>
        </v-btn>
      </v-col>

      <v-col align="center">
        <v-card tile>
          TITLE: {{ presentingPdfAttributes.title }}
        </v-card>
      </v-col>

      <v-col align="center">
      </v-col>
    </v-row>
    
    <v-row no-gutters>
      <v-col>
        <v-card tile align="center">
          <pdf 
            :src = presentingPdfAttributes.url
            :page = presentingPdfAttributes.currentPage
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row no-gutters class="primary">
      <v-col align="right">
        <v-card tile>
          <v-btn @click.stop="incrementPage(-1)">
            <v-icon>keyboard_arrow_left</v-icon>
          </v-btn>
        </v-card>
      </v-col>

      <v-col>
        <v-card tile align="center">
          {{ presentingPdfAttributes.currentPage }} / {{ presentingPdfAttributes.numPages }}
        </v-card>
      </v-col>

      <v-col align="left">
        <v-card tile>
          <v-btn @click.stop="incrementPage(1)">
            <v-icon>keyboard_arrow_right</v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
  </div>
</template>

<script>
import pdf from 'pdfvuer'
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
      'bufferedPdf',
    ]),
  },
  methods: {
    ...mapActions([
      'getAllPdfsForUser',
      'getPresentingData',
      'getPresentingTimestamp',
      'incrementPage',
    ]),
  },
};
</script>
