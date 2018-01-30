const crypto = require('crypto');

// https://github.com/keithwhor/nodal/blob/57e3b3a080b20a0247fa9027a725fece29afc69f/cli/templates/models/access_token.jst
const genAuthKey = () => {
  return crypto
    .createHmac('md5', crypto.randomBytes(512).toString())
    .update([].slice.call(arguments).join(':'))
    .digest('hex');
};

if (require.main === module) {
  console.log(genAuthKey());
}
