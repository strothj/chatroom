import chai from 'chai';
import Vue from 'vue';
import MessageItem from '../../src/components/MessageItem.vue';

chai.should();

describe('MessageItem', () => {

  it('renders supplied message', () => {
    const username = 'Bob';
    const message = 'Hello world!';
    const expected = `<div>
  <div class="chip">${username}</div>
  <span>${message}</span>
</div>`;
    const Ctor = Vue.extend(MessageItem);
    const vm = new Ctor().$mount();
    vm.username = username;
    vm.message = message;

    console.log(vm.$el);
    vm.$el.innerHTML.should.equal(expected);
  });

});
