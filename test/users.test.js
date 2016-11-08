import { should } from 'chai';
import Users from '../src/users';

should();

describe('Users', () => {

  describe('generateRandomName', () => {
    let users;

    beforeEach(() => {
      users = new Users();
    });

    it('should return "guest1" when no other users are present', () => {
      const username = users.generateRandomName();
      username.should.equal('guest1');
    });

    it('should return "guest2" when "guest1" is already present', () => {
      users.users.push('guest1');
      const username = users.generateRandomName();
      username.should.equal('guest2');
    });

  });

});
