<template>
	
		<div v-if="asyncDataStatus_ready" class="col-full push-top">
			<h1>
				Create new thread in <i>{{ forum.name }}</i>
			</h1>

			<thread-editor @save="save" @cancel="cancel" @dirty="formIsDirty = true" @clean="formIsDirty = false"/>
		</div>
	
</template>

<script>
import { mapActions } from 'vuex'
import ThreadEditor from "@/components/ThreadEditor.vue";
import asyncDataStatus from "@/mixins/asyncDataStatus.js"
import { findById } from '@/helpers'

export default {
	name: "ThreadCreate",
	components: { "thread-editor": ThreadEditor },
	props: {
		forumId: {
			type: String,
			required: true,
		},
	},
	data(){
		return {
			formIsDirty: false 
		}
	},
	mixins:[asyncDataStatus],
	computed: {
		forum() {
			console.log(findById(this.$store.state.forums.items, this.forumId))
			return findById(this.$store.state.forums.items, this.forumId)
		},
	},
	methods: {
		...mapActions('threads',['createThread']),
		...mapActions('forums',['fetchForum']),
		async save({ title, text }) {
			const thread = await this.createThread({
				forumId: this.forumId,
				title,
				text,
			});

			this.$router.push({
				name: "ThreadShow",
				params: { id: thread.id },
			});
		},
		cancel() {
			this.$router.push({ name: "Forum", params: { id: this.forum.id } });
		},
	},
	beforeRouteLeave(){
		if(this.formIsDirty){
			const confirmed = window.confirm('Are you sure you want to leave? Unsaved changes will be lost!')
			if(!confirmed) return false 
		}	
	},
	async created(){
		await this.fetchForum({ id: this.forumId })
		this.asyncDataStatus_fetched()
	}
};
</script>
