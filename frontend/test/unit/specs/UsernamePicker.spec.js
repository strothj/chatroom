import Vue from 'vue';
import UsernamePicker from 'components/UsernamePicker';

describe('UsernamePicker', () => {

  it('submitting form emits event', (done) => {
    const vm = new Vue(UsernamePicker).$mount();
    $(vm.$el).find('input').val('Bob');

    vm.$on('submit', (username) => {
      username.should.equal('Bob');
      done();
    });

    vm.submit();
  });

  it('setting username property sets username form field', (done) => {
    const vm = new Vue(UsernamePicker).$mount();
    vm.username = 'Bob';
    vm.$nextTick(function cb() {
      this.$refs.username.value.should.equal('Bob');
      done();
    });
  });

  describe('jQuery modal', () => {
    let mount;
    let usernamePicker;

    before(() => {
      // Mount to DOM so materialize-css jQuery modal plugin updates class and styles.
      mount = $('<div></div>').appendTo('body');

      usernamePicker = new Vue({
        el: mount.get(0),
        render: h => h(UsernamePicker, { ref: 'usernamePicker' }),
      }).$mount().$refs.usernamePicker;
    });

    after(() => { mount.remove(); });

    it('visible when "usernameNeeded" is true', (done) => {
      $(usernamePicker.$el).hasClass('open').should.equal(false);
      usernamePicker.usernameNeeded = true;
      Vue.nextTick(() => {
        $(usernamePicker.$el).hasClass('open').should.equal(true);
        usernamePicker.usernameNeeded = false;
        Vue.nextTick(() => {
          $(usernamePicker.$el).hasClass('open').should.equal(false);
          done();
        });
      });
    });

  });

});
