<template>
  <header 
   class="header" id="header"
   v-click-outside="()=> mobileNavMenu=false"
   v-page-scroll="()=> mobileNavMenu=false"
   >
    <router-link :to="{ name: 'Home' }" class="logo">
      <img src="@/assets/svg/vueschool-logo.svg" />
    </router-link>

    <div class="btn-hamburger" @click="mobileNavMenu = !mobileNavMenu">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar" :class="{'navbar-open': mobileNavMenu}">
      <ul>
        <li v-if="authUser" class="navbar-user">
          <a 
          @click.prevent="userDropdownOpen = !userDropdownOpen"
          v-click-outside="() => userDropdownOpen = false"
          
          >
            <AppAvatarImg
              class="avatar-small"
              :src="authUser.avatar"
              :alt="`${authUser.name} profile picture`"
            />
            <span>
              {{ authUser.name }}
              <img
                class="icon-profile"
                src="../assets/svg/arrow-profile.svg"
                alt=""
              />
            </span>
          </a>

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown" :class="{ 'active-drop': userDropdownOpen }">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item" >
                <router-link :to="{ name:'Profile' }" >View profile</router-link>
              </li>
              <li class="dropdown-menu-item">
                <a @click.prevent="$store.dispatch('auth/signOut'),
                $router.push({name: 'Home'})"
                >
                Sign Out
                </a>
              </li>
            </ul>
          </div>
        </li>

        
        <li v-if="!authUser" class="navbar-item">
          <router-link :to="{ name: 'SignIn' }">Sign In</router-link>
        </li>
        <li v-if="!authUser" class="navbar-item">
          <router-link :to="{ name: 'Register' }">Register</router-link>
        </li>
        <li v-if="authUser" class="navbar-mobile-item"><router-link :to="{name: 'Profile'}">View Profile</router-link></li>
        <li v-if="authUser" class="navbar-mobile-item"><a
          @click.prevent="$store.dispatch('auth/signOut'),
          $router.push({name: 'Home'})">
        Sign Out</a></li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "TheNavBar",
  computed: {
    ...mapGetters('auth', ["authUser"]),
  },
  data(){
    return{
      userDropdownOpen: false,
      mobileNavMenu: false
    }
  },
  created(){
    this.$router.beforeEach(() => {
      this.mobileNavMenu = false
    })
  }
};
</script>
