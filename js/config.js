const UNIT = 40;
const INFO = UNIT / 1.5;
const BORDER = UNIT / 2;
const OFFSET = UNIT * 4;

const config = {
    CANVAS_W: 800,
    CANVAS_H: 480,
    TIME_MOVING: 30,
    MOVING_SPEED: 5,
    UNIT,
    INFO,
    BORDER,
    OFFSET,
    IMAGE_WIDTH: 32,
    IMAGE_HEIGHT: 33,
    IMAGE_A: 32,
    keyToEvent: {
        37: 'leftArrowPressed',
        38: 'upArrowPressed',
        39: 'rightArrowPressed',
        40: 'downArrowPressed',
    },
    alphaKeyToEvent: {
        73: 'i-monsterInfo',
        105: 'i-monsterInfo',
        32: 'spacePressed',
    },
    keyState: {
        32: false,
        37: false,
        38: false,
        39: false,
        40: false,
    },
    IMAGES: {
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
    },
    ITEM: {
        key_yellow: {class: 1, option: {image: 'item_01_01', attr: 'key', level: 0, imgX: 0, imgY: 0}},
        key_blue: {class: 1, option: {image: 'item_01_01', attr: 'key', level: 1, imgX: 1, imgY: 0}},
        key_red: {class: 1, option: {image: 'item_01_01', attr: 'key', level: 2, imgX: 2, imgY: 0}},
        key_green: {class: 1, option: {image: 'item_01_01', attr: 'key', level: 3, imgX: 3, imgY: 0}},

        gem_red: {class: 1, option: {image: 'item_01_Gem_01', attr: 'gem', effect: 'atk', imgX: 0, imgY: 0}},
        gem_blue: {class: 1, option: {image: 'item_01_Gem_01', attr: 'gem', effect: 'def', imgX: 1, imgY: 0}},

        liquid_red: {class: 1, option: {image: 'item_01_02', attr: 'liquid', effect: 50, imgX: 0, imgY: 0}},
        liquid_blue: {class: 1, option: {image: 'item_01_02', attr: 'liquid', effect: 200, imgX: 1, imgY: 0}},

        door_yellow: {class: 2, option: {image: 'door', imgX: 0, level: 0}},
        door_blue: {class: 2, option: {image: 'door', imgX: 1, level: 1}},
        door_red: {class: 2, option: {image: 'door', imgX: 2, level: 2}},
        door_green: {class: 2, option: {image: 'door', imgX: 3, level: 3}},

        up_floor: {class: 3, option: {image: 'up_floor', attr: 'go_floor', go: 1}},
        down_floor: {class: 3, option: {image: 'down_floor', attr: 'down_floor', go: 0}},

        npc_old_man: {class: 4, option: {image: 'NPC', name: '长者', imgY: 0}},
        npc_trader: {class: 4, option: {image: 'NPC', name: '商人', imgY: 1}},
        npc_adventurer: {class: 4, option: {image: 'NPC', name: '冒险家', imgY: 2}},
        npc_elf: {class: 4, option: {image: 'NPC', name: '精灵', imgY: 3}},

        mon_green_slime: {
            class: 5,
            option: {image: 'monster_01_01', imgY: 0, name: '绿史莱姆', life: 35, atk: 18, def: 1, coin: 1}
        },
        mon_red_slime: {
            class: 5,
            option: {image: 'monster_01_01', imgY: 1, name: '红史莱姆', life: 45, atk: 20, def: 2, coin: 2}
        },
        mon_big_slime: {
            class: 5,
            option: {image: 'monster_01_01', imgY: 2, name: '大史莱姆', life: 130, atk: 60, def: 3, coin: 8}
        },
        mon_slime_lord: {
            class: 5,
            option: {image: 'monster_01_01', imgY: 3, name: '史莱姆王', life: 360, atk: 310, def: 20, coin: 40}
        },
        mon_skeleton: {
            class: 5,
            option: {image: 'monster_02_01', imgY: 0, name: '骷髅人', life: 50, atk: 42, def: 6, coin: 6}
        },
        mon_skeleton_soldier: {
            class: 5,
            option: {image: 'monster_02_01', imgY: 1, name: '骷髅士兵', life: 55, atk: 52, def: 12, coin: 8}
        },
        mon_skeleton_captain: {
            class: 5,
            option: {image: 'monster_02_01', imgY: 2, name: '骷髅队长', life: 100, atk: 65, def: 15, coin: 30}
        },
        mon_skeleton_: {class: 5, option: {image: 'monster_02_01', imgY: 3}},
        mon_bat: {class: 5, option: {image: 'monster_03_01', imgY: 0, name: '小蝙蝠', life: 35, atk: 38, def: 3, coin: 3}},
        mon_big_bat: {
            class: 5,
            option: {image: 'monster_03_01', imgY: 1, name: '大蝙蝠', life: 60, atk: 100, def: 8, coin: 12}
        },
        mon_red_bat: {
            class: 5,
            option: {image: 'monster_03_01', imgY: 2, name: '吸血蝙蝠', life: 200, atk: 390, def: 90, coin: 50}
        },
        mon_demo_lord: {class: 5, option: {image: 'monster_03_01', imgY: 3}},
        mon_guard: {
            class: 5,
            option: {image: 'monster_05_01', imgY: 0, name: '初级卫兵', life: 50, atk: 48, def: 22, coin: 12}
        },
        mon_big_guard: {
            class: 5,
            option: {image: 'monster_05_01', imgY: 1, name: '中级卫兵', life: 100, atk: 180, def: 110, coin: 50}
        },
        mon_super_guard: {
            class: 5,
            option: {image: 'monster_05_01', imgY: 2, name: '高级卫兵', life: 180, atk: 460, def: 360, coin: 200}
        },
        mon_priest: {
            class: 5,
            option: {image: 'monster_06_01', imgY: 0, name: '初级法师', life: 60, atk: 32, def: 8, coin: 5}
        },
        mon_super_priest: {
            class: 5,
            option: {image: 'monster_06_01', imgY: 1, name: '高级法师', life: 100, atk: 95, def: 30, coin: 18}
        },
        mon_magician: {
            class: 5,
            option: {image: 'monster_06_01', imgY: 2, name: '初级巫师', life: 220, atk: 370, def: 110, coin: 80}
        },
        mon_super_magician: {
            class: 5,
            option: {image: 'monster_06_01', imgY: 3, name: '高级巫师', life: 200, atk: 380, def: 130, coin: 90}
        },
        mon_zombie: {
            class: 5,
            option: {image: 'monster_09_01', imgY: 0, name: '兽人', life: 260, atk: 85, def: 5, coin: 22}
        },
        mon_zombie_knight: {
            class: 5,
            option: {image: 'monster_09_01', imgY: 1, name: '兽人武士', life: 320, atk: 120, def: 15, coin: 30}
        },
        mon_rocker: {
            class: 5,
            option: {image: 'monster_10_01', imgY: 0, name: '石头人', life: 20, atk: 100, def: 68, coin: 28}
        },
        mon_slime_man: {
            class: 5,
            option: {image: 'monster_11_01', imgY: 0, name: '兽人武士', life: 320, atk: 120, def: 15, coin: 30}
        },
        braver: {class: 5, option: {image: 'actor', imgY: 0, name: '勇者'}},
    },
    MAP: [
        [
            ['up_floor', 0, 'mon_green_slime', 'mon_red_slime', 'mon_green_slime', 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            ['liquid_red', 0, 0, 'door_yellow', 0, 1, 'gem_red', 'key_yellow', 0, 1, 0],
            [0, 'mon_skeleton', 0, 1, 0, 1, 'gem_blue', 'liquid_red', 0, 1, 0],
            [1, 'door_yellow', 1, 1, 0, 1, 1, 1, 'door_yellow', 1, 0],
            ['key_yellow', 0, 0, 1, 0, 'door_yellow', 'mon_bat', 'mon_priest', 'mon_bat', 1, 0],
            [0, 'mon_skeleton_soldier', 0, 1, 0, 1, 1, 1, 1, 1, 0],
            [1, 'door_yellow', 1, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 'door_yellow', 1, 1, 1, 'door_yellow', 1],
            ['gem_red', 0, 'key_yellow', 1, 'key_yellow', 0, 0, 1, 0, 'mon_bat', 0],
            ['gem_red', 0, 'key_yellow', 1, 'npc_old_man', 0, 'npc_elf', 1, 'mon_green_slime', 'liquid_blue', 'mon_green_slime']],

        [
            ['down_floor', 0, 'door_blue', 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1],
            [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
            [0, 1, 'key_yellow', 'key_yellow', 1, 0, 0, 0, 1, 0, 0],
            [0, 1, 'key_yellow', 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
            [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
            [0, 1, 'liquid_blue', 'liquid_blue', 1, 0, 0, 0, 1, 0, 0],
            ['up_floor', 1, 'liquid_blue', 0, 0, 0, 0, 0, 0, 0, 0],
        ],
        [
            ['key_yellow', 'gem_blue', 1, 'key_yellow', 'liquid_blue', 'key_yellow', 1, 0, 1, 0, 'liquid_red'],
            [0, 'liquid_red', 1, 'liquid_blue', 'key_yellow', 'liquid_blue', 1, 0, 'door_yellow', 'mon_bat', 0],
            ['mon_priest', 0, 1, 'key_yellow', 'liquid_blue', 'key_yellow', 1, 0, 1, 1, 1],
            ['door_yellow', 1, 1, 1, 0, 1, 1, 0, 1, 0, 0],
            [0, 0, 'mon_bat', 0, 0, 0, 'mon_green_slime', 0, 0, 0, 0],
            ['door_yellow', 1, 1, 0, 0, 0, 1, 0, 1, 1, 1],
            ['mon_skeleton', 0, 1, 1, 0, 1, 1, 0, 1, 0, 'liquid_red'],
            [0, 'key_yellow', 1, 0, 0, 0, 1, 0, 'door_yellow', 'mon_priest', 'key_yellow'],
            ['liquid_red', 'gem_red', 1, 0, 0, 0, 1, 0, 1, 1, 1],
            [1, 1, 1, 1, 0, 1, 1, 'mon_red_slime', 1, 0, 0],
            ['down_floor', 0, 0, 0, 0, 0, 1, 0, 'door_yellow', 0, 'up_floor'],
        ],
        [
            [0, 'key_blue', 0, 1, 0, 0, 0, 1, 0, 0, 0],
            ['liquid_red', 0, 'key_yellow', 1, 0, 0, 0, 1, 'key_yellow', 0, 'liquid_blue'],
            [0, 0, 0, 1, 0, 0, 0, 1, 0, 'mon_skeleton_soldier', 0],
            [1, 'door_yellow', 1, 1, 1, 'door_blue', 1, 1, 1, 'door_yellow', 1],
            [0, 'mon_priest', 0, 'door_yellow', 0, 'mon_red_slime', 0, 0, 'mon_skeleton', 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
            ['mon_red_slime', 0, 'mon_green_slime', 0, 0, 0, 0, 0, 0, 0, 0],
            ['door_yellow', 1, 1, 'door_yellow', 1, 1, 1, 'door_yellow', 1, 1, 'door_yellow'],
            [0, 1, 0, 'mon_bat', 0, 1, 0, 'mon_priest', 0, 1, 0],
            [0, 1, 'mon_green_slime', 0, 'key_yellow', 1, 'gem_red', 0, 'liquid_red', 1, 0],
            ['up_floor', 1, 'key_yellow', 'mon_green_slime', 'key_yellow', 1, 0, 'mon_green_slime', 0, 1, 'down_floor'],
        ],
        [
            ['up_floor', 1, 0, 'mon_red_slime', 'door_yellow', 0, 1, 0, 0, 'door_yellow', 0],
            [0, 1, 'mon_bat', 0, 1, 'key_yellow', 1, 'mon_green_slime', 'mon_green_slime', 1, 'mon_red_slime'],
            [0, 'door_yellow', 0, 0, 1, 0, 1, 'key_yellow', 'key_yellow', 1, 0],
            [1, 1, 1, 'door_yellow', 1, 'mon_bat', 1, 'key_yellow', 'key_yellow', 1, 0],
            ['key_yellow', 0, 'mon_priest', 0, 1, 0, 1, 1, 1, 1, 0],
            ['key_yellow', 0, 0, 'mon_bat', 1, 0, 'mon_green_slime', 0, 0, 0, 0],
            [1, 'mon_skeleton_soldier', 1, 1, 1, 0, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 'mon_green_slime', 1, 0, 0, 0, 'mon_red_slime'],
            ['gem_blue', 'key_yellow', 'liquid_red', 0, 1, 0, 1, 'door_yellow', 1, 1, 1],
            [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0],
            ['down_floor', 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],

        ],
        [
            ['down_floor', 1, 'key_yellow', 'key_yellow', 1, 0, 'mon_priest', 0, 'key_yellow', 'mon_green_slime', 0],
            [0, 1, 'key_yellow', 'key_yellow', 1, 0, 1, 1, 1, 1, 'door_yellow'],
            [0, 1, 1, 'mon_red_slime', 1, 0, 1, 'liquid_red', 0, 'mon_skeleton', 0],
            [0, 'door_yellow', 'door_yellow', 0, 'door_yellow', 0, 1, 0, 0, 0, 'mon_bat'],
            [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
            [0, 0, 'mon_red_slime', 'mon_priest', 0, 'key_yellow', 0, 'mon_skeleton', 'mon_skeleton_soldier', 0, 0],
            [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
            ['mon_priest', 0, 0, 0, 1, 0, 'door_yellow', 'door_yellow', 0, 'door_yellow', 0],
            [0, 'mon_bat', 0, 'gem_blue', 1, 0, 1, 1, 'mon_red_slime', 1, 'mon_red_slime'],
            [0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0],
            [0, 'mon_green_slime', 0, 0, 'mon_skeleton', 0, 1, 'liquid_red', 'liquid_red', 1, 'up_floor'],
        ],
        [
            ['up_floor', 1, 'gem_red', 1, 0, 0, 0, 1, 'key_yellow', 1, 'mon_green_slime'],
            [0, 1, 'liquid_red', 1, 0, 0, 0, 1, 'key_yellow', 1, 'mon_red_slime'],
            [0, 1, 'mon_bat', 1, 'mon_red_slime', 1, 'mon_skeleton_soldier', 1, 'liquid_red', 1, 'mon_green_slime'],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            ['door_yellow', 1, 'door_yellow', 1, 'door_blue', 1, 'door_yellow', 1, 'mon_skeleton', 1, 'door_yellow'],
            [0, 'mon_skeleton_soldier', 0, 'mon_priest', 0, 0, 0, 0, 0, 0, 0],
            ['door_yellow', 1, 'door_yellow', 1, 'door_yellow', 1, 'door_yellow', 1, 'mon_skeleton_soldier', 1, 'door_yellow'],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 'mon_bat', 1, 'mon_red_slime', 1, 'liquid_blue', 1, 0],
            ['mon_green_slime', 1, 'mon_green_slime', 1, 'key_yellow', 1, 'mon_priest', 1, 'key_yellow', 1, 0],
            [0, 'mon_red_slime', 0, 1, 'key_yellow', 1, 'liquid_blue', 1, 'key_yellow', 1, 'down_floor'],

        ],
        [
            ['down_floor', 0, 'door_yellow', 'door_yellow', 0, 'up_floor', 0, 1, 'key_yellow', 0, 'key_yellow'],
            [0, 0, 1, 1, 0, 0, 'mon_green_slime', 1, 0, 'key_red', 0],
            ['door_yellow', 1, 1, 1, 1, 'door_yellow', 1, 1, 'liquid_blue', 0, 'liquid_red'],
            [0, 1, 'key_yellow', 'key_yellow', 'key_yellow', 0, 0, 1, 1, 'door_green', 1],
            ['liquid_red', 1, 1, 1, 1, 1, 'mon_priest', 1, 'mon_guard', 0, 'mon_guard'],
            [0, 'mon_red_slime', 'mon_green_slime', 'mon_red_slime', 0, 1, 0, 1, 0, 0, 0],
            [1, 1, 1, 1, 'door_yellow', 1, 'mon_bat', 1, 1, 'door_yellow', 1],
            [0, 0, 0, 'mon_bat', 0, 'mon_skeleton', 0, 'mon_priest', 0, 0, 0],
            ['door_yellow', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'door_yellow'],
            ['mon_green_slime', 0, 1, 'gem_red', 'key_yellow', 1, 'key_blue', 'liquid_red', 1, 0, 'mon_skeleton'],
            [0, 'mon_bat', 'door_blue', 'key_yellow', 'gem_blue', 1, 'key_yellow', 0, 'door_yellow', 'mon_skeleton_soldier', 0],
        ],
        [
            [0, 0, 'mon_skeleton', 'door_yellow', 0, 'down_floor', 0, 'door_yellow', 'mon_green_slime', 0, 'liquid_red'],
            [0, 'key_yellow', 0, 1, 0, 0, 0, 1, 0, 'mon_green_slime', 0],
            ['mon_skeleton_soldier', 1, 1, 1, 1, 'door_blue', 1, 1, 1, 1, 0],
            [0, 'key_yellow', 0, 1, 'key_yellow', 0, 'key_yellow', 'door_yellow', 'door_yellow', 0, 0],
            ['gem_blue', 0, 'mon_bat', 'door_yellow', 0, 'gem_red', 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 'mon_red_slime', 1, 0, 0, 'mon_skeleton_soldier'],
            ['key_yellow', 0, 'door_yellow', 'mon_skeleton_soldier', 'key_yellow', 1, 0, 1, 0, 1, 0],
            ['mon_skeleton_soldier', 0, 1, 0, 0, 1, 0, 1, 1, 1, 'door_yellow'],
            ['door_yellow', 1, 1, 1, 'door_yellow', 1, 0, 1, 'key_yellow', 0, 'mon_priest'],
            [0, 'liquid_red', 1, 0, 'mon_skeleton', 1, 'mon_bat', 1, 0, 'mon_skeleton', 0],
            ['up_floor', 0, 'door_blue', 0, 0, 'door_yellow', 0, 'door_yellow', 'mon_priest', 0, 'key_yellow'],
        ],
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
            ['mon_skeleton', 'mon_skeleton', 'mon_skeleton', 1, 1, 0, 1, 1, 'mon_skeleton', 'mon_skeleton', 'mon_skeleton'],
            [0, 'mon_skeleton_soldier', 0, 'door_green', 0, 'mon_skeleton_captain', 0, 'door_green', 0, 'mon_skeleton_soldier', 0],
            [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
            ['mon_skeleton', 'gem_blue', 'mon_skeleton', 1, 1, 0, 1, 1, 'mon_skeleton', 'gem_red', 'mon_skeleton'],
            [0, 'mon_skeleton_soldier', 0, 1, 1, 0, 1, 1, 0, 'mon_skeleton_soldier', 0],
            [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
            ['door_yellow', 1, 'door_yellow', 1, 1, 'door_red', 1, 1, 'door_yellow', 1, 'door_yellow'],
            [0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
            ['down_floor', 1, 0, 'mon_priest', 0, 0, 0, 'mon_priest', 0, 1, 'liquid_blue'],
        ],
        [
            [0, 0, 0, 1, 'gem_red', 0, 'door_yellow', 0, 0, 'liquid_red', 'key_yellow'],
            [0, 0, 0, 1, 0, 'mon_bat', 1, 'mon_zombie', 1, 0, 0],
            [0, 0, 0, 1, 'door_yellow', 1, 1, 0, 'door_yellow', 0, 0],
            [1, 'door_green', 1, 1, 0, 'mon_big_bat', 1, 1, 1, 1, 'mon_big_slime'],
            ['mon_super_priest', 0, 'mon_super_priest', 1, 'mon_zombie', 0, 'door_yellow', 'mon_super_priest', 0, 1, 0],
            [0, 0, 0, 1, 0, 0, 0, 0, 'liquid_red', 1, 0],
            ['liquid_blue', 0, 0, 'mon_big_bat', 0, 0, 'door_yellow', 'mon_big_slime', 0, 1, 0],
            [1, 'door_blue', 1, 1, 1, 1, 1, 1, 1, 1, 'mon_big_bat'],
            [0, 'mon_big_bat', 0, 'mon_big_slime', 'door_yellow', 0, 0, 0, 0, 'mon_bat', 0],
            ['key_yellow', 0, 0, 0, 1, 0, 1, 1, 'door_yellow', 1, 0],
            ['key_yellow', 'key_yellow', 'key_yellow', 'key_yellow', 1, 'down_floor', 1, 'liquid_blue', 'mon_big_bat', 1, 'up_floor'],
        ],
        [
            [0, 1, 0, 1, 'key_yellow', 'gem_red', 'key_yellow', 1, 0, 1, 1],
            [1, 1, 'mon_big_bat', 1, 0, 1, 0, 1, 0, 1, 1],
            [0, 0, 0, 1, 'mon_super_priest', 0, 'mon_super_priest', 1, 0, 'mon_zombie', 0],
            ['door_yellow', 1, 1, 1, 1, 'door_yellow', 1, 1, 1, 1, 0],
            [0, 'mon_super_priest', 0, 'door_yellow', 0, 'mon_zombie', 0, 1, 'liquid_red', 0, 'mon_big_bat'],
            [1, 1, 1, 1, 0, 0, 'mon_super_priest', 'door_yellow', 0, 'gem_blue', 0],
            ['key_yellow', 'key_yellow', 0, 1, 0, 'liquid_blue', 0, 1, 'key_yellow', 0, 'mon_big_slime'],
            ['key_yellow', 'key_blue', 0, 1, 1, 1, 1, 1, 'door_blue', 1, 'door_yellow'],
            [0, 0, 'mon_zombie', 1, 0, 0, 0, 1, 'mon_big_slime', 0, 'mon_zombie'],
            [1, 1, 'door_yellow', 1, 'liquid_red', 0, 'liquid_red', 1, 1, 0, 1],
            ['up_floor', 0, 0, 'mon_bat', 0, 0, 0, 'mon_bat', 0, 0, 'down_floor'],
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
            ['mon_zombie_knight', 0, 'mon_zombie_knight', 1, 'gem_blue', 'key_yellow', 'liquid_red', 1, 'key_yellow', 'key_yellow', 'key_yellow'],
            [0, 'mon_zombie_knight', 0, 1, 'mon_big_slime', 1, 'mon_zombie_knight', 1, 0, 0, 'key_yellow'],
            [1, 0, 0, 1, 0, 1, 0, 1, 1, 'door_yellow', 1],
            [1, 'door_blue', 1, 1, 'door_blue', 1, 'door_yellow', 1, 0, 'mon_zombie_knight', 0],
            ['liquid_red', 0, 0, 'mon_big_bat', 0, 'mon_rocker', 0, 'mon_big_bat', 0, 0, 0],
            [0, 'mon_big_slime', 0, 1, 1, 'door_yellow', 1, 1, 'liquid_red', 0, 'mon_zombie'],
            ['door_yellow', 1, 'door_yellow', 1, 0, 0, 0, 1, 1, 1, 'door_yellow'],
            [0, 1, 0, 'mon_zombie', 0, 'door_yellow', 0, 'mon_big_slime', 0, 'mon_big_slime', 0],
            ['mon_super_priest', 1, 'mon_super_priest', 1, 1, 1, 1, 1, 'door_yellow', 1, 1],
            [0, 1, 0, 1, 'liquid_red', 0, 0, 1, 0, 0, 0],
            ['key_blue', 1, 0, 'door_yellow', 0, 0, 0, 1, 0, 0, 0],
        ],
        [
            ['gem_blue', 'mon_zombie_knight', 0, 'door_yellow', 0, 0, 0, 1, 0, 0, 0],
            ['mon_zombie', 0, 0, 1, 0, 0, 0, 1, 0, 0, 'mon_big_slime'],
            [0, 0, 'mon_big_slime', 1, 1, 'door_green', 1, 1, 1, 1, 'door_yellow'],
            ['door_yellow', 1, 1, 1, 0, 0, 0, 1, 'mon_big_bat', 0, 0],
            [0, 1, 'key_yellow', 1, 0, 0, 0, 1, 0, 'mon_big_bat', 0],
            [0, 1, 'key_blue', 1, 0, 0, 0, 1, 'door_yellow', 1, 'mon_super_priest'],
            ['mon_big_slime', 1, 'key_yellow', 1, 0, 0, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 'liquid_blue'],
            [0, 'door_yellow', 0, 1, 0, 0, 0, 1, 'door_yellow', 1, 1],
            ['mon_big_bat', 1, 'mon_big_bat', 1, 0, 0, 0, 1, 0, 'mon_bat', 0],
            [0, 'mon_super_priest', 0, 1, 0, 0, 0, 'door_yellow', 'mon_bat', 0, 0],
        ],
        [
            ['key_yellow', 'mon_big_bat', 0, 1, 0, 0, 0, 1, 0, 0, 'mon_big_bat'],
            ['key_yellow', 'mon_super_priest', 0, 'door_yellow', 0, 0, 0, 'door_yellow', 'mon_big_slime', 0, 0],
            ['key_yellow', 'mon_big_bat', 0, 1, 'mon_zombie', 0, 'key_yellow', 1, 0, 0, 'liquid_red'],
            [1, 1, 1, 1, 1, 'door_blue', 1, 1, 1, 1, 1],
            ['gem_red', 'key_yellow', 0, 1, 'liquid_red', 0, 0, 1, 0, 'mon_zombie', 0],
            ['liquid_red', 0, 'mon_rocker', 'door_yellow', 0, 'mon_zombie_knight', 0, 1, 'mon_big_bat', 0, 'key_blue'],
            ['gem_blue', 'key_yellow', 0, 1, 0, 0, 0, 1, 0, 'door_yellow', 0],
            [1, 1, 1, 1, 1, 'door_yellow', 1, 1, 1, 'mon_super_priest', 1],
            [0, 'mon_big_slime', 0, 1, 'mon_big_bat', 0, 'mon_big_bat', 1, 0, 0, 0],
            [0, 0, 0, 'door_yellow', 0, 0, 0, 'door_yellow', 0, 1, 1],
            [0, 0, 0, 1, 0, 0, 0, 1, 'mon_slime_man', 1, 1],
        ],
        [
            [0, 0, 0, 1, 0, 0, 0, 1, 'gem_red', 0, 'gem_blue'],
            [0, 0, 0, 1, 0, 0, 0, 1, 0, 'liquid_blue', 0],
            [0, 0, 0, 1, 'mon_zombie_knight', 1, 'mon_big_bat', 1, 'key_yellow', 0, 'key_yellow'],
            [1, 'door_green', 1, 1, 0, 1, 0, 1, 1, 'door_green', 1],
            ['mon_guard', 0, 'mon_guard', 1, 'door_yellow', 1, 'door_blue', 1, 'mon_zombie_knight', 0, 'mon_zombie_knight'],
            [0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
            [1, 'door_green', 1, 1, 'mon_zombie', 1, 'mon_big_slime', 1, 1, 'door_green', 1],
            ['mon_guard', 0, 'mon_guard', 1, 0, 0, 0, 1, 'mon_zombie', 0, 'mon_zombie'],
            [0, 0, 0, 1, 1, 'mon_super_priest', 1, 1, 0, 0, 0],
            [1, 'door_yellow', 1, 1, 0, 0, 0, 1, 1, 'door_yellow', 1],
            ['liquid_red', 0, 0, 'mon_big_bat', 0, 0, 0, 'mon_big_bat', 0, 0, 'liquid_red'],
        ],
        [
            [0, 0, 0, 'door_blue', 0, 0, 0, 'door_yellow', 'mon_super_priest', 0, 'key_yellow'],
            [0, 0, 0, 1, 0, 0, 0, 1, 0, 'mon_big_slime', 'key_yellow'],
            ['door_yellow', 1, 1, 1, 1, 1, 1, 1, 0, 0, 'key_blue'],
            [0, 'liquid_red', 0, 'door_yellow', 'mon_zombie_knight', 0, 'mon_zombie_knight', 'door_yellow', 'mon_zombie', 0, 'key_yellow'],
            ['mon_rocker', 0, 'mon_rocker', 1, 0, 0, 0, 1, 0, 'mon_big_bat', 'key_yellow'],
            [1, 1, 1, 1, 1, 'door_blue', 1, 1, 1, 1, 1],
            [0, 'mon_zombie', 0, 0, 0, 0, 0, 0, 0, 'mon_rocker', 0],
            ['door_yellow', 1, 1, 'door_yellow', 1, 1, 1, 'door_yellow', 1, 1, 'door_yellow'],
            ['mon_super_priest', 0, 1, 'mon_big_bat', 'mon_big_bat', 1, 'mon_big_slime', 'mon_big_slime', 1, 0, 'mon_super_priest'],
            [0, 'key_yellow', 1, 'mon_big_bat', 'mon_big_bat', 1, 'mon_big_slime', 'mon_big_slime', 1, 'key_yellow', 0],
            ['liquid_red', 'gem_red', 1, 0, 'key_yellow', 1, 'key_yellow', 0, 1, 'gem_blue', 'liquid_red'],
        ],
        [
            [0, 0, 1, 0, 'liquid_red', 'mon_super_priest', 0, 'key_blue', 1, 'key_yellow', 'gem_red'],
            [0, 0, 1, 0, 0, 1, 0, 0, 1, 'mon_big_bat', 0],
            ['door_yellow', 0, 1, 'mon_zombie_knight', 1, 1, 1, 'mon_zombie_knight', 1, 'door_yellow', 0],
            ['mon_bat', 0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
            [0, 0, 1, 'key_yellow', 0, 1, 0, 'key_yellow', 1, 'mon_big_slime', 'mon_big_slime'],
            ['door_yellow', 0, 1, 0, 'mon_rocker', 0, 'mon_rocker', 0, 1, 0, 0],
            ['mon_big_bat', 0, 1, 1, 1, 'door_blue', 1, 1, 1, 1, 0],
            [0, 0, 'mon_big_slime', 0, 0, 0, 0, 'mon_zombie_knight', 0, 0, 'mon_zombie'],
            ['door_yellow', 1, 1, 1, 1, 'mon_zombie_knight', 1, 1, 'liquid_red', 'key_yellow', 0],
            [0, 1, 0, 'door_yellow', 'key_yellow', 0, 'key_yellow', 1, 1, 1, 'mon_big_bat'],
            ['mon_big_slime', 0, 'mon_big_bat', 1, 0, 0, 0, 'door_yellow', 0, 'mon_bat', 0],
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
    ],
    MAP_ENTER: [{X: 5, Y: 10}, {X: 0, Y: 1}, {X: 1, Y: 10}, {X: 10, Y: 9}, {X: 1, Y: 10}, {X: 0, Y: 1},],
    MAP_LEAVE: [{X: 1, Y: 0}, {X: 0, Y: 9}, {X: 9, Y: 10}, {X: 0, Y: 9}, {X: 0, Y: 1}, {X: 10, Y: 9},],
    EVENTS: [
        {
            map_num: 0,
            X: 4,
            Y: 10,
            events: [{
                type: 'dialog',
                people: ['braver'],
                content: [
                    {braver: "嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿"},
                    {braver: "我是勇者啊"},
                    {self: "还是我们做的魔塔好用"}],
            }, {
                type: 'dialog',
                loop: true,
                people: ['braver'],
                content: [
                    {braver: "嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿"},
                    {self: "这位年轻人怕是不知道什么是力量这位年轻人怕是不知道什么是力量这位年轻人怕是不知道什么是力量这位年轻人怕是不知道什么是力量"}],
            }]
        },
        {
            map_num: 0,
            X: 6,
            Y: 10,
            events: [{
                type: 'trade',
                people: [],
                content: [
                    {self: "这位年轻人怕是不知道什么是力量这位年轻人怕是不知道什么是力量这位年轻人怕是不知道什么是力量这位年轻人怕是不知道什么是力量"}
                ],
                info: {
                    coin: 1000,
                    good: 'key',
                    num: 4,
                    attr: 0
                }
            }, {
                type: 'dialog',
                loop: true,
                people: ['braver'],
                content: [
                    {braver: "嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿"},
                    {self: "这位年轻人怕是不知道什么是力量这位年轻人怕是不知道什么是力量这位年轻人怕是不知道什么是力量这位年轻人怕是不知道什么是力量"}],
            }]
        }
    ]
};

export default config;
//
// //         你主动攻击怪物，你先攻击；怪物主动攻击你，怪物先攻击。
// // 初级、中级、高级卫兵总是守卫一个仓库的机关门，但机关门不一定由卫兵守护。
// // 魔法警卫和初、高级巫师会使用魔法攻击，来到初/高级巫师身边生命减少100/200，同时被多个巫师攻击效果可叠加。
// // 47楼左下角和右上角的两个高级巫师会“退敌”，玩家直冲其而来时，先魔法攻击减少你200生命，自身再退后一格，玩家如果再靠近他一步，则会再重复一次这一过程。等到这两个高级巫师无路可退时，才会和玩家战斗。没有神圣盾的时候，经过两个魔法警卫中间生命减少一半。
// // 一般情况下，打败一个区域boss会出现大血瓶、黄钥匙、红、蓝宝石各3个。
// // 下面表格中，各怪物按区域排放，粗体名称表示区域boss。名字后的*号表示在打通这10层前不会与他/它战斗。
// // 名字
// //         生命
// //         攻击
// //         防御
// //         获得金币数量（不计算幸运金币）	出现的楼层
// //         绿色史莱姆
// //         35
// //         18
// //         1
// //         1	1、3、4、5、6、7、8、9、30、34
// //         红色史莱姆
// //         45
// //         20
// //         2
// //         2	1、3、4、5、6、7、8、9、30、34、46
// //         小蝙蝠
// //         35
// //         38
// //         3
// //         3	1、3、4、5、6、7、8、9、11、12、15、19、20、34
// //         初级法师
// //         60
// //         32
// //         8
// //         5	1、3、4、5、6、7、8、9、10
// //         骷髅人
// //         50
// //         42
// //         6
// //         6	1、3、4、6、7、8、9、10、46
// //         骷髅士兵
// //         55
// //         52
// //         12
// //         8	1、4、5、6、7、8、9、10
// //         初级卫兵
// //         50
// //         48
// //         22
// //         12	8、17
// //         骷髅队长
// //         100
// //         65
// //         15
// //         30	10
// //         大史莱姆
// //         130
// //         60
// //         3
// //         8	11、12、14、15、16、18、19、30、34
// //         大蝙蝠
// //         60
// //         100
// //         8
// //         12	11、12、14、15、16、17、18、19、20、46
// //         高级法师
// //         100
// //         95
// //         30
// //         18	11、12、14、15、16、17、18、19、20
// //         兽人
// //         260
// //         85
// //         5
// //         22	11、12、14、15、16、17、18、19、38、46
// //         兽人武士
// //         320
// //         120
// //         15
// //         30	14、15、16、17、18、19、31、33、36
// //         石头人
// //         20
// //         100
// //         68
// //         28	14、16、18、19、20
// //         大乌贼 * ①
// // 1200
// //         180
// //         20
// //         100	15
// //         吸血鬼
// //         444
// //         199
// //         66
// //         144	20
// //         大法师* ②
// // 4500
// //         560
// //         310
// //         1000	25
// //         鬼战士
// //         220
// //         180
// //         30
// //         35	31、32、33、34、36、37、38、39、40
// //         战士
// //         210
// //         200
// //         65
// //         45	31、32、33、34、36、37、38、39、40、46
// //         幽灵
// //         320
// //         140
// //         20
// //         30	16、31、32、33、34、36、37、38、39、40
// //         中级卫兵
// //         100
// //         180
// //         110
// //         50	2、32、38
// //         双手剑士
// //         100
// //         680
// //         50
// //         55	31、32、33、34、36、37、38、39、40、46
// //         魔龙 * ③
// // 1500
// //         600
// //         250
// //         800	35
// //         骑士
// //         160
// //         230
// //         105
// //         65	31、32、34、36、37、38、39、40、46
// //         骑士队长
// //         120
// //         150
// //         50
// //         100	32、40、42
// //         初级巫师
// //         220
// //         370
// //         110
// //         80	41、42、43、45、46、47、48
// //         高级巫师
// //         200
// //         380
// //         130
// //         90	41、42、43、45、46、47、48、49
// //         史莱姆王
// //         360
// //         310
// //         20
// //         40	41、42、43、45、46、47、48
// //         吸血蝙蝠
// //         200
// //         390
// //         90
// //         50	41、42、43、45、46、47、48
// //         黑暗骑士
// //         180
// //         430
// //         210
// //         120	42、43、45、48、49
// //         魔法警卫
// //         230
// //         450
// //         100
// //         100	41、42、43、45、48、49
// //         高级卫兵	180	460	360	200	44
// //         魔王（49层）④
// // 800×10
// //         500×10
// //         100×10
// //         500	49
// //         魔王（50层）
// // 8000
// //         1580
// //         190
// //         50