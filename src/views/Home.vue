<template>
  <div>
  <v-container>

    <v-row no-gutters>
      <v-col align="center">
      </v-col>

      <v-col align="center">
        SYNC Presentation Home
      </v-col>

      <v-col align="center">
      </v-col>
    </v-row>
    
    <v-row no-gutters>
      <v-col>
      </v-col>
    </v-row>

    <v-row no-gutters class="primary">
      <v-col>
        <v-card tile align="center">
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
      'id',
    ]),
  },
  methods: {
    ...mapActions([
      'getPresentingData',
      'getCurrentUser',
    ]),
  },
};
</script>
