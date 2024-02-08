"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbPool = void 0;
// //import mqtt 
const mqtt_1 = __importDefault(require("mqtt"));
const express_1 = __importDefault(require("express"));
//import mysql for the get connection
const mysql2_1 = __importDefault(require("mysql2"));
const server = (0, express_1.default)();
const PORT = 4001;
server.listen(PORT, () => {
    // console.log(`server is running on  ${PORT}`);
});
//set the mysql connection
let mySQLConn = {
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    password: "Lalan@*Pack123]",
    database: "lalan_database",
    multipleStatements: true
};
exports.dbPool = mysql2_1.default.createPool(mySQLConn);
//check if the db is connected successfully
exports.dbPool.getConnection((err, conn) => {
    if (err) {
        console.log(err.message + "Not able to connect");
    }
    else {
        console.log(" connected");
    }
});
//read the table first and send the msg to device to indicate that the parameter level out of range
setInterval(() => {
    //connect to the mqtt broker
    var mqttConnection = mqtt_1.default.connect('mqtt://103.6.169.80:1883');
    try {
        //read the data table
        var sqldata = `select parameter_code, device_id
            from lalan_database.alarm_table group by parameter_code, device_id`;
        // var sqldata = `select ipadd, deviceid
        //        from new_table`;
        //check whether the data table is null or not
        if (sqldata.length != null) {
            //get the data results in the table
            exports.dbPool.query(sqldata, (err, result) => {
                // console.log("err", err);
                // console.log("result", result);
                var len = result.length;
                //read the table and publish massages
                for (var i = 0; i < len; i++) {
                    var variable = result[i].parameter_code;
                    var variable1 = result[i].device_id;
                    // console.log("variable", variable)
                    // console.log("variable1", variable1)
                    mqttConnection.on("connect", () => {
                        let msg = (variable);
                        console.log(msg);
                        mqttConnection.publish('10000016', msg);
                    });
                }
                //once the table read , delete all records in the alarm table
                //let deleterecords = `truncate table crms.new_table`;
                //    let deleterecords = `truncate table lalan_database.alarm_table`;
                //     dbPool.query(deleterecords, (err: any, result: any) => {
                //         console.log("result", result);
                //         console.log("error", err);
                //         console.log("table rows deleted");
                //     }
                //     )
            });
        }
        else {
            //if the data table is null
            console.log("data does not exit!");
        }
    }
    catch (e) {
        console.log("error");
    }
}, 5000);
//read the data table for every 5 second again and again 
//# sourceMappingURL=app.js.map