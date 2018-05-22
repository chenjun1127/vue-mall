/**
 * Created by ChenJun on 2018/5/11
 */
const moment = require('moment');
const orderNo = () => {
    const date = moment(new Date()).format('YYYYMMDDhhmmss');
    const NO_START = '622';
    const r1 = Math.floor(Math.random() * 10);
    const r2 = Math.floor(Math.random() * 10);
    return NO_START + r1 + date + r2;
}

module.exports = orderNo;
