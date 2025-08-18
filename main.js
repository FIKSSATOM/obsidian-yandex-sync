var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
for (var name in all)
__defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
if (from && typeof from === "object" || typeof from === "function") {
for (let key of __getOwnPropNames(from))
if (!__hasOwnProp.call(to, key) && key !== except)
__defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
}
return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

var require_spark_md5 = __commonJS({
"node_modules/spark-md5/spark-md5.js"(exports, module) {
(function(factory) {
if (typeof exports === "object") {
module.exports = factory();
} else if (typeof define === "function" && define.amd) {
define(factory);
} else {
var glob;
try {
glob = window;
} catch (e) {
glob = self;
}
glob.SparkMD5 = factory();
}
})(function() {
"use strict";
var add32 = function(a, b) {
return a + b & 4294967295;
}, hex_chr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
function cmn(q, a, b, x, s, t) {
a = add32(add32(a, q), add32(x, t));
return add32(a << s | a >>> 32 - s, b);
}
function ff(a, b, c, d, x, s, t) {
return cmn(b & c | ~b & d, a, b, x, s, t);
}
function gg(a, b, c, d, x, s, t) {
return cmn(b & d | c & ~d, a, b, x, s, t);
}
function hh(a, b, c, d, x, s, t) {
return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a, b, c, d, x, s, t) {
return cmn(c ^ (b | ~d), a, b, x, s, t);
}
function md5cycle(x, l) {
var a = x[0], b = x[1], c = x[2], d = x[3];
a = ff(a, b, c, d, l[0], 7, -680876936);
d = ff(d, a, b, c, l[1], 12, -389564586);
c = ff(c, d, a, b, l[2], 17, 606105819);
b = ff(b, c, d, a, l[3], 22, -1044525330);
a = ff(a, b, c, d, l[4], 7, -176418897);
d = ff(d, a, b, c, l[5], 12, 1200080426);
c = ff(c, d, a, b, l[6], 17, -1473231341);
b = ff(b, c, d, a, l[7], 22, -45705983);
a = ff(a, b, c, d, l[8], 7, 1770035416);
d = ff(d, a, b, c, l[9], 12, -1958414417);
c = ff(c, d, a, b, l[10], 17, -42063);
b = ff(b, c, d, a, l[11], 22, -1990404162);
a = ff(a, b, c, d, l[12], 7, 1804603682);
d = ff(d, a, b, c, l[13], 12, -40341101);
c = ff(c, d, a, b, l[14], 17, -1502002290);
b = ff(b, c, d, a, l[15], 22, 1236535329);
a = gg(a, b, c, d, l[1], 5, -165796510);
d = gg(d, a, b, c, l[6], 9, -1069501632);
c = gg(c, d, a, b, l[11], 14, 643717713);
b = gg(b, c, d, a, l[0], 20, -373897302);
a = gg(a, b, c, d, l[5], 5, -701558691);
d = gg(d, a, b, c, l[10], 9, 38016083);
c = gg(c, d, a, b, l[15], 14, -660478335);
b = ff(b, c, d, a, l[4], 20, -405537848);
a = gg(a, b, c, d, l[9], 5, 568446438);
d = gg(d, a, b, c, l[14], 9, -1019803690);
c = gg(c, d, a, b, l[3], 14, -187363961);
b = gg(b, c, d, a, l[8], 20, 1163531501);
a = gg(a, b, c, d, l[13], 5, -1444681467);
d = gg(d, a, b, c, l[2], 9, -51403784);
c = gg(c, d, a, b, l[7], 14, 1735328473);
b = gg(b, c, d, a, l[12], 20, -1926607734);
a = hh(a, b, c, d, l[5], 4, -378558);
d = hh(d, a, b, c, l[8], 11, -2022574463);
c = hh(c, d, a, b, l[11], 16, 1839030562);
b = hh(b, c, d, a, l[14], 23, -35309556);
a = hh(a, b, c, d, l[1], 4, -1530992060);
d = hh(d, a, b, c, l[4], 11, 1272893353);
c = hh(c, d, a, b, l[7], 16, -155497632);
b = hh(b, c, d, a, l[10], 23, -1094730640);
a = hh(a, b, c, d, l[13], 4, 681279174);
d = hh(d, a, b, c, l[0], 11, -358537222);
c = hh(c, d, a, b, l[3], 16, -722521979);
b = hh(b, c, d, a, l[6], 23, 76029189);
a = hh(a, b, c, d, l[9], 4, -640364487);
d = hh(d, a, b, c, l[12], 11, -421815835);
c = hh(c, d, a, b, l[15], 16, 530742520);
b = hh(b, c, d, a, l[2], 23, -995338651);
a = ii(a, b, c, d, l[0], 6, -198630844);
d = ii(d, a, b, c, l[7], 10, 1126891415);
c = ii(c, d, a, b, l[14], 15, -1416354905);
b = ii(b, c, d, a, l[5], 21, -57434055);
a = ii(a, b, c, d, l[12], 6, 1700485571);
d = ii(d, a, b, c, l[3], 10, -1894986606);
c = ii(c, d, a, b, l[10], 15, -1051523);
b = ii(b, c, d, a, l[1], 21, -2054922799);
a = ii(a, b, c, d, l[8], 6, 1873313359);
d = ii(d, a, b, c, l[15], 10, -30611744);
c = ii(c, d, a, b, l[6], 15, -1560198380);
b = ii(b, c, d, a, l[13], 21, 1309151649);
a = ii(a, b, c, d, l[4], 6, -145523070);
d = ii(d, a, b, c, l[11], 10, -1120210379);
c = ii(c, d, a, b, l[2], 15, 718787259);
b = ii(b, c, d, a, l[9], 21, -343485551);
x[0] = add32(a, x[0]);
x[1] = add32(b, x[1]);
x[2] = add32(c, x[2]);
x[3] = add32(d, x[3]);
}
function md5blk(s) {
var n, i, b = [];
for (i = 0; i < 64; i += 4) {
n = s.charCodeAt(i) << 24 | s.charCodeAt(i + 1) << 16 | s.charCodeAt(i + 2) << 8 | s.charCodeAt(i + 3);
b[i >> 2] = n;
}
return b;
}
function md5blk_array(a) {
var n, i, b = [];
for (i = 0; i < 64; i += 4) {
n = a[i] << 24 | a[i + 1] << 16 | a[i + 2] << 8 | a[i + 3];
b[i >> 2] = n;
}
return b;
}
function rhex(n) {
var s = "", t;
for (t = 0; t < 4; t += 1) {
s += hex_chr[n >> t * 8 + 4 & 15] + hex_chr[n >> t * 8 & 15];
}
return s;
}
function hex(x) {
var i;
for (i = 0; i < x.length; i += 1) {
x[i] = rhex(x[i]);
}
return x.join("");
}
if (hex([1732584193, -271733879, -1732584194, 271733878]) !== "67452301efcdab8998badcfe10325476") {
add32 = function(x, y) {
var lsw = (x & 65535) + (y & 65535), msw = (x >> 16) + (y >> 16) + (lsw >> 16);
return msw << 16 | lsw & 65535;
};
}
function SparkMD5() {
this.reset();
}
SparkMD5.prototype.append = function(s) {
var nkey, tail, tmp;
this.appendBinary(s);
nkey = this.raw === true ? this.x.length - 16 : 0;
tail = this.x[nkey];
tmp = tail.length;
if (tmp < 16) {
this.x[nkey] = tail.concat(Array(16 - tmp).join(String.fromCharCode(0)));
}
return this;
};
SparkMD5.prototype.appendBinary = function(s) {
var n, l, i, j, t;
l = s.length;
n = this.x.length - 16;
for (i = 0; i < l; i += 1) {
j = n + (i >> 2);
t = (i & 3) << 3;
if (j >= this.x.length) {
j = this.x.push([0, 0, 0, 0]) - 1;
n = j;
}
this.x[j][t >> 5] |= s.charCodeAt(i) << 24 - t;
}
this.l = add32(this.l, l * 8);
return this;
};
SparkMD5.prototype.end = function(raw) {
var i, n, l, p, x, tail, tmpl, h, pad, nkey;
l = this.l;
nkey = this.x.length - 16;
p = nkey << 4;
x = this.x;
n = l & 63;
pad = n < 56 ? 56 - n : 120 - n;
tail = p + n;
tmpl = (tail >> 2) + 1;
p = (tail & 3) << 3;
if (tmpl > 16) {
x.push([0, 0, 0, 0]);
tmpl -= 16;
}
x[nkey][tmpl - 1] |= 128 << 24 - p;
if (this.raw === true) {
x[nkey][14] = l;
x[nkey][15] = 0;
} else {
x[nkey][14] = l[1];
x[nkey][15] = l[0];
}
h = hex(this.h);
if (raw) {
return h;
}
return h.split("").reverse().join("");
};
SparkMD5.prototype.reset = function() {
this.x = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
this.l = [0, 0];
this.h = [1732584193, -271733879, -1732584194, 271733878];
return this;
};
SparkMD5.prototype.getState = function() {
return {
x: this.x,
l: this.l,
h: this.h
};
};
SparkMD5.prototype.setState = function(state) {
this.x = state.x;
this.l = state.l;
this.h = state.h;
return this;
};
SparkMD5.prototype.destroy = function() {
delete this.x;
delete this.l;
delete this.h;
};
SparkMD5.hash = function(s, raw) {
return SparkMD5.hashBinary(s, raw);
};
SparkMD5.hashBinary = function(s, raw) {
var hash, i, x = [], l = s.length, n = l * 8;
for (i = 0; i < l; i += 1) {
x[i >> 2] |= (s.charCodeAt(i) & 255) << (i % 4 << 3);
}
x[n >> 5] |= 128 << (n & 31);
x[(n + 64 >>> 9 << 4) + 14] = n;
hash = [1732584193, -271733879, -1732584194, 271733878];
l = (n + 64 >>> 9 << 4) + 16;
for (i = 0; i < l; i += 16) {
md5cycle(hash, x.slice(i, i + 16));
}
if (raw) {
return hash;
}
return hex(hash);
};
SparkMD5.ArrayBuffer = function() {
this.reset();
};
SparkMD5.ArrayBuffer.prototype.append = function(arr) {
var l = arr.length, n = this.buff.length, i;
this.buff = this.buff.concat(Array.prototype.slice.call(arr));
this.length += l;
for (i = 0; i + 63 < this.buff.length; i += 64) {
md5cycle(this.h, md5blk_array(this.buff.slice(i, i + 64)));
}
this.buff = this.buff.slice(i);
return this;
};
SparkMD5.ArrayBuffer.prototype.end = function(raw) {
var buff = this.buff, length = this.length, h = this.h, i, p, tail;
p = buff.length;
buff[p] = 128;
for (i = p + 1; i < 64; i += 1) {
buff[i] = 0;
}
tail = md5blk_array(buff);
if (p > 55) {
md5cycle(h, tail);
for (i = 0; i < 16; i += 1) {
tail[i] = 0;
}
}
tail[14] = length * 8;
md5cycle(h, tail);
return raw ? h : hex(h);
};
SparkMD5.ArrayBuffer.prototype.reset = function() {
this.buff = [];
this.length = 0;
this.h = [1732584193, -271733879, -1732584194, 271733878];
return this;
};
SparkMD5.ArrayBuffer.prototype.getState = function() {
var state = SparkMD5.prototype.getState.call(this);
state.buff = this.buff;
state.length = this.length;
return state;
};
SparkMD5.ArrayBuffer.prototype.setState = function(state) {
SparkMD5.prototype.setState.call(this, state);
this.buff = state.buff;
this.length = state.length;
return this;
};
SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;
SparkMD5.ArrayBuffer.hash = function(arr, raw) {
var hash = (new SparkMD5.ArrayBuffer()).append(arr).end(raw);
return hash;
};
return SparkMD5;
});
}
});

var main_exports = {};
__export(main_exports, {
default: () => YDSyncPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var import_spark_md5 = __toESM(require_spark_md5());

var LOG_FILE_NAME = "yd-sync.log";
var MANIFEST_NAME = "yd-sync-manifest.json";
var IGNORED_FILES = [LOG_FILE_NAME, MANIFEST_NAME];
var MAX_LOG_SIZE = 1024 * 1024;
var YANDEX_API_BASE_URL = "https://cloud-api.yandex.net/v1/disk";
var INCOMING_FOLDER_NAME = "Incoming"; 
var DEVICE_INITIALIZED_KEY = "yd-sync-initialized-v2";

var FileLogger = class {
constructor(app, logPath) {
this.app = app;
this.logPath = logPath;
this.logQueue = [];
this.groupLevel = 0;
}
getTimestamp() {
const d = new Date();
return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}
formatMessage(level, message) {
const indent = "  ".repeat(this.groupLevel);
return `[${this.getTimestamp()}] [${level}]${indent} ${message}`;
}
log(message) {
this.logQueue.push(this.formatMessage("INFO", message));
console.log(message);
}
warn(message) {
this.logQueue.push(this.formatMessage("WARN", message));
console.warn(message);
}
error(message, ...optionalParams) {
const fullMessage = [message, ...optionalParams].join(" ");
this.logQueue.push(this.formatMessage("ERROR", fullMessage));
console.error(message, ...optionalParams);
}
group(label) {
this.logQueue.push(this.formatMessage("GROUP", label));
console.group(label);
this.groupLevel++;
}
groupEnd() {
this.groupLevel = Math.max(0, this.groupLevel - 1);
console.groupEnd();
}
async flush() {
if (this.logQueue.length === 0)
return;
const logFile = this.app.vault.getAbstractFileByPath(this.logPath);
let existingContent = "";
if (logFile instanceof import_obsidian.TFile) {
existingContent = await this.app.vault.read(logFile);
}
const newContent = this.logQueue.join("\n") + "\n" + existingContent;
const trimmedContent = newContent.length > MAX_LOG_SIZE ? newContent.substring(0, MAX_LOG_SIZE) : newContent;
if (logFile instanceof import_obsidian.TFile) {
await this.app.vault.modify(logFile, trimmedContent);
} else {
await this.app.vault.create(this.logPath, trimmedContent);
}
this.logQueue = [];
}
async clear() {
await this.app.vault.adapter.write(this.logPath, "");
new import_obsidian.Notice("Файл логов очищен.");
}
};

var DEFAULT_SETTINGS = {
oauthToken: "",
remoteFolderName: "Obsidian Sync",
localSubfolder: "",
syncOnStart: false,
syncOnExit: false,
localManifest: {}
};

var YDSyncPlugin = class extends import_obsidian.Plugin {
constructor() {
super(...arguments);
this.syncInProgress = false;
this.isNewDevice = false;
this.handleQuit = async (task) => {
if (this.settings.syncOnExit && !this.syncInProgress) {
await this.runSync(true);
}
};
}

async onload() {
console.log('Загрузка плагина "Yandex.Disk Sync"');
this.logger = new FileLogger(this.app, LOG_FILE_NAME);

try {
    const initialized = window.localStorage.getItem(DEVICE_INITIALIZED_KEY);
    this.isNewDevice = !initialized;
    if (this.isNewDevice) {
        this.logger.log("Обнаружено новое устройство или сброс состояния. Синхронизация будет работать в режиме 'только скачивание' до первого успеха.");
    }
} catch (e) {
    this.logger.warn("Не удалось получить доступ к localStorage, работаем в стандартном режиме.");
    this.isNewDevice = false;
}

await this.loadSettings();
this.addRibbonIcon("sync", "YD Sync: Синхронизировать", async () => {
this.runSync(false);
});
this.addSettingTab(new YDSyncSettingTab(this.app, this));
this.app.workspace.on("quit", this.handleQuit);

this.app.workspace.onLayoutReady(() => {
    if (this.settings.syncOnStart) {
        this.logger.log("Планирование синхронизации при запуске...");
        setTimeout(() => {
            this.runSync(false);
        }, 5000);
    }
});
}

onunload() {
console.log('Выгрузка плагина "Yandex.Disk Sync"');
this.app.workspace.off("quit", this.handleQuit);
if (this.logger) {
this.logger.flush();
}
}

async loadSettings() {
const loadedData = await this.loadData();
this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedData);
if (loadedData && loadedData.lastSyncState) {
this.settings.localManifest = loadedData.lastSyncState;
delete this.settings.lastSyncState;
await this.saveSettings();
this.logger.log("Настройки мигрировали на новую структуру 'localManifest'.");
}
}

async saveSettings() {
await this.saveData(this.settings);
}

async runSync(isQuitting = false) {
if (this.syncInProgress) {
new import_obsidian.Notice("Синхронизация уже выполняется.");
return;
}
if (!this.settings.oauthToken || !this.settings.remoteFolderName) {
new import_obsidian.Notice("Ошибка: Укажите OAuth-токен и имя папки на Диске в настройках.", 1e4);
return;
}

this.syncInProgress = true;
if (!isQuitting) {
new import_obsidian.Notice("YD Sync: Старт", 2e3);
}
this.logger.log("--- Начало сеанса синхронизации ---");

try {
await this.ensureRemoteFolderExists();

this.logger.log("1. Получение состояний...");
this.logger.group("Подготовка");
let remoteManifest = await this.getRemoteManifest();
const localManifest = this.settings.localManifest || {};
const { files: currentLocalFiles, folders: currentLocalFolders } = await this.getLocalState();
this.logger.groupEnd();

if (remoteManifest === null) {
this.logger.warn("Манифест на Диске не найден. Запуск сценария первой синхронизации.");
const choice = await this.promptFirstSync();
if (choice === "upload") {
this.logger.log("Пользователь выбрал 'Загрузить на Диск'.");
await this.performInitialUpload(currentLocalFiles, currentLocalFolders);
} else {
this.logger.warn("Синхронизация отменена пользователем.");
throw new Error("Синхронизация отменена пользователем.");
}
new import_obsidian.Notice("Первоначальная синхронизация завершена.");
this.syncInProgress = false;
this.logger.log("--- Сеанс первоначальной синхронизации завершен ---");
await this.logger.flush();
return;
}

const operations = [];
const stats = { uploaded: 0, downloaded: 0, deletedRemote: 0, deletedLocal: 0, moved: 0, conflicts: 0, folderCreated: 0, folderDeleted: 0, incoming: 0 };
let newManifest = { ...remoteManifest };
let handledPaths = new Set();

this.logger.log("2. Анализ изменений и планирование операций...");

this.logger.group("Поиск перемещенных/переименованных файлов");
const localHashMap = new Map(Object.entries(currentLocalFiles).map(([path, md5]) => [md5, path]));
const movedFiles = [];
for (const oldPath in remoteManifest) {
    if (!currentLocalFiles[oldPath]) {
        const md5 = remoteManifest[oldPath];
        if (localHashMap.has(md5)) {
            const newPath = localHashMap.get(md5);
            if (!remoteManifest[newPath]) {
                this.logger.log(`[ПЕРЕМЕЩЕНИЕ] Обнаружено: ${oldPath} -> ${newPath}`);
                const fromFullPath = `${this.getRemoteBasePath()}/${oldPath}`;
                const toFullPath = `${this.getRemoteBasePath()}/${newPath}`;
                movedFiles.push({ type: 'move_remote', from: fromFullPath, to: toFullPath, overwrite: false });
                
                delete newManifest[oldPath];
                newManifest[newPath] = md5;
                handledPaths.add(oldPath).add(newPath);
                stats.moved++;
            }
        }
    }
}
this.logger.groupEnd();

operations.push(...movedFiles);


await this.processIncomingFolder(currentLocalFiles, newManifest, operations, stats, handledPaths);

const allPaths = new Set([
...Object.keys(remoteManifest),
...Object.keys(localManifest),
...Object.keys(currentLocalFiles)
]);

for (const path of allPaths) {
    if (handledPaths.has(path)) continue;

    const remoteHash = remoteManifest[path];
    const localSavedHash = localManifest[path];
    const currentLocalHash = currentLocalFiles[path];

    this.logger.group(`[Анализ] ${path}`);
    this.logger.log(`Состояния: remote=${remoteHash || 'no'}, localSaved=${localSavedHash || 'no'}, currentLocal=${currentLocalHash || 'no'}`);

    if (currentLocalHash && remoteHash) {
        if (currentLocalHash === remoteHash) {
            this.logger.log("РЕШЕНИЕ: [ПРОПУСТИТЬ] Файлы идентичны.");
        } else {
            const remoteChanged = remoteHash !== localSavedHash;
            const localChanged = currentLocalHash !== localSavedHash;

            if (localChanged && !remoteChanged) {
                this.logger.log("РЕШЕНИЕ: [ЗАГРУЗИТЬ] Файл изменен локально.");
                operations.push({ type: 'upload', path, md5: currentLocalHash });
                newManifest[path] = currentLocalHash;
                stats.uploaded++;
            } else if (!localChanged && remoteChanged) {
                this.logger.log("РЕШЕНИЕ: [СКАЧАТЬ] Файл изменен на Диске.");
                operations.push({ type: 'download', path, md5: remoteHash });
                stats.downloaded++;
            } else if (localChanged && remoteChanged) {
                this.logger.error("РЕШЕНИЕ: [КОНФЛИКТ] Обнаружен конфликт версий.");
                const conflictOp = await this.handleConflict(path, currentLocalHash, remoteHash);
                operations.push(...conflictOp.operations);
                Object.assign(newManifest, conflictOp.manifestUpdates);
                stats.conflicts++;
            } else {
                this.logger.warn("РЕШЕНИЕ: [СКАЧАТЬ] Неоднозначное состояние, приоритет у Диска.");
                operations.push({ type: 'download', path, md5: remoteHash });
                stats.downloaded++;
            }
        }
    } else if (currentLocalHash && !remoteHash) {
        if (this.isNewDevice) {
            this.logger.warn(`РЕШЕНИЕ: [ПРОПУСТИТЬ ЗАГРУЗКУ] Новое устройство, локальный файл '${path}' не будет загружен, чтобы избежать конфликтов. Он будет удален, если его нет на сервере.`);
            operations.push({ type: 'delete_local', path });
            stats.deletedLocal++;
        }
        else if (localSavedHash) {
            this.logger.log("РЕШЕНИЕ: [УДАЛИТЬ ЛОКАЛЬНО] Файл удален на Диске, удаляем локальную копию.");
            operations.push({ type: 'delete_local', path });
            delete newManifest[path];
            stats.deletedLocal++;
        } else {
            this.logger.log("РЕШЕНИЕ: [ЗАГРУЗИТЬ] Новый локальный файл.");
            operations.push({ type: 'upload', path, md5: currentLocalHash });
            newManifest[path] = currentLocalHash;
            stats.uploaded++;
        }
    } else if (!currentLocalHash && remoteHash) {
        if (this.isNewDevice || !localSavedHash) {
             this.logger.log("РЕШЕНИЕ: [СКАЧАТЬ] Новый файл с Диска (или новое устройство).");
             operations.push({ type: 'download', path, md5: remoteHash });
             stats.downloaded++;
        } else { 
            this.logger.log("РЕШЕНИЕ: [УДАЛИТЬ С ДИСКА] Файл удален локально.");
            operations.push({ type: 'delete_remote', path });
            delete newManifest[path];
            stats.deletedRemote++;
        }
    } else if (!currentLocalHash && !remoteHash && localSavedHash) {
        this.logger.log(`РЕШЕНИЕ: [ОЧИСТИТЬ] Файл удален везде, удаляем запись из памяти.`);
        delete newManifest[path];
    }
    this.logger.groupEnd();
}


this.logger.log("3. Выполнение запланированных операций...");
if (operations.length > 0) {
    operations.sort((a, b) => {

        const getPriority = (op) => {
            if (op.type === 'download' && op.sourcePath) return 0; 
            if (op.type === 'move_remote' && op.overwrite) return 1; 
            const order = { 'upload': 2, 'download': 2, 'move_remote': 2, 'rename_local_for_conflict': 2, 'delete_local': 3, 'delete_remote': 4 };
            return order[op.type] || 99;
        };
        return getPriority(a) - getPriority(b);
    });

    for (const op of operations) {
        switch (op.type) {
            case 'upload':
                await this.uploadFile(op.path);
                break;
            case 'download':
                await this.downloadFile(op.path, op.md5, op.sourcePath);
                break;
            case 'delete_remote':
                await this.deleteRemoteFile(op.path);
                break;
            case 'delete_local':
                await this.deleteLocalFile(op.path);
                break;
            case 'move_remote':
                try {
                    await this.moveRemoteFile(op.from, op.to, op.overwrite);
                } catch (e) {
                    if (e.message && e.message.includes("404")) {
                        this.logger.warn(`Перемещение не удалось (404): исходный файл не найден. Это может быть нормально, если он уже был перемещен или удален. Путь: ${op.from}`);
                        this.logger.log(`Пробуем альтернативу: загрузить локальный файл в целевую папку, чтобы гарантировать консистентность.`);
                        
                        // Извлекаем локальный путь из целевого удаленного пути
                        const localPathToUpload = op.to.substring(this.getRemoteBasePath().length + 1);
                        await this.uploadFile(localPathToUpload);

                    } else {
                        // Если ошибка другая, то она действительно критическая
                        throw e;
                    }
                }
                break;
            case 'rename_local_for_conflict':
                await this.app.vault.rename(op.file, op.newPath);
                break;
        }
    }
} else {
    this.logger.log("Нет файловых операций для выполнения.");
}

this.logger.log("4. Синхронизация структуры папок...");
const { folders: finalLocalFolders } = await this.getLocalState();
let remoteFolders = await this.getAllRemoteFolders();

const foldersToCreateRemotely = [...finalLocalFolders].filter(f => !remoteFolders.has(f));
if (foldersToCreateRemotely.length > 0) {
    foldersToCreateRemotely.sort();
    for (const localFolder of foldersToCreateRemotely) {
        this.logger.log(`[Создать на Диске] Папка: ${localFolder}`);
        await this.createRemoteFolder(`${this.getRemoteBasePath()}/${localFolder}`);
        stats.folderCreated++;
    }
}

remoteFolders = await this.getAllRemoteFolders();
const foldersToDeleteRemotely = [...remoteFolders].filter(f => !finalLocalFolders.has(f));
if (foldersToDeleteRemotely.length > 0) {
    foldersToDeleteRemotely.sort((a, b) => b.length - a.length);
    for (const remoteFolder of foldersToDeleteRemotely) {
        this.logger.log(`[Удалить с Диска] Папка: ${remoteFolder}`);
        await this.deleteRemoteFolder(remoteFolder);
        stats.folderDeleted++;
    }
}


this.logger.log("5. Завершение и сохранение состояния...");
await this.uploadRemoteManifest(newManifest);
this.settings.localManifest = newManifest;
await this.saveSettings();

if (this.isNewDevice) {
    try {
        window.localStorage.setItem(DEVICE_INITIALIZED_KEY, 'true');
        this.isNewDevice = false;
        this.logger.log("Устройство помечено как инициализированное. Следующие синхронизации будут проходить в обычном режиме.");
    } catch(e) {
        this.logger.warn("Не удалось записать флаг инициализации в localStorage.");
    }
}


const hasChanges = operations.length > 0 || stats.folderCreated > 0 || stats.folderDeleted > 0;
if (!isQuitting) {
if (hasChanges) {
new import_obsidian.Notice("YD Sync: Готово", 3e3);
} else {
new import_obsidian.Notice("YD Sync: Нет изменений", 3e3);
}
this.logger.log("--- Сеанс синхронизации завершен ---");
this.logger.log(`Статистика: ${JSON.stringify(stats)}`);
}

} catch (error) {
this.logger.error("КРИТИЧЕСКАЯ ОШИБКА СИНХРОНИЗАЦИИ:", error);
if (!isQuitting) {
new import_obsidian.Notice(`Критическая ошибка: ${error.message}. Подробности в логе.`, 15e3);
}
} finally {
this.syncInProgress = false;
await this.logger.flush();
}
}

getRemoteBasePath() {
const remoteBase = this.settings.remoteFolderName.trim();
const vaultName = this.app.vault.getName();
const pathSegments = [remoteBase];
if (remoteBase.toLowerCase() !== vaultName.toLowerCase()) {
pathSegments.push(vaultName);
}
return pathSegments.join("/");
}

getRemoteIncomingFolderPath() {
    return `${this.settings.remoteFolderName}/${INCOMING_FOLDER_NAME}`;
}

async getLocalState() {
const files = {};
const folders = new Set();
const abstractFiles = this.app.vault.getAllLoadedFiles().filter((f) =>
!f.path.startsWith(".obsidian/") && !IGNORED_FILES.some(ignored => f.path.endsWith(ignored))
);

const fileReadPromises = [];
for (const abstractFile of abstractFiles) {
if (abstractFile instanceof import_obsidian.TFolder) {
if (abstractFile.path !== "/") {
folders.add(abstractFile.path);
}
continue;
}
if (abstractFile instanceof import_obsidian.TFile) {
const parentDir = abstractFile.parent.path;
if (parentDir && parentDir !== "/") {
folders.add(parentDir);
}

fileReadPromises.push((async () => {
try {
const content = await this.app.vault.readBinary(abstractFile);
const md5 = this.calculateMD5(content);
files[abstractFile.path] = md5;
} catch (e) {
this.logger.warn(`Не удалось прочитать локальный файл ${abstractFile.path}, он будет пропущен.`);
}
})());
}
}
await Promise.all(fileReadPromises);
return { files, folders };
}

async getRemoteManifest() {
const remotePath = `${this.getRemoteBasePath()}/${MANIFEST_NAME}`;
try {
const downloadUrlResponse = await this.authenticatedRequest(`${YANDEX_API_BASE_URL}/resources/download?path=${encodeURIComponent(remotePath)}`);
const { href } = await downloadUrlResponse.json();
const manifestResponse = await fetch(href);
if (!manifestResponse.ok) throw new Error("Failed to download manifest content");
return await manifestResponse.json();
} catch (error) {
if (error.message.includes("404")) {
this.logger.warn("Файл манифеста не найден на Диске.");
return null;
}
this.logger.error("Ошибка при получении удаленного манифеста:", error);
throw new Error("Не удалось получить манифест с Диска.");
}
}

async uploadRemoteManifest(manifestObject) {
const remotePath = `${this.getRemoteBasePath()}/${MANIFEST_NAME}`;
const manifestContent = JSON.stringify(manifestObject, null, 2);
try {
const uploadUrlResponse = await this.authenticatedRequest(`${YANDEX_API_BASE_URL}/resources/upload?path=${encodeURIComponent(remotePath)}&overwrite=true`, "GET");
const { href } = await uploadUrlResponse.json();
await fetch(href, {
method: "PUT",
headers: { 'Content-Type': 'application/json' },
body: manifestContent
});
this.logger.log("Манифест на Диске успешно обновлен.");
} catch (e) {
this.logger.error("Не удалось загрузить манифест на Диск:", e);
throw new Error("Не удалось обновить манифест на Диске.");
}
}

async uploadFile(path) {
this.logger.log(`Uploading file: ${path}`);
const file = this.app.vault.getAbstractFileByPath(path);
if (!(file instanceof import_obsidian.TFile)) {
this.logger.warn(`Upload skipped: local file not found at ${path}`);
return;
}
const remotePath = `${this.getRemoteBasePath()}/${path}`;

const parentDir = path.substring(0, path.lastIndexOf("/"));
if (parentDir) {
    await this.createRemoteFolder(`${this.getRemoteBasePath()}/${parentDir}`);
}

try {
const uploadUrlResponse = await this.authenticatedRequest(`${YANDEX_API_BASE_URL}/resources/upload?path=${encodeURIComponent(remotePath)}&overwrite=true`);
const { href } = await uploadUrlResponse.json();
const fileContent = await this.app.vault.readBinary(file);
await fetch(href, { method: "PUT", body: fileContent });
this.logger.log(`Upload success: ${path}`);
} catch (e) {
this.logger.error(`Failed to upload file ${path}:`, e);
}
}


async downloadFile(path, md5, sourceRemotePath = null) {
    this.logger.log(`Downloading file: ${path}`);

    const remotePath = sourceRemotePath ? sourceRemotePath : `${this.getRemoteBasePath()}/${path}`;
    
    try {
        this.logger.log(`Requesting download from remote path: ${remotePath}`);
        const downloadUrlResponse = await this.authenticatedRequest(`${YANDEX_API_BASE_URL}/resources/download?path=${encodeURIComponent(remotePath)}`);
        const { href } = await downloadUrlResponse.json();
        const fileContentResponse = await fetch(href);
        if (!fileContentResponse.ok) {
            throw new Error(`Server returned ${fileContentResponse.status} for file content`);
        }
        const fileContent = await fileContentResponse.arrayBuffer();

        const existingFile = this.app.vault.getAbstractFileByPath(path);
        if (existingFile instanceof import_obsidian.TFile) {
            await this.app.vault.modifyBinary(existingFile, fileContent);
        } else {
            const parentDir = path.substring(0, path.lastIndexOf("/"));
            if (parentDir) {
                await this.createLocalFolder(parentDir);
            }
            await this.app.vault.createBinary(path, fileContent);
        }
        this.logger.log(`Download success: ${path}`);
    } catch (e) {
        this.logger.error(`Failed to download file ${path}:`, e);
    }
}


async deleteRemoteFile(path) {
this.logger.log(`Deleting remote file: ${path}`);
const remotePath = `${this.getRemoteBasePath()}/${path}`;
await this.authenticatedRequest(`${YANDEX_API_BASE_URL}/resources?path=${encodeURIComponent(remotePath)}&permanently=true`, "DELETE");
}

async deleteLocalFile(path) {
    this.logger.log(`Deleting local file: ${path}`);
    try {
        const file = this.app.vault.getAbstractFileByPath(path);
        if (file instanceof import_obsidian.TFile) {
            await this.app.vault.delete(file);
            this.logger.log(`Local file deleted: ${path}`);
        } else {
            this.logger.warn(`Could not delete local file, not found: ${path}`);
        }
    } catch (e) {
        this.logger.error(`Failed to delete local file ${path}:`, e);
    }
}


async deleteRemoteFolder(path) {
    this.logger.log(`Deleting remote folder: ${path}`);
    const cleanedPath = path.startsWith('/') ? path.substring(1) : path;
    const remotePath = `${this.getRemoteBasePath()}/${cleanedPath}`;
    await this.authenticatedRequest(`${YANDEX_API_BASE_URL}/resources?path=${encodeURIComponent(remotePath)}&permanently=true&force_async=true`, "DELETE");
}

async moveRemoteFile(sourceRemotePath, destinationRemotePath, overwrite = false) {
    this.logger.log(`Moving remote file from ${sourceRemotePath} to ${destinationRemotePath} (overwrite: ${overwrite})`);
    const url = `${YANDEX_API_BASE_URL}/resources/move?from=${encodeURIComponent(sourceRemotePath)}&path=${encodeURIComponent(destinationRemotePath)}&overwrite=${overwrite}`;
    try {
        await this.authenticatedRequest(url, "POST");
        this.logger.log(`Remote file moved: ${sourceRemotePath} -> ${destinationRemotePath}`);
    } catch (e) {
        this.logger.error(`Failed to move remote file ${sourceRemotePath} to ${destinationRemotePath}:`, e);
        if (e.message.includes("409")) {
            this.logger.warn(`Conflict when moving remote file: ${sourceRemotePath}. File likely already exists at destination.`);
        }
        throw e;
    }
}


async handleConflict(path, localHash, remoteHash) {
const file = this.app.vault.getAbstractFileByPath(path);
if (!(file instanceof import_obsidian.TFile)) {
return {
operations: [{ type: 'download', path, md5: remoteHash }],
manifestUpdates: { [path]: remoteHash }
};
}

const date = new Date();
const timestamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}_${String(date.getHours()).padStart(2, "0")}-${String(date.getMinutes()).padStart(2, "0")}`;
const extensionIndex = path.lastIndexOf(".");
const basePath = extensionIndex > 0 ? path.substring(0, extensionIndex) : path;
const extension = extensionIndex > 0 ? path.substring(extensionIndex) : "";
const newPath = (0, import_obsidian.normalizePath)(`${basePath} (конфликт от ${timestamp})${extension}`);

new import_obsidian.Notice(`Конфликт для "${path}". Локальная версия переименована.`, 7e3);
this.logger.warn(`[Conflict Resolved] Конфликт для "${path}". Локальная версия переименована в "${newPath}". Скачиваю версию с Диска.`);

return {
operations: [
{ type: 'rename_local_for_conflict', file, newPath },
{ type: 'download', path, md5: remoteHash }
],
manifestUpdates: {
[newPath]: localHash,
[path]: remoteHash
}
};
}

async performInitialUpload(localFiles, localFolders) {
new import_obsidian.Notice(`Первоначальная загрузка: ${Object.keys(localFiles).length} файлов и ${localFolders.size} папок...`);
const uploadPromises = Object.keys(localFiles).map(path => this.uploadFile(path));
await Promise.all(uploadPromises);

const initialManifest = { ...localFiles };
await this.uploadRemoteManifest(initialManifest);
this.settings.localManifest = initialManifest;
await this.saveSettings();

try {
    window.localStorage.setItem(DEVICE_INITIALIZED_KEY, 'true');
    this.isNewDevice = false;
    this.logger.log("Устройство помечено как инициализированное после первоначальной загрузки.");
} catch(e) {
    this.logger.warn("Не удалось записать флаг инициализации в localStorage.");
}
}

async createLocalFolder(path) {
try {
await this.app.vault.createFolder(path);
} catch (e) {
if (!e.message.includes("Folder already exists")) {
    this.logger.error(`Failed to create local folder ${path}:`, e);
    throw e;
}
}
}

async createRemoteFolder(fullRemotePath) {
    if (this.createdRemoteFoldersInSession && this.createdRemoteFoldersInSession.has(fullRemotePath)) {
        return;
    }
    try {
        await this.authenticatedRequest(
            `${YANDEX_API_BASE_URL}/resources?path=${encodeURIComponent(fullRemotePath)}`, "PUT"
        );
        this.logger.log(`Remote folder created or already exists: ${fullRemotePath}`);
    } catch (e) {
        if (e.message.includes("409")) {
            this.logger.log(`Remote folder already exists (409 Conflict): ${fullRemotePath}`);
        } else {
            this.logger.error(`Failed to create remote folder ${fullRemotePath}:`, e);
            throw e;
        }
    }
    if (!this.createdRemoteFoldersInSession) {
        this.createdRemoteFoldersInSession = new Set();
    }
    this.createdRemoteFoldersInSession.add(fullRemotePath);
}

async getAllRemoteFolders() {
const folders = new Set();
const limit = 200;
let offset = 0;
let moreData = true;
const basePath = this.getRemoteBasePath();

while (moreData) {
const remotePathEnc = encodeURIComponent(basePath);
const fields = encodeURIComponent("_embedded.items.path,_embedded.items.type");
const url = `${YANDEX_API_BASE_URL}/resources?path=${remotePathEnc}&limit=${limit}&offset=${offset}&fields=${fields}&sort=path`;
try {
const response = await this.authenticatedRequest(url);
const data = await response.json();
const remotePathPrefix = `disk:${basePath}/`;

if (data._embedded && data._embedded.items) {
for (const item of data._embedded.items) {
if (item.type === "dir") {
let relativePath = item.path.substring(remotePathPrefix.length);
if (relativePath.startsWith('/')) {
    relativePath = relativePath.substring(1);
}
if (relativePath) folders.add(relativePath);
}
}
if (data._embedded.items.length < limit) {
moreData = false;
} else {
offset += limit;
}
} else {
moreData = false;
}
} catch (error) {
if (error.message.includes("404")) {
return new Set();
} else {
throw error;
}
}
}
return folders;
}

async ensureRemoteFolderExists() {
    this.createdRemoteFoldersInSession = new Set(); 
    const remoteBase = this.settings.remoteFolderName.trim();
    const vaultName = this.app.vault.getName();
    await this.createRemoteFolder(remoteBase);
    const vaultRemotePath = this.getRemoteBasePath();
    await this.createRemoteFolder(vaultRemotePath);
    const incomingRemotePath = this.getRemoteIncomingFolderPath();
    await this.createRemoteFolder(incomingRemotePath);
    this.logger.log(`Все необходимые базовые удаленные папки (${remoteBase}, ${vaultRemotePath}, ${incomingRemotePath}) проверены/созданы.`);
}


async authenticatedRequest(url, method = "GET", body = null) {
const headers = new Headers();
headers.append("Authorization", `OAuth ${this.settings.oauthToken}`);
const options = { method, headers };
if (body) {
options.body = body;
}
const response = await fetch(url, options);
if (!response.ok) {
if (method === "PUT" && response.status === 409) {
this.logger.log(`Ignoring expected 409 Conflict for PUT request to ${url}`);
return response;
}
if (method === "DELETE" && response.status === 404) {
this.logger.warn(`Ignoring 404 Not Found for DELETE request to ${url}`);
return response;
}
if (response.status === 401) {
throw new Error("Ошибка API (401): Неверный или истекший OAuth-токен.");
}
const errorText = await response.text();
let errorMessage;
try {
errorMessage = JSON.parse(errorText).message || errorText;
} catch (e) {
errorMessage = errorText;
}
throw new Error(`Ошибка API Яндекс.Диска (${response.status}): ${errorMessage}`);
}
return response;
}

calculateMD5(content) {
if (typeof content !== 'string') {
const spark = new import_spark_md5.default.ArrayBuffer();
spark.append(content);
return spark.end();
}
const normalizedContent = content.replace(/\r\n/g, "\n");
return import_spark_md5.default.hash(normalizedContent);
}

promptFirstSync() {
return new Promise((resolve) => {
const modal = new import_obsidian.Modal(this.app);
modal.contentEl.createEl("h2", { text: "Первая синхронизация" });
modal.contentEl.createEl("p", { text: "На Яндекс.Диске не найдено состояние хранилища. Чтобы начать, нужно загрузить текущее состояние вашего локального хранилища на Диск." });
modal.contentEl.createEl("p", { text: "Это действие загрузит все ваши заметки и файлы в папку на Диске. Продолжить?" });
new import_obsidian.Setting(modal.contentEl)
.addButton((btn) => btn.setButtonText("Да, загрузить на Диск").setWarning().onClick(() => {
resolve("upload");
modal.close();
}))
.addButton((btn) => btn.setButtonText("Отмена").onClick(() => {
resolve("cancel");
modal.close();
}));
modal.open();
});
}



async getFilesFromRemoteFolder(remotePath) {
    const files = [];
    const limit = 200;
    let offset = 0;
    let moreData = true;
    const remotePathEnc = encodeURIComponent(remotePath);
    const fields = encodeURIComponent("_embedded.items.name,_embedded.items.md5,_embedded.items.type,_embedded.items.path");

    while (moreData) {
        try {
            const url = `${YANDEX_API_BASE_URL}/resources?path=${remotePathEnc}&limit=${limit}&offset=${offset}&fields=${fields}`;
            const response = await this.authenticatedRequest(url);
            const data = await response.json();

            if (data._embedded && data._embedded.items) {
                for (const item of data._embedded.items) {
                    if (item.type === "file") {
                        files.push({
                            name: item.name,
                            md5: item.md5,
                            path: item.path
                        });
                    }
                }
                if (data._embedded.items.length < limit) {
                    moreData = false;
                } else {
                    offset += limit;
                }
            } else {
                moreData = false;
            }
        } catch (error) {
            if (error.message.includes("404")) {
                this.logger.warn(`Удаленная папка "${remotePath}" не найдена.`);
                return [];
            }
            this.logger.error(`Ошибка при получении списка файлов из "${remotePath}":`, error);
            throw error;
        }
    }
    return files;
}

async processIncomingFolder(currentLocalFiles, newManifest, operations, stats, handledPaths) {
    this.logger.group("Обработка входящей папки на Яндекс.Диске");
    const incomingRemotePathBase = this.getRemoteIncomingFolderPath();
    
    const incomingFilesList = await this.getFilesFromRemoteFolder(incomingRemotePathBase);

    if (incomingFilesList.length === 0) {
        this.logger.log("Входящая папка пуста.");
        this.logger.groupEnd();
        return;
    }

    this.logger.log(`Найдено ${incomingFilesList.length} файлов во входящей папке.`);
    stats.incoming = incomingFilesList.length;

    for (const incomingItem of incomingFilesList) {
        const fileName = incomingItem.name;
        const localTargetPath = (0, import_obsidian.normalizePath)(fileName);
        const remoteSourcePath = incomingItem.path;
        const remoteDestinationPath = (0, import_obsidian.normalizePath)(`${this.getRemoteBasePath()}/${fileName}`);
        const remoteItemMd5 = incomingItem.md5;

        this.logger.group(`Обработка входящего файла: ${fileName}`);
        this.logger.log(`Планирую загрузку входящего файла: ${localTargetPath}`);

        operations.push({ type: 'download', path: localTargetPath, md5: remoteItemMd5, sourcePath: remoteSourcePath });
        stats.downloaded++;

        this.logger.log(`Планирую удаленное перемещение файла из Incoming: ${remoteSourcePath} -> ${remoteDestinationPath}`);
        operations.push({ type: 'move_remote', from: remoteSourcePath, to: remoteDestinationPath, overwrite: true });

        newManifest[localTargetPath] = remoteItemMd5;
        handledPaths.add(localTargetPath);

        this.logger.groupEnd();
    }
    this.logger.groupEnd();
}

};

var YDSyncSettingTab = class extends import_obsidian.PluginSettingTab {
constructor(app, plugin) {
super(app, plugin);
this.plugin = plugin;
}
display() {
const { containerEl } = this;
containerEl.empty();
containerEl.createEl("h2", { text: "Настройки Yandex.Disk Sync" });
new import_obsidian.Setting(containerEl).setName("OAuth-токен для Яндекс.Диска").setDesc(createFragment((frag) => {
frag.appendText("Вы можете получить токен на ");
frag.createEl("a", {
href: "https://yandex.ru/dev/disk/poligon/",
text: "этой странице",
target: "_blank"
});
frag.appendText(". Внимание: токен хранится в файле настроек плагина в открытом виде.");
})).addText(
(text) => text.setPlaceholder("Введите ваш OAuth-токен").setValue(this.plugin.settings.oauthToken).onChange(async (value) => {
this.plugin.settings.oauthToken = value.trim();
await this.plugin.saveSettings();
})
);
new import_obsidian.Setting(containerEl).setName("Корневая папка на Яндекс.Диске").setDesc("Укажите имя папки в корне вашего Диска. Каждое хранилище будет синхронизировано в свою подпапку внутри нее (если их имена не совпадают).").addText(
(text) => text.setPlaceholder("Например, Obsidian").setValue(this.plugin.settings.remoteFolderName).onChange(async (value) => {
this.plugin.settings.remoteFolderName = value.trim().replace(/\/|\\/g, "");
await this.plugin.saveSettings();
})
);
new import_obsidian.Setting(containerEl).setName("Синхронизировать при запуске").setDesc("Автоматически запускать синхронизацию через несколько секунд после старта Obsidian.").addToggle(
(toggle) => toggle.setValue(this.plugin.settings.syncOnStart).onChange(async (value) => {
this.plugin.settings.syncOnStart = value;
await this.plugin.saveSettings();
})
);
containerEl.createEl("h3", { text: "Отладка" });
new import_obsidian.Setting(containerEl).setName("Сброс состояния синхронизации").setDesc("Это заставит плагин считать, что синхронизация на этом устройстве происходит впервые, и заново скачать все с Диска. Используйте, если синхронизация работает некорректно.").addButton((button) => {
button.setButtonText("Сбросить локальное состояние").setWarning().onClick(async () => {
    try {
        window.localStorage.removeItem(DEVICE_INITIALIZED_KEY);
        this.plugin.isNewDevice = true;
        this.plugin.logger.log("Флаг инициализации устройства сброшен.");
        new import_obsidian.Notice("Флаг инициализации устройства сброшен.");
    } catch(e) {
        new import_obsidian.Notice("Не удалось сбросить флаг инициализации.", 5000);
    }
    this.plugin.settings.localManifest = {};
    await this.plugin.saveSettings();
    new import_obsidian.Notice("Локальное состояние синхронизации сброшено.");
});
});
new import_obsidian.Setting(containerEl).setName("Файл логов").setDesc(`Плагин записывает подробный лог каждой синхронизации в файл ${LOG_FILE_NAME} в корне хранилища.`).addButton((button) => {
button.setButtonText("Очистить лог").onClick(async () => {
await this.plugin.logger.clear();
});
});
}
};