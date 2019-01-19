import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import MainPage from './views/MainPage.vue'
import Error from './views/Error.vue'
import NotFound from './views/NotFound.vue'
import './assets/app.css'
import Config from './config.js'
import $ from 'jquery'
import 'font-awesome/css/font-awesome.min.css'
import Menu from './Menu.vue'
import AppContent from './AppContent.vue'
import Status from './Status.vue'
import Login from './views/Login.vue'
import VueCookies from 'vue-cookies'
import Forbidden from './views/Forbidden.vue'
import Logout from './views/Logout.vue'
import Register from './views/Register.vue'
import VueProgressBar from 'vue-progressbar'
import SubPage from './views/Sub.vue'
import Moment from 'vue-moment'
import Post from './Post.vue'
import Comments from './views/Comments.vue'
import Comment from './Comment.vue'

window.Config = Config
window.$ = $

Vue.use(VueRouter)
Vue.use(VueCookies)
const options = {
  color: '#33CCCC',
  failedColor: '#cc3333',
  thickness: '2px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}
Vue.use(VueProgressBar, options)
Vue.use(Moment)

Vue.component('not-found', NotFound)
Vue.component('error', Error)
Vue.component('main-menu', Menu)
Vue.component('app-content', AppContent)
Vue.component('status', Status)
Vue.component('forbidden', Forbidden)
Vue.component('post', Post)
Vue.component('comment', Comment)

Vue.prototype.$status = function(msg, type = "info", notHide = !1) {
  var icon;
  switch (type) {
    case "success":
      icon = "fa fa-check";
      break;
    case "error":
      icon = "fa fa-ban";
      break;
    case "info":
      icon = "fa fa-info-circle";
      break;
    case "loading":
      icon = "fa fa-spinner fa-spin";
      break;
    default:
      icon = "fa fa-info"
  }
  var StatusId = `status-${Math.floor(Math.random() * 1000000000000000)}`;
  $("#status").append(`<div class="statusBlock ${type}" id="${StatusId}"><i class="${icon}"></i> ${msg}</div>`);
  $(`#${StatusId}`).slideDown();
  if (window.statusView) {
    clearTimeout(window.statusView)
  }
  $(".statusBlock").each(function() {
    var color = $(this).css("color");
    $(this).css({
      "box-shadow": `0px 0px 5px 0px ${color}`
    })
  });
  if (!notHide) {
    setTimeout(function() {
      $(`#${StatusId}`).slideUp();
      setTimeout(function () {
        $(`#${StatusId}`).remove();
      }, 3000);
    }, 3000)
  }
}

const routes = [
  {
    path: "/",
    component: MainPage
  },
  {
    path: "*",
    component: NotFound
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/logout",
    component: Logout
  },
  {
    path: "/register/:inviteCode?",
    component: Register
  },
  {
    path: "/sub/:address/:page?",
    component: SubPage
  },
  {
    path: "/comments/:postId",
    component: Comments
  },
]

const router = new VueRouter({
  routes,
  mode: "history"
})

const app = new Vue({
  router,
  el: "#app",
  data: {
    config: Config,
    isLogged: false
  },
  created () {
    if(!this.isLogged) {
      if(this.$cookies.get('access_token')) {
        var vm = this
        $.ajax({
          url: vm.config.api,
          async: false,
          data: {
            method: 'user.info',
            access_token: vm.$cookies.get('access_token'),
          },
          success (data) {
            if(data.success) {
              vm.isLogged = true
            }
            else {
              vm.isLogged = false
            }
          }
        })
      }
    }
  },
  render: h => h(App)
})
