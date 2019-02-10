import Account from './account.js';

function API(router) {
  this.router = router;
  this.account = new Account(this);
}

export default API;
