toast('auto.js start');


// const killapp = () => {
//     var name = getPackageName(packageName);
//     if (!name) {
//         if (getAppName(packageName)) {
//             name = packageName;
//         } else {
//             return false;
//         }
//     }
//     app.openAppSetting(name);
//     text(app.getAppName(name)).waitFor();
//     let is_sure = textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne();
//     if (is_sure.enabled()) {
//         textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne().click();
//         buttons=textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*|确定|是)/).find()
//         if(buttons.length>0){
//             buttons[buttons.length-1].click()
//         }
        
//         log(app.getAppName(name) + "应用已被关闭");
//         sleep(1000);
//         back();
//     } else {
//         log(app.getAppName(name) + "应用不能被正常关闭或不在后台运行");
//         back();
//     }
// }

const init = () => {

    var appName = '叮咚买菜';
    launchApp(appName)

    auto.waitFor()

    console.log('windows', auto.windows)
    if (auto.windows.length < 1) {
        toast('没有找到对应窗口')
        return
    }
}


const skip_ad_page = () => {
    console.log('skip ad page start')
    // textContains('购物车').untilFind()
    sleep(5000)
    console.log('skip ad page end')
    fresh()
}

const fresh = () => {
    console.log('start refresh')
    click('首页')
    click('购物车')
    console.log('end refresh')
}

const shopping = () => {
    fresh()

    let err_time = 0;

    while (true) {
        var button = textContains('去结算').findOne()
        console.log('submit:', button)
        if (button.text() === '去结算') {
            err_time++;
            if (err_time > 10) {
                toast('购物车内没有商品，自动退出');
                break;
            }
            sleep(200)
            fresh()
            continue;
        }
        button.click()
        break;
    }
}


const time_2_delivery = () => {
    var timer = textContains('请选择送达时间').findOne()
    timer.click()
    let timeSet = id('cl_item_select_hour_root').find();
    if (timeSet.empty()) {
        console.log('没有找到可送时间')
        return false
    }
    for (let i = 0; timeSet.length > i; i++) {
        if (timeSet[i].clickable) {
            timeSet[i].click()
            return true
        }
    }
    return false
}


const pay = () => {
    var payBtn = textContains('立即').findOne()
    console.log("payBtn:", payBtn)
    payBtn.click()
    toast('赶快付钱')
}


const start = () => {
    init()
    skip_ad_page()
    shopping()

    while (true) {
        let time_result = time_2_delivery()
        if (!time_result) {
            toast('没有选到配送时间');
            sleep(100)
            continue
        }
        pay()
        break;
    }
}

start()