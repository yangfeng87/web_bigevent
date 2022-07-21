$(function () {

    initCate();
    //文本区域富文本
    initEditor();

    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    //加载文章分类
    function initCate() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0)
                    return layui.layer.msg(res.message);
                //模板引擎渲染下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                layui.form.render();
            }
        });
    }

    //选择封面

    $('#btnChooseImage').on('click', function () {

        $('#coverFile').click();
    });
    $('#coverFile').change(function (e) {
        var files = e.target.files;
        if (files.length === 0) return;
        var newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    });


    var art_state = '已发布';
    $('#btnSave').click(function () {
        art_state = '草稿';
    });

    //表单提交
    $('#form_pub').submit(function (e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        fd.append('state', art_state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
            });
        console.log('res');
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            cotentType: false,
            processData: false,
            success: function (res) {


                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg(res.message);
                Location.href = '/article/art_list.html';
            }

        });
    });
})