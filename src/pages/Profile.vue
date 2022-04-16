<template>
	<div class="container" style="width:100%">
		<div class="flex-grid">
			<div class="col-3 push-top">
				<user-profile-card v-if="!edit" :user="user" />

				<user-profile-card-editor v-else :user="user" />

				<p class="text-xsmall text-faded text-center">
					Member since <AppDate :timestamp="user.registeredAt"/>  , last visited <AppDate :timestamp="user.lastVisitAt"/>
				</p>
				<div class="text-center">
					<hr />
					<router-link
						:to="{ name: 'ProfileEdit' }"
						class="btn-green btn-small"
						>Edit Profile</router-link
					>
				</div>
			</div>
			<div class="col-7 push-top">
				<div class="profile-header">
					<span class="text-lead">
						{{ user.username }} recent activity
					</span>
					<a href="#">See only started threads?</a>
				</div>
				<hr />
				<post-list :posts="user.posts" />
				<app-infinite-scroll 
				@load="fetchUserPost" 
				:done="user.posts.length === user.postsCount"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import PostList from "@/components/PostList";
import UserProfileCard from "@/components/UserProfileCard";
import UserProfileCardEditor from "@/components/UserProfileCardEditor";

import { mapGetters } from "vuex";
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
	name: "Profile",
	props: {
		edit: {
			type: Boolean,
			default: false,
		},
	},
	mixins:[asyncDataStatus],
	components: {
		"post-list": PostList,
		"user-profile-card": UserProfileCard,
		"user-profile-card-editor": UserProfileCardEditor,

	},
	computed: {
		...mapGetters('auth',{ user: "authUser" }),
		lastPostFetched(){
			if(this.user.posts.length === 0) return null

			return this.user.posts[this.user.posts.length - 1]
		}
	},
	methods:{
		async creationTime(){
			
		},
		fetchUserPosts(){
			return this.$store.dispatch('auth/fetchAuthUsersPosts', {startAfter: this.lastPostFetched})
		}
	},
	async created(){
		await this.fetchUserPosts()
		this.asyncDataStatus_fetched()
	}
};
</script>
