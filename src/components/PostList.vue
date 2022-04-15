<template>
  <div class="post-list">
    <div class="post" v-for="post in posts" :key="post.id">
      <div v-if="userById(post.userId)" class="user-info">
        <a href="#" class="user-name">{{ userById(post.userId).name }}</a>

        <a href="#">
          <AppAvatarImg
            class="avatar-large"
            :src="userById(post.userId).avatar"
            alt=""
          />
        </a>

        <p class="desktop-only text-small">
          {{ userById(post.userId).postCount }} posts
        </p>
        <p class="desktop-only text-small">
          {{ userById(post.userId).threadCount }} threads
        </p>
      </div>

      <div class="post-content">
        <div>
          <div v-if="editing === post.id">
            <post-editor :post="post" @save="handleUpdate" />
          </div>
          <p v-else >
            {{ post.text }}
          </p>
        </div>
        <a 
        v-if="post.userId === $store.state.auth.authId"
        @click.prevent="toggleEditMode(post.id)"
        href="#" style="margin-left: auto; padding-left:10px;" 
        class="link-unstyled" 
        title="Make a change">
          <fa icon="pencil-alt" />
        </a>
      </div>

      <div class="post-date text-faded">
        <div v-if="post.edited?.at" class="edition-info">edited</div>
        <app-date :timestamp="post.publishedAt" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import AppDate from "@/components/AppDate.vue";
import PostEditor from '@/components/PostEditor.vue'

export default {
  name: "PostList",
  props: {
    posts: {
      type: Array,
      required: true,
    },
  },
  data(){
    return{
      editing: null
    }
  },
  components: {
    "app-date": AppDate,
    'post-editor': PostEditor
  },
  computed:{
    users() {
      return this.$store.state.users.items;
    }
  },
  methods: {
    ...mapActions('posts', ['updatePost']),
    handleUpdate(event) {
      this.updatePost(event.post)
      this.editing = null
    },
    userById(userId) {
      return this.$store.getters['users/user'](userId);
    },
    toggleEditMode(id){
      this.editing = id === this.editing ? null : id 
    }
  },
};
</script>

<style></style>
