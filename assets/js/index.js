$(function () {
    // 获取用户信息
    getUserInfo();
    var layer = layui.layer;
    $('#btnLogOut').on('click', function () {
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            //do something
            localStorage.removeItem('token');
            location.href = '/login.html';
        });

    });
})

function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        success: function (res) {
            if (res.status !== 0) return layer.msg('获取失败');
            renderAvatar(res.data);
        }
    });
}
// 渲染用户头像
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcom').html("欢迎" + name);
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}