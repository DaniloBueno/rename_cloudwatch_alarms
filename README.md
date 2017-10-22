# Rename AWS CloudWatch Alarms

A simple node.js script to rename AWS CloudWatch alarms.

### Installing

Run inside rename_cloudwatch_alarms directory:
```
npm install
```

### Configuring

Add your AWS credentials inside index.js:
~~~ javascript
aws.config.region = '';
aws.config.update({accessKeyId: '', secretAccessKey: ''});
~~~

Note that hard-coding credentials isn't recommended by AWS. Check alternatives in <a href="http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html" target="_blank">AWS Documentation</a>

Add your old and new alarms' names inside input.txt. One line for each alarm. Use ";" as delimiter. Example:

```
old_alarm_name1;new_alarm_name1
old_alarm_name2;new_alarm_name2
old_alarm_name3;new_alarm_name3
```

## Running

Run index.js:
```
node index.js
```

## License

This project is licensed under the MIT License.
