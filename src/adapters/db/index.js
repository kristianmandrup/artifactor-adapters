const config = require('../config');
const BaseAdapter = require('../base');

class DbAdapter extends BaseAdapter {
  // TODO: move entity into params. Much more flexible
  constructor(params) {
    super(params);
    this.adapter = this.resolvedAdapter;
  }

  get resolvedAdapter() {
    return config.db ? require(`./${config.db}`) : {};
  }
}

