import Vue from 'vue';
import App from 'src/App';
import EventEmitter from 'events';

describe('App', () => {

  describe('socket', () => {
    let socket;
    let vm;

    beforeEach(() => {
      socket = new EventEmitter();
      const Ctor = Vue.extend(App);
      vm = new Ctor({ propsData: { initialSocket: socket } }).$mount();
    });

    describe('UsernamePicker', () => {
      let usernamePicker;

      beforeEach(() => { usernamePicker = vm.$refs.usernamePicker; });

      it('shows UsernamePicker on "recommend username" event', (done) => {
        usernamePicker.visible.should.equal(false);
        socket.emit('recommend username', 'Bob');
        vm.$nextTick(() => {
          usernamePicker.visible.should.equal(true);
          done();
        });
      });

      it('sends selected username from UsernamePicker', (done) => {
        socket.on('set username', (username, ok) => {
          username.should.equal('Bob');
          ok(true);
          Vue.nextTick(() => {
            usernamePicker.visible.should.equal(false);
            done();
          });
        });
        socket.emit('recommend username', 'Bob');
        vm.$nextTick(() => {
          usernamePicker.visible.should.equal(true);
          usernamePicker.$emit('usernameSelected', 'Bob');
        });
      });

    }); // UsernamePicker

  }); // socket

});
