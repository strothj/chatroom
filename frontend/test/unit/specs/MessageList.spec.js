import Vue from 'vue';
import MessageList from 'components/MessageList';

describe('MessageList', () => {

  it('displays provided messages', (done) => {
    const messages = [
      { username: 'Bob', contents: 'Hello world!' },
      { username: 'Jane', contents: 'Ok!' },
    ];

    const vm = new Vue(MessageList).$mount();
    vm.messages = messages;

    Vue.nextTick(() => {
      vm.$refs.messages.length.should.equal(messages.length);
      vm.$refs.messages.forEach((val, i) => {
        val.username.should.equal(messages[i].username);
        val.contents.should.equal(messages[i].contents);
      });
      done();
    });

  });

});
