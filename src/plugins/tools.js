/**
 * Created by ChenJun on 2018/3/28
 */
import {formatPrice} from "../utils/index";
import moment from 'moment';
moment.locale('zh-cn');
/**
 * @dateTime:2018/03/28 11:38:17
 * @author:ChenJun
 * @desc:vue 工具插件，可全局使用
 */
export default {
    install(Vue, options) {
        Vue.prototype.formatPrice = (number) => formatPrice(number);
        Vue.prototype.getTime = () => {
            console.log(`time:${new Date().getTime()}`);
        };
        Vue.prototype.formatTime = (date) => moment(date).format('YYYY-MM-DD HH:mm:ss');
    }
}
