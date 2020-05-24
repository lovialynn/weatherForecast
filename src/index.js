//图表

function chart(arr1, arr2) {
    let type = 'line';
    let defaults = {
        title: false,
    }
    let data = {

        
        labels: [1, 2, 3,4, 5, 6, 7],
        datasets: [

            {
                backgroundColor: 'white',

                lineTension: 0,
                borderColor: 'orange',
                data: arr1,
                pointBackgroundColor: 'orange',
            },
            {
                backgroundColor: 'white',

                lineTension: 0,
                pointBackgroundColor: 'rgb(119, 184, 201)',
                borderColor: 'rgb(119, 184, 201)',
                data: arr2,

            }
        ]
    }

    let ctx = document.getElementById('chart').getContext('2d');
    let chart = new Chart(ctx, {
        type: type,
        data: data,
        defaults: defaults,
        options: {
            hover: {
                animationDuration: 0
            }, //防止颤抖
            animation: {

                onComplete: function () { //数值
                    var chartInstance = this.chart,

                        ctx = chartInstance.ctx;
                    // 以下属于canvas的属性（font、fillStyle、textAlign...）
                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    ctx.fillStyle = "black";
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);
                        });
                    })
                }
            },
            legend: {
                display: false,

            },

            scales: {
                yAxes: [{
                    gridLines: {
                        display: false,

                    },
                    ticks: {
                        max:42,
                        min: -15, //缩小比例
                        display: false,
                        beginAtZero: true,

                    },
                }],
                xAxes: [{
                    gridLines: {
                        display: false, //隐藏网格线

                    },
                    ticks: { //无论怎么样x轴的宽度为啥总是改不了，烦死了。
                      
                        display: false,
                        beginAtZero: true
                    }
                }]
            }
        }
    })
}

// ajax函数
function ajax(options) {
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest()
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (options.type == "GET") {
        xhr.open(options.type, options.url + options.data, options.async);
        xhr.send()
    } else if (options.type == "POST") {
        xhr.open(options.type, options.url, options.type);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(options.data);
    }
    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var data = xhr.responseText;
                options.success(data);
            } else options.error()
        }
    }
}
//使用例如

let cityHistory = [];
let input = document.getElementById('input')
// submit.addEventListener('click',function(){
//     　　let value = input.value;
//         cityHistory.push(value);
//         cityHistory.push(1);
// });
//判断星期几
let date2 = new Date();

var a = ["日", "一", "二", "三", "四", "五", "六"];
var week = new Date().getDay();
var weekstr = [];
for (let i = 0; i < 7; i++) {
    weekstr.push('周' + a[week + i])
}
weekstr[0] = '今天'
weekstr[1] = '明天'
weekstr[2] = '后天'

console.log(weekstr[1])
//重载html的函数
function ajaxHtml(area) {
    ajax({
        url: 'https://www.tianqiapi.com/free/day?appid=41754247&appsecret=8khNLj7E&city=',
        type: "GET",
        async: true,
        data: area,
        success: function (data) {
            data = JSON.parse(data)
            console.log(data)
            document.getElementById('cityName').innerHTML = data.city
            data.update_time = data.update_time.replace(/^.{7}/, ' ')
            document.getElementById('updataTimeC').innerHTML = `中国气象局${data.update_time.replace(/^.{5}/, ' ')}发布`
            document.getElementById('quality').innerHTML = `
            <h3>${data.air}</h3>
            <h3>优</h3>`
            document.getElementById('mainCenter').innerHTML = `
            <div id="mainTp">
                ${data.tem}°
            </div>
            <h1>
                ${data.wea}
            </h1>`
            document.getElementById('win1').innerHTML = `${data.win} ${data.win_speed}`
            document.getElementById('win2').innerHTML = ` ${data.win_meter}`

            tomTd.innerHTML = ` <div class="flexB">
      <h2>今天</h2>
      <h2>${data.tem_day}/${data.tem_night}°</h2>
  </div>
  <div class="flexB">
      <h2>${data.wea}</h2>
      <img src="../src/${data.wea}.svg" class="wtIcon">
  </div>`
            main.style.backgroundImage = `url(../src/${data.wea_img}.jpg)`
        },
        error: () => {
            alert('失败')
        }
    })
    ajax({
        url: 'https://www.tianqiapi.com/free/week?appid=41754247&appsecret=8khNLj7E&city=',
        type: "GET",
        async: true,
        data: area,
        success: (data) => {
            data = JSON.parse(data)
            console.log(data)
            let date = [];
            let high = [];
            let low = [];
            let day2Itemsli = [];
            let day1Itemsli = [];
            for (let i = 0; i < 7; i++) {
                date[i] = data.data[i].date.replace(/-/g, "/");
                date[i] = date[i].replace(/^.{5}/, ' ')
                high.push(data.data[i].tem_day);
                low.push(data.data[i].tem_night);

            }
            for (let i = 0; i < 7; i++) {
                day2Itemsli[i] = `<li class="dayItem">
                    <img src="../src/${data.data[i].wea}.svg" class="wtIcon">
                    <h2 class="pad2 dayItemwea">${data.data[i].wea}</h2>
                    <h3>${data.data[i].win}</h3>
                    <h3>${data.data[i].win_speed}</h2>
        
        
                </li>`
            }
            day2Itemsli = day2Itemsli.join(' ')
            for (let i = 0; i < 7; i++) {
                day1Itemsli[i] = `
            
            <li class="dayItem">
             <h3>${weekstr[i]}</h2>
            <h3>${date[i]}</h2>
                <h2 class="pad2 dayItemwea">${data.data[i].wea}</h2>
                <img src="../src/${data.data[i].wea}.svg" class="wtIcon">
           </li>`
            }
            day1Itemsli = day1Itemsli.join(' ')

            tomTm.innerHTML = ` <div class="flexB">
            
        <h2>今天</h2>
        <h2>${data.data[1].tem_day}/${data.data[1].tem_night}°</h2>
        </div>
        <div class="flexB">
        <h2>${data.data[1].wea}</h2>
        <img src="../src/${data.data[1].wea}.svg" class="wtIcon">
        </div>`

            days.innerHTML = ` <ul id="dayItems" class="day1Items">
            ${day1Itemsli}
    
</ul>

<div id="bigChart"><canvas id="chart"></canvas></div>
<ul id="dayItems" class="day2Items">
    
${day2Itemsli}
    </ul>`
            chart(high, low)
        },
        error: () => {
            alert('失败')
        }
    })
}
//初次调用
ajaxHtml('重庆')


//显示main
let main = document.getElementById('main')
let tomTd = document.getElementById('tomTd')
let tomTm = document.getElementById('tomTm')
let days = document.getElementById('days')
let day2Items = document.getElementsByClassName('day2Items')[0]
input.addEventListener('keydown', function () {
    // 回车提交表单
    // 兼容FF和IE和Opera
    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    if (code == 13) {
        let value = input.value;
        cityHistory.push(value);
        bigsearch.style.display = 'none'
        ajaxHtml(input.value);
        document.getElementById('historyItems').innerHTML += `<li class="historyItems">
        ${input.value}</li>`
        cityHistory.push(input.value);
        input.value = ''
    }

})


//风速滚动 为什么更新数据后就不滚了 最后只能不重载节点来解决..无语..好麻烦
let win = document.getElementById('win')
let win1 = document.getElementById('win1')
let win2 = document.getElementById('win2')
let updataTimeC = document.getElementById('updataTimeC')
setInterval(() => {
    if (win1.style.transform == 'translateY(-0.3rem)') {
        win1.style.transform = 'translateY(0)';
        win2.style.transform = 'translateY(0)';
    } else {
        win1.style.transform = 'translateY(-0.3rem)';
        win2.style.transform = 'translateY(-0.3rem)';
    }
}, 3000);
setInterval(() => {
    if (updataTimeC.style.transform == 'translateY(-0.3rem)') {
        updataTimeC.style.transform = 'translateY(0)';
    } else {
        updataTimeC.style.transform = 'translateY(-0.3rem)';
    }
}, 4000);
//点击出现搜索框
let city = document.getElementById('city');
let bigsearch = document.getElementById('bigsearch')
let cancel = document.getElementById('cancel')
city.addEventListener('click', function () {
    bigsearch.style.display = 'inline';
    // bigsearch.style.transform='translateY(0)';
})
cancel.addEventListener('click', function () {
    bigsearch.style.display = 'none'
})
//点击清除
document.getElementById('delete').addEventListener('click', function () {
    document.getElementById('historyItems').innerHTML = ''
})
//烦死了 为什么重载节点之后绑定事件失效啊啊啊啊啊 所以到底要怎么才能给新添加的绑定数据啊无语！
let historyItems = document.getElementsByClassName('historyItems');
for(let i = 0;i<historyItems.length;i++){
   document.getElementsByClassName('historyItems')[i].addEventListener('click',function(){
   let area = document.getElementsByClassName('historyItems')[i].innerHTML;
   console.log(area)
    ajax(area);
      bigsearch.style.display = 'none'
})
}