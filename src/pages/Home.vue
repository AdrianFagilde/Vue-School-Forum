<template>
	
	<div v-if="asyncDataStatus_ready" class="col-full">
		<h1 class="push-top">Welcome to the Forums</h1>
		<category-list :categories="categories" />
	</div>
</template>

<script>
/* eslint-disable */
import { mapActions } from 'vuex'
import CategoryList from "@/components/CategoryList.vue";
import asyncDataStatus from "@/mixins/asyncDataStatus.js"

export default {
	name: "Home",
	components: {
		"category-list": CategoryList,
	},
	mixins:[asyncDataStatus],
	computed: {
		categories() {
			
			return this.$store.state.categories.items;
		},
	},
	methods:{
		...mapActions('categories',['fetchAllCategories']),
		...mapActions('forums',['fetchForums'])

	},
	async created(){
		
		const categories = await this.fetchAllCategories()
		const forumIds = categories.map( c => c.forums).flat()
		await this.fetchForums({ ids: forumIds})
		this.asyncDataStatus_fetched();
	}

};
</script>

<style></style>
	