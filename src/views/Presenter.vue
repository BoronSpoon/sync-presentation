<template>
  <div>
  <v-container>
    <v-row no-gutters>
      <v-col>
        <v-card tile outlined>
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
    ...mapState({
    }),
  },
  methods: {
    ...mapActions([
      'getAllPdfsForUser',
    ]),
  },
};
</script>
