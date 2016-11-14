import Vue from 'vue';
// import $ from 'jquery';
import UsernamePicker from 'components/UsernamePicker';

describe('UsernamePicker', () => {
  let mount;
  let usernamePicker;

  beforeEach(() => {
    // Mount to DOM so materialize-css jQuery modal plugin updates class and styles.
    mount = $('<div></div>').appendTo('body');

    const vm = new Vue({
      el: mount.get(0),
      render: h => h(UsernamePicker, { ref: 'usernamePicker' }),
    }).$mount();
    usernamePicker = vm.$refs.usernamePicker;
  });

  afterEach(() => { mount.remove(); });

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
