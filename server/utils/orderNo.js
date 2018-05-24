/**
 * @dateTime:2018/05/24 11:03:12
 * @author:ChenJun
 * @desc:生成订单号
 */
const moment = require('moment');
const orderNo = () => {
    const date = moment(new Date()).format('YYYYMMDDhhmmss');
    const NO_START = '622';
    const r1 = Math.floor(Math.random() * 10);
    const r2 = Math.floor(Math.random() * 10);
    return NO_START + r1 + date + r2;
};

module.exports = orderNo;
