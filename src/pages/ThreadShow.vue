<template>
  <div v-if="asyncDataStatus_ready" class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link
        v-if="thread.userId === authUser.id"
        :to="{ name: 'ThreadEdit', params: { id: thread.id } }"
        class="btn-green btn-small"
      >
        Edit Thread
      </router-link>
    </h1>
    <p>
      By <a href="#" class="link-unstyled">{{ thread.author?.name }}</a
      >, <app-date :timestamp="thread.publishedAt" />.
      <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">
        {{thread.repliesCount}}
        {{thread.repliesCount === 1 ? 'reply' : 'replies'}}
        by {{thread.contributorsCount}}
        {{thread.contributorsCount === 1 ? 'contributor' : 'contributors'}}
      </span>
    </p>

    <post-list :posts="threadPosts" />
    <post-editor v-if="authUser" @save="addPost" />
    <div v-else class="text-center" style="margin-bottom: 50px">
      <router-link :to="{ name: 'SignIn', query: { redirectTo: $route.path } }"
        >Sign In</router-link
      >
      or
      <router-link
        :to="{ name: 'Register', query: { redirectTo: $route.path } }"
        >Register</router-link
      >
      to reply.
    </div>
  </div>
</template>

<script>
import AppDate from "@/components/AppDate.vue";
import PostList from "@/components/PostList.vue";
import PostEditor from "@/components/PostEditor.vue";
import { mapActions, mapGetters } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus.js";
import useNotifications from "@/composables/useNotifications";
import difference from "lodash/difference";

export default {
  name: "ThreadShow",
  components: {
    "post-list": PostList,
    "post-editor": PostEditor,
    "app-date": AppDate,
  },
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  mixins: [asyncDataStatus],
  methods: {
    ...mapGetters("auth", ["authUser"]),
    ...mapActions("threads", ["fetchThread"]),
    ...mapActions("users", ["fetchUsers"]),
    ...mapActions("posts", ["fetchPosts", "createPost"]),
    async fetchPostsWithUsers(ids) {
      const posts = await this.fetchPosts({
        ids,
        onSnapshot: ({ isLocal, previousItem }) => {
          if (!this.asyncDataStatus_ready || isLocal || (previousItem?.edited && !previousItem?.edited?.at)) return
          this.addNotification({ message: 'Thread recently updated', timeout: 5000 })
        }
      });

      const users = posts.map((post) => post.userId).concat(this.thread.userId);
      await this.fetchUsers({ ids: users });
    },
    addPost(eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id,
      };

      this.$store.dispatch("posts/createPost", post);
    },
  },
  setup() {
    const { addNotification } = useNotifications();
    return { addNotification }
  },
  computed: {
    thread() {
      return this.$store.getters["threads/thread"](this.id);
    },
    threads() {
      return this.$store.state.threads.items;
    },
    posts() {
      return this.$store.state.posts.items;
    },
    threadPosts() {
      return this.posts.filter((post) => post.threadId === this.id);
    },
  },
  async created() {
    // fetch the thread
    
    const thread = await this.fetchThread({
      id: this.id,
      onSnapshot: async ({ isLocal, item, previousItem }) => {
        if (!this.asyncDataStatus_ready || isLocal) return
        const newPosts = difference(item.posts, previousItem.posts);
       
        const hasNewPosts = newPosts.length > 0
        if (hasNewPosts) {
        await this.fetchPostsWithUsers(newPosts)
        } else {
        this.addNotification({ message: 'Thread recently updated', timeout: 5000 })
        }
      },
    });


    await this.fetchPostsWithUsers(thread.posts)
    
    this.asyncDataStatus_fetched();
  },
};
</script>

<style></style>
