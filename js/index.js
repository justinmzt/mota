require('babel-polyfill');

// 按键事件
document.onkeydown = function (event) {
    const e = event || window.event || arguments.callee.caller.arguments[0];
    if (!e) {
        return
    }
    let evt = keyToEvent[e.keyCode];
    if (evt !== undefined) {
        keyState[e.keyCode] = true;
        eventEmitter.emit(evt, e.keyCode)
    }
};
document.onkeyup = function (event) {
    const e = event || window.event || arguments.callee.caller.arguments[0];
    if (!e) {
        return
    }
    let evt = keyToEvent[e.keyCode];
    if (evt !== undefined) keyState[e.keyCode] = false;
}
document.onkeypress = function (event) {
    const e = event || window.event || arguments.callee.caller.arguments[0];
    if (!e) {
        return
    }
    let evt = alphaKeyToEvent[e.keyCode];
    if (evt !== undefined) {
        eventEmitter.emit(evt, e.keyCode)
    }
};
document.onmouseup = function (event) {
    if (event.which === 1) {
        eventEmitter.emit('click', event.pageX, event.pageY)
    }
};

/**
 * @function bindEvent 将事件绑定到对象上（感觉可以直接调用，不必要用这个，但这个可以把事件提取出来，阅读也比较方便）
 *
 * @param {Object} eventEmitter 事件触发对象
 * @param {Object} entity 游戏对象
 *
 * @return {Object} ITEM 对象生成函数表
 *
 */
const bindEvent = (eventEmitter, entity) => {
    eventEmitter.on('go_floor', (floor) => {
        entity._goFloor(floor)
    });
    eventEmitter.on('deleteItem', (x, y) => {
        entity.onEvent = false;
        entity.deleteItem(x, y)
    });
    eventEmitter.on('battleInfo', (monster) => {
        entity.battleInfo(monster)
    });
    eventEmitter.on('i-monsterInfo', () => {
        console.log('monsterInfo');
        entity.monsterInfo();
    });
    eventEmitter.on('spacePressed', () => {
        entity.spacePressed();
    });
    eventEmitter.on('leftArrowPressed', () => {
        entity.leftArrowPressed();
    });
    eventEmitter.on('rightArrowPressed', () => {
        entity.rightArrowPressed();
    });
    eventEmitter.on('upArrowPressed', () => {
        entity.upArrowPressed();
    });
    eventEmitter.on('downArrowPressed', () => {
        entity.downArrowPressed();
    });
    eventEmitter.on('click', (x, y) => {
        entity.mouseClick = true;
        entity.mouseX = x;
        entity.mouseY = y
    });
    eventEmitter.on('flowOnClick', (orient) => {
        entity.flowOnClick(orient)
    });
// todo: eventEmitter 其他事件
    eventEmitter.bindParam = function (targetObj, param) {
        Object.defineProperty(this, param, {
            get: function () {
                return targetObj[param]
            },
            set: function (value) {
                targetObj[param] = value;
            }
        });
    }
    eventEmitter.bindParam(entity, 'onEvent');
    eventEmitter.bindParam(entity, 'window');
};
/**
 * @function initItem 初始化对象生成函数
 *
 * @param {Object} items 配置信息
 *
 * @return {Object} ITEM 对象生成函数表
 *
 */
const initItem = (items) => {
    let ITEM = {};
    for (let [key, value] of Object.entries(items)) {
        switch (value.class) {
            case 1:
                ITEM[key] = () => {
                    return new Item(value.option)
                };
                break;
            case 2:
                ITEM[key] = () => {
                    return new Door(value.option)
                };
                break;
            case 3:
                ITEM[key] = () => {
                    let go_floor = new Item(value.option);
                    go_floor.go = () => {
                        return value.option.go
                    };
                    return go_floor
                };
                break;
            case 4:
                ITEM[key] = () => {
                    return new NPC(value.option)
                };
                break;
            case 5:
                ITEM[key] = () => {
                    return new Monster(value.option)
                };
                break;
        }

    }
    return ITEM
};
/**
 * @function keyIsDown 按键是否被按下
 *
 * @param {Number} keyCode
 *
 * @return {Boolean} ifDown
 *
 */
const keyIsDown = (keyCode) => {
    return keyState[keyCode]
};
/**
 * @function transferXToPixel 将网格数据转换为像素数据
 *
 * @param {Number} x 网格x坐标值
 *
 * @return {Number} x 像素值
 *
 */
const transferXToPixel = (x) => {
    return OFFSET + BORDER + UNIT * x
};
/**
 * @function transferXToPixel 将网格数据转换为像素数据
 *
 * @param {Number} y 网格y坐标值
 *
 * @return {Number} y 像素值
 *
 */
const transferYToPixel = (y) => {
    return BORDER + UNIT * y
};


/**
 * 主窗口类
 *
 * @class Canvas
 *
 * @constructor
 *
 * @param {Number} width 窗口宽度
 * @param {Number} height 窗口高度
 *
 * @property {Boolean} onEvent 是否处于事件状态
 * @property {Number} window 当前所在窗口 0 主窗口/ 1 怪物信息/ 2 对话/ 3 交易
 * @property {Number} width 窗口宽度
 * @property {Number} height 窗口高度
 * @property {Object} canvasNode canvas DOM 节点
 * @property {Object} ctx canvas中的CanvasRenderingContext2D
 * @property {Boolean} mouseClick 是否存在鼠标左键点击事件
 * @property {Number} mouseX 点击事件事发x坐标
 * @property {Number} mouseY 点击事件事发y坐标
 * @property {Object} images 所有读取完的图片节点，以键值对保存
 * @property {Array} map 所有生成的地图对象
 * @property {Number} map_num 当前所在地图序号
 * @property {Object} braver 勇者，玩家可控角色对象
 * @property {Object} dialog 当前进行的对话事件对象
 * @property {Object} trade 当前进行的交易事件对象
 * @property {Object} monster 当前进行的显示怪物信息对象
 *
 *
 */
class Canvas {
    constructor(width, height) {
        this.width = width || 800;
        this.height = height || 480;
        this.canvasNode = document.createElement("Canvas");
        this.canvasNode.setAttribute('width', this.width);
        this.canvasNode.setAttribute('height', this.height);
        this.ctx = this.canvasNode.getContext("2d");
        document.getElementsByTagName('body')[0].appendChild(this.canvasNode)
        this.images = {};
        this.map = [];
        this.map_num = 0;
        this.braver = new Actor({image: 'actor', name: '勇者'});
        this.window = 0;
        this.onEvent = false;
    }

    // 基本canvas绘图方法

    /**
     * @method clear: 清屏
     *
     * @return null
     *
     */
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * @method background: 使用纯色填充背景
     *
     * @param {String} color 颜色
     *
     * @return null
     *
     */
    background(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height)
    }
    /**
     * @method rect: 绘制填充矩形
     *
     * @param {Number} x 横坐标
     * @param {Number} y 纵坐标
     * @param {Number} w 宽度
     * @param {Number} h 高度
     * @param {String} color 颜色
     *
     * @return null
     *
     */
    rect(x, y, w, h, color) {
        this.ctx.strokeRect(x, y, w, h);
        this.ctx.fillStyle = color || 'white';
        this.ctx.fillRect(x, y, w, h);
    }

    /**
     * @method font: 设置字的字号颜色（字号还未适应窗口大小）
     *
     * @param {Number} size 字号
     * @param {String} color 颜色
     *
     * @return null
     *
     */
    font(size, color) {
        if (color === undefined) {
            this.ctx.fillStyle = 'black'
        }
        else {
            this.ctx.fillStyle = color
        }
        if (size !== undefined) {
            this.fontSize = size;
            this.ctx.font = size + 'px serif';
        }
    }

    /**
     * @method text: 打印文字
     *
     * @param {String} text 文本
     * @param {Number} x 横坐标
     * @param {Number} y 纵坐标
     * @param {Number} size 字号
     * @param {String} align 对齐方式 'center', 'left', 'right'
     * @param {String} color 颜色
     *
     * @return null
     *
     */
    text(text, x, y, size, align, color) {
        if (align !== undefined) {
            this.ctx.textAlign = align;
        }
        this.font(size, color);
        this.ctx.fillText(text, x, y + this.fontSize / 2);
    }

    /**
     * @method image: 打印图片（原来的API不太舒服，重新包装了一下）
     *
     * @param {Object} image 图片dom节点
     * @param {Number} sx 横坐标
     * @param {Number} sy 纵坐标
     * @param {Number} sWidth 宽度
     * @param {Number} sHeight 高度
     * @param {Number} dx 切割原图（位置横坐标）
     * @param {Number} dy 切割原图（位置纵坐标）
     * @param {Number} dWidth 切割原图（切割宽度）
     * @param {Number} dHeight 切割原图（切割高度）
     *
     * @return null
     *
     */
    image(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
        if (dx !== undefined) {
            this.ctx.drawImage(this.images[image], dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight);
        }
        else {
            this.ctx.drawImage(this.images[image], sx, sy, sWidth, sHeight)
        }
    }

    /**
     * @method isClickInPath: 判断上次鼠标左键是否在区域内
     *
     * @param {Number} sx 横坐标
     * @param {Number} sy 纵坐标
     * @param {Number} sWidth 宽度
     * @param {Number} sHeight 高度
     *
     * @return null
     *
     */
    isClickInPath(sx, sy, sWidth, sHeight) {
        if (this.mouseClick === true) {
            this.ctx.beginPath(); // 注意这步不可省略，否则判定区域会计算所有前后绘制过的路径
            this.ctx.globalAlpha=0;
            this.ctx.rect(sx, sy, sWidth, sHeight);
            this.ctx.stroke();
            this.ctx.globalAlpha=1;
            this.ctx.closePath();
            if (this.ctx.isPointInPath(this.mouseX, this.mouseY)) {
                console.log(this.mouseX, this.mouseY)
                this.mouseClick = false;
                return true
            }
        }
        return false
    }


    // 人物连续移动
    moving() {
        if (this.onEvent) {
            return;
        }
        if (keyIsDown(37)) {
            this.braver.movingLeft(this.map[this.map_num].data)
        }
        else if (keyIsDown(38)) {
            this.braver.movingUp(this.map[this.map_num].data)
        }
        else if (keyIsDown(39)) {
            this.braver.movingRight(this.map[this.map_num].data)
        }
        else if (keyIsDown(40)) {
            this.braver.movingDown(this.map[this.map_num].data)
        }
        else {
            this.braver.time_moving = 0;
            this.braver.speed = 0;
            this.braver.stand()
        }
    }

    /**
     * @method deleteItem: 删除某一单位
     *
     * @param {Number} x 横坐标
     * @param {Number} y 纵坐标
     *
     * @return null
     *
     */
    deleteItem(x, y) {
        this.map[this.map_num].data[y][x] = 0;
    }

    /**
     * @method dealTrade: 处理NPC交易
     *
     * @param {Object} info 交易信息
     * @param {Number} info.coin 交易金额
     * @param {String} info.good 商品名称
     * @param {Number} info.attr 商品种类
     * @param {Number} info.num 商品数量
     *
     * @return {Boolean} ifCommit 是否成交
     *
     */
    dealTrade(info) {
        if (info.coin > this.braver.coin) {
            return false
        }
        this.braver.coin -= info.coin;
        this.braver[info.good][info.attr] += info.num;
        return true
    }

    /**
     * @method monsterInfo: 加载当前层怪物信息
     *
     * @return null
     *
     */
    monsterInfo () {
        if (this.window === 1) {
            this.window = 0;
            this.onEvent = false;
            return
        }
        if (this.onEvent) {
            return
        }
        this.onEvent = true;
        let monster = [];
        let monster_map = {};
        this.map[this.map_num].data.every(function (item) {
            item.every(function (item) {
                if (item.category === 'monster') {
                    monster_map[item.coin] = item
                }
                return true;
            });
            return true;
        });
        for (let key in monster_map) {
            monster.push(monster_map[key])
        }
        this.monster = new MonsterInfo(monster, this.braver);
        console.log(monster);
        this.window = 1;
    }

    /**
     * @method battleInfo: 加载更新战斗信息
     *
     * @return null
     *
     */
    battleInfo(monster) {
        if (monster.life <= 0) {
            this.rect(UNIT * 1.5, UNIT * 2, UNIT * 2, BORDER);
            this.text(this.braver.life, UNIT * 3.5 - 2, UNIT * 2.25, 16, 'right');
            this.rect(UNIT * 1.5 + UNIT * 16, UNIT * 9.1, UNIT * 2, BORDER);
            this.rect(UNIT * 1.5 + UNIT * 16, UNIT * 9.7, UNIT * 2, BORDER);
            this.rect(UNIT * 1.5 + UNIT * 16, UNIT * 10.3, UNIT * 2, BORDER);
            this.text(0, UNIT * 19.5 - 2, UNIT * 9.35);
            this.text(0, UNIT * 19.5 - 2, UNIT * 9.95);
            this.text(0, UNIT * 19.5 - 2, UNIT * 10.55);
            this.onEvent = false;
            this.braver.kill[monster.name] = ++this.braver.kill[monster.name] || 1;
            this.deleteItem(this.braver.X, this.braver.Y);
            return;
        }
        this.rect(UNIT * 1.5, UNIT * 2, UNIT * 2, BORDER);
        this.text(this.braver.life, UNIT * 3.5 - 2, UNIT * 2.25);
        this.rect(UNIT * 1.5 + UNIT * 16, UNIT * 9.1, UNIT * 2, BORDER);
        this.text(monster.life, UNIT * 19.5 - 2, UNIT * 9.35);
    }

    /**
     * @method update: 根据窗口加载下一帧（定时反复调用生成一帧）
     *
     * @return null
     *
     */
    update() {
        //todo: 多个窗口
        if (this.window === 1) {
            this.rect(OFFSET + BORDER, BORDER, UNIT * 11, UNIT * 11, 'black');
            for (let i = 0; i < this.monster.currentNode(); i++) {
                let currentItem = this.monster.currentItem(i);
                this.monster.data[currentItem].load(0.5, 0.5 + i * 2);
                this.text(this.monster.data[currentItem].name, OFFSET + BORDER + UNIT * 2.5, BORDER + UNIT * (i * 2 + 1), 16, 'center', 'white');
                this.text(`生命 ${this.monster.data[currentItem].life}    攻击 ${this.monster.data[i].atk}    防御 ${this.monster.data[i].def}`, OFFSET + BORDER + UNIT * 4, BORDER + UNIT * (i * 2 + 0.5), 16, 'left', 'white');
                this.text(`金钱 ${this.monster.data[currentItem].coin}    杀敌 ${this.braver.kill[this.monster.data[currentItem].name] || 0}    损血 ${this.monster.data[currentItem].consume}`, OFFSET + BORDER + UNIT * 4, BORDER + UNIT * (i * 2 + 1.5), 16, 'left', 'white');
            }
            LEFT_FLOW.load(4, 10);
            RIGHT_FLOW.load(6, 10)
        }
        else if (this.window === 2) {
            this.dialog.update()
            // this._loadDialogFrame()
        }
        else if (this.window === 3) {
            this.trade.update()
            // this._loadDialogFrame()
        }
        else {
            this.moving();
            this.map[this.map_num].load();
            this.braver.move();
        }
        setTimeout(() => {
            this.update();
        }, 1000 / 60);
    }


    // 按键操作

    /**
     * @method spacePressed: space按键操作
     *
     * @return null
     *
     */
    spacePressed () {
        if (this.window === 0) {
            let next = this.braver.checkForward(this.map[this.map_num].data);
            if (!next) {
                return
            }
            let event = next.events[0];
            if (event.type === 'dialog') {
                console.log('dialog');
                this._emitDialog(event);
                if (!event.loop) {
                    next.events.shift();
                    if (!next.events.length) {
                        next.hasEvent = false
                    }
                }
                return
            }
            if (event.type === 'trade') {
                console.log('trade');
                event.load.self = next.load.bind(next);
                event.name.self = next.name;
                event.trader = next;
                this._emitTrade(event)
            }
            return
        }
        if (this.window === 2) {
            this.dialog.next();
            if (!this.dialog.content.length) {
                this.onEvent = false;
                this.window = 0;
            }
            return
        }
        if (this.window === 3) {
            this.trade.next();
            if (this.trade.over) {
                this.onEvent = false;
                this.window = 0;
                return
            }
            if (this.trade.trading) {
                this.trade.tradeResult(this.dealTrade(this.trade.info));
                this._reloadActorInfo()
            }
            return
        }
    }

    /**
     * @method flowOnClick: 箭头被单击
     *
     * @param {Number} orient 箭头方向 0 left/ 1 right
     *
     * @return null
     *
     */
    flowOnClick (orient) {
        if (this.window === 1) {
            this.monster.changePage(orient)
        }
    }

    /**
     * @method leftArrowPressed/upArrowPressed/rightArrowPressed/downArrowPressed: 方向键操作
     *
     * @return null
     *
     */
    leftArrowPressed () {
        if (this.window === 0) {
            if (this.onEvent) {
                return
            }
            this.braver.step({
                orient: 1,
                node: this.map[this.map_num].data[this.braver.Y],
                next: this.map[this.map_num].data[this.braver.Y][this.braver.X - 1],
                change: () => {
                    this.braver.X--
                }
            });
            return
        }
        if (this.window === 3) {
            this.trade.choose('left')
        }
    }
    upArrowPressed () {
        if (this.window === 0) {
            if (this.onEvent) {
                return
            }
            let obj = {
                orient: 3,
                node: this.map[this.map_num].data[this.braver.Y - 1],
                change: () => {
                    this.braver.Y--
                }
            };
            if (obj.node !== undefined) obj.next = obj.node[this.braver.X];
            this.braver.step(obj);
            // return
        }

    }
    rightArrowPressed () {
        if (this.window === 0) {
            if (this.onEvent) {
                return
            }
            this.braver.step({
                orient: 2,
                node: this.map[this.map_num].data[this.braver.Y],
                next: this.map[this.map_num].data[this.braver.Y][this.braver.X + 1],
                change: () => {
                    this.braver.X++
                }
            });
            return
        }
        if (this.window === 3) {
            this.trade.choose('right')
        }
    }
    downArrowPressed () {
        if (this.window === 0) {
            if (this.onEvent) {
                return
            }
            let obj = {
                orient: 0,
                node: this.map[this.map_num].data[this.braver.Y + 1],
                change: () => {
                    this.braver.Y++
                }
            };
            if (obj.node !== undefined) {
                obj.next = obj.node[this.braver.X];
            }
            this.braver.step(obj);
            return
        }
    }

    // async functions

    /**
     * @method loadImage: 加载图片
     * @async
     *
     * @param {String} name 图片名称
     * @param {String} source 图片地址
     *
     * @return {Object} Promise
     *
     */
    async loadImage(name, source) {
        if (source === undefined || name === undefined) {
            throw 'Image loading error'
        }
        let img = new Image();
        img.src = source;
        return new Promise((rsv) => {
            img.onload = () => {
                this.images[name] = img;
                rsv()
            }
        });
    }

    /**
     * @method loadImage: 调用预加载内容
     * @async
     *
     * @return {Object} Promise
     *
     */
    async preload() {
        for (const name of Object.keys(IMAGES)) {
            await this.loadImage(name, IMAGES[name]);
        }
        this._noSmooth();
        this._loadFrame();
        this._loadMap();
        this._loadBraver();
        this._loadInfo();
        this._loadEvents(config.EVENTS);
    }

    /**
     * @method loadImage: 入口
     * @async
     *
     * @return {Object} Promise（update方法启动后）
     *
     */
    async start() {
        await this.preload();
        this.update()
    }

    // private function

    /**
     * @method _noSmooth: 无浏览器平滑处理
     * @private
     *
     * @return null
     *
     */
    _noSmooth() {
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;
    }

    /**
     * @method _loadFrame: 绘出游戏外框架
     * @private
     *
     * @return null
     *
     */
    _loadFrame () {
        WALL = [new Wall({image: 'wall', imgX: 1, imgY: 0}), new Wall({image: 'wall', imgX: 2, imgY: 0}), new Wall({image: 'wall', imgX: 3, imgY: 0})];
        FLOOR = [new Floor({image: 'floor', imgX: 0, imgY: 0})];
        RIGHT_FLOW = new Flow({image: 'item_01_10', attr: 'flow', orient: 'right', level: 0, imgX: 3, imgY: 1});
        LEFT_FLOW = new Flow({image: 'item_01_10', attr: 'flow', orient: 'left', level: 0, imgX: 0, imgY: 2});
        ITEM = initItem(config.ITEM);
        for (let i = 0; i < 12; i++) {
            this.image('wall', 0, UNIT * i, UNIT, UNIT, 0, 0, 32, 32);
            this.image('wall', UNIT, UNIT * i, UNIT, UNIT, 0, 0, 32, 32);
            this.image('wall', UNIT * 2, UNIT * i, UNIT, UNIT, 0, 0, 32, 32);
            this.image('wall', UNIT * 3, UNIT * i, UNIT, UNIT, 0, 0, 32, 32);
            this.image('wall', UNIT * 16, UNIT * i, UNIT, UNIT, 0, 0, 32, 32);
            this.image('wall', UNIT * 17, UNIT * i, UNIT, UNIT, 0, 0, 32, 32);
            this.image('wall', UNIT * 18, UNIT * i, UNIT, UNIT, 0, 0, 32, 32);
            this.image('wall', UNIT * 19, UNIT * i, UNIT, UNIT, 0, 0, 32, 32);
            this.image('wall', OFFSET + UNIT * i, 0, UNIT, UNIT / 2, 32, 0, 32, 16);
            this.image('wall', OFFSET + UNIT * i, CANVAS_H - UNIT / 2, UNIT, UNIT / 2, 32, 0, 32, 16);
            this.image('wall', OFFSET, UNIT * i, UNIT / 2, UNIT, 32, 0, 16, 32);
            this.image('wall', OFFSET + CANVAS_H - UNIT / 2, UNIT * i, UNIT / 2, UNIT, 32, 0, 16, 32);
        }
    }
    /**
     * @method _loadMap: 加载所有地图对象
     * @private
     *
     * @return null
     *
     */
    _loadMap() {

//         // todo: 这里先测试NPC，之后再将NPC的对话解耦出去


        for (let i = 0; i < MAP_ENTER.length; i++) {
            this.map[i] = new Map({data: MAP[i], enter: MAP_ENTER[i], leave: MAP_LEAVE[i]})
        }
    }

    /**
     * @method _loadInfo: 加载人物角色、怪物信息
     * @private
     *
     * @return null
     *
     */
    _loadInfo () {
        this.rect(UNIT / 2, UNIT, UNIT * 3, INFO);                        // 层数显示框
        this.rect(UNIT * 1.5, UNIT * 2, UNIT * 2, BORDER);                // 角色生命值框
        this.rect(UNIT * 1.5, UNIT * 2.75, UNIT * 2, BORDER);             // 角色攻击值框
        this.rect(UNIT * 1.5, UNIT * 3.5, UNIT * 2, BORDER);              // 角色防御值框
        this.rect(UNIT * 1.5, UNIT * 4.25, UNIT * 2, BORDER);             // 角色金钱框
        this.rect(UNIT / 2, UNIT * 5, UNIT * 3, UNIT * 6);                // 角色道具框
        this.rect(UNIT / 2 + UNIT * 16, UNIT, UNIT * 3, UNIT);            // 怪物名称框
        this.rect(UNIT / 2 + UNIT * 16, UNIT * 2.25, UNIT * 3, UNIT);     // 怪物生命值框
        this.rect(UNIT / 2 + UNIT * 16, UNIT * 4, UNIT * 3, UNIT * 2.5);  // 怪物攻击值框
        this.rect(UNIT / 2 + UNIT * 16, UNIT * 7, UNIT * 3, UNIT * 4);    // 怪物防御值框
        this.text('魔塔 第' + (this.map_num + 1) + '层', UNIT * 2, UNIT + INFO / 2, INFO - 5, 'center');
        this.text(this.braver.life, UNIT * 3.5 - 2, UNIT * 2.25, BORDER - 5, 'right');
        this.text(this.braver.atk, UNIT * 3.5 - 2, UNIT * 3);
        this.text(this.braver.def, UNIT * 3.5 - 2, UNIT * 3.75);
        this.text(this.braver.coin, UNIT * 3.5 - 2, UNIT * 4.5);
        this.rect(UNIT / 2 + UNIT * 16, UNIT * 8.5, UNIT * 3, BORDER);
        this.rect(UNIT * 1.5 + UNIT * 16, UNIT * 9.1, UNIT * 2, BORDER);
        this.rect(UNIT * 1.5 + UNIT * 16, UNIT * 9.7, UNIT * 2, BORDER);
        this.rect(UNIT * 1.5 + UNIT * 16, UNIT * 10.3, UNIT * 2, BORDER);
        this.text('生命', UNIT * 17.5 - 5, UNIT * 9.35);
        this.text('攻击', UNIT * 17.5 - 5, UNIT * 9.95);
        this.text('防御', UNIT * 17.5 - 5, UNIT * 10.55);
    }
    _loadBraver() {
        this.braver.setLocation(this.map[this.map_num].enter)
        this.braver.coin = 9999 // 预设高金币
    }
    /**
     * @method _loadEvents: 加载事件（目前有对话、交易）
     * @private
     *
     * @param {Array} events 事件数组
     *
     * @return null
     *
     */
    _loadEvents(events) {
        events.every((event) => {
            this.map[event.map_num].data[event.Y][event.X].setEvents(event.events);
            return true;
        });
    }
    /**
     * @method _reloadActorInfo: 重载人物角色信息
     * @private
     *
     * @return null
     *
     */
    _reloadActorInfo () {
        this.rect(UNIT * 1.5, UNIT * 2, UNIT * 2, BORDER);
        this.rect(UNIT * 1.5, UNIT * 2.75, UNIT * 2, BORDER);
        this.rect(UNIT * 1.5, UNIT * 3.5, UNIT * 2, BORDER);
        this.rect(UNIT * 1.5, UNIT * 4.25, UNIT * 2, BORDER);
        this.text(this.braver.life, UNIT * 3.5 - 2, UNIT * 2.25, BORDER - 5, 'right');
        this.text(this.braver.atk, UNIT * 3.5 - 2, UNIT * 3);
        this.text(this.braver.def, UNIT * 3.5 - 2, UNIT * 3.75);
        this.text(this.braver.coin, UNIT * 3.5 - 2, UNIT * 4.5);
    }

    /**
     * @method _reloadFloorNum: 重载层数信息
     * @private
     *
     * @return null
     *
     */
    _reloadFloorNum () {
        this.rect(UNIT / 2, UNIT, UNIT * 3, INFO);                        // 层数显示框
        this.text('魔塔 第' + (this.map_num + 1) + '层', UNIT * 2, UNIT + INFO / 2, INFO - 5, 'center');
    }

    /**
     * @method _goFloor: 重载人物角色信息
     * @private
     *
     * @param {Object} floor: 上下楼处理对象
     *
     * @return null
     *
     */
    _goFloor(floor) {
        if (floor.go()) {
            this.map_num++;
            this.braver.map_num++;
            this.braver.setLocation(this.map[this.map_num].enter);
            this._reloadFloorNum()
        }
        else {
            this.map_num--;
            this.braver.map_num--;
            this.braver.setLocation(this.map[this.map_num].leave);
            this._reloadFloorNum()
        }
    }

    /**
     * @method _emitTrade: 触发交易事件，切换到交易窗口
     * @private
     *
     * @param {Object} option: 交易配置信息
     *
     * @return null
     *
     */
    _emitTrade (option) {
        this.window = 3;
        this.onEvent = true;
        this.trade = new Trade(option);
    }

    /**
     * @method _emitTrade: 触发对话事件，切换到对话窗口
     * @private
     *
     * @param {Object} option: 对话配置信息
     *
     * @return null
     *
     */
    _emitDialog (option) {
        this.window = 2;
        this.onEvent = true;
        this.dialog = new Dialog(option);
    }

}

/**
 * 地图类
 *
 * @class Map
 *
 * @constructor
 *
 * @param {Array} data 地图数据（二维数组形式）
 * @param {Object} enter 进图坐标 x, y
 * @param {Object} leave 出图坐标
 *
 * @property {Array} data 地图数据（二维数组形式）
 * @property {Object} enter 进图坐标 x, y
 * @property {Object} leave 出图坐标
 * @property {Number} wallNum 墙序号
 * @property {Number} floorNum 地板序号
 *
 */
class Map {
    constructor(option) {
        this.data = option.data;
        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].length; j++) {
                let node = this.data[i][j];
                if (node !== 1 && node !== 0) {
                    this.data[i][j] = ITEM[node]()
                }
            }
        }
        this.enter = option.enter;
        this.leave = option.leave;
        this.wallNum = 0;
        this.floorNum = 0;
    }

    /**
     * @method load: 加载地图数据
     *
     * @return null
     *
     */
    load() {
        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].length; j++) {
                let node = this.data[i][j];
                if (node === 1) {
                    WALL[this.wallNum].load(j, i);
                }
                else {
                    FLOOR[this.floorNum].load(j, i);
                }
                if (typeof(node) === 'object') {
                    node.load(j, i);
                }
            }
        }
    }
}

/**
 * 怪物信息类
 *
 * @class MonsterInfo
 *
 * @constructor
 *
 * @param {Array} monsters 出现怪物对象数组
 * @param {Object} braver 人物角色对象
 *
 * @property {Number} node 每页显示怪物数
 * @property {Number} page 页码
 * @property {Number} totalPage 总页数
 * @property {Array} data 出现怪物对象数组
 *
 */
class MonsterInfo {
    constructor(monsters, braver) {
        this.node = 4;
        this.page = 0;
        this.data = monsters;
        this.totalPage = Math.ceil(this.data.length / this.node);
        this.data.every(function (item) {
            let atk = braver.atk - item.def;
            let mAtk = item.atk - braver.def;
            if (atk <= 0) {
                item.consume = '打不过';
                return true;
            }
            let consume = mAtk * Math.ceil(item.life / atk);
            if (consume > braver.life) {
                item.consume = '打不过';
                return true;
            }
            item.consume = consume;
            return true;
        });
    }

    /**
     * @method currentNode: 判断当前页面显示多少条怪物数据
     *
     * @return {Number} node 显示数据条数
     *
     */
    currentNode() {
        let current = this.data.length - this.page * this.node;
        return current > this.node ? this.node : current;
    }

    /**
     * @method currentItem: 对应数组位置
     *
     * @return {Number} i 对应数组中序号
     *
     */
    currentItem(i) {
        return this.page * this.node + i;
    }

    /**
     * @method changePage: 切换页面
     *
     * @return null
     *
     */
    changePage(orient) {
        if (orient === 'right') {
            if (this.page >= this.totalPage) {
                return
            }
            this.page++
        }
        if (orient === 'left') {
            if (this.page <= 0) {
                return
            }
            this.page--
        }
    }
}

/**
 * 对话事件类
 *
 * @class Dialog
 *
 * @constructor
 *
 * @param {Object} load 包含对话出现各人物的动作绘制函数
 * @param {Object} name 人物名称表
 * @param {Array} content 对话数组，每个元素是以人物为key，对话内容为value的键值对
 * @param {Boolean} loop 是否重复对话
 *
 * @property {Object} load 包含对话出现各人物的动作绘制函数
 * @property {Object} name 人物名称表
 * @property {Array} content 对话数组，键值对中的字符串按窗口分割，抽取成了字符串数组形式
 * @property {Number} subNode 对话切割长度
 * @property {Number} nameFontSize 名称字号
 * @property {Number} textFontSize 文本字号
 * @property {Object} wall 绘制墙的对象
 * @property {Object} floor 绘制地板的对象
 *
 */
class Dialog {
    constructor(option) {
        this.load = option.load;
        this.name = option.name;
        this.loop = option.loop;
        this.subNode = 19;
        this.nameFontSize = 20;
        this.textFontSize = 14;
        this.content = [];
        option.content.every((item) => {
            for (let key of Object.keys(item)) {
                this.content.push({
                    [key]: this._subContent(item[key])
                })
            }
            return true;
        });
        this.wall = WALL[1];
        this.floor = FLOOR[0];
        this._loadDialogFrame()
    }

    /**
     * @method _subContent: 切割字符串
     * @private
     *
     * @param {String} content: 对话字符串
     *
     * @return {Array} rst 分割后的字符串数组
     *
     */
    _subContent(content) {
        let ctt = content;
        let rst = [];
        while (ctt.length) {
            let len = ctt.length;
            rst.push(ctt.substr(0, this.subNode));
            ctt = ctt.substr(this.subNode, len)
        }
        return rst
    }

    /**
     * @method _loadDialogFrame: 绘制对话框架
     * @private
     *
     * @return null
     *
     */
    _loadDialogFrame () {
        for (let i = 0; i < 11; i++) {
            this.wall.load(i, 3);
            this.wall.load(i, 4);
            this.wall.load(i, 5);
            this.wall.load(i, 6);
            this.wall.load(i, 7)
        }
        for (let i = 0; i < 10; i++) {
            let x = i + 0.5;
            this.floor.load(x, 3.5);
            this.floor.load(x, 4.5);
            this.floor.load(x, 5.5);
            this.floor.load(x, 6.5);
        }
    }

    /**
     * @method _loadPeople: 绘制对话人物动作
     * @private
     *
     * @return null
     *
     */
    _loadPeople (person, x, y) {
        this.floor.load(x + 0.5, y + 3.5); // 为了刷新背景
        this.load[person](x + 0.5, y + 3.5);
        this._textName(this.name[person], x + 0.5, y + 1.5)
    }

    /**
     * @method _textName: 打印角色名称
     * @private
     *
     * @param {String} content: 字符串
     * @param {String} x: 相对对话框架的横坐标
     * @param {String} y: 同上
     * @param {String} align: 对齐方式
     *
     * @return null
     *
     */
    _textName (content, x, y, align) {
        text(content,
            transferXToPixel(x + 0.5),
            transferYToPixel(y + 3.5),
            this.nameFontSize,
            align || 'center',
            'white'
        )
    }

    /**
     * @method _textName: 打印文本
     * @private
     *
     * @param {String} content: 字符串
     * @param {String} x: 相对对话框架的横坐标
     * @param {String} y: 同上
     *
     * @return null
     *
     */
    _textContent (content, x, y) {
        text(content,
            transferXToPixel(x + 0.5),
            transferYToPixel(y + 3.5),
            this.textFontSize,
            'left',
            'white'
        )
    }

    /**
     * @method _textName: 打印所有文本
     * @private
     *
     * @param {Array} content: 字符串数组
     *
     * @return null
     *
     */
    _loadContent (content) {
        for (let i = 0; i < content.length; i++) {
            this._textContent(content[i], 3, 0.5 * i + 1)
        }
    }

    /**
     * @method next: 进入下一句话
     *
     * @return null
     *
     */
    next () {
        this.content.shift();
        if (this.content.length) {
            this._loadDialogFrame()
        }
    }

    /**
     * @method update: 绘制下一帧
     *
     * @return null
     *
     */
    update () {
        let key = Object.keys(this.content[0])[0];
        this._loadPeople(key, 1, 1);
        this._loadContent(this.content[0][key])
    }
}

/**
 * 交易事件类
 *
 * @class Dialog
 *
 * @constructor
 *
 * @param {Object} load 包含对话出现各人物的动作绘制函数
 * @param {Object} name 人物名称表
 * @param {Array} content 对话数组，每个元素是以人物为key，对话内容为value的键值对
 * @param {Boolean} loop 是否重复对话
 * @param {Object} info 交易内容
 * @param {Object} trader 交易的NPC
 *
 * @extends @property {Object} load 包含对话出现各人物的动作绘制函数
 * @extends @property {Object} name 人物名称表
 * @extends @property {Array} content 对话数组，键值对中的字符串按窗口分割，抽取成了字符串数组形式
 * @extends @property {Boolean} loop 是否重复对话
 * @extends @property {Object} wall 绘制墙的对象
 * @extends @property {Object} floor 绘制地板的对象
 * @property {Object} info 交易内容
 * @property {Object} trader 交易的NPC
 * @property {Number} option 选项
 * @property {String} accept 选项文本（接收）
 * @property {String} reject 选项文本（拒绝）
 * @property {Boolean} trading 是否正在交易
 * @property {Boolean} ifCommit 是否成交
 * @property {String} trade_result 交易结果文本
 * @property {Boolean} over 是否结束
 *
 */
class Trade extends Dialog{
    constructor(option) {
        super(option);
        this.info = option.info;
        this.trader = option.trader;
        this.option = 0;
        this.accept = '好的';
        this.reject = '算了';
        this.trading = false;
        this.over = false;
    }

    /**
     * @method _textName: 打印选项
     * @private
     *
     * @param {String} content: 字符串
     * @param {String} x: 相对对话框架的横坐标
     * @param {String} y: 同上
     * @param {String} color: 颜色
     *
     * @return null
     *
     */
    _textOption (content, x, y, color) {
        text(content,
            transferXToPixel(x + 0.5),
            transferYToPixel(y + 3.5),
            this.nameFontSize,
            'center',
            color
        )
    }

    /**
     * @method _loadOption: 加载选项，标红focus的选项
     * @private
     *
     * @return null
     *
     */
    _loadOption () {
        this._textOption(this.accept, 5, 3.25, this.option ? 'white' : 'red');
        this._textOption(this.reject, 8, 3.25, this.option ? 'red' : 'white')
    }

    /**
     * @method tradeResult: 处理交易结果
     *
     * @param {Boolean} ifCommit: 是否成交
     *
     * @return null
     *
     */
    tradeResult (ifCommit) {
        this.ifCommit = ifCommit;
        this.trade_result = [ifCommit ? '交易成功！' : '金币不足，交易失败！'];
        console.log(this.trade_result)
    }

    /**
     * @method choose: 交易选择
     *
     * @param {String} option: 选项 'right' or 'left'
     *
     * @return null
     *
     */
    choose (option) {
        if (option === 'right') {
            this.option = 1
        }
        if (option === 'left') {
            this.option = 0
        }
    }

    /**
     * @method next: 进入下一阶段
     *
     * @return null
     *
     */
    next () {
        if (this.trading) {
            if (this.ifCommit && !this.loop) {
                this.trader.events.shift()
            }
            this.over = true;
            return
        }
        if (this.option === 0) {
            this.trading = true;
            this._loadDialogFrame()
            return
        }
        this.over = true
    }

    /**
     * @method update: 绘制下一帧
     *
     * @return null
     *
     */
    update () {
        let key = Object.keys(this.content[0])[0];
        this._loadPeople(key, 1, 1);
        if (this.ifCommit !== undefined) {
            this._loadContent(this.trade_result)
        }
        else {
            this._loadContent(this.content[0][key]);
            this._loadOption();
        }
    }

}

/**
 * 物体
 *
 * @class Solid
 *
 * @constructor
 *
 * @param {Object} image 物体图片节点
 * @param {Number} imgX 在图片上分割出的横坐标
 * @param {Number} imgY 在图片上分割出的纵坐标
 *
 * @property {String} category 物体分类
 * @property {Object} image 物体图片节点
 * @property {Number} imgX 在图片上分割出的横坐标
 * @property {Number} imgY 在图片上分割出的纵坐标
 *
 */
class Solid {
    constructor(option) {
        this.category = 'solid';
        this.image = option.image;
        this.imgX = option.imgX || 0;
        this.imgY = option.imgY || 0;
    }

    /**
     * @method load: 绘制物体（在UNIT * UNIT长度的网格内）
     *
     * @param {Number} x 网格横坐标
     * @param {Number} y 网格纵坐标
     *
     * @return null
     *
     */
    load(x, y) {
        image(this.image,
            transferXToPixel(x),
            transferYToPixel(y),
            UNIT,
            UNIT,
            this.imgX * 32,
            this.imgY * 33,
            IMAGE_A,
            IMAGE_A
        )
    }

}

/**
 * 地板
 *
 * @class Floor
 * @extends Solid
 *
 * @constructor
 *
 * @property {String} category 物体分类 = 'floor'
 *
 */
class Floor extends Solid {
    constructor(option) {
        super(option);
        this.category = 'floor'
    }
}

/**
 * 墙体
 *
 * @class Floor
 * @extends Solid
 *
 * @constructor
 *
 * @property {String} category 物体分类 = 'wall'
 *
 */
class Wall extends Solid {
    constructor(option) {
        super(option);
        this.category = 'wall'
    }
}

/**
 * 方向箭头
 *
 * @class Flow
 * @extends Solid
 *
 * @constructor
 *
 * @param {Number} orient 箭头方向
 *
 * @property {Number} orient 箭头方向
 *
 */
class Flow extends Solid {
    constructor(option) {
        super(option);
        this.orient = option.orient
    }

    /**
     * @method load: 绘制物体，方法重写，增加按钮点击判定
     *
     * @param {Number} x 网格横坐标
     * @param {Number} y 网格纵坐标
     *
     * @return null
     *
     */
    load(x, y) {
        if (isClickInPath(
                transferXToPixel(x),
                transferYToPixel(y),
                UNIT,
                UNIT,
            )) {
            eventEmitter.emit('flowOnClick', this.orient)
        }
        super.load(x, y)
    }

}

/**
 * 个体（带有动画的物体）
 *
 * @class Item
 * @extends Solid
 *
 * @constructor
 *
 * @param {Number} attr 物体属性
 * @param {Number} level 物体等级
 * @param {Number} effect 物体效果
 *
 * @property {String} category 物体分类 = 'item'
 * @property {String} attr 物体属性 'key', 'gem', 'liquid'
 * @property {Number} level 物体等级 0/1/2/3
 * @property {Number} effect 物体效果（系数，具体效果由程序实现）
 * @property {Number} speed 物体切换动画的速度（这个数值是动作切换的帧间距）
 * @property {Number} count 动画切换帧的计数器
 *
 */
class Item extends Solid{
    constructor(option) {
        super(option);
        this.category = 'item';
        this.attr = option.attr;
        this.level = option.level;
        this.effect = option.effect;
        this.speed = 5;
        this.count = 0;
    }
}


/**
 * 门
 *
 * @class Door
 * @extends Item
 *
 * @constructor
 *
 * @property {Boolean} event_on 是否处于事件状态
 * @property {Boolean} over 门是否打开
 *
 */
class Door extends Item{
    constructor(option) {
        super(option);
        this.category = 'door';
        this.imgY = 0;
        this.event_on = false;
        this.count = 0;
        this.speed = 2;
        this.over = false;
    }

    /**
     * @method event: 触发门关闭事件
     *
     * @return null
     *
     */
    event () {
        this.event_on = true
    }

    /**
     * @method load: 绘制物体，方法重写，增加关门处理
     *
     * @param {Number} x 网格横坐标
     * @param {Number} y 网格纵坐标
     *
     * @return null
     *
     */
    load (x, y) {
        super.load(x, y);
        if (this.event_on) {
            if (this.count < this.speed) {
                this.count++;
                return;
            }
            if (this.imgY >= 3) {
                this.event_on = false;
                this.over = true;
                return;
            }
            this.count = 0;
            this.imgY++;
        }
        if (this.over) {
            eventEmitter.emit('deleteItem', x, y);
        }
    }
}

/**
 * 怪物
 *
 * @class Door
 * @extends Item
 *
 * @constructor
 *
 * @param {String} name 怪物名称
 * @param {Number} life 生命值
 * @param {Number} atk 攻击值
 * @param {Number} def 防御值
 * @param {Number} coin 掉落金钱数量
 *
 * @property {String} name 怪物名称
 * @property {Number} life 生命值
 * @property {Number} atk 攻击值
 * @property {Number} def 防御值
 * @property {Number} coin 金钱数量
 * @property {Object} actor 交战的角色
 * @property {Boolean} battle 是否处于战斗状态
 * @property {Number} battle_speed 战斗速度
 * @property {Number} battle_count 战斗计数器
 *
 */
class Monster extends Item{
    constructor(option) {
        super(option)
        this.category = 'monster';
        this.life = option.life;
        this.atk = option.atk;
        this.def = option.def;
        this.coin = option.coin;
        this.name = option.name;
        this.imgX = 0;
        this.speed = 20;
        this.count = 0;
        this.battle = false;
        this.battle_speed = 10;
        this.battle_count = 0;
    }

    /**
     * @method load: 绘制物体，方法重写，增加战斗信息处理
     *
     * @param {Number} x 网格横坐标
     * @param {Number} y 网格纵坐标
     *
     * @return null
     *
     */
    load (x, y) {
        super.load(x, y);
        this.count++;
        if (this.count === this.speed) {
            this.count = 0;
            this.imgX++;
            if (this.imgX > 3) this.imgX = 0
        }
        if (this.battle) {
            this.battle_count++;
            if (this.battle_count === this.battle_speed) {
                this.battle_count = 0;
                if (this.attacking) {
                    this.life -= this.actor.atk - this.def;
                    this.attacking = false
                } else {
                    this.actor.life -= this.atk - this.actor.def;
                    this.attacking = true
                }
                if (this.life <= 0) {
                    this.battle = false;
                    this.life = 0;
                }
                eventEmitter.emit('battleInfo', this)
            }
        }
    }

    /**
     * @method event: 触发战斗事件
     *
     * @param {Object} actor: 交战的角色对象
     *
     * @return null
     *
     */
    event(actor) {
        rect(UNIT * 1.5 + UNIT * 16, UNIT * 9.1, UNIT * 2, BORDER);
        rect(UNIT * 1.5 + UNIT * 16, UNIT * 9.7, UNIT * 2, BORDER);
        rect(UNIT * 1.5 + UNIT * 16, UNIT * 10.3, UNIT * 2, BORDER);

        text(this.life, UNIT * 19.5 - 2, UNIT * 9.35);
        text(this.atk, UNIT * 19.5 - 2, UNIT * 9.95);
        text(this.def, UNIT * 19.5 - 2, UNIT * 10.55);
        this.actor = actor;
        this.battle = true;
    }
}

/**
 * Non-Player controller
 *
 * @class NPC
 * @extends Item
 *
 * @constructor
 *
 * @param {String} name NPC名称
 *
 * @property {String} name NPC名称
 * @property {Array} events 所有事件
 * @property {Boolean} hasEvent 是否有事件
 *
 */
class NPC extends Item{
    constructor(option) {
        super(option);
        this.category = 'npc';
        this.name = option.name;
        this.speed = 20;
        this.count = 0;
        this.people = {}
    }

    /**
     * @method setEvents: 设置对话事件
     *
     * @return null
     *
     */
    setEvents (events){
        if (events !== undefined) {
            this.events = events;
            this.events.every((item) => {
                item.load = {
                    self: this.load.bind(this)
                };
                item.name = {
                    self: this.name
                };
                item.people.every((people) => {
                    this.people[people] = ITEM[people]();
                    item.load[people] = this.people[people].load.bind(this.people[people]);
                    item.name[people] = this.people[people].name;
                    return true;
                });
                return true;
            });
            this.hasEvent = Boolean(this.events)
        }
    }

    /**
     * @method load: 绘制物体，添加NPC动画
     *
     * @param {Number} x 网格横坐标
     * @param {Number} y 网格纵坐标
     *
     * @return null
     *
     */
    load (x, y) {
        super.load(x, y);
        this.count++;
        if (this.count === this.speed) {
            this.count = 0;
            this.imgX++;
            if (this.imgX > 3) this.imgX = 0
        }
    }

}


/**
 * 人物类
 *
 * @class Actor
 *
 * @constructor
 *
 * @param {Object} option.image 所使用的图片节点
 * @param {String} option.name 人物名字
 *
 * @property {String} name 人物名字
 * @property {Number} X 位置x坐标（网格）
 * @property {Number} Y 位置y坐标（网格）
 * @property {Number} orient 人物朝向 0 down/ 1 2 3
 * @property {Number} action 人物动作，对应素材中的每一帧画面
 * @property {Number} speed 切换动作间隔
 * @property {Number} count 切换动作的计数器
 * @property {Number} life 生命值
 * @property {Number} atk 攻击值
 * @property {Number} def 防御值
 * @property {Number} coin 金钱数量
 * @property {Array} key 钥匙数量 0 黄钥匙数量/ 1 蓝钥匙/ 2 红钥匙/ 3 绿钥匙
 * @property {Object} kill 已杀敌数量记录表
 * @property {Number} map_num 当前所在地图序号
 *
 */
class Actor {
    constructor(option) {
        this.image = option.image;
        this.name = option.name;
        this.X = 0;
        this.Y = 0;
        this.time_moving = 0;
        this.speed = 0;
        this.orient = 0;
        this.action = 0;
        this.speed = 20;
        this.count = 0;
        this.life = 400;
        this.atk = 10;
        this.def = 10;
        this.coin = 0;
        this.key = [0, 0, 0, 0];
        this.kill = {};
        this.map_num = 0;
    }

    /**
     * @method load: 在网格上绘出对象
     *
     * @param {Number} x 网格x坐标
     * @param {Number} y 网格y坐标
     *
     * @return null
     *
     */
    load (x, y) {
        // 朝向默认方向（向下）的绘图
        image(
            this.image,
            transferXToPixel(x),
            transferYToPixel(y),
            UNIT,
            UNIT,
            IMAGE_WIDTH * this.action,
            0,
            32,
            32);
        // 处理动作变化
        this.count++;
        if (this.count === this.speed) {
            this.count = 0;
            this.act()
        }
    }

    /**
     * @method setLocation: 设置人物位置（朝向恢复初始状态）
     *
     * @param {Number} X 网格x坐标
     * @param {Number} Y 网格y坐标
     *
     * @return null
     *
     */
    setLocation({X, Y}) {
        this.X = X;
        this.Y = Y;
        this.orient = 0;
    }

    /**
     * @method move: 绘制人物行走状态
     *
     * @return null
     *
     */
    move() {
        image(
            this.image,
            transferXToPixel(this.X),
            transferYToPixel(this.Y),
            UNIT,
            UNIT,
            32 * this.action,
            33 * this.orient,
            32,
            32);
    }

    /**
     * @method act: 对象触发下一个动作
     *
     * @return null
     *
     */
    act() {
        this.action++;
        if (this.action > 3) this.action = 0
    }

    /**
     * @method stand: 人物停下后调用，恢复站立状态
     *
     * @return null
     *
     */
    stand() {
        if (this.action % 2) this.action--
    }

    /**
     * @method movingRight: 向右走动，下类似
     *
     * @param {Object} data 所在地图数据对象
     *
     * @return null
     *
     */
    movingRight(data) {
        let next = data[this.Y][this.X + 1];
        if (next === undefined) return;
        if (this.orient !== 2) {
            this.orient = 2;
            return;
        }
        if (next !== 0) {
            this.time_moving = 0;
            return;
        }
        if (!next) {
            if (this.time_moving < TIME_MOVING) {
                this.time_moving++;
                return;
            }
            if (this.speed < MOVING_SPEED) {
                this.speed++;
                return;
            }
            this.X++;
            this.act();
            this.speed = 0
        }
    }

    movingLeft(data) {
        let next = data[this.Y][this.X - 1];
        if (next === undefined) return;
        if (this.orient !== 1) {
            this.orient = 1;
            return;
        }
        if (next !== 0) {
            this.time_moving = 0;
            return;
        }
        if (!next) {
            if (this.time_moving < TIME_MOVING) {
                this.time_moving++;
                return;
            }
            if (this.speed < MOVING_SPEED) {
                this.speed++;
                return;
            }
            this.X--;
            this.act();
            this.speed = 0
        }
    }

    movingUp(data) {
        let node = data[this.Y - 1];
        if (!node) return;
        if (this.orient !== 3) {
            this.orient = 3;
            return;
        }
        let next = node[this.X];
        if (next !== 0) {
            this.time_moving = 0;
            return;
        }
        if (!next) {
            if (this.time_moving < TIME_MOVING) {
                this.time_moving++;
                return;
            }
            if (this.speed < MOVING_SPEED) {
                this.speed++;
                return;
            }
            this.Y--;
            this.act();
            this.speed = 0;
        }
    }

    movingDown(data) {
        let node = data[this.Y + 1];
        if (!node) return;
        if (this.orient !== 0) {
            this.orient = 0;
            return;
        }
        let next = node[this.X];
        if (next !== 0) {
            this.time_moving = 0;
            return;
        }
        if (!next) {
            if (this.time_moving < TIME_MOVING) {
                this.time_moving++;
                return;
            }
            if (this.speed < MOVING_SPEED) {
                this.speed++;
                return;
            }
            this.Y++;
            this.act();
            this.speed = 0;
        }
    }

    step(option) {
        if (this.orient !== option.orient) {
            this.orient = option.orient;
            return;
        }
        let next = option.next;
        if (option.node === undefined || next === undefined) return;
        if (!next) {
            option.change();
            this.act();
        }

        if (next === 1) return;

        if (next.category === 'item') {
            option.change();
            this.act();
            console.log("I'm eating the ITEM!!!");
            if (next.attr === 'go_floor') {
                eventEmitter.emit('go_floor', next);
                return;
            }
            if (next.attr === 'key') {
                this.key[next.level]++;
            }
            if (next.attr === 'gem') {
                this[next.effect] += (this.map_num + 1)
            }
            if (next.attr === 'liquid') {
                this.life += next.effect * (this.map_num + 1)
            }
            entity._reloadActorInfo()
            eventEmitter.emit('deleteItem', this.X, this.Y);
        }

        if (next.category === 'door') {
            console.log("Oh, Door...");
            if (this.key[next.level] > 0) {
                this.key[next.level]--;
                eventEmitter.onEvent = true;
                next.event()
            }
        }

        if (next.category === 'monster') {
            console.log('HEY, MONSTER!!!');
            option.change();
            this.act();
            eventEmitter.onEvent = true;
            next.event(this)
        }

    }

    /**
     * @method checkForward: 查看前方东西（查看是否有对话等事件触发）
     *
     * @param {Object} data 所在地图数据对象
     *
     * @return null
     *
     */
    checkForward(data) {
        switch (this.orient) {
            case 0:
                if (data[this.Y + 1] && data[this.Y + 1][this.X]) {
                    let next = data[this.Y + 1][this.X];
                    if (next.hasEvent) {
                        return next
                    }
                }
                return false;
            case 1:
                if (data[this.Y][this.X - 1]) {
                    let next = data[this.Y][this.X - 1];
                    if (next.hasEvent) {
                        return next
                    }
                }
                return false;
            case 2:
                if (data[this.Y][this.X + 1]) {
                    let next = data[this.Y][this.X + 1];
                    if (next.hasEvent) {
                        return next
                    }
                }
                return false;
            case 3:
                if (data[this.Y - 1] && data[this.Y - 1][this.X]) {
                    let next = data[this.Y - 1][this.X];
                    if (next.hasEvent) {
                        return next
                    }
                }
                return false
        }
    }


}

import EventEmitter from './event_emitter'
import config from './config'
const { CANVAS_W, CANVAS_H, TIME_MOVING, MOVING_SPEED, UNIT, INFO, BORDER, OFFSET, IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_A, IMAGES } = config;
const { MAP, MAP_ENTER, MAP_LEAVE } = config;
const { keyToEvent, alphaKeyToEvent, keyState } = config;
let WALL, FLOOR, RIGHT_FLOW, LEFT_FLOW, ITEM = null;

const entity = new Canvas(CANVAS_W, CANVAS_H);
const eventEmitter = new EventEmitter();
bindEvent(eventEmitter, entity);

const image = entity.image.bind(entity);
const rect = entity.rect.bind(entity);
const text = entity.text.bind(entity);
const isClickInPath = entity.isClickInPath.bind(entity);

entity.start();
