<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <div class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{ forum.name }}</h1>
          <p class="text-lead">{{ forum.description }}</p>
        </div>
        <router-link
          :to="{
            name: 'ThreadCreate',
            params: { forumId: forum.id },
          }"
          class="btn-green btn-small"
          >Start a thread
        </router-link>
      </div>
    </div>
  </div>

  <div v-if="threadLoaded" class="col-full push-top">
    <thread-list :threads="threads" />
    <v-pagination
      v-model="page"
      :pages="totalPages"
      active-color="#57AD8D"

    />
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions } from "vuex";
import { findById } from "@/helpers";
import ThreadList from "@/components/ThreadList.vue";
import asyncDataStatus from "@/mixins/asyncDataStatus.js";

export default {
  name: "Forum",
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  mixins: [asyncDataStatus],
  data() {
    return {
      threadLoaded: false,
	    page: parseInt(this.$route.query.page) || 1,
	    perPage: 10
    };
  },
  components: {
    "thread-list": ThreadList,
  },
  methods: {
    ...mapActions("forums", ["fetchForum"]),
    ...mapActions("threads", ["fetchThreadsByPage"]),
    ...mapActions("users", ["fetchUsers"]),
  },
  computed: {
    threads() {
      if (!this.forum) return [];
      return this.$store.state.threads.items
	  .filter(thread => thread.forumId === this.forum.id) 
	  .map((thread) =>
        this.$store.getters["threads/thread"](thread.id)
      );
    },
    forum() {
      return findById(this.$store.state.forums.items, this.id);
    },
	threadCount(){
		return this.forum.threads?.length || 0
	},
	totalPages(){

		if(!this.threadCount) return 0
		return Math.ceil(this.threadCount/this.perPage)
	}
  },
  watch:{
	  async page(page){
		  this.$router.push({ query: { page: this.page }})
	  }
  },
  async created() {
    const forum = await this.fetchForum({ id: this.id });

    const threads = await this.fetchThreadsByPage({ ids: forum.threads , page: this.page , perPage: this.perPage });

    await this.fetchUsers({ ids: threads.map((t) => t.userId) });
    this.threadLoaded = true;
    this.asyncDataStatus_fetched();
  },
};
</script>

<style></style>
