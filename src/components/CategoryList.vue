<template>
	<forum-list
		v-for="category in categories" :key="category.id"
		:forums="getForumsForCategory(category)"
		:categoryName="category.name"
		:categoryId="category.id"
	/>
</template>

<script>
import ForumList from '@/components/ForumList.vue'

	export default{
		name:'CategoryList',
		components:{
			'forum-list': ForumList
		},
		props:{
			categories:{
				type: Array,
				required: true

			}
		},
		methods:{
			getForumsForCategory(category){
				return this.$store.state.forums.items.filter( forum => forum.categoryId === category.id)
			}
		},
	}
</script>


<style>
	

</style>