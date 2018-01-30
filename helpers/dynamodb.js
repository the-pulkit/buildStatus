const AWS = require('aws-sdk');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // gg

AWS.config.update({
  accessKeyId: process.env.AWS_PUBLIC_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

const docClient = new AWS.DynamoDB.DocumentClient();
const table = process.env.DYNAMO_TABLE_NAME;

const addItem = item => {
  return new Promise((resolve, reject) => {
    let params = {
      TableName: table,
      Item: item
    };

    docClient.put(params, (error, data) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(data);
    });
  });
};

const query = filter => {
  return new Promise((resolve, reject) => {
    let params = {
      TableName: table
    };

    params = Object.assign({}, params, filter);

    docClient.query(params, (error, data) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(data);
    });
  });
};

exports.addItem = addItem;
exports.query = query;
