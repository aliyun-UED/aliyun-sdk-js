var ALY = require('../core');
var parseURL = require('url').parse;

ALY.BatchCompute = ALY.Service.defineService('batchcompute', ['2015-06-30','2015-11-11'], {
    /**
     * @api private
     */
    initialize: function initialize(options) {
        ALY.Service.prototype.initialize.call(this, options);
    },
    setupRequestListeners: function setupRequestListeners(request) {

        var that = this;
        var svc = ALY.ServiceInterface.RestJson;

        request.addListener('build', this.addContentType);

        request.removeListener('extractData', svc.extractData);

        request.addListener('extractError', this.extractError);
        request.addListener('extractData', function (response) {
            that.extractData(response, request['operation']);
        });
    },


    addContentType: function(req){
        var httpRequest = req.httpRequest;
        var headers = httpRequest.headers;

        headers['x-acs-version'] = req.service.config.apiVersion;

        if(req.operation==='updateJobPriority'){
            httpRequest.body = JSON.parse(httpRequest.body).priority+'';
            headers['Content-Type'] = 'application/octet-stream';
            //headers['Content-Length']= httpRequest.body.length;
        }
    },


    extractData: function extractData(resp, operation) {

        resp.data = JSON.parse(resp.httpResponse.body.toString().trim() || '{}');

        var result = resp.data;
        delete result['RequestId'];


        var headers = resp.httpResponse.headers;
        var reqId = headers['x-acs-request-id'] || headers['request-id'];


        resp.data = {
            code: resp.httpResponse.statusCode,
            message: headers.status,
            headers: headers,
            requestId: reqId || ''
        };

        if(headers['x-acs-version']=='2015-06-30') {

            switch (operation) {
                case 'listJobs':
                    resp.data.data = this.getFormatters().formatJobList(result);
                    break;
                case 'getJob':
                    resp.data.data = this.getFormatters().formatJob(result);
                    break;
                case 'getJobDescription':
                    resp.data.data = this.getFormatters().formatJobDescription(result);
                    break;
                case 'listTasks':
                    resp.data.data = this.getFormatters().formatTaskList(result);
                    break;
                case 'listImages':
                    resp.data.data = this.getFormatters().formatImageList(result);
                    break;
                case 'createJob':
                    resp.data.data = this.getFormatters().formatJob(result);
                    break;
            }
        }
        else{
            resp.data.data = result;
        }

    },
    getFormatters: function () {

        function getState(state) {
            switch (state) {
                case 0:
                    return 'Init';
                case 1:
                    return 'Waiting';
                case 2:
                    return 'Running';
                case 3:
                    return 'Finished';
                case 4:
                    return 'Failed';
                case 5:
                    return 'Stopped';
                default:
                    return 'Unkowned';
            }
        }

        return {
            formatJob: function (v) {

                v['JobId'] = v['ResourceId'];
                v['JobName'] = v['Name'];
                v['CreationTime'] = v['CreateTime'];

                delete v['Name'];
                delete v['ResourceId'];
                delete v['CreateTime'];

                if (v['State'] == 'Terminated') v['State'] = 'Finished';

                return v;
            },
            formatJobList: function (data) {
                var that = this;
                var t = [];
                Object.keys(data).forEach(function (k) {
                    t.push(that.formatJob(data[k]));
                });

                t.sort(function (a, b) {
                    return a['JobId'] > b['JobId'] ? 1 : -1;
                });
                return t;
            },
            formatTaskList: function (data) {
                /*{ CountTask:
                 { EndTime: 1435520792,
                 InstanceStatusVector: [Object],
                 StartTime: 1435519721,
                 State: 5,
                 UnfinishedInstances: [Object] } },
                 */
                var t = [];
                Object.keys(data).forEach(function (k) {
                    var v = data[k];
                    v['TaskName'] = k;
                    v['State'] = getState(v['State']);
                    v['InstanceList'] = v['InstanceStatusVector'];

                    delete v['InstanceStatusVector'];
                    delete v['UnfinishedInstances'];

                    if (v['InstanceList']) {
                        v['InstanceList'].forEach(function (n) {
                            n.State = getState(n.State);
                            delete n['WorkerStartTime'];
                            delete n['WorkerEndTime'];
                        });
                    }
                    t.push(data[k]);
                });

                //sort by StartTime, TaskName
                t.sort(function (a, b) {
                    if (a['StartTime'] == 0) {
                        if (b['StartTime'] == 0) {
                            return a['TaskName'] > b['TaskName'] ? 1 : -1;
                        } else {
                            return -1;
                        }
                    } else {
                        if (b['StartTime'] == 0) {
                            return -1;
                        } else {
                            return a['StartTime'] > b['StartTime'] ? 1 : -1;
                        }
                    }
                });
                return t;
            },
            formatImageList: function (data) {
                var t = [];

                Object.keys(data).forEach(function (k) {
                    var v = data[k];
                    v['ImageId'] = k;
                    v['ImageName'] = v['Name'];

                    delete v['Name'];

                    t.push(data[k]);
                });

                t.sort(function (a, b) {
                    return a['ImageId'] > b['ImageId'] ? 1 : -1;
                });
                return t;
            },
            formatJobDescription: function (data) {
                var taskMap = data.TaskDag.TaskDescMap;
                Object.keys(taskMap).forEach(function (k) {
                    var v = taskMap[k];
                    delete v['BlockDeviceMapping'];
                    delete v['CreateSnapshotAfterTerminated'];
                    delete v['LoadImage'];
                    delete v['SaveImage'];
                    delete v['LoadPreparedData'];
                    delete v['MaxReplica'];
                    delete v['MinReplica'];
                });
                return data;
            }

        };
    },


    extractError: function extractError(resp) {

        var headers = resp.httpResponse.headers;

        var body = resp.httpResponse.body;
        var error = body.toString();

        try {
            error = JSON.parse(error);
        } catch (e) {
            error = {};
        }

        resp.error = ALY.util.error(new Error(error.Message), {
            code: error.Code || error.ErrorCode,
            headers: headers,
            requestId: headers['x-acs-request-id'] || headers['request-id']
        });
    }
});

module.exports = ALY.BatchCompute;
