<template>
	<div class="col-full">
		<VeeForm @submit="save" :key="formKey">
			<AppFormField as="textarea" name="text" v-model="postCopy.text" rows="10" cols="30" rules="required" />
			<div class="form-actions">
				<button class="btn-blue">{{post? 'Submit post' : 'Update Post'}}</button>
			</div>
		</VeeForm>
	</div>
</template>

<script>
export default {
	name: "PosEditor",
	props:{
		post:{
			type:Object,
			default: () => ({ text: null })
		}
	},
	data() {
		return {
			postCopy: { ...this.post },
			formKey: Math.random()
		};
	},
	methods: {
		save() {
			this.$emit("save", { post: this.postCopy });
			this.postCopy.text = "";
			this.formKey = Math.random()
		},
	},
};
</script>

<style></style>
