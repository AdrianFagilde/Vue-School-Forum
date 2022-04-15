<template>
<div v-if="asyncDataStatus_ready" class="col-full" >
<h1>Category</h1>
<forum-list :forums="getForumsForCategory(category)" :categoryName="category.name"/>
</div>
	
</template>


<script>
import { mapActions } from 'vuex'
import { findById } from '@/helpers'
import ForumList from '@/components/ForumList.vue'
import asyncDataStatus from "@/mixins/asyncDataStatus.js"

	export default{
		Name:'Category',
		props:{
			id:{
				type:String,
				required:true
			}
		},
		mixins: [asyncDataStatus],
		components:{
			'forum-list' : ForumList
		},
		computed:{
			category(){
				return findById(this.$store.state.categories.items, this.id) || {}
			}

		},
		methods:{
			...mapActions('categories',['fetchCategory']),
			...mapActions('forums',['fetchForums']),
			getForumsForCategory (category) {
				return this.$store.state.forums.items.filter(forum => forum.categoryId === category.id)
			}
		},
		async created(){

			const category = await this.fetchCategory({ id: this.id })
			await this.fetchForums( {ids: category.forums})
			this.asyncDataStatus_fetched();

		}
	}
</script>

<style>
	
</style>