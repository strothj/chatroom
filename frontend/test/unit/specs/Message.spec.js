import Vue from 'vue';
import Message from 'src/components/Message';

describe('Message', () => {

  it('should display username and message contents', (done) => {
    const username = 'Bob';
    const contents = 'Hello world!';

    const vm = new Vue(Message).$mount();
    vm.username = username;
    vm.contents = contents;

    Vue.nextTick(() => {
      vm.$el.querySelector('.message-username').textContent.should.equal(username);
      vm.$el.querySelector('.message-contents').textContent.should.equal(contents);
      done();
    });
  });

});
