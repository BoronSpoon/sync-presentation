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
        join a session
        <v-form
          ref="form"
          v-model="valid"
          :lazy-validation="lazy"
        >
          <v-text-field
            v-model="tempPresentId"
            :counter="10"
            :rules="nameRules"
            label="Name"
            @click="setPresentIdAction.then(() => {})"
          ></v-text-field>
        </v-form>
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
  },
  data: () => ({
    tempPresentId
  }),
  computed: {
    ...mapState([
      'presentingPdfAttributes',
    ]),
  },
  methods: {
    ...mapActions([
      'getCurrentUser',
      'setPresentIdAction',
    ]),
  },
};
</script>
