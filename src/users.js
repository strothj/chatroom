class Users {
  constructor() {
    this.users = [];
  }

  generateRandomName() {
    let i = 0;
    let username;
    const match = element => element === username;
    do {
      i += 1;
      username = `guest${i}`;
    } while (this.users.find(match));
    return username;
  }
}

export default Users;
