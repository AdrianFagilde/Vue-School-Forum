<template>
	<the-nav-bar />
	<div class="container">
		<router-view  v-show="showPage" @ready="onPageReady" :key="`${$route.path}${JSON.stringify($route.query)}`"/>
		<app-spinner v-show="!showPage"/>
		<AppNotifications/>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import TheNavBar from "@/components/TheNavBar.vue";
import AppSpinner from '@/components/AppSpinner.vue'
import NProgress from 'nprogress'
import AppNotifications from '@/components/AppNotifications'
import useNotifications from "@/composables/useNotifications";
export default {
	name: "App",
	components: {
		"the-nav-bar": TheNavBar,
		'app-spinner':	AppSpinner,
		AppNotifications
	},
	setup(){
		const { removeNotification } = useNotifications()
		return { removeNotification }
	},
	data(){
		return  {
			showPage: false
		}
	},
	methods:{
		...mapActions('auth', ['fetchAuthUser']),
		onPageReady(){
			this.showPage = true
			NProgress.done()
		}
	},
	created(){
		this.fetchAuthUser()
		NProgress.configure({
			speed: 200,
			showSpinner: false
		})
		this.$router.beforeEach(()=>{
			this.showPage = false,
			NProgress.start()
		})

		setTimeout( () => this.removeNotification(1), 5000)
	}
};
</script>

<style>
@import "assets/style.css";
@import "~nprogress/nprogress.css";
#nprogress .bar{
  background: #57AD8D !important;
}
</style>
