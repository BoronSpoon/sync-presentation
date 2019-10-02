<template>
  <div>
  <v-container>

    <v-row no-gutters>
      <v-col align="left" class="display-1 font-weight-black">
        SYNC Presentation Home
      </v-col>
    </v-row>

    <v-divider/>
    
    <v-form ref="form" v-model="valid">
      <v-row no-gutters  class="title">
        join a session
      </v-row>
      <v-row no-gutters>
        <v-col align="right">
          <v-text-field
            v-model="tempPresentId"
            :rules="idRules"
            label="enter session id (6 letters)"
          ></v-text-field>
        </v-col>
        <v-col align="left">
          <v-btn
            type="submit"
            color="success"
            :disabled="!valid"
            @click="setPresentIdAction(tempPresentId)">
          Submit
          </v-btn>
        </v-col>
      </v-row>
    </v-form>


    <v-divider/>

    <v-row no-gutters>
      <v-col align="left" class="title">
      present your pdf
      </v-col>
      <v-col align="left">
        <v-btn
          type="submit"
          color="success"
          @click="getCurrentUser().then(() => {$router.push('/selecter')}).catch(() => {$router.push('/login')})">
        GO
        </v-btn>
      </v-col>
    </v-row>

  <v-divider/>

    <v-row no-gutters class="primary">
      <v-col align="center">
        <v-card>
        </v-card>
      </v-col>
    </v-row>


  <v-divider/>

  </v-container>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    pdf,
  },
  created() {
  },
  data: () => ({
    valid: false,
    tempPresentId: '',
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
