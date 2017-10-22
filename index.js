const aws = require('aws-sdk'),
      fs = require('fs'),
      split = require('split'),
      through2 = require('through2');

aws.config.region = '';
aws.config.update({accessKeyId: '', secretAccessKey: ''});

const cw = new aws.CloudWatch();

function validateLine() {
	return through2.obj((data, enc, done) => {
		const oldName = data.split(';')[0],
		      newName = data.split(';')[1];

		(oldName !== '' && newName !== '') ? done(null, {oldName: oldName, newName: newName}) : done();
	});
}

function getAlarmFromCw() {
	return through2.obj((data, enc, done) => {
		const params = {AlarmNames: [data.oldName]};

		cw.describeAlarms(params, (err, alarm) => {
			if (err) {
				console.error(err);
				return done();
			}

			alarm.MetricAlarms[0] ? done(null, {metrics: alarm.MetricAlarms[0], oldName: data.oldName, newName: data.newName}) : done();
		});
	});
}

function updateAlarm() {
	return through2.obj((data, enc, done) => {
		const params = {
			AlarmName: data.newName,
			ComparisonOperator: data.metrics.ComparisonOperator,
			EvaluationPeriods: data.metrics.EvaluationPeriods,
			MetricName: data.metrics.MetricName,
			Namespace: data.metrics.Namespace,
			Period: data.metrics.Period,
			Threshold: data.metrics.Threshold,
			ActionsEnabled: data.metrics.ActionsEnabled,
			AlarmActions: data.metrics.AlarmActions,
			AlarmDescription: data.metrics.AlarmDescription,
			Dimensions: data.metrics.Dimensions,
			EvaluateLowSampleCountPercentile: data.metrics.EvaluateLowSampleCountPercentile,
			ExtendedStatistic: data.metrics.ExtendedStatistic,
			InsufficientDataActions: data.metrics.InsufficientDataActions,
			OKActions: data.metrics.OKActions,
			Statistic: data.metrics.Statistic,
			TreatMissingData: data.metrics.TreatMissingData,
			Unit: data.metrics.Unit
		};

		cw.putMetricAlarm(params, err => {
			if (err) {
				console.error(err);
				return done();
			} else {
				done(null, [data.oldName]);
			}
		});
	});
}

function deleteOldAlarm() {
	return through2.obj((data, enc, done) => {
		const params = {AlarmNames: data};

		cw.deleteAlarms(params, err => {
			err ? console.error(err) : console.log(`Alarm updated: ${data}`);
			done();
		});
	});
}

fs.createReadStream('input.txt', 'utf8')
	.pipe(split())
	.pipe(validateLine())
	.pipe(getAlarmFromCw())
	.pipe(updateAlarm())
	.pipe(deleteOldAlarm());