$(function () {
    // 查询请求对象
    var q = {
        pagenum: 1,//默认请求第一页
        pagesize: 2,//默认每页显示数据
        cate_id: '',//文章分类Id
        status: ''//文章发布状态
    };
    initTable();
    initCate();
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0)
                    return layui.layer.msg(res.message);
                //使用模板渲染数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        });
    }
    //美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' +
            hh + ':' + mm + ':' + ss;
    }
    function padZero(n) {
        return n > 9 ? n : "0" + n;
    }
    // 初始化文章筛选
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0)
                    return layui.layer.msg(res.message);
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 重新渲染layui表单区域
                layui.form.render();
            }
        });
    }
    //提交筛选
    $('#form-searvh').on('submit', function (e) {
        e.preventDefault();
        // 获取选中项值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    });

    // 分页实现 ,接受数据条数
    function renderPage(total) {
        layui.laypage.render({
            elem: 'pageBOx',//分页容器ID
            count: total,//总数居条数
            limit: q.pagesize,//每页多少数据
            curr: q.pagenum,//默认选中
            layout: [
                'count',
                'limit',
                'prev',
                'page',
                'next',
                'skip'
            ],//设置分页样式，顺序相关
            limits: [2, 3, 5, 10],//每页显示多少条数    
            //分页切换触发jump
            jump: function (obj, first) {
                q.pagenum = obj.curr;//当前页
                q.pagesize = obj.limit;//当前每页显示多少条数
                //如果是切换触发，如果是调用renderpage则不触发
                if (!first) {
                    initTable();
                }
            }

        });

    }
    //删除功能实现
    $('tbody').on('click', '#btn-del', function () {
        var btnLength = $('#btn-del').length;
        layui.layer.confirm('确定删除?', { icon: 3, title: '提示' },
            function (index) {
                //do something
                $.ajax({
                    method: "GET",
                    url: "/my/article/delete/" + $(this).attr('data-id'),
                    success: function (res) {
                        if (res.status !== 0)
                            return layui.layer.msg(res.message);
                        layui.layer.msg(res.message);
                        //当前页是否还有剩余数据
                        //若没有页码-1
                        //通过剩余按钮书判断数据条数，如果为1
                        if (btnLength === 1) {
                            //页码值最小为1
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                        }
                        initTable();
                        layer.close(index);
                    }
                });

            });
    });
})
