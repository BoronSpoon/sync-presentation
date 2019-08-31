<template>
  <div>
  <v-container>

    <v-row no-gutters>
      <v-col align="center">
        <v-card tile>
          TITLE: {{ presentingPdfAttributes.title }}
        </v-card>
      </v-col>
    </v-row>
    
    <v-row no-gutters>
      <v-col>
        <v-card tile center>

        </v-card>
      </v-col>
    </v-row>

    <v-row no-gutters class="primary">
      <v-col align="right">
        <v-card tile>
          <v-btn>
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
          <v-btn>
            <v-icon>keyboard_arrow_right</v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  created() {
    this.getAllPdfsForUser();
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
    ]),
  },
};
</script>
