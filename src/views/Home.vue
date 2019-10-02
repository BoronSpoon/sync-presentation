<template>
  <div>
  <v-container>

    <v-row no-gutters>
      <v-col align="center">
        SYNC Presentation Home
      </v-col>

      <v-col align="center">
      </v-col>

      <v-col align="center">
      </v-col>
    </v-row>
    
    <v-form ref="form" v-model="valid">
      <v-row no-gutters>
        join a session
      </v-row>
      <v-row no-gutters>
        <v-col align="center">
          <v-text-field
            v-model="tempPresentId"
            :rules="idRules"
            label="enter session id (6 letters)"
          ></v-text-field>
        </v-col>
        <v-col align="center">
          <v-btn
            type="submit"
            color="success"
            :disabled="!valid"
            @click="setPresentIdAction(tempPresentId).then(() => {})">
          Submit
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-row no-gutters>
      <v-col align="center">
      present your pdf
      </v-col>
      <v-col align="center">
        <v-btn
          type="submit"
          color="success"
          @click="getCurrentUser().then(() => {router.replace('/selecter')}).catch(() => {router.replace('/login')})">
        GO
        </v-btn>
      </v-col>
    </v-row>

    <v-row no-gutters class="primary">
      <v-col align="center">
        <v-card>
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
    valid: false,
    tempPresentId: 0,
    idRules: [
      v => !!v || 'id is required',
      v => v.length == 6 || 'id must be 6 characters',
    ],
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
