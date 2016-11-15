import Vue from 'vue';
import App from 'src/App';
import EventEmitter from 'events';

describe('App', () => {

  it('shows UsernamePicker on "recommend username" event', (done) => {

    const ee = new EventEmitter();
    const Ctor = Vue.extend(App);
    const vm = new Ctor({ propsData: { initialSocket: ee } }).$mount();

    vm.$refs.usernamePicker.visible.should.equal(false);
    ee.emit('recommend username', 'Bob');
    vm.$nextTick(function cb() {
      this.$refs.usernamePicker.visible.should.equal(true);
      done();
    });

  });

});
