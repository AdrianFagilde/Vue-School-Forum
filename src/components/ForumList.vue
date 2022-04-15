<template>
  <div class="forum-list">
    <h2 class="list-title">
      <router-link
        v-if="categoryId"
        :to="{ name: 'Category', params: { id: categoryId } }"
        >{{ categoryName }}
      </router-link>
      <span v-else>{{ categoryName }}</span>
    </h2>

    <div class="forum-listing" v-for="forum in forums" :key="forum.id">
      <div class="forum-details">
        <router-link
          class="text-xlarge"
          v-if="forum.id"
          :to="{ name: 'Forum', params: { id: forum.id } }"
        >
          {{ forum.name }}</router-link
        >
        <p>{{ forum.description }}</p>
      </div>

      <div class="threads-count">
        <p>
          <span class="count">{{ forum.threads?.length || "0" }}</span>
          {{ howManyThreads(forum) }}
        </p>
      </div>

      <div class="last-thread"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "ForumList",
  props: {
    forums: {
      required: true,
      type: Array,
    },
    categoryName: {
      type: String,
      default: "Forum",
    },
    categoryId: {
      required: false,
      type: String,
    },
  },
  methods: {
    howManyThreads(forum) {
      forum.threads?.length
        ? forum.threads?.length > 1
          ? "threads"
          : "thread"
        : "no thread";
    },
  },
};
</script>


<style>
</style>