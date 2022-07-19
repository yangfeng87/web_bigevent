// 每次发起ajax请求前或调用这个函数
$.ajaxPrefilter(function (options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    // 请求头配置对象
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ""
        }
    }
    // 成功与否调用该函数
    options.complete = function (res) {
        console.log(res);
        if (res.responseJSON.status === 1 &&
            res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token');


            location.href = '/login.html';
        }
    }
});