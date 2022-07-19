$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比 裁剪框宽高比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);

    //点击按钮触发文件选择框
    $('#btnChooseImage').click(function () {
        $('#file').click();
    });
    $('#file').change(function (e) {
        var filelist = e.target.files;
        if (filelist.length === 0)
            return layui.layer.msg('请选择图片');
        var file = e.target.files[0];
        // 将文件转化为路劲
        var newImgURL = URL.createObjectURL(file);
        //重新初始化裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options);      // 重新初始化裁剪区域
    });


    //上传头像到服务器
    $('#btnUpload').click(function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png');     // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL,
            },
            success: function (res) {
                if (res.status !== 0)
                    return layui.layer.msg('更新失败');
                layui.layer.msg('更新成功');
                window.parent.getUserInfo();
            }
        });
    });
})