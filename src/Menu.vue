<template>
	<div id="menu">
    <div id="toggleMenu" v-on:click="toggleMenu()"><i class="fa fa-bars"></i></div>
    <div id="items" v-show="show">
      <ul>
        <li v-for="item in menu.forAll"><router-link :to="item.link" v-html="item.html"></router-link></li>
        <li v-for="item in menu.forLogged" v-if="$root.isLogged"><router-link :to="item.link" v-html="item.html"></router-link></li>
        <li v-for="item in menu.forLoggedOut" v-if="!$root.isLogged"><router-link :to="item.link" v-html="item.html"></router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>
	export default {
		name: "main-menu",
    data() {
		  return {
		    show: true,
		    menu: {
		      forLogged: [
            {
              link: "/createSubPage",
              html: "<i class='fa fa-plus'></i> Создать раздел"
            },
            {
              link: "/subList",
              html: "<i class=\"fa fa-list\"></i> Все разделы"
            },
            {
              link: "/logout",
              html: "<i class=\"fa fa-sign-out\"></i> Выйти"
            }
          ],
          forLoggedOut: [
            {
              link: "/login",
              html: "<i class='fa fa-sign-in'></i> Логин"
            },
            {
              link: '/register',
              html: "<i class='fa fa-user-plus'></i> Регистрация"
            }
          ],
          forAll: [
            {
              link: '/',
              html: '<i class="fa fa-home"></i> Глагне'
            }
          ]
        }
      }
    },
    methods: {
      toggleMenu () {
        this.show = !this.show
        if(this.show) {
          $('body').css ({"marginLeft": "265px"})
        }
        else {
          $('body').css ({"marginLeft": "40px"})
        }
      }
    }
	}
</script>

<style scoped>
  #toggleMenu {
    display: inline-block;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 250;
    margin: 10px;
    cursor: pointer;
    width: 30px;
    font-size: 120%;
  }
  #items {
    margin: 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 250px;
    height: 100%;
    background: whitesmoke;
    overflow: auto;
    z-index: 249;
  }
  li {
    list-style: none;
    margin: 15px;
    vertical-align: middle;
    font-weight: bold;
  }
  li > a {
    text-decoration: none;
  }
</style>
