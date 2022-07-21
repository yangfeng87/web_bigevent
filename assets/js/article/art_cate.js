$(function () {
    initArtCateList();

    // 初始化文章列表
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                var tpl_table = template('tpl-table', res);
                $('tbody').html(tpl_table);
            }
        });
    }
    var indexAdd = null;
    //添加事件
    $('#btnAddCate').click(function () {
        indexAdd = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类'
            , content: $('#dialog-add').html(),
        });
    });
    // 通过代理绑定弹出层表单提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layui.layer.close(indexAdd);
                    return layui.layer.msg('新增失败');

                }
                initArtCateList();
                layui.layer.msg('新增成功');
                layui.layer.close(indexAdd);
            }
        });
    });
    // 绑定编辑按钮事件
    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function () {
        indexEdit = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类'
            , content: $('#dialog-edit').html(),
        });
        var id = $(this).attr('data-id');
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                layui.form.val('form-edit', res.data);

            }
        });
    });

    // 绑定编辑表单提交时间
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layui.layer.close(indexEdit);
                    return layui.layer.msg(res.message);

                }
                initArtCateList();
                layui.layer.msg(res.message);
                layui.layer.close(indexEdit);
            }

        });
    });
    //删除按钮实现
    $('tbody').on('click', '#btn-del', function () {
        var id = $(this).attr('data-id');
        layui.layer.confirm('确认三处？', { icon: 3, title: '提示' },
            function (index) {
                //do something
                $.ajax({
                    method: "GET",
                    url: "/my/article/deletecate/" + id,
                    success: function (res) {
                        if (res.status !== 0)
                            return layui.layer.msg(res.message);
                        layui.layer.msg(res.message);
                        layer.close(index);
                        initArtCateList();
                    }
                });

            });
    });

})



