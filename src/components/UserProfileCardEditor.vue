<template>
  <div class="profile-card">
    <VeeForm @submit="save">
      <p class="text-center avatar-edit">
        <label for="avatar">
          <AppAvatarImg
            :src="activeUser.avatar"
            :alt="`${user.name} profile picture`"
            class="avatar-xlarge img-update"
          />
          <div class="avatar-upload-overlay">
            <app-spinner v-if="uploadingImage" color="white" />
            <fa
              v-else
              icon="camera"
              size="3x"
              :style="{ color: 'white', opacity: '8' }"
            />
          </div>
          <input
            v-show="false"
            type="file"
            id="avatar"
            accept="image/*"
            @change="handleAvatarUpload"
          />
        </label>
      </p>

      <AppFormField name="username" label="Username" type="username" v-model="activeUser.username" :rules="`required|unique:users,username,${user.username}`"/>
      <AppFormField label="Full Name" name="name" v-model="activeUser.name" rules="required" />
      <AppFormField label="Bio" name="bio" as="textarea" v-model="activeUser.bio" placeholder="Write a few words about yourself." />

      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>

      <hr />

      <AppFormField label="Website" name="website" v-model="activeUser.website" rules="url" />
      <AppFormField label="Email" name="email" v-model="activeUser.email" :rules="`required|email|unique:users,email,${user.email}`"/>
      <AppFormField label="Location" name="location" v-model="activeUser.location" list="locations" @mouseenter="loadLocationOptions"/>
      <datalist id="locations">
        <option v-for="location in locationOptions" :value="location.name.common" :key="location.name.common" />
      </datalist>

      <div class="btn-group space-between">
        <button class="btn-ghost" @click="cancel">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </VeeForm>
    <UserProfileCardEditorReauthenticate
      v-model='needsReAuth'
      @success="onReauthenticated"
      @fail="onReauthenticatedFailed"

    />
    
  </div>
</template>

<script>
import { mapActions } from "vuex";
import UserProfileCardEditorReauthenticate from '@/components/UserProfileCardEditorReauthenticate.vue'
import useNotifications from '@/composables/useNotifications.js'

export default {
  name: "UserProfileCardEditor",
  data() {
    return {
      uploadingImage: false,
      activeUser: { ...this.user },
      locationOptions: [],
      needsReAuth: false
    };
  },
  setup(){
    const { addNotification } = useNotifications()
    return { addNotification }

  },
  components:{
    UserProfileCardEditorReauthenticate
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ...mapActions("auth", ["uploadAvatar"]),
    async loadLocationOptions () {
      if (this.locationOptions.length) return
      const res = await fetch('https://restcountries.com/v3/all')
      this.locationOptions = await res.json()
    },
    async handleAvatarUpload(e) {
      this.uploadingImage = true;
      const file = e.target.files[0];
      const uploadedImage = await this.uploadAvatar({ file });
      this.activeUser.avatar = uploadedImage || this.activeUser.avatar;
      this.uploadingImage = false
    },
    async onReauthenticated(){
      await this.$store.dispatch('auth/updateEmail', { email: this.activeUser.email })
      this.saveUserData()
    },
    async onReauthenticateFailed(){
      this.addNotification({ message: 'Error updating user', type: 'error', timeout: 3000 })
      this.$router.push({ name: 'Profile' })
    },
    async saveUserData(){
      
      await this.$store.dispatch("users/updateUser", { ...this.activeUser, threads: this.activeUser.threadIds });
      this.$router.push({ name: "Profile" });
      this.addNotification({ message: 'User successfully updated', timeout: 3000 })
    },
    async save() {
      
      const emailChanged = this.activeUser.email !== this.user.email
      console.log(emailChanged)
      if(emailChanged){
        
        this.needsReAuth = true
      }else{
        this.saveUserData()
      }
      
    },
    cancel() {
      this.$router.push({ name: "Profile" });
    },
  },
};
</script>
