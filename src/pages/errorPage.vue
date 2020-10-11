<template>
<div class="container">
    <div class="row pad-top text-center">
        <div class="col-md-6 col-md-offset-3 text-center">
            <h2>  您访问的页面出去玩了! </h2>
            <h5> 您访问的页面不存在，请点击页底的链接返回</h5>
            <span id="error-link">404</span>
            <h2>! 访问出错 !</h2>
        </div>
    </div>
    <div class="row text-center">
        <div class="col-md-8 col-md-offset-2">
            <div class="bigfont">
                <span class="glyphicon"></span>
            </div>
            <a class="btn btn-primary">返回首页</a><br><br>
        </div>
    </div>

</div>

</template>
<script src="../../src/assets/lib/jquery.min.js"></script>
    <script src="../../src/assets/lib/countUp.js"></script>
<script src="../../src/assets/lib/custom.js"></script>
<script>
export default {

}
</script>

<style>
/*=======================================
    GENERAL STYLES
==================================================*/
body {
    font-family: 'Microsoft Yahei', '微软雅黑', 'Nova Flat', cursive, 'Times New Roman', 'Arial', 'Helvetica', 'sans-serif';
    background-color: #b3c0da;
color: #fff;
}
.pad-top {
    padding-top:60px;
}
.text-center {
    text-align:center;
}
#error-link {
    font-size:150px;
    padding:10px;
}
.bigfont {
    font-size:70px;
}
</style>