<template>
  <v-app>
    <div id="app">
      <!-- App content -->
      <v-content>
        <v-container fluid>
          <router-view/>
        </v-container>
      </v-content>
    </div>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  created() {
    this.$router.push('/')
  },
  methods: {
    ...mapActions(['getCurrentUser']),
  },
};
</script>
