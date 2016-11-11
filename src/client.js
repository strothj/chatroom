import Vue from 'vue';
import App from './App.vue';

new Vue({ // eslint-disable-line no-new
  el: '#app',
  render: h => h(App),
});

// const socket = io();

// socket.on('recommend username', (username) => {
//   vm.suggestUsername(username);
// });
