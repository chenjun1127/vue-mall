/**
 * Created by 0easy-23 on 2018/1/17
 * 工具函数
 */

/*
    去除数组指定的元素，得到改变后的数组
 */

const removeByValue = (arr, val) => {
    let index = arr.indexOf(val);
    arr.splice(index, 1);
    return arr;
};
export {removeByValue};

