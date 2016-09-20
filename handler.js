'use strict';
const aws = require('aws-sdk');
const _ = require('lodash/fp');

const dynamo = new aws.DynamoDB.DocumentClient();

exports.create = function(event, context) {
  const payload = {
    TableName: 'Pets',
    Item: event.body
  };

  const cb = (err, data) => {
    if (err) {
      console.log(err);
      context.fail('Error creating pet');
    } else {
      console.log(data);
      context.succeed(data);
    }
  }

  dynamo.put(payload, cb);
};

exports.show = function(event, context) {
  const payload = {
    TableName: 'Pets',
    Key: {
      petId: event.params.path.petId
    }
  }

  const cb = (err, data) => {
    if (err) {
      console.log(err);
      context.fail('Error retrieving pet');
    } else {
      console.log(data);
      context.done(null, data);
    }
  }

  dynamo.get(payload, cb);
};

exports.list = function(event, context) {
	const payload = {
		TableName: 'Pets'
	}

	const cb = (err, data) => {
    if (err) {
      console.log(err);
      context.fail('Error getting pets');
    } else {
      console.log(data);
      context.done(null, data);
    }
  }

	dynamo.scan(payload, cb);
}

exports.update = function(event, context) {
  const payload = {
    TableName: 'Pets',
    Key: {
      petId: event.params.path.petId
    }
  };

  dynamo.get(payload, (err, data) => {
    if (err) {
      console.log(err);
      context.fail('No pet with that id exists.');
    } else {
      const item = _.merge(data.Item, event.body);
      payload.Item = item;

      dynamo.put(payload, (putErr, putData) => {
        if (putErr) {
          console.log('Error updating pet.');
          console.log(putErr);
          context.fail('Error updating pet.');
        } else {
          console.log('Success!');
          console.log(putData);
          context.done(null, item);
        }
      });
    }
  });
}

exports.delete = function(event, context) {
  const payload = {
    TableName: 'Pets',
    Key: {
      petId: event.params.path.petId
    }
  };

  const cb = (err, data) => {
    if (err) {
      console.log(err);
      context.fail('Error retrieving pet');
    } else {
      console.log(data);
      context.done(null, data);
    }
  }

  dynamo.delete(payload, cb);
}
