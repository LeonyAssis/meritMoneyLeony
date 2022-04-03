'use strict';

class AwsSqsService {

  constructor(params) {
    this.sqs = params.sqs;
    this.errorService = params.errorService;
    this.gnLogger = params.gnLogger;
  }

  async getMessage(queueURL, limit) {
    const receiveParams = {
      AttributeNames: [
        'SentTimestamp'
      ],
      MaxNumberOfMessages: limit,
      MessageAttributeNames: [
        'All'
      ],
      QueueUrl: queueURL,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 0
    };

    try {
      const messages = await this.sqs.receiveMessage(receiveParams).promise();
      if (!messages.Messages || !messages.Messages[0].Body || !messages.Messages[0].Attributes || !messages.Messages[0].ReceiptHandle) {
        return null;
      }

      return messages.Messages;
    } catch (error) {
      this.gnLogger.error(error, 'failed to receive SQS message');
      throw this.errorService.get('failed_to_receive_SQS_message');
    }
  }

  async sendMessage(queueURL, mesageJSON) {
    try {
      let messageString = JSON.stringify(mesageJSON);
      let sendParams = {
        DelaySeconds: 2,
        MessageBody: messageString,
        QueueUrl: queueURL
      };

      return await this.sqs.sendMessage(sendParams).promise();
    } catch (error) {
      this.gnLogger.error(error, 'failed to send SQS message');
      throw this.errorService.get('failed_to_send_SQS_message');
    }
  }


  async deleteMessage(queueURL, SQSMessage) {
    try {
      let deleteParams = {
        QueueUrl: queueURL,
        ReceiptHandle: SQSMessage.ReceiptHandle
      };

      return await this.sqs.deleteMessage(deleteParams).promise();
    } catch (error) {
      this.gnLogger.error(error, 'failed to delete SQS message');
      throw this.errorService.get('failed_to_delete_SQS_message');
    }
  }
}

module.exports = AwsSqsService;
