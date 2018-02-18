require('babel-polyfill');

import EventEmitter from './event_emitter'


const GAME = {
    W: 800,
    H: 480,
    TIME_MOVING: 30,
    MOVING_SPEED: 5
};
const UNIT = 40,
    INFO = UNIT / 1.5,
    BORDER = 20,
    OFFSET = 160,
    IMAGE_WIDTH = 32,
    IMAGE_HEIGHT = 33,
    IMAGE_A = 32;

// const MAP;
const map_num = 0;

const IMAGES = {
    item_01_01: 'img/Item01-01.png',
    item_01_02: 'img/Item01-02.png',
    item_01_05: 'img/Item01-05.png',
    item_01_08: 'img/Item01-08.png',
    item_01_09: 'img/Item01-09.png',
    item_01_10: 'img/Item01-10.png',
    item_01_Gem_01: 'img/Item01-Gem01.png',
    monster_13_01: 'img/Monster13-01.png',
    monster_12_01: 'img/Monster12-01.png',
    monster_11_01: 'img/Monster11-01.png',
    monster_10_01: 'img/Monster10-01.png',
    monster_09_01: 'img/Monster09-01.png',
    monster_08_01: 'img/Monster08-01.png',
    monster_07_01: 'img/Monster07-01.png',
    monster_06_01: 'img/Monster06-01.png',
    monster_05_01: 'img/Monster05-01.png',
    monster_04_01: 'img/Monster04-01.png',
    monster_03_01: 'img/Monster03-01.png',
    monster_02_01: 'img/Monster02-01.png',
    monster_01_01: 'img/Monster01-01.png',
    NPC: 'img/NPC01-01.png',
    actor: 'img/Actor01-Braver01.png',
    wall: 'img/Event01-Wall01.png',
    door: 'img/Event01-Door01.png',
    floor: 'img/Other09.png',
    up_floor: 'img/up_floor.png',
    down_floor: 'img/down_floor.png',
};

let WALL = [];
let FLOOR = [];


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
 * @property {object} canvasNode canvas DOM 节点
 * @property {object} ctx canvas中的CanvasRenderingContext2D
 * @property {Boolean} mouseClick 是否存在鼠标左键点击事件
 * @property {Number} mouseX 点击事件事发x坐标
 * @property {Number} mouseY 点击事件事发y坐标
 * @property {object} images 所有读取完的图片节点，以键值对保存
 * @property {Array} map 所有生成的地图对象
 * @property {Number} map_num 当前所在地图序号
 * @property {object} braver 勇者，玩家可控角色对象
 * @property {object} dialog 当前进行的对话事件对象
 * @property {object} trade 当前进行的交易事件对象
 * @property {object} monster 当前进行的显示怪物信息对象
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
     * @param {string} color 颜色
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
     * @param {string} color 颜色
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
     * @param {string} color 颜色
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
     * @param {string} text 文本
     * @param {Number} x 横坐标
     * @param {Number} y 纵坐标
     * @param {Number} size 字号
     * @param {string} align 对齐方式 'center', 'left', 'right'
     * @param {string} color 颜色
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
     * @param {object} image 图片dom节点
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
     * @param {object} info 交易信息
     * @param {Number} info.coin 交易金额
     * @param {string} info.good 商品名称
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
        console.log(this.braver.coin);
        this.braver.coin -= info.coin;
        this.braver[info.good][info.attr] += info.num;
        console.log(this.braver.coin);

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
            console.log(this.braver.kill);
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
            this.leftFlow.load(4, 10);
            this.rightFlow.load(6, 10)
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
            console.log(event)
            if (event.type === 'dialog') {
                console.log('dialog');
                event.load.self = next.load.bind(next);
                event.name.self = next.name;
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
     * @param {string} name 图片名称
     * @param {string} source 图片地址
     *
     * @return {object} Promise
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
     * @return {object} Promise
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
        this._loadInfo()
    }

    /**
     * @method loadImage: 入口
     * @async
     *
     * @return {object} Promise（update方法启动后）
     *
     */
    async start() {
        await this.preload();
        console.log(this.map[this.map_num]);
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
        this.rightFlow = new Flow({image: 'item_01_10', attr: 'flow', orient: 'right', level: 0, imgX: 1, imgY: 3});
        this.leftFlow = new Flow({image: 'item_01_10', attr: 'flow', orient: 'left', level: 0, imgX: 2, imgY: 0});
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
            this.image('wall', OFFSET + UNIT * i, GAME.H - UNIT / 2, UNIT, UNIT / 2, 32, 0, 32, 16);
            this.image('wall', OFFSET, UNIT * i, UNIT / 2, UNIT, 32, 0, 16, 32);
            this.image('wall', OFFSET + GAME.H - UNIT / 2, UNIT * i, UNIT / 2, UNIT, 32, 0, 16, 32);
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
        // 各预设变量

        const KEY = {
            yellow: () => {
                return new Item({image: 'item_01_01', attr: 'key', level: 0, imgX: 0, imgY: 0})
            },
            blue: () => {
                return new Item({image: 'item_01_01', attr: 'key', level: 1, imgX: 1, imgY: 0})
            },
            red: () => {
                return new Item({image: 'item_01_01', attr: 'key', level: 2, imgX: 2, imgY: 0})
            },
            green: () => {
                return new Item({image: 'item_01_01', attr: 'key', level: 3, imgX: 3, imgY: 0})
            }
        };
        const GEM = {
            red: () => {
                return new Item({image: 'item_01_Gem_01', attr: 'gem', effect: 'atk', imgX: 0, imgY: 0})
            },
            blue: () => {
                return new Item({image: 'item_01_Gem_01', attr: 'gem', effect: 'def', imgX: 1, imgY: 0})
            }
        };
        const LIQUID = {
            red: () => {
                return new Item({image: 'item_01_02', attr: 'liquid', effect: 50, imgX: 0, imgY: 0})
            },
            blue: () => {
                return new Item({image: 'item_01_02', attr: 'liquid', effect: 200, imgX: 1, imgY: 0})
            }
        };
        const DOOR = {
            yellow: () => {
                return new Door({image: 'door', imgX: 0, level: 0})
            },
            blue: () => {
                return new Door({image: 'door', imgX: 1, level: 1})
            },
            red: () => {
                return new Door({image: 'door', imgX: 2, level: 2})
            },
            green: () => {
                return new Door({image: 'door', imgX: 3, level: 3})
            }
        };
        const up_floor = () => {
            let up_floor = new Item({image: 'up_floor', attr: 'go_floor'});
            up_floor.go = () => {
                return 1
            };
            return up_floor
        };
        const down_floor = () => {
            let down_floor = new Item({image: 'down_floor', attr: 'go_floor'});
            down_floor.go = () => {
                return 0
            };
            return down_floor
        };

        //todo: NPC

        const NPCs = {
            old_man: (option) => {
                option.name = '长者';
                option.image = 'NPC';
                option.imgY = 0;
                return new NPC(option)
            },
            trader: (option) => {
                option.name = '商人';
                option.image = 'NPC';
                option.imgY = 1;
                return new NPC(option)
            },
            adventurer: (option) => {
                option.name = '冒险家';
                option.image = 'NPC';
                option.imgY = 2;
                return new NPC(option)
            },
            elf: (option) => {
                option.name = '精灵';
                option.image = 'NPC';
                option.imgY = 3;
                return new NPC(option)
            }
        };

        //TODO: 怪物资料

//         你主动攻击怪物，你先攻击；怪物主动攻击你，怪物先攻击。
// 初级、中级、高级卫兵总是守卫一个仓库的机关门，但机关门不一定由卫兵守护。
// 魔法警卫和初、高级巫师会使用魔法攻击，来到初/高级巫师身边生命减少100/200，同时被多个巫师攻击效果可叠加。
// 47楼左下角和右上角的两个高级巫师会“退敌”，玩家直冲其而来时，先魔法攻击减少你200生命，自身再退后一格，玩家如果再靠近他一步，则会再重复一次这一过程。等到这两个高级巫师无路可退时，才会和玩家战斗。没有神圣盾的时候，经过两个魔法警卫中间生命减少一半。
// 一般情况下，打败一个区域boss会出现大血瓶、黄钥匙、红、蓝宝石各3个。
// 下面表格中，各怪物按区域排放，粗体名称表示区域boss。名字后的*号表示在打通这10层前不会与他/它战斗。
// 名字
//         生命
//         攻击
//         防御
//         获得金币数量（不计算幸运金币）	出现的楼层
//         绿色史莱姆
//         35
//         18
//         1
//         1	1、3、4、5、6、7、8、9、30、34
//         红色史莱姆
//         45
//         20
//         2
//         2	1、3、4、5、6、7、8、9、30、34、46
//         小蝙蝠
//         35
//         38
//         3
//         3	1、3、4、5、6、7、8、9、11、12、15、19、20、34
//         初级法师
//         60
//         32
//         8
//         5	1、3、4、5、6、7、8、9、10
//         骷髅人
//         50
//         42
//         6
//         6	1、3、4、6、7、8、9、10、46
//         骷髅士兵
//         55
//         52
//         12
//         8	1、4、5、6、7、8、9、10
//         初级卫兵
//         50
//         48
//         22
//         12	8、17
//         骷髅队长
//         100
//         65
//         15
//         30	10
//         大史莱姆
//         130
//         60
//         3
//         8	11、12、14、15、16、18、19、30、34
//         大蝙蝠
//         60
//         100
//         8
//         12	11、12、14、15、16、17、18、19、20、46
//         高级法师
//         100
//         95
//         30
//         18	11、12、14、15、16、17、18、19、20
//         兽人
//         260
//         85
//         5
//         22	11、12、14、15、16、17、18、19、38、46
//         兽人武士
//         320
//         120
//         15
//         30	14、15、16、17、18、19、31、33、36
//         石头人
//         20
//         100
//         68
//         28	14、16、18、19、20
//         大乌贼 * ①
// 1200
//         180
//         20
//         100	15
//         吸血鬼
//         444
//         199
//         66
//         144	20
//         大法师* ②
// 4500
//         560
//         310
//         1000	25
//         鬼战士
//         220
//         180
//         30
//         35	31、32、33、34、36、37、38、39、40
//         战士
//         210
//         200
//         65
//         45	31、32、33、34、36、37、38、39、40、46
//         幽灵
//         320
//         140
//         20
//         30	16、31、32、33、34、36、37、38、39、40
//         中级卫兵
//         100
//         180
//         110
//         50	2、32、38
//         双手剑士
//         100
//         680
//         50
//         55	31、32、33、34、36、37、38、39、40、46
//         魔龙 * ③
// 1500
//         600
//         250
//         800	35
//         骑士
//         160
//         230
//         105
//         65	31、32、34、36、37、38、39、40、46
//         骑士队长
//         120
//         150
//         50
//         100	32、40、42
//         初级巫师
//         220
//         370
//         110
//         80	41、42、43、45、46、47、48
//         高级巫师
//         200
//         380
//         130
//         90	41、42、43、45、46、47、48、49
//         史莱姆王
//         360
//         310
//         20
//         40	41、42、43、45、46、47、48
//         吸血蝙蝠
//         200
//         390
//         90
//         50	41、42、43、45、46、47、48
//         黑暗骑士
//         180
//         430
//         210
//         120	42、43、45、48、49
//         魔法警卫
//         230
//         450
//         100
//         100	41、42、43、45、48、49
//         高级卫兵	180	460	360	200	44
//         魔王（49层）④
// 800×10
//         500×10
//         100×10
//         500	49
//         魔王（50层）
// 8000
//         1580
//         190
//         50
        const green_slime = () => {
            return new Monster({image: 'monster_01_01', imgY: 0, name: '绿史莱姆', life: 35, atk: 18, def: 1, coin: 1})
        };
        const red_slime = () => {
            return new Monster({image: 'monster_01_01', imgY: 1, name: '红史莱姆', life: 45, atk: 20, def: 2, coin: 2})
        };
        const big_slime = () => {
            return new Monster({image: 'monster_01_01', imgY: 2, name: '大史莱姆', life: 130, atk: 60, def: 3, coin: 8})
        };
        const slime_lord = () => {
            return new Monster({image: 'monster_01_01', imgY: 3, name: '史莱姆王', life: 360, atk: 310, def: 20, coin: 40})
        };
        const skeleton = () => {
            return new Monster({image: 'monster_02_01', imgY: 0, name: '骷髅人', life: 50, atk: 42, def: 6, coin: 6})
        };
        const skeleton_soldier = () => {
            return new Monster({image: 'monster_02_01', imgY: 1, name: '骷髅士兵', life: 55, atk: 52, def: 12, coin: 8})
        };
        const skeleton_captain = () => {
            return new Monster({image: 'monster_02_01', imgY: 2, name: '骷髅队长', life: 100, atk: 65, def: 15, coin: 30})
        };
        const skeleton_ = () => {
            return new Monster({image: 'monster_02_01', imgY: 3})
        };
        const bat = () => {
            return new Monster({image: 'monster_03_01', imgY: 0, name: '小蝙蝠', life: 35, atk: 38, def: 3, coin: 3})
        };
        const big_bat = () => {
            return new Monster({image: 'monster_03_01', imgY: 1, name: '大蝙蝠', life: 60, atk: 100, def: 8, coin: 12})
        };
        const red_bat = () => {
            return new Monster({image: 'monster_03_01', imgY: 2, name: '吸血蝙蝠', life: 200, atk: 390, def: 90, coin: 50})
        };
        const demo_lord = () => {
            return new Monster({image: 'monster_03_01', imgY: 3})
        };
        const guard = () => {
            return new Monster({image: 'monster_05_01', imgY: 0, name: '初级卫兵', life: 50, atk: 48, def: 22, coin: 12})
        };
        const big_guard = () => {
            return new Monster({image: 'monster_05_01', imgY: 1, name: '中级卫兵', life: 100, atk: 180, def: 110, coin: 50})
        };
        const super_guard = () => {
            return new Monster({image: 'monster_05_01', imgY: 2, name: '高级卫兵', life: 180, atk: 460, def: 360, coin: 200})
        };
        const priest = () => {
            return new Monster({image: 'monster_06_01', imgY: 0, name: '初级法师', life: 60, atk: 32, def: 8, coin: 5})
        };
        const super_priest = () => {
            return new Monster({image: 'monster_06_01', imgY: 1, name: '高级法师', life: 100, atk: 95, def: 30, coin: 18})
        };
        const magician = () => {
            return new Monster({image: 'monster_06_01', imgY: 2, name: '初级巫师', life: 220, atk: 370, def: 110, coin: 80})
        };
        const super_magician = () => {
            return new Monster({image: 'monster_06_01', imgY: 3, name: '高级巫师', life: 200, atk: 380, def: 130, coin: 90})
        };
        const zombie = () => {
            return new Monster({image: 'monster_09_01', imgY: 0, name: '兽人', life: 260, atk: 85, def: 5, coin: 22})
        };
        const zombie_knight = () => {
            return new Monster({image: 'monster_09_01', imgY: 1, name: '兽人武士', life: 320, atk: 120, def: 15, coin: 30})
        };
        const rocker = () => {
            return new Monster({image: 'monster_10_01', imgY: 0, name: '石头人', life: 20, atk: 100, def: 68, coin: 28})
        };
        const slime_man = () => {
            return new Monster({image: 'monster_11_01', imgY: 0, name: '兽人武士', life: 320, atk: 120, def: 15, coin: 30})
        };


        // todo: 这里先测试NPC，之后再将NPC的对话解耦出去
        const zhangzhe = NPCs.old_man({
            events: [{
                type: 'dialog',
                loop: true,
                load: {
                    braver: this.braver.load.bind(this.braver),
                },
                name: {
                    braver: this.braver.name,
                },
                content: [
                    {braver: "嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿"},
                    {self: "这位年轻人怕是不知道什么是力量这位年轻人怕是不知道什么是力量这位年轻人怕是不知道什么是力量这位年轻人怕是不知道什么是力量"}],
            }]
        });
        const jingling = NPCs.elf({
            events: [{
                type: 'trade',
                load: {},
                name: {},
                content: [
                    {self: "这位年轻人怕是不知道什么是力量这位年轻人怕是不知道什么是力量这位年轻人怕是不知道什么是力量这位年轻人怕是不知道什么是力量"}
                ],
                info: {
                    coin: 1000,
                    good: 'key',
                    num: 4,
                    attr: 0
                }
            },{
                type: 'dialog',
                loop: true,
                load: {
                    braver: this.braver.load.bind(this.braver),
                },
                name: {
                    braver: this.braver.name,
                },
                content: [
                    {braver: "嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿"},
                    {self: "这位年轻人怕是不知道什么是力量这位年轻人怕是不知道什么是力量这位年轻人怕是不知道什么是力量这位年轻人怕是不知道什么是力量"}],
            }]
        });
        console.log(zhangzhe);

        const MAP = [
            [
                [up_floor(), 0, green_slime(), red_slime(), green_slime(), 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [LIQUID.red(), 0, 0, DOOR.yellow(), 0, 1, GEM.red(), KEY.yellow(), 0, 1, 0],
                [0, skeleton(), 0, 1, 0, 1, GEM.blue(), LIQUID.red(), 0, 1, 0],
                [1, DOOR.yellow(), 1, 1, 0, 1, 1, 1, DOOR.yellow(), 1, 0],
                [KEY.yellow(), 0, 0, 1, 0, DOOR.yellow(), bat(), priest(), bat(), 1, 0],
                [0, skeleton_soldier(), 0, 1, 0, 1, 1, 1, 1, 1, 0],
                [1, DOOR.yellow(), 1, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, DOOR.yellow(), 1, 1, 1, DOOR.yellow(), 1],
                [GEM.red(), 0, KEY.yellow(), 1, KEY.yellow(), 0, 0, 1, 0, bat(), 0],
                [GEM.red(), 0, KEY.yellow(), 1, zhangzhe, 0, jingling, 1, green_slime(), LIQUID.blue(), green_slime()]],

            [
                [down_floor(), 0, DOOR.blue(), 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1],
                [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
                [0, 1, KEY.yellow(), KEY.yellow(), 1, 0, 0, 0, 1, 0, 0],
                [0, 1, KEY.yellow(), 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
                [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
                [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
                [0, 1, LIQUID.blue(), LIQUID.blue(), 1, 0, 0, 0, 1, 0, 0],
                [up_floor(), 1, LIQUID.blue(), 0, 0, 0, 0, 0, 0, 0, 0],
            ],
            [
                [KEY.yellow(), GEM.blue(), 1, KEY.yellow(), LIQUID.blue(), KEY.yellow(), 1, 0, 1, 0, LIQUID.red()],
                [0, LIQUID.red(), 1, LIQUID.blue(), KEY.yellow(), LIQUID.blue(), 1, 0, DOOR.yellow(), bat, 0],
                [priest(), 0, 1, KEY.yellow(), LIQUID.blue(), KEY.yellow(), 1, 0, 1, 1, 1],
                [DOOR.yellow(), 1, 1, 1, 0, 1, 1, 0, 1, 0, 0],
                [0, 0, bat(), 0, 0, 0, green_slime(), 0, 0, 0, 0],
                [DOOR.yellow(), 1, 1, 0, 0, 0, 1, 0, 1, 1, 1],
                [skeleton(), 0, 1, 1, 0, 1, 1, 0, 1, 0, LIQUID.red()],
                [0, KEY.yellow(), 1, 0, 0, 0, 1, 0, DOOR.yellow(), priest(), KEY.yellow()],
                [LIQUID.red(), GEM.red(), 1, 0, 0, 0, 1, 0, 1, 1, 1],
                [1, 1, 1, 1, 0, 1, 1, red_slime(), 1, 0, 0],
                [down_floor(), 0, 0, 0, 0, 0, 1, 0, DOOR.yellow(), 0, up_floor()],
            ],
            [
                [0, KEY.blue(), 0, 1, 0, 0, 0, 1, 0, 0, 0],
                [LIQUID.red(), 0, KEY.yellow(), 1, 0, 0, 0, 1, KEY.yellow(), 0, LIQUID.blue()],
                [0, 0, 0, 1, 0, 0, 0, 1, 0, skeleton_soldier(), 0],
                [1, DOOR.yellow(), 1, 1, 1, DOOR.blue(), 1, 1, 1, DOOR.yellow(), 1],
                [0, priest(), 0, DOOR.yellow(), 0, red_slime(), 0, 0, skeleton(), 0, 0],
                [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
                [red_slime(), 0, green_slime(), 0, 0, 0, 0, 0, 0, 0, 0],
                [DOOR.yellow(), 1, 1, DOOR.yellow(), 1, 1, 1, DOOR.yellow(), 1, 1, DOOR.yellow()],
                [0, 1, 0, bat(), 0, 1, 0, priest(), 0, 1, 0],
                [0, 1, green_slime(), 0, KEY.yellow(), 1, GEM.red(), 0, LIQUID.red(), 1, 0],
                [up_floor(), 1, KEY.yellow(), green_slime(), KEY.yellow(), 1, 0, green_slime(), 0, 1, down_floor()],
            ],
            [
                [up_floor(), 1, 0, red_slime(), DOOR.yellow(), 0, 1, 0, 0, DOOR.yellow(), 0],
                [0, 1, bat(), 0, 1, KEY.yellow(), 1, green_slime(), green_slime(), 1, red_slime()],
                [0, DOOR.yellow(), 0, 0, 1, 0, 1, KEY.yellow(), KEY.yellow(), 1, 0],
                [1, 1, 1, DOOR.yellow(), 1, bat(), 1, KEY.yellow(), KEY.yellow(), 1, 0],
                [KEY.yellow(), 0, priest(), 0, 1, 0, 1, 1, 1, 1, 0],
                [KEY.yellow(), 0, 0, bat(), 1, 0, green_slime(), 0, 0, 0, 0],
                [1, skeleton_soldier(), 1, 1, 1, 0, 1, 1, 1, 1, 0],
                [0, 0, 0, 0, 1, green_slime(), 1, 0, 0, 0, red_slime()],
                [GEM.blue(), KEY.yellow(), LIQUID.red(), 0, 1, 0, 1, DOOR.yellow(), 1, 1, 1],
                [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0],
                [down_floor(), 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],

            ],
            [
                [down_floor(), 1, KEY.yellow(), KEY.yellow(), 1, 0, priest(), 0, KEY.yellow(), green_slime(), 0],
                [0, 1, KEY.yellow(), KEY.yellow(), 1, 0, 1, 1, 1, 1, DOOR.yellow()],
                [0, 1, 1, red_slime(), 1, 0, 1, LIQUID.red(), 0, skeleton(), 0],
                [0, DOOR.yellow(), DOOR.yellow(), 0, DOOR.yellow(), 0, 1, 0, 0, 0, bat()],
                [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
                [0, 0, red_slime(), priest(), 0, KEY.yellow(), 0, skeleton(), skeleton_soldier(), 0, 0],
                [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
                [priest(), 0, 0, 0, 1, 0, DOOR.yellow(), DOOR.yellow(), 0, DOOR.yellow(), 0],
                [0, bat(), 0, GEM.blue(), 1, 0, 1, 1, red_slime(), 1, red_slime()],
                [0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0],
                [0, green_slime(), 0, 0, skeleton(), 0, 1, LIQUID.red(), LIQUID.red(), 1, up_floor()],
            ],
            [
                [up_floor(), 1, GEM.red(), 1, 0, 0, 0, 1, KEY.yellow(), 1, green_slime()],
                [0, 1, LIQUID.red(), 1, 0, 0, 0, 1, KEY.yellow(), 1, red_slime()],
                [0, 1, bat(), 1, red_slime(), 1, skeleton_soldier(), 1, LIQUID.red(), 1, green_slime()],
                [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                [DOOR.yellow(), 1, DOOR.yellow(), 1, DOOR.blue(), 1, DOOR.yellow(), 1, skeleton(), 1, DOOR.yellow()],
                [0, skeleton_soldier(), 0, priest(), 0, 0, 0, 0, 0, 0, 0],
                [DOOR.yellow(), 1, DOOR.yellow(), 1, DOOR.yellow(), 1, DOOR.yellow(), 1, skeleton_soldier(), 1, DOOR.yellow()],
                [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                [0, 1, 0, 1, bat(), 1, red_slime(), 1, LIQUID.blue(), 1, 0],
                [green_slime(), 1, green_slime(), 1, KEY.yellow(), 1, priest(), 1, KEY.yellow(), 1, 0],
                [0, red_slime(), 0, 1, KEY.yellow(), 1, LIQUID.blue(), 1, KEY.yellow(), 1, down_floor()],

            ],
            [
                [down_floor(), 0, DOOR.yellow(), DOOR.yellow(), 0, up_floor(), 0, 1, KEY.yellow(), 0, KEY.yellow()],
                [0, 0, 1, 1, 0, 0, green_slime(), 1, 0, KEY.red(), 0],
                [DOOR.yellow(), 1, 1, 1, 1, DOOR.yellow(), 1, 1, LIQUID.blue(), 0, LIQUID.red()],
                [0, 1, KEY.yellow(), KEY.yellow(), KEY.yellow(), 0, 0, 1, 1, DOOR.green(), 1],
                [LIQUID.red(), 1, 1, 1, 1, 1, priest(), 1, guard(), 0, guard()],
                [0, red_slime(), green_slime(), red_slime(), 0, 1, 0, 1, 0, 0, 0],
                [1, 1, 1, 1, DOOR.yellow(), 1, bat, 1, 1, DOOR.yellow(), 1],
                [0, 0, 0, bat(), 0, skeleton(), 0, priest(), 0, 0, 0],
                [DOOR.yellow(), 1, 1, 1, 1, 1, 1, 1, 1, 1, DOOR.yellow()],
                [green_slime(), 0, 1, GEM.red(), KEY.yellow(), 1, KEY.blue(), LIQUID.red(), 1, 0, skeleton()],
                [0, bat(), DOOR.blue(), KEY.yellow(), GEM.blue(), 1, KEY.yellow(), 0, DOOR.yellow(), skeleton_soldier(), 0],
            ],
            [
                [0, 0, skeleton(), DOOR.yellow(), 0, down_floor(), 0, DOOR.yellow(), green_slime(), 0, LIQUID.red()],
                [0, KEY.yellow(), 0, 1, 0, 0, 0, 1, 0, green_slime(), 0],
                [skeleton_soldier(), 1, 1, 1, 1, DOOR.blue(), 1, 1, 1, 1, 0],
                [0, KEY.yellow(), 0, 1, KEY.yellow(), 0, KEY.yellow(), DOOR.yellow(), DOOR.yellow(), 0, 0],
                [GEM.blue(), 0, bat(), DOOR.yellow(), 0, GEM.red(), 0, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, red_slime(), 1, 0, 0, skeleton_soldier()],
                [KEY.yellow(), 0, DOOR.yellow(), skeleton_soldier(), KEY.yellow(), 1, 0, 1, 0, 1, 0],
                [skeleton_soldier(), 0, 1, 0, 0, 1, 0, 1, 1, 1, DOOR.yellow()],
                [DOOR.yellow(), 1, 1, 1, DOOR.yellow(), 1, 0, 1, KEY.yellow(), 0, priest()],
                [0, LIQUID.red(), 1, 0, skeleton(), 1, bat(), 1, 0, skeleton(), 0],
                [up_floor(), 0, DOOR.blue(), 0, 0, DOOR.yellow(), 0, DOOR.yellow(), priest, 0, KEY.yellow()],
            ],
            [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
                [skeleton(), skeleton(), skeleton(), 1, 1, 0, 1, 1, skeleton(), skeleton(), skeleton()],
                [0, skeleton_soldier(), 0, DOOR.green(), 0, skeleton_captain(), 0, DOOR.green(), 0, skeleton_soldier(), 0],
                [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
                [skeleton(), GEM.blue(), skeleton(), 1, 1, 0, 1, 1, skeleton(), GEM.red(), skeleton()],
                [0, skeleton_soldier(), 0, 1, 1, 0, 1, 1, 0, skeleton_soldier(), 0],
                [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
                [DOOR.yellow(), 1, DOOR.yellow(), 1, 1, DOOR.red(), 1, 1, DOOR.yellow(), 1, DOOR.yellow()],
                [0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
                [down_floor(), 1, 0, priest(), 0, 0, 0, priest(), 0, 1, LIQUID.blue()],
            ],
            [
                [0, 0, 0, 1, GEM.red(), 0, DOOR.yellow(), 0, 0, LIQUID.red(), KEY.yellow()],
                [0, 0, 0, 1, 0, bat(), 1, zombie(), 1, 0, 0],
                [0, 0, 0, 1, DOOR.yellow(), 1, 1, 0, DOOR.yellow(), 0, 0],
                [1, DOOR.green(), 1, 1, 0, big_bat(), 1, 1, 1, 1, big_slime()],
                [super_priest(), 0, super_priest(), 1, zombie(), 0, DOOR.yellow(), super_priest(), 0, 1, 0],
                [0, 0, 0, 1, 0, 0, 0, 0, LIQUID.red(), 1, 0],
                [LIQUID.blue(), 0, 0, big_bat(), 0, 0, DOOR.yellow(), big_slime(), 0, 1, 0],
                [1, DOOR.blue(), 1, 1, 1, 1, 1, 1, 1, 1, big_bat()],
                [0, big_bat(), 0, big_slime(), DOOR.yellow(), 0, 0, 0, 0, bat(), 0],
                [KEY.yellow(), 0, 0, 0, 1, 0, 1, 1, DOOR.yellow(), 1, 0],
                [KEY.yellow(), KEY.yellow(), KEY.yellow(), KEY.yellow(), 1, down_floor(), 1, LIQUID.blue(), big_bat(), 1, up_floor()],
            ],
            [
                [0, 1, 0, 1, KEY.yellow(), GEM.red(), KEY.yellow(), 1, 0, 1, 1],
                [1, 1, big_bat(), 1, 0, 1, 0, 1, 0, 1, 1],
                [0, 0, 0, 1, super_priest(), 0, super_priest(), 1, 0, zombie(), 0],
                [DOOR.yellow(), 1, 1, 1, 1, DOOR.yellow(), 1, 1, 1, 1, 0],
                [0, super_priest(), 0, DOOR.yellow(), 0, zombie(), 0, 1, LIQUID.red(), 0, big_bat()],
                [1, 1, 1, 1, 0, 0, super_priest(), DOOR.yellow(), 0, GEM.blue(), 0],
                [KEY.yellow(), KEY.yellow(), 0, 1, 0, LIQUID.blue(), 0, 1, KEY.yellow(), 0, big_slime()],
                [KEY.yellow(), KEY.blue(), 0, 1, 1, 1, 1, 1, DOOR.blue(), 1, DOOR.yellow()],
                [0, 0, zombie(), 1, 0, 0, 0, 1, big_slime(), 0, zombie()],
                [1, 1, DOOR.yellow(), 1, LIQUID.red(), 0, LIQUID.red(), 1, 1, 0, 1],
                [up_floor(), 0, 0, bat(), 0, 0, 0, bat(), 0, 0, down_floor()],
            ],
            [ //TODO:设计地图
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ],
            [
                [zombie_knight(), 0, zombie_knight(), 1, GEM.blue(), KEY.yellow(), LIQUID.red(), 1, KEY.yellow(), KEY.yellow(), KEY.yellow()],
                [0, zombie_knight(), 0, 1, big_slime(), 1, zombie_knight(), 1, 0, 0, KEY.yellow()],
                [1, 0, 0, 1, 0, 1, 0, 1, 1, DOOR.yellow(), 1],
                [1, DOOR.blue(), 1, 1, DOOR.blue(), 1, DOOR.yellow(), 1, 0, zombie_knight(), 0],
                [LIQUID.red(), 0, 0, big_bat(), 0, rocker(), 0, big_bat(), 0, 0, 0],
                [0, big_slime(), 0, 1, 1, DOOR.yellow(), 1, 1, LIQUID.red(), 0, zombie()],
                [DOOR.yellow(), 1, DOOR.yellow(), 1, 0, 0, 0, 1, 1, 1, DOOR.yellow()],
                [0, 1, 0, zombie(), 0, DOOR.yellow(), 0, big_slime(), 0, big_slime(), 0],
                [super_priest(), 1, super_priest(), 1, 1, 1, 1, 1, DOOR.yellow(), 1, 1],
                [0, 1, 0, 1, LIQUID.red(), 0, 0, 1, 0, 0, 0],
                [KEY.blue(), 1, 0, DOOR.yellow(), 0, 0, 0, 1, 0, 0, 0],
            ],
            [
                [GEM.blue(), zombie_knight(), 0, DOOR.yellow(), 0, 0, 0, 1, 0, 0, 0],
                [zombie(), 0, 0, 1, 0, 0, 0, 1, 0, 0, big_slime()],
                [0, 0, big_slime(), 1, 1, DOOR.green(), 1, 1, 1, 1, DOOR.yellow()],
                [DOOR.yellow(), 1, 1, 1, 0, 0, 0, 1, big_bat(), 0, 0],
                [0, 1, KEY.yellow(), 1, 0, 0, 0, 1, 0, big_bat(), 0],
                [0, 1, KEY.blue(), 1, 0, 0, 0, 1, DOOR.yellow(), 1, super_priest()],
                [big_slime(), 1, KEY.yellow(), 1, 0, 0, 0, 1, 0, 1, 0],
                [0, 1, 0, 1, 0, 0, 0, 1, 0, 1, LIQUID.blue()],
                [0, DOOR.yellow(), 0, 1, 0, 0, 0, 1, DOOR.yellow(), 1, 1],
                [big_bat(), 1, big_bat(), 1, 0, 0, 0, 1, 0, bat(), 0],
                [0, super_priest(), 0, 1, 0, 0, 0, DOOR.yellow(), bat(), 0, 0],
            ],
            [
                [KEY.yellow(), big_bat(), 0, 1, 0, 0, 0, 1, 0, 0, big_bat()],
                [KEY.yellow(), super_priest(), 0, DOOR.yellow(), 0, 0, 0, DOOR.yellow(), big_slime(), 0, 0],
                [KEY.yellow(), big_bat(), 0, 1, zombie(), 0, KEY.yellow(), 1, 0, 0, LIQUID.red()],
                [1, 1, 1, 1, 1, DOOR.blue(), 1, 1, 1, 1, 1],
                [GEM.red(), KEY.yellow(), 0, 1, LIQUID.red(), 0, 0, 1, 0, zombie(), 0],
                [LIQUID.red(), 0, rocker(), DOOR.yellow(), 0, zombie_knight(), 0, 1, big_bat(), 0, KEY.blue()],
                [GEM.blue(), KEY.yellow(), 0, 1, 0, 0, 0, 1, 0, DOOR.yellow(), 0],
                [1, 1, 1, 1, 1, DOOR.yellow(), 1, 1, 1, super_priest(), 1],
                [0, big_slime(), 0, 1, big_bat(), 0, big_bat(), 1, 0, 0, 0],
                [0, 0, 0, DOOR.yellow(), 0, 0, 0, DOOR.yellow(), 0, 1, 1],
                [0, 0, 0, 1, 0, 0, 0, 1, slime_man(), 1, 1],
            ],
            [
                [0, 0, 0, 1, 0, 0, 0, 1, GEM.red(), 0, GEM.blue()],
                [0, 0, 0, 1, 0, 0, 0, 1, 0, LIQUID.blue(), 0],
                [0, 0, 0, 1, zombie_knight(), 1, big_bat(), 1, KEY.yellow(), 0, KEY.yellow()],
                [1, DOOR.green(), 1, 1, 0, 1, 0, 1, 1, DOOR.green(), 1],
                [guard(), 0, guard(), 1, DOOR.yellow(), 1, DOOR.blue(), 1, zombie_knight(), 0, zombie_knight()],
                [0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
                [1, DOOR.green(), 1, 1, zombie(), 1, big_slime(), 1, 1, DOOR.green(), 1],
                [guard(), 0, guard(), 1, 0, 0, 0, 1, zombie(), 0, zombie()],
                [0, 0, 0, 1, 1, super_priest(), 1, 1, 0, 0, 0],
                [1, DOOR.yellow(), 1, 1, 0, 0, 0, 1, 1, DOOR.yellow(), 1],
                [LIQUID.red(), 0, 0, big_bat(), 0, 0, 0, big_bat(), 0, 0, LIQUID.red()],
            ],
            [
                [0, 0, 0, DOOR.blue(), 0, 0, 0, DOOR.yellow(), super_priest(), 0, KEY.yellow()],
                [0, 0, 0, 1, 0, 0, 0, 1, 0, big_slime(), KEY.yellow()],
                [DOOR.yellow(), 1, 1, 1, 1, 1, 1, 1, 0, 0, KEY.blue()],
                [0, LIQUID.red(), 0, DOOR.yellow(), zombie_knight(), 0, zombie_knight(), DOOR.yellow(), zombie(), 0, KEY.yellow()],
                [rocker(), 0, rocker(), 1, 0, 0, 0, 1, 0, big_bat(), KEY.yellow()],
                [1, 1, 1, 1, 1, DOOR.blue(), 1, 1, 1, 1, 1],
                [0, zombie(), 0, 0, 0, 0, 0, 0, 0, rocker(), 0],
                [DOOR.yellow(), 1, 1, DOOR.yellow(), 1, 1, 1, DOOR.yellow(), 1, 1, DOOR.yellow()],
                [super_priest(), 0, 1, big_bat(), big_bat(), 1, big_slime(), big_slime(), 1, 0, super_priest()],
                [0, KEY.yellow(), 1, big_bat(), big_bat(), 1, big_slime(), big_slime(), 1, KEY.yellow(), 0],
                [LIQUID.red(), GEM.red(), 1, 0, KEY.yellow(), 1, KEY.yellow(), 0, 1, GEM.blue(), LIQUID.red()],
            ],
            [
                [0, 0, 1, 0, LIQUID.red(), super_priest(), 0, KEY.blue(), 1, KEY.yellow(), GEM.red()],
                [0, 0, 1, 0, 0, 1, 0, 0, 1, big_bat(), 0],
                [DOOR.yellow(), 0, 1, zombie_knight(), 1, 1, 1, zombie_knight(), 1, DOOR.yellow(), 0],
                [bat(), 0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
                [0, 0, 1, KEY.yellow(), 0, 1, 0, KEY.yellow(), 1, big_slime(), big_slime()],
                [DOOR.yellow(), 0, 1, 0, rocker(), 0, rocker(), 0, 1, 0, 0],
                [big_bat(), 0, 1, 1, 1, DOOR.blue(), 1, 1, 1, 1, 0],
                [0, 0, big_slime(), 0, 0, 0, 0, zombie_knight(), 0, 0, zombie()],
                [DOOR.yellow(), 1, 1, 1, 1, zombie_knight(), 1, 1, LIQUID.red(), KEY.yellow(), 0],
                [0, 1, 0, DOOR.yellow(), KEY.yellow(), 0, KEY.yellow(), 1, 1, 1, big_bat()],
                [big_slime(), 0, big_bat(), 1, 0, 0, 0, DOOR.yellow(), 0, bat(), 0],
            ],
            [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ],
        ];
        const MAP_ENTER = [{X: 5, Y: 10}, {X: 0, Y: 1}, {X: 1, Y: 10}, {X: 10, Y: 9}, {X: 1, Y: 10}, {X: 0, Y: 1},];
        const MAP_LEAVE = [{X: 1, Y: 0}, {X: 0, Y: 9}, {X: 9, Y: 10}, {X: 0, Y: 9}, {X: 0, Y: 1}, {X: 10, Y: 9},];
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
        this.rect(UNIT / 2, UNIT, UNIT * 3, INFO);
        this.rect(UNIT * 1.5, UNIT * 2, UNIT * 2, BORDER);                // 角色生命值框
        this.rect(UNIT * 1.5, UNIT * 2.75, UNIT * 2, BORDER);             // 角色攻击值框
        this.rect(UNIT * 1.5, UNIT * 3.5, UNIT * 2, BORDER);              // 角色防御值框
        this.rect(UNIT * 1.5, UNIT * 4.25, UNIT * 2, BORDER);             // 角色金钱框
        this.rect(UNIT / 2, UNIT * 5, UNIT * 3, UNIT * 6);                // 角色道具框
        this.rect(UNIT / 2 + UNIT * 16, UNIT, UNIT * 3, UNIT);            // 怪物名称框
        this.rect(UNIT / 2 + UNIT * 16, UNIT * 2.25, UNIT * 3, UNIT);     // 怪物生命值框
        this.rect(UNIT / 2 + UNIT * 16, UNIT * 4, UNIT * 3, UNIT * 2.5);  // 怪物攻击值框
        this.rect(UNIT / 2 + UNIT * 16, UNIT * 7, UNIT * 3, UNIT * 4);    // 怪物防御值框
        this.text('魔塔 第' + (map_num + 1) + '层', UNIT * 2, UNIT + INFO / 2, INFO - 5, 'center');
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
     * @method _goFloor: 重载人物角色信息
     * @private
     *
     * @param {object} floor: 上下楼处理对象
     *
     * @return null
     *
     */
    _goFloor(floor) {
        if (floor.go()) {
            this.map_num++;
            this.braver.map_num++;
            this.braver.setLocation(this.map[this.map_num].enter);
        }
        else {
            this.map_num--;
            this.braver.map_num--;
            this.braver.setLocation(this.map[this.map_num].leave);
        }
    }

    /**
     * @method _emitTrade: 触发交易事件，切换到交易窗口
     * @private
     *
     * @param {object} option: 交易配置信息
     *
     * @return null
     *
     */
    _emitTrade (option) {
        this.window = 3;
        this.onEvent = true;
        this.trade = new Trade(option);
        console.log(this.trade)
    }

    /**
     * @method _emitTrade: 触发对话事件，切换到对话窗口
     * @private
     *
     * @param {object} option: 对话配置信息
     *
     * @return null
     *
     */
    _emitDialog (option) {
        this.window = 2;
        this.onEvent = true;
        this.dialog = new Dialog(option);
        console.log(this.dialog)
    }

}

class Map {
    constructor(option) {
        this.interval = 3;
        this.next = 0;
        this.data = option.data;
        this.enter = option.enter;
        this.leave = option.leave;
        this.wallNum = 0;
        this.floorNum = 0;
    }

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
    currentNode() {
        let current = this.data.length - this.page * this.node;
        return current > this.node ? this.node : current;
    }
    currentItem(i) {
        return this.page * this.node + i;
    }

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

class Dialog {
    constructor(option) {
        this.load = option.load;
        this.name = option.name;
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

    _loadPeople (person, x, y) {
        this.floor.load(x + 0.5, y + 3.5); // 为了刷新背景
        this.load[person](x + 0.5, y + 3.5);
        this._textName(this.name[person], x + 0.5, y + 1.5)
    }

    _textName (content, x, y, align) {
        text(content,
            transferXToPixel(x + 0.5),
            transferYToPixel(y + 3.5),
            this.nameFontSize,
            align || 'center',
            'white'
        )
    }
    _textContent (content, x, y) {
        text(content,
            transferXToPixel(x + 0.5),
            transferYToPixel(y + 3.5),
            this.textFontSize,
            'left',
            'white'
        )
    }

    _loadContent (content) {
        for (let i = 0; i < content.length; i++) {
            this._textContent(content[i], 3, 0.5 * i + 1)
        }
    }

    next () {
        this.content.shift();
        if (this.content.length) {
            this._loadDialogFrame()
        }
    }
    update () {
        let key = Object.keys(this.content[0])[0];
        this._loadPeople(key, 1, 1);
        this._loadContent(this.content[0][key])
    }
}

class Trade extends Dialog{
    constructor(option) {
        super(option);
        this.info = option.info;
        this.trader = option.trader;
        this.loop = option.loop;
        this.option = 0;
        this.accept = '好的';
        this.reject = '算了';
        this.trading = false;
        this.over = false;
    }

    _textOption (content, x, y, color) {
        text(content,
            transferXToPixel(x + 0.5),
            transferYToPixel(y + 3.5),
            this.nameFontSize,
            'center',
            color
        )
    }

    _loadOption () {
        this._textOption(this.accept, 5, 3.25, this.option ? 'white' : 'red');
        this._textOption(this.reject, 8, 3.25, this.option ? 'red' : 'white')
    }

    tradeResult (ifCommit) {
        this.ifCommit = ifCommit;
        this.trade_result = [ifCommit ? '交易成功！' : '金币不足，交易失败！'];
        console.log(this.trade_result)
    }

    choose (option) {
        if (option === 'right') {
            this.option = 1
        }
        if (option === 'left') {
            this.option = 0
        }
    }

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

class Solid {
    constructor(option) {
        this.category = 'solid';
        this.image = option.image;
        this.imgX = option.imgX || 0;
        this.imgY = option.imgY || 0;
    }

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

class Floor extends Solid {
    constructor(option) {
        super(option);
        this.category = 'floor'
    }
}

class Wall extends Solid {
    constructor(option) {
        super(option);
        this.category = 'wall'
    }
}

class Item extends Solid{
    constructor(option) {
        super(option);
        this.category = 'item';
        this.attr = option.attr;
        this.level = option.level;
        this.effect = option.effect;
        this.interval = 5;
        this.next = 0;
    }
}

class Flow extends Item {
    constructor(option) {
        super(option);
        this.orient = option.orient
    }

    // 方法重写，需要判定按钮
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

    event () {
        this.event_on = true
    }

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
        this.interval = 20;
        this.next = 0;
        this.battle = false;
        this.battle_interval = 10;
        this.battle_next = 0;
    }

    load (x, y) {
        super.load(x, y);
        this.next++;
        if (this.next === this.interval) {
            this.next = 0;
            this.imgX++;
            if (this.imgX > 3) this.imgX = 0
        }
        if (this.battle) {
            this.battle_next++;
            if (this.battle_next === this.battle_interval) {
                this.battle_next = 0;
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

// Non-Player controller
class NPC extends Item{
    constructor(option) {
        super(option);
        this.category = 'npc';
        this.name = option.name;
        this.interval = 20;
        this.next = 0;
        if (option.events !== undefined) {
            this.events = option.events;
            this.hasEvent = Boolean(this.events)
        }
    }

    load (x, y) {
        super.load(x, y);
        this.next++;
        if (this.next === this.interval) {
            this.next = 0;
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
 * @param {object} option.image 所使用的图片节点
 * @param {string} option.name 人物名字
 *
 * @property {string} name 人物名字
 * @property {Number} X 位置x坐标（网格）
 * @property {Number} Y 位置y坐标（网格）
 * @property {Number} orient 人物朝向 0 down/ 1 2 3
 * @property {Number} action 人物动作，对应素材中的每一帧画面
 * @property {Number} interval 切换动作间隔
 * @property {Number} next 切换动作的计数器
 * @property {Number} life 生命值
 * @property {Number} atk 攻击值
 * @property {Number} def 防御值
 * @property {Number} coin 金钱数量
 * @property {Array} key 钥匙数量 0 黄钥匙数量/ 1 蓝钥匙/ 2 红钥匙/ 3 绿钥匙
 * @property {object} kill 已杀敌数量记录表
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
        this.interval = 20;
        this.next = 0;
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
        this.next++;
        if (this.next === this.interval) {
            this.next = 0;
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
     * @param {object} data 所在地图数据对象
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
            if (this.time_moving < GAME.TIME_MOVING) {
                this.time_moving++;
                return;
            }
            if (this.speed < GAME.MOVING_SPEED) {
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
            if (this.time_moving < GAME.TIME_MOVING) {
                this.time_moving++;
                return;
            }
            if (this.speed < GAME.MOVING_SPEED) {
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
            if (this.time_moving < GAME.TIME_MOVING) {
                this.time_moving++;
                return;
            }
            if (this.speed < GAME.MOVING_SPEED) {
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
            if (this.time_moving < GAME.TIME_MOVING) {
                this.time_moving++;
                return;
            }
            if (this.speed < GAME.MOVING_SPEED) {
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
     * @param {object} data 所在地图数据对象
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





const keyToEvent = {
    37: 'leftArrowPressed',
    38: 'upArrowPressed',
    39: 'rightArrowPressed',
    40: 'downArrowPressed',
};
const alphaKeyToEvent = {
    73: 'i-monsterInfo',
    105: 'i-monsterInfo',
    32: 'spacePressed',
}
const keyState = {
    32: false,
    37: false,
    38: false,
    39: false,
    40: false,
};
const keyIsDown = (code) => {
    return keyState[code]
};


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



const entity = new Canvas();
const eventEmitter = new EventEmitter();
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
    console.log('spacePressed');
    entity.spacePressed();
});

eventEmitter.on('leftArrowPressed', () => {
    console.log('leftArrowPressed');
    entity.leftArrowPressed();
});

eventEmitter.on('rightArrowPressed', () => {
    console.log('rightArrowPressed');
    entity.rightArrowPressed();
});

eventEmitter.on('upArrowPressed', () => {
    console.log('upArrowPressed');
    entity.upArrowPressed();
});

eventEmitter.on('downArrowPressed', () => {
    console.log('downArrowPressed');
    entity.downArrowPressed();
});

eventEmitter.on('click', (x, y) => {
    entity.mouseClick = true;
    entity.mouseX = x;
    entity.mouseY = y
});
eventEmitter.on('flowOnClick', (orient) => {
    console.log('flowOnClick')
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

// 测试双向绑定
eventEmitter.onEvent = true;
console.log(eventEmitter.onEvent);
console.log(entity.onEvent);
eventEmitter.onEvent = !eventEmitter.onEvent;
console.log(eventEmitter.onEvent);
console.log(entity.onEvent);


const image = entity.image.bind(entity);
const rect = entity.rect.bind(entity);
const text = entity.text.bind(entity);
const isClickInPath = entity.isClickInPath.bind(entity);

entity.start();
