// --- НАЧАЛО ФАЙЛА main.js ---
const { Plugin, Notice, Modal, Setting, requestUrl, PluginSettingTab, TFile, TFolder } = require('obsidian');

const PLUGIN_ID = 'yandex-disk-sync';
const API_BASE = 'https://cloud-api.yandex.net/v1/disk';

// Словарь для описаний полей
const I18N = {
  en: { // Сохраняем английский для полноты, хотя он не будет использоваться
    'desc.clientId': 'Yandex OAuth Client ID (required for Connect)',
    'desc.accessToken': 'Paste token manually or use Connect below. Stored in plugin data.',
    'desc.oauthControls': 'Connect: open OAuth in a browser and paste the token; Disconnect: remove the locally stored token; Manage on Yandex: open the OAuth portal to manage your application/tokens.',
    'desc.oauthBaseUrl': 'Used for authorization and portal links',
    'desc.oauthScopes': 'Leave empty to use scopes configured for your Yandex app. For app-folder only, keep this empty to avoid invalid_scope.',
    'desc.remoteBase': "Root path on Yandex.Disk. For app-folder tokens, use 'app:/' (recommended). The vault will sync to a subfolder under this path.",
    'desc.vaultFolderName': 'Subfolder under remote base where this vault is stored (only the folder name). Default: current vault name',
    'desc.localScope': 'Relative path within the vault to sync (empty = entire vault)',
    'desc.ignorePatterns': 'Comma-separated globs (e.g., .obsidian/**, **/.trash/**)',
    'desc.syncMode': 'Sync direction: two-way, upload (local → cloud), download (cloud → local). Deletions follow the delete policy.',
    'desc.deletePolicy': 'Controls deletions. mirror: propagate deletions on both sides based on the last sync index (only if the other side has not changed). skip: never delete automatically. Start with skip for safety; use mirror for full mirroring.',
    'desc.strategy': 'How to resolve concurrent changes: newest-wins uses timestamps (overwrites the older side; within tolerance, prefers local); duplicate-both creates two local copies ("... (conflict ... local)" and "... (conflict ... remote)").',
    'desc.tolerance': 'Time buffer for newest-wins. If local vs cloud modified times differ by less than this many seconds, treat them as equal and prefer the local version.',
    'desc.autoSync': 'Minutes between automatic syncs. 0 disables. Runs only while Obsidian is open. Typical: 5–30 min.',
    'desc.syncOnStartup': 'Run a sync automatically when Obsidian starts (after UI is ready).',
    'desc.syncNow': 'Run sync with current settings (mode, deletes, filters)',
    'desc.dryRun': 'Preview the sync plan without making changes. Opens a diagnostics window with the list of planned operations.',
    'desc.diagnostics': 'Open diagnostics: shows environment summary (paths, mode), last API check, last HTTP error, and recent logs. Set how many lines to show below.',
    'desc.maxSize': 'Skip local files larger than this during uploads. Default: 200.',
    'desc.concurrency': 'Parallel transfers (upload/download). High values may cause 429/409; recommended 1–3 / 1–4.',
    'desc.syncOnStartupDelay': 'Delay before startup sync runs (seconds). 0 = no delay.',
  },
  ru: {
    'desc.clientId': 'ID клиента Яндекс OAuth (нужен для подключения)',
    'desc.accessToken': 'Вставьте токен вручную или используйте кнопку "Подключить". Токен хранится в данных плагина.',
    'desc.oauthControls': 'Подключить: открыть OAuth в браузере и вставить токен; Отключить: удалить локально сохранённый токен; Управлять на Яндексе: открыть портал OAuth для управления приложением/токенами.',
    'desc.oauthBaseUrl': 'Используется для авторизации и ссылок на портал Яндекса',
    'desc.oauthScopes': 'Оставьте пустым, чтобы использовать права, настроенные у вашего приложения. Для режима «папка приложения» это поле должно быть пустым, иначе возникнет ошибка invalid_scope.',
    'desc.remoteBase': "Корневая папка на Яндекс.Диске. Для полного доступа используйте 'disk:/Имя_Папки'. Для папки приложения оставьте 'app:/'. Хранилище будет синхронизироваться в подпапку внутри этого пути.",
    'desc.vaultFolderName': 'Подпапка внутри удалённой базы для этого хранилища (только имя папки). По умолчанию — имя текущего хранилища.',
    'desc.localScope': 'Относительный путь внутри хранилища для синхронизации (пусто = всё хранилище)',
    'desc.ignorePatterns': 'Список шаблонов через запятую (например, .obsidian/**, **/.trash/**)',
    'desc.syncMode': 'Направление синхронизации: двусторонняя, только загрузка (локально → облако), только скачивание (облако → локально).',
    'desc.deletePolicy': 'Управляет удалением файлов. Зеркально: удалять файлы на другой стороне, если они были удалены локально/в облаке. Пропустить: никогда не удалять файлы автоматически.',
    'desc.strategy': 'Как разрешать одновременные изменения: "Новейшее выигрывает" использует временные метки (перезаписывает старую версию); "Дублировать оба" создаёт две локальные копии: с постфиксом "(конфликт ... локально)" и "(конфликт ... удалённо)".',
    'desc.tolerance': 'Допуск по времени для стратегии "Новейшее выигрывает". Если разница во времени изменения файлов меньше этого значения (в сек.), будет выбрана локальная версия.',
    'desc.autoSync': 'Интервал (в минутах) между автосинхронизациями. 0 — выключено. Работает, только пока открыт Obsidian.',
    'desc.syncOnStartup': 'Автоматически запускать синхронизацию при старте Obsidian.',
    'desc.syncNow': 'Запустить синхронизацию с текущими настройками.',
    'desc.dryRun': 'Показать лог синхронизации. Откроется окно диагностики со списком операций.',
    'desc.diagnostics': 'Открыть окно диагностики: показывает сводку (пути, режим), результат последней проверки API и недавние записи журнала.',
    'desc.maxSize': 'Пропускать при загрузке локальные файлы, размер которых превышает это значение (в МБ). По умолчанию: 200.',
    'desc.concurrency': 'Количество параллельных операций (загрузка/скачивание). Высокие значения могут вызвать ошибки; рекомендуется 1–4.',
    'desc.syncOnStartupDelay': 'Задержка перед запуском синхронизации при старте (в секундах). 0 = без задержки.',
  },
};

const DEFAULT_SETTINGS = {
  clientId: '',
  accessToken: '',
  oauthBaseUrl: 'https://oauth.yandex.ru',
  oauthScopes: '',
  localBasePath: '',
  remoteBasePath: 'app:/',
  ignorePatterns: ['.obsidian/**', '**/.trash/**'],
  binaryExtensions: ['png', 'jpg', 'jpeg', 'gif', 'pdf', 'zip'],
  excludeExtensions: [],
  maxSizeMB: 200,
  syncMode: 'two-way',
  deletePolicy: 'mirror',
  uploadConcurrency: 2,
  downloadConcurrency: 2,
  autoSyncIntervalMin: 0,
  logLimit: 500,
  diagnosticsLines: 50,
  timeSkewToleranceSec: 180,
  conflictStrategy: 'newest-wins',
  showStatusBar: true,
  progressLines: 25,
  vaultFolderName: '',
  _autoVaultNameApplied: false,
  syncOnStartup: false,
  syncOnStartupDelaySec: 3,
  lang: 'ru',
};

// ... (остальной код до YandexDiskSyncSettingTab без изменений)
function nowIso() {
  return new Date().toISOString();
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// Convert a simple glob (supports **, *, ?) to RegExp. Escapes regex meta as needed.
function globToRegExp(glob) {
  const reStr = '^' + glob
    .replace(/[.+^${}()|\[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '::DOUBLE_STAR::')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '[^/]')
    .replace(/::DOUBLE_STAR::/g, '.*') + '$';
  return new RegExp(reStr);
}

function pathJoin(...parts) {
  return parts.filter(Boolean).join('/').replace(/\\/g, '/');
}

function getExt(name) {
  const i = name.lastIndexOf('.');
  return i === -1 ? '' : name.slice(i + 1).toLowerCase();
}

function normalizeRelPath(rel) {
  return rel.replace(/^\/+/, '').replace(/\\/g, '/');
}

class DiagnosticsModal extends Modal {
  constructor(app, text) {
    super(app);
    this.text = text;
  }
  setText(text) {
    this.text = text || '';
    if (this.preEl) this.preEl.setText(this.text);
  }
  onOpen() {
    const { contentEl, modalEl, titleEl } = this;
    contentEl.empty();

    // Title in the modal header
    titleEl.setText('Yandex Disk Sync — Диагностика');

    // Make modal resizable (user can drag edges/corner)
    modalEl.style.width = '70vw';
    modalEl.style.height = '70vh';
    modalEl.style.maxWidth = '90vw';
    modalEl.style.maxHeight = '90vh';
    modalEl.style.minWidth = '400px';
    modalEl.style.minHeight = '200px';
    modalEl.style.resize = 'both';
    modalEl.style.overflow = 'hidden';
    modalEl.style.display = 'flex';
    modalEl.style.flexDirection = 'column';

    // Let content fill available space and scroll as needed
    contentEl.style.display = 'flex';
    contentEl.style.flex = '1 1 auto';
    contentEl.style.minHeight = '0';
    // Ensure text is selectable/copyable
    modalEl.style.userSelect = 'text';
    contentEl.style.userSelect = 'text';
    // vendor-prefixed for wider Electron/WebKit support
    modalEl.style.webkitUserSelect = 'text';
    contentEl.style.webkitUserSelect = 'text';

    // Toolbar with actions (Copy All)
    const toolbar = contentEl.createEl('div');
    toolbar.style.display = 'flex';
    toolbar.style.justifyContent = 'flex-end';
    toolbar.style.gap = '8px';
    toolbar.style.margin = '0 0 8px 0';
    const copyBtn = toolbar.createEl('button', { text: 'Копировать всё' });
    copyBtn.addEventListener('click', async () => {
      const txt = this.text || '';
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(txt);
        } else {
          // Fallback
          const ta = document.createElement('textarea');
          ta.value = txt;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        new Notice('Диагностика скопирована в буфер обмена');
      } catch (_) {
        new Notice('Не удалось скопировать');
      }
    });

    const pre = (this.preEl = contentEl.createEl('pre'));
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.flex = '1 1 auto';
    pre.style.width = '100%';
    pre.style.margin = '0';
    pre.style.overflow = 'auto';
    pre.style.userSelect = 'text';
    pre.style.webkitUserSelect = 'text';
    pre.style.cursor = 'text';
    pre.setText(this.text);
  }
}

class ProgressModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this._timer = null;
  }
  onOpen() {
    const { contentEl, modalEl, titleEl } = this;
    contentEl.empty();
    titleEl.setText('Yandex Disk Sync — Прогресс');
    modalEl.style.width = '60vw';
    modalEl.style.height = '50vh';
    modalEl.style.resize = 'both';
    modalEl.style.display = 'flex';
    modalEl.style.flexDirection = 'column';
    contentEl.style.display = 'flex';
    contentEl.style.flex = '1 1 auto';
    contentEl.style.minHeight = '0';
    // Make text selectable/copyable
    modalEl.style.userSelect = 'text';
    contentEl.style.userSelect = 'text';
    modalEl.style.webkitUserSelect = 'text';
    contentEl.style.webkitUserSelect = 'text';

    // Left vertical toolbar
    const toolbar = contentEl.createEl('div');
    toolbar.style.display = 'flex';
    toolbar.style.flexDirection = 'column';
    toolbar.style.alignItems = 'stretch';
    toolbar.style.gap = '8px';
    toolbar.style.marginRight = '12px';
    toolbar.style.minWidth = '180px';

    const syncBtn = toolbar.createEl('button', { text: 'Синхронизировать' });
    syncBtn.onclick = () => {
      if (this.plugin.currentRun?.active) { new Notice('Синхронизация уже запущена'); return; }
      this.plugin.syncNow(false);
    };

    const dryBtn = toolbar.createEl('button', { text: 'логи' });
    dryBtn.onclick = () => {
      if (this.plugin.currentRun?.active) { new Notice('Синхронизация уже запущена'); return; }
      this.plugin.syncNow(true);
    };

    const copyBtn = toolbar.createEl('button', { text: 'Копировать всё' });
    copyBtn.onclick = async () => {
      const txt = this.plugin.getProgressSummary();
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(txt);
        } else {
          const ta = document.createElement('textarea');
          ta.value = txt;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        new Notice('Прогресс скопирован в буфер обмена');
      } catch (_) {
        new Notice('Не удалось скопировать');
      }
    };

    const cancelBtn = toolbar.createEl('button', { text: 'Отмена' });
    cancelBtn.onclick = () => this.plugin.cancelCurrentRun();

    const pre = (this.preEl = contentEl.createEl('pre'));
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.flex = '1 1 auto';
    pre.style.margin = '0';
    pre.style.overflow = 'auto';
    pre.style.userSelect = 'text';
    pre.style.webkitUserSelect = 'text';
    pre.style.cursor = 'text';

    const render = () => {
      pre.setText(this.plugin.getProgressSummary());
    };
    render();
    this._timer = setInterval(render, 500);
  }
  onClose() {
    if (this._timer) clearInterval(this._timer);
  }
}


class YandexDiskSyncSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    try { containerEl.addClass('yds-copyable'); } catch (_) {}
    containerEl.createEl('h2', { text: 'Настройки Yandex Disk Sync' });

    // Язык по умолчанию — русский, выбор убран
    this.plugin.settings.lang = 'ru';
    
    containerEl.createEl('h3', { text: 'Авторизация' });

    new Setting(containerEl)
      .setName('Client ID')
      .setDesc(this.plugin.t('desc.clientId'))
      .addText((txt) =>
        txt
          .setPlaceholder('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
          .setValue(this.plugin.settings.clientId)
          .onChange(async (v) => {
            this.plugin.settings.clientId = v.trim();
            await this.plugin.saveSettings();
          }),
      );

    const tokenSetting = new Setting(containerEl)
      .setName('OAuth токен')
      .setDesc(this.plugin.t('desc.accessToken'))
      .addText((txt) =>
        txt
          .setPlaceholder('(вставьте токен доступа)')
          .setValue(this.plugin.settings.accessToken || '')
          .onChange(async (v) => {
            this.plugin.settings.accessToken = (v || '').trim();
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Управление подключением')
      .setDesc(this.plugin.t('desc.oauthControls'))
      .addButton((b) =>
        b.setButtonText('Подключить').onClick(() => this.plugin.startOAuthFlow()),
      )
      .addButton((b) =>
        b
          .setButtonText('Отключить')
          .onClick(async () => {
            this.plugin.settings.accessToken = '';
            await this.plugin.saveSettings();
            new Notice('Токен удалён');
            this.display();
          }),
      )
      .addButton((b) =>
        b
          .setButtonText('Управлять в Яндексе')
          .onClick(() => this.plugin.openOAuthManagement()),
      );

    new Setting(containerEl)
      .setName('Базовый URL для OAuth')
      .setDesc(this.plugin.t('desc.oauthBaseUrl'))
      .addText((txt) =>
        txt
          .setPlaceholder(DEFAULT_SETTINGS.oauthBaseUrl)
          .setValue(this.plugin.settings.oauthBaseUrl)
          .onChange(async (v) => {
            const val = (v || '').trim() || DEFAULT_SETTINGS.oauthBaseUrl;
            this.plugin.settings.oauthBaseUrl = val;
            await this.plugin.saveSettings();
          }),
      );
      
    containerEl.createEl('h3', { text: 'Настройки Синхронизации' });

    // *** НАЧАЛО ИЗМЕНЕНИЯ ***
    new Setting(containerEl)
      .setName('Удалённый базовый путь')
      .setDesc(this.plugin.t('desc.remoteBase'))
      .addText((txt) =>
        txt
          .setPlaceholder(DEFAULT_SETTINGS.remoteBasePath)
          .setValue(this.plugin.settings.remoteBasePath)
          .onChange(async (v) => {
            this.plugin.settings.remoteBasePath = (v || '').trim() || DEFAULT_SETTINGS.remoteBasePath;
            await this.plugin.saveSettings();
          }),
      );
    // *** КОНЕЦ ИЗМЕНЕНИЯ ***

    new Setting(containerEl)
      .setName('Шаблоны игнорирования')
      .setDesc(this.plugin.t('desc.ignorePatterns'))
      .addTextArea((txt) =>
        txt
          .setPlaceholder('.obsidian/**, **/.trash/**')
          .setValue(this.plugin.settings.ignorePatterns.join(', '))
          .onChange(async (v) => {
            this.plugin.settings.ignorePatterns = v
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Режим синхронизации')
      .setDesc(this.plugin.t('desc.syncMode'))
      .addDropdown((dd) =>
        dd
          .addOptions({ 'two-way': 'Двусторонняя', upload: 'Только загрузка', download: 'Только скачивание' })
          .setValue(this.plugin.settings.syncMode)
          .onChange(async (v) => {
            this.plugin.settings.syncMode = v;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Политика удаления')
      .setDesc(this.plugin.t('desc.deletePolicy'))
      .addDropdown((dd) =>
        dd
          .addOptions({ mirror: 'Зеркально', skip: 'Пропускать' })
          .setValue(this.plugin.settings.deletePolicy)
          .onChange(async (v) => {
            this.plugin.settings.deletePolicy = v;
            await this.plugin.saveSettings();
          }),
      );

    containerEl.createEl('h3', { text: 'Разрешение конфликтов' });

    new Setting(containerEl)
      .setName('Стратегия')
      .setDesc(this.plugin.t('desc.strategy'))
      .addDropdown((dd) =>
        dd
          .addOptions({ 'newest-wins': 'Новейшее выигрывает', 'duplicate-both': 'Дублировать оба' })
          .setValue(this.plugin.settings.conflictStrategy || 'newest-wins')
          .onChange(async (v) => {
            this.plugin.settings.conflictStrategy = v;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Допуск по времени (сек)')
      .setDesc(this.plugin.t('desc.tolerance'))
      .addText((txt) =>
        txt
          .setPlaceholder('180')
          .setValue(String(this.plugin.settings.timeSkewToleranceSec || 0))
          .onChange(async (v) => {
            const n = Math.max(0, Math.min(3600, Number(v) || 0));
            this.plugin.settings.timeSkewToleranceSec = n;
            await this.plugin.saveSettings();
          }),
      );

    containerEl.createEl('h3', { text: 'Производительность и Автоматизация' });

    new Setting(containerEl)
      .setName('Максимальный размер файла (МБ)')
      .setDesc(this.plugin.t('desc.maxSize'))
      .addText((txt) =>
        txt
          .setValue(String(this.plugin.settings.maxSizeMB))
          .onChange(async (v) => {
            const n = Number(v);
            if (!Number.isFinite(n) || n <= 0) return;
            this.plugin.settings.maxSizeMB = n;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Параллельные операции (загрузка/скачивание)')
      .setDesc(this.plugin.t('desc.concurrency'))
      .addText((txt) =>
        txt
          .setPlaceholder('загрузка')
          .setValue(String(this.plugin.settings.uploadConcurrency))
          .onChange(async (v) => {
            const n = Math.max(1, Math.min(8, Number(v) || 1));
            this.plugin.settings.uploadConcurrency = n;
            await this.plugin.saveSettings();
          }),
      )
      .addText((txt) =>
        txt
          .setPlaceholder('скачивание')
          .setValue(String(this.plugin.settings.downloadConcurrency))
          .onChange(async (v) => {
            const n = Math.max(1, Math.min(8, Number(v) || 1));
            this.plugin.settings.downloadConcurrency = n;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Интервал автосинхронизации (минуты)')
      .setDesc(this.plugin.t('desc.autoSync'))
      .addText((txt) =>
        txt
          .setPlaceholder('0')
          .setValue(String(this.plugin.settings.autoSyncIntervalMin))
          .onChange(async (v) => {
            const n = Math.max(0, Math.min(1440, Number(v) || 0));
            this.plugin.settings.autoSyncIntervalMin = n;
            await this.plugin.saveSettings();
            this.plugin.resetAutoSyncTimer();
          }),
      );

    new Setting(containerEl)
      .setName('Синхронизировать при запуске')
      .setDesc(this.plugin.t('desc.syncOnStartup'))
      .addToggle((tg) =>
        tg
          .setValue(!!this.plugin.settings.syncOnStartup)
          .onChange(async (v) => {
            this.plugin.settings.syncOnStartup = !!v;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Задержка при запуске (сек)')
      .setDesc(this.plugin.t('desc.syncOnStartupDelay'))
      .addText((txt) =>
        txt
          .setPlaceholder('0')
          .setValue(String(this.plugin.settings.syncOnStartupDelaySec || 0))
          .onChange(async (v) => {
            const n = Math.max(0, Math.min(3600, Number(v) || 0));
            this.plugin.settings.syncOnStartupDelaySec = n;
            await this.plugin.saveSettings();
          }),
      );

    containerEl.createEl('h3', { text: 'Управление' });

    new Setting(containerEl)
      .setName('Ручная синхронизация')
      .setDesc(this.plugin.t('desc.syncNow'))
      .addButton((b) => b.setCta().setButtonText('Синхронизировать').onClick(() => this.plugin.syncNow(false)));

    new Setting(containerEl)
      .setName('Предпросмотр')
      .setDesc(this.plugin.t('desc.dryRun'))
      .addButton((b) => b.setButtonText('Показать план').onClick(() => this.plugin.syncNow(true)));

    containerEl.createEl('h3', { text: 'Диагностика' });
    new Setting(containerEl)
      .setName('Окно диагностики')
      .setDesc(this.plugin.t('desc.diagnostics'))
      .addText((txt) =>
        txt
          .setPlaceholder(String(DEFAULT_SETTINGS.diagnosticsLines))
          .setValue(String(this.plugin.settings.diagnosticsLines || DEFAULT_SETTINGS.diagnosticsLines))
          .onChange(async (v) => {
            let n = Number(v);
            if (!Number.isFinite(n)) return;
            n = Math.max(1, Math.min(this.plugin.settings.logLimit || 500, Math.floor(n)));
            this.plugin.settings.diagnosticsLines = n;
            await this.plugin.saveSettings();
          }),
      )
      .addButton((b) => b.setButtonText('Открыть').onClick(() => this.plugin.showDiagnostics()));
  }
}

// ... (остальной код после YandexDiskSyncSettingTab без изменений)
class YandexDiskSyncPlugin extends Plugin {
  async onload() {
    this.log = [];
    this.index = { files: {}, lastSyncAt: null };
    this.currentRun = null;
    this.statusBar = null;

    await this.loadSettings();
    // One-time migration: if vaultFolderName is unset or legacy 'vault', apply suggested vault name
    try {
      if (!this.settings._autoVaultNameApplied && (!this.settings.vaultFolderName || this.settings.vaultFolderName === 'vault')) {
        this.settings.vaultFolderName = this.getSuggestedVaultFolderName();
        this.settings._autoVaultNameApplied = true;
        await this.saveSettings();
      }
    } catch (_) {}

    this.addCommand({ id: 'sync-now', name: 'Sync now', callback: () => this.syncNow(false) });
    this.addCommand({ id: 'dry-run', name: 'Dry-run (plan only)', callback: () => this.syncNow(true) });
    this.addCommand({ id: 'diagnostics', name: 'Diagnostics', callback: () => this.showDiagnostics() });

    this.settingTab = new YandexDiskSyncSettingTab(this.app, this);
    this.addSettingTab(this.settingTab);

    // Ensure settings text (names/descriptions) is selectable/copyable
    try {
      this._copyStyleEl = document.createElement('style');
      this._copyStyleEl.textContent = `.yds-copyable, .yds-copyable * { user-select: text !important; -webkit-user-select: text !important; }`;
      document.head.appendChild(this._copyStyleEl);
    } catch (_) {}

    this.resetAutoSyncTimer();

    if (this.settings.showStatusBar) this.initStatusBar();
    this.initRibbon();

    // Optional: run sync on startup after layout is ready
    if (this.settings.syncOnStartup) {
      const start = () => {
        if (this.settings.accessToken) this.syncNow(false).catch(() => {});
      };
      const delayMs = Math.max(0, (Number(this.settings.syncOnStartupDelaySec) || 0) * 1000);
      try {
        if (this.app?.workspace?.onLayoutReady) this.app.workspace.onLayoutReady(() => setTimeout(start, delayMs));
        else setTimeout(start, Math.max(2000, delayMs));
      } catch (_) {
        setTimeout(start, Math.max(2000, delayMs));
      }
    }

    this.registerEvent(this.app.vault.on('modify', (f) => this.onLocalEvent('modify', f)));
    this.registerEvent(this.app.vault.on('create', (f) => this.onLocalEvent('create', f)));
    this.registerEvent(this.app.vault.on('delete', (f) => this.onLocalEvent('delete', f)));
    this.registerEvent(this.app.vault.on('rename', (f, oldPath) => this.onLocalEvent('rename', f, oldPath)));

    this.logInfo('Loaded Yandex Disk Sync');
  }

  onunload() {
    if (this._autoTimer) clearInterval(this._autoTimer);
    try { this._copyStyleEl?.remove(); } catch (_) {}
  }

  getLang() {
    return 'ru'; // Принудительно используем русский
  }

  t(key) {
    const lang = this.getLang();
    return (I18N[lang] && I18N[lang][key]) || (I18N.en && I18N.en[key]) || key;
  }

  async loadSettings() {
    const data = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data?.settings || {});
    this.index = data?.index || { files: {}, lastSyncAt: null };
  }

  async saveSettings() {
    await this.saveData({ settings: this.settings, index: this.index });
  }

  initStatusBar() {
    try {
      this.statusBar = this.addStatusBarItem();
      this.statusBar.style.cursor = 'pointer';
      this.statusBar.onclick = () => this.openProgress();
      this.updateStatusBar('Idle');
    } catch (_) {}
  }

  initRibbon() {
    try {
      this.ribbonEl = this.addRibbonIcon(
        'refresh-ccw',
        'Yandex Disk Sync — Синхронизировать',
        async () => {
          if (this.currentRun?.active) {
            new Notice('Синхронизация уже запущена');
            this.openProgress();
            return;
          }
          await this.syncNow(false);
        },
      );
      this.ribbonEl.addClass('yandex-disk-sync-ribbon');
    } catch (_) {}
  }

  updateStatusBar(state) {
    if (!this.statusBar) return;
    const run = this.currentRun;
    const total = run?.total || 0;
    const done = run?.done || 0;
    const failed = run?.failed || 0;
    const txt = total
      ? `YDS: ${state} (вып.:${done} ошиб.:${failed} всего:${total})`
      : `YDS: ${state}`;
    this.statusBar.textContent = txt;
    try {
      if (this.ribbonEl) {
        this.ribbonEl.setAttribute('aria-label', txt);
        this.ribbonEl.setAttribute('title', txt);
      }
    } catch (_) {}
    let color = '#bbb';
    if (state === 'Running' || state === 'Uploading' || state === 'Downloading') color = '#4da3ff';
    else if (state === 'Throttled') color = '#e6a700';
    else if (state === 'Error') color = '#ff5c5c';
    else if (state === 'Done') color = '#4caf50';
    this.statusBar.style.color = color;
    this.statusBar.title = `Последняя синхронизация: ${this.index.lastSyncAt || 'никогда'}`;
  }

  openProgress() {
    if (!this._progressModal) this._progressModal = new ProgressModal(this.app, this);
    this._progressModal.open();
  }

  startRun(dryRun, planCount = 0) {
    this.currentRun = {
      active: true,
      dryRun: !!dryRun,
      startAt: Date.now(),
      phase: 'Планирование',
      total: planCount,
      done: 0,
      failed: 0,
      queued: planCount,
      canceled: false,
      lastOps: [],
      counts: { upload: { queued: 0, done: 0 }, download: { queued: 0, done: 0 }, del: { queued: 0, done: 0 }, conflict: { queued: 0, done: 0 } },
    };
    this.updateStatusBar('Планирование');
  }

  setRunPlan(plan) {
    const c = { upload: 0, download: 0, del: 0, conflict: 0 };
    for (const op of plan) {
      if (op.type === 'upload') c.upload++;
      else if (op.type === 'download') c.download++;
      else if (op.type === 'remote-delete' || op.type === 'local-delete') c.del++;
      else if (op.type === 'conflict') c.conflict++;
    }
    const r = this.currentRun;
    if (!r) return;
    r.total = plan.length;
    r.queued = plan.length;
    r.counts.upload.queued = c.upload;
    r.counts.download.queued = c.download;
    r.counts.del.queued = c.del;
    r.counts.conflict.queued = c.conflict;
    this.updateStatusBar('Выполнение');
  }

  finishRun(ok) {
    const r = this.currentRun;
    if (!r) return;
    r.active = false;
    r.endAt = Date.now();
    this.updateStatusBar(ok ? 'Готово' : 'Ошибка');
  }

  cancelCurrentRun() {
    if (this.currentRun?.active) {
      this.currentRun.canceled = true;
      this.logWarn('Отмена запрошена пользователем');
    }
  }

  reportOpStart(op) {
    const r = this.currentRun; if (!r) return;
    r.phase = op.type;
    this.updateStatusBar(op.type === 'upload' ? 'Загрузка' : op.type === 'download' ? 'Скачивание' : 'Выполнение');
  }
  reportOpEnd(op, ok, errMsg) {
    const r = this.currentRun; if (!r) return;
    r.done += ok ? 1 : 0;
    r.failed += ok ? 0 : 1;
    r.queued = Math.max(0, r.queued - 1);
    const bucket = op.type === 'upload' ? 'upload' : op.type === 'download' ? 'download' : 'del';
    if (r.counts[bucket]) {
      r.counts[bucket].done += ok ? 1 : 0;
      r.counts[bucket].queued = Math.max(0, r.counts[bucket].queued - 1);
    }
    const line = `${ok ? 'OK' : 'FAIL'} ${op.type} ${op.rel || ''}` + (op.toAbs ? ` -> ${op.toAbs}` : '') + (op.fromAbs ? ` <- ${op.fromAbs}` : '') + (ok ? '' : ` — ${errMsg || ''}`);
    r.lastOps.push(line);
    const cap = Math.max(1, this.settings.progressLines || 25);
    while (r.lastOps.length > cap) r.lastOps.shift();
  }

  getProgressSummary() {
    const r = this.currentRun;
    if (!r) return 'Нет активной синхронизации.';
    const elapsed = ((Date.now() - r.startAt) / 1000).toFixed(1);
    const header = [
      `Фаза: ${r.phase}${r.canceled ? ' (отмена...)' : ''}`,
      `Прогресс: ${r.done}/${r.total} (ошибки ${r.failed}, в очереди ${r.queued})`,
      `Загрузки: ${r.counts.upload.done}/${r.counts.upload.done + r.counts.upload.queued}  Скачивания: ${r.counts.download.done}/${r.counts.download.done + r.counts.download.queued}  Удаления: ${r.counts.del.done}/${r.counts.del.done + r.counts.del.queued}`,
      `Прошло времени: ${elapsed}с`,
      '',
      'Последние операции:',
      ...(r.lastOps.length ? r.lastOps.slice().reverse() : ['(нет)']),
    ].join('\n');
    return header;
  }

  resetAutoSyncTimer() {
    if (this._autoTimer) clearInterval(this._autoTimer);
    const minutes = this.settings.autoSyncIntervalMin;
    if (minutes > 0) {
      this._autoTimer = setInterval(() => this.syncNow(false).catch(() => {}), minutes * 60 * 1000);
    }
  }

  logInfo(msg) {
    const line = `[${nowIso()}] INFO ${msg}`;
    console.log(`[${PLUGIN_ID}]`, msg);
    this.log.push(line);
    if (this.log.length > this.settings.logLimit) this.log.shift();
  }
  logWarn(msg) {
    const line = `[${nowIso()}] WARN ${msg}`;
    console.warn(`[${PLUGIN_ID}]`, msg);
    this.log.push(line);
    if (this.log.length > this.settings.logLimit) this.log.shift();
  }
  logError(msg) {
    const line = `[${nowIso()}] ERROR ${msg}`;
    console.error(`[${PLUGIN_ID}]`, msg);
    this.log.push(line);
    if (this.log.length > this.settings.logLimit) this.log.shift();
  }

  async showDiagnostics() {
    const token = this.settings.accessToken || '';
    const tokenTail = token ? token.slice(-6) : '';
    const api = this.lastApiCheck;
    const lines = Math.max(1, Math.min(this.settings.logLimit || 500, Number(this.settings.diagnosticsLines || 50)));
    const summary = [
      `Версия: 1.2.0`,
      `Локальный путь: ${this.settings.localBasePath || '(корень хранилища)'}`,
      `Удалённый путь: ${this.getRemoteBase()}`,
      `Режим: ${this.settings.syncMode}, Удаление: ${this.settings.deletePolicy}`,
      `Конфликты: ${this.settings.conflictStrategy}${this.settings.conflictStrategy==='newest-wins' ? ` (допуск ${this.settings.timeSkewToleranceSec || 0}с)` : ''}`,
      `Параллельно: загрузка ${this.settings.uploadConcurrency}, скачивание ${this.settings.downloadConcurrency}`,
      `Автосинхронизация: ${this.settings.autoSyncIntervalMin} мин`,
      `OAuth URL: ${this.getOAuthBase()}`,
      `Client ID: ${this.settings.clientId ? 'да' : 'нет'}`,
      `Токен: ${token ? 'да' : 'нет'}${token ? ` (****${tokenTail})` : ''}`,
      `Права (scopes): ${this.settings.oauthScopes ? this.settings.oauthScopes : '(по умолчанию для приложения)'}`,
      `Проверка API: ${api ? (api.ok ? `OK для ${api.path || this.settings.remoteBasePath}` : `ОШИБКА ${api.error}`) : 'не проводилась'}${api?.at ? ` в ${api.at}` : ''}`,
      `Последняя синхр.: ${this.index.lastSyncAt || 'никогда'}`,
      `Файлов в индексе: ${Object.keys(this.index.files).length}`,
      `Последняя ошибка HTTP: ${this.lastHttpError || '-'}`,
      '',
      'Последние записи журнала (новые сверху):',
      ...this.log.slice(-lines).reverse(),
    ].join('\n');
    const modal = new DiagnosticsModal(this.app, summary);
    modal.open();

    // Refresh API status in background and update modal text when ready
    if (this.settings.accessToken) {
      this.verifyToken(true)
        .then(() => {
          const api2 = this.lastApiCheck;
          const lines2 = Math.max(1, Math.min(this.settings.logLimit || 500, Number(this.settings.diagnosticsLines || 50)));
          const updated = [
            `Версия: 1.2.0`,
            `Локальный путь: ${this.settings.localBasePath || '(корень хранилища)'}`,
            `Удалённый путь: ${this.settings.remoteBasePath}`,
            `Режим: ${this.settings.syncMode}, Удаление: ${this.settings.deletePolicy}`,
            `Параллельно: загрузка ${this.settings.uploadConcurrency}, скачивание ${this.settings.downloadConcurrency}`,
            `Автосинхронизация: ${this.settings.autoSyncIntervalMin} мин`,
            `OAuth URL: ${this.getOAuthBase()}`,
            `Client ID: ${this.settings.clientId ? 'да' : 'нет'}`,
            `Токен: ${token ? 'да' : 'нет'}${token ? ` (****${tokenTail})` : ''}`,
            `Права (scopes): ${this.settings.oauthScopes ? this.settings.oauthScopes : '(по умолчанию для приложения)'}`,
            `Проверка API: ${api2 ? (api2.ok ? `OK для ${api2.path || this.settings.remoteBasePath}` : `ОШИБКА ${api2.error}`) : 'не проводилась'}${api2?.at ? ` в ${api2.at}` : ''}`,
            `Последняя синхр.: ${this.index.lastSyncAt || 'никогда'}`,
            `Файлов в индексе: ${Object.keys(this.index.files).length}`,
            `Последняя ошибка HTTP: ${this.lastHttpError || '-'}`,
            '',
            'Последние записи журнала (новые сверху):',
            ...this.log.slice(-lines2).reverse(),
          ].join('\n');
          modal.setText(updated);
        })
        .catch(() => {});
    }
  }

  onLocalEvent(type, file, oldPath) {
    if (!(file?.path)) return;
    const rel = this.toLocalRel(file.path);
    if (!this.inScope(rel) || this.matchesIgnore(rel)) return;
    this.logInfo(`Локальное событие: ${type} ${rel}${oldPath ? ` (из ${oldPath})` : ''}`);
  }

  getOAuthBase() {
    const base = (this.settings.oauthBaseUrl || DEFAULT_SETTINGS.oauthBaseUrl).replace(/\/+$/, '');
    return base;
  }

  getSuggestedVaultFolderName() {
    try {
      const name = (this.app?.vault?.getName && this.app.vault.getName()) || 'vault';
      return String(name).replace(/[\\/]+/g, '').trim() || 'vault';
    } catch (_) {
      return 'vault';
    }
  }

  getRemoteBase() {
    let base = (this.settings.remoteBasePath || 'app:/').replace(/\/+$/, '');
    let folder = (this.settings.vaultFolderName || this.getSuggestedVaultFolderName() || 'vault').trim();
    folder = folder.replace(/[\\/]+/g, '');
    if (!folder) folder = this.getSuggestedVaultFolderName() || 'vault';
    return `${base}/${folder}`;
  }

  startOAuthFlow() {
    if (!this.settings.clientId) {
      new Notice('Сначала укажите Client ID в настройках.');
      return;
    }
    const base = this.getOAuthBase();
    const scopes = (this.settings.oauthScopes || '').trim();
    const url = `${base}/authorize?response_type=token&client_id=${encodeURIComponent(this.settings.clientId)}${scopes ? `&scope=${encodeURIComponent(scopes)}` : ''}`;
    try {
      const electron = require('electron');
      if (electron?.shell?.openExternal) {
        electron.shell.openExternal(url);
      } else {
        window.open(url, '_blank');
      }
    } catch (_) {
      window.open(url, '_blank');
    }
    const modal = new Modal(this.app);
    modal.titleEl.setText('Вставьте OAuth-токен Яндекса');
    const desc = modal.contentEl.createEl('div');
    desc.createEl('p', { text: 'В браузере открылась страница авторизации. После предоставления доступа скопируйте access_token и вставьте его сюда.' });
    let token = '';
    new Setting(modal.contentEl).setName('Токен доступа').addText((t) => t.onChange((v) => (token = v.trim())));
    new Setting(modal.contentEl)
      .addButton((b) =>
        b.setButtonText('Сохранить').onClick(async () => {
          if (!token) {
            new Notice('Токен не может быть пустым');
            return;
          }
          this.settings.accessToken = token;
          await this.saveSettings();
          new Notice('Подключено к Яндекс.Диску');
          this.verifyToken(true).catch(() => {});
          try { this.settingTab?.display(); } catch (_) {}
          modal.close();
        }),
      )
      .addButton((b) => b.setButtonText('Отмена').onClick(() => modal.close()));
    modal.open();
  }

  openOAuthManagement() {
    const url = this.getOAuthBase();
    try {
      const electron = require('electron');
      if (electron?.shell?.openExternal) return electron.shell.openExternal(url);
    } catch (_) {}
    window.open(url, '_blank');
  }

  async verifyToken(silent = false) {
    const basePath = (this.getRemoteBase() || '/').replace(/\/+$/, '') || '/';
    try {
      const probe = `${basePath}/${'.obsidian-yandex-disk-sync-probe'}`;
      await this.ydGetUploadHref(probe, false);
      this.lastApiCheck = { ok: true, path: basePath, at: nowIso() };
      if (!silent) new Notice('Доступ к Яндекс.Диску подтверждён');
      this.logInfo(`Доступ к API в порядке для пути ${basePath}`);
      return this.lastApiCheck;
    } catch (e) {
      const msg = e?.message || String(e);
      this.lastApiCheck = { ok: false, error: msg, at: nowIso() };
      if (!silent) new Notice(`Ошибка проверки токена: ${msg}`);
      this.logError(`Ошибка проверки токена: ${msg}`);
      throw e;
    }
  }

  toLocalRel(fullPath) {
    const base = this.settings.localBasePath ? normalizeRelPath(this.settings.localBasePath) + '/' : '';
    if (!base) return normalizeRelPath(fullPath);
    if (fullPath.startsWith(base)) return normalizeRelPath(fullPath.slice(base.length));
    return normalizeRelPath(fullPath);
  }
  fromLocalRel(rel) {
    const base = this.settings.localBasePath ? normalizeRelPath(this.settings.localBasePath) + '/' : '';
    return normalizeRelPath(base + rel);
  }
  inScope(rel) {
    if (!this.settings.localBasePath) return true;
    return this.fromLocalRel(rel).startsWith(this.settings.localBasePath);
  }
  matchesIgnore(rel) {
    if (!this._ignoreCache) {
      this._ignoreCache = this.settings.ignorePatterns.map(globToRegExp);
    }
    return this._ignoreCache.some((re) => re.test(rel));
  }

  async http(method, url, opts = {}, isBinary = false) {
    const token = this.settings.accessToken;
    if (!token) throw new Error('Нет подключения: отсутствует токен доступа');
    const headers = Object.assign({}, opts.headers || {}, {
      Authorization: `OAuth ${token}`,
    });
    const maxAttempts = Math.max(1, Number(opts.maxAttempts || 5));
    const noRetryStatuses = new Set(opts.noRetryStatuses || []);
    let attempt = 0;
    while (true) {
      attempt++;
      try {
        const res = await requestUrl({ url, method, headers, body: opts.body, contentType: opts.contentType });
        if (res.status === 429) {
          const ra = Number(res.headers['retry-after'] || res.headers['Retry-After'] || 1);
          const waitMs = Math.max(1000, ra * 1000);
          this.logWarn(`Получен код 429, повтор через ${waitMs}мс`);
          try { this.updateStatusBar('Throttled'); } catch (_) {}
          await delay(waitMs);
          continue;
        }
        if (res.status >= 400) {
          const err = new Error(`HTTP ${res.status}: ${res.text || ''}`);
          err.status = res.status;
          err.text = res.text;
          throw err;
        }
        return isBinary ? res.arrayBuffer : (opts.expectJson ? res.json : res);
      } catch (e) {
        const status = e?.status || e?.response?.status;
        const body = e?.text || e?.response?.text;
        const msg = status ? `HTTP ${status}${body ? `: ${String(body).slice(0, 200)}` : ''}` : (e?.message || String(e));
        this.lastHttpError = msg;
        const shouldRetry = !(noRetryStatuses.has?.(status)) && attempt < maxAttempts;
        if (!shouldRetry) throw new Error(msg);
        const backoff = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
        this.logWarn(`Ошибка HTTP (попытка ${attempt}): ${msg}. Повтор через ${backoff}мс`);
        await delay(backoff);
      }
    }
  }

  async ydGetResource(path, params = {}) {
    const q = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]));
    q.set('path', path);
    const url = `${API_BASE}/resources?${q.toString()}`;
    const data = await this.http('GET', url, { expectJson: true });
    return data;
  }

  async ydListFolderRecursive(basePath) {
    const files = [];
    const stack = [basePath];
    const fields = '_embedded.items.name,_embedded.items.type,_embedded.items.path,_embedded.items.size,_embedded.items.md5,_embedded.items.sha256,_embedded.items.modified,_embedded.items.revision';
    while (stack.length) {
      const p = stack.pop();
      let limit = 200, offset = 0;
      while (true) {
        const data = await this.ydGetResource(p, { limit, offset, fields });
        const items = data?._embedded?.items || [];
        for (const it of items) {
          if (it.type === 'dir') {
            stack.push(it.path);
          } else if (it.type === 'file') {
            files.push({
              path: it.path,
              name: it.name,
              size: it.size,
              md5: it.md5,
              sha256: it.sha256,
              modified: it.modified,
              revision: it.revision,
              rel: this.remoteAbsToRel(it.path, basePath),
            });
          }
        }
        if (items.length < limit) break;
        offset += limit;
      }
    }
    return files;
  }

  remoteAbsToRel(abs, base) {
    const stripAlias = (p) => (p || '').replace(/^(app:|disk:|trash:)/, '');
    let A = stripAlias(abs).replace(/^\/+/, '');
    const baseStr = base || '';
    let B = stripAlias(baseStr).replace(/^\/+/, '');

    if (baseStr.startsWith('app:')) {
      const aSegs = A.split('/');
      if (aSegs.length >= 2) A = aSegs.slice(2).join('/'); else A = aSegs.join('/');
      const bRel = B;
      if (bRel) {
        if (A === bRel) return '';
        if (A.startsWith(bRel + '/')) return A.slice(bRel.length + 1);
      }
      return A;
    }

    if (B && A.startsWith(B)) {
      let rel = A.slice(B.length);
      if (rel.startsWith('/')) rel = rel.slice(1);
      return rel;
    }
    return A;
  }

  async ydGetUploadHref(absPath, overwrite = true) {
    const q = new URLSearchParams({ path: absPath, overwrite: String(!!overwrite) });
    const url = `${API_BASE}/resources/upload?${q.toString()}`;
    const data = await this.http('GET', url, { expectJson: true });
    return data.href;
  }

  async ydGetDownloadHref(absPath) {
    const q = new URLSearchParams({ path: absPath });
    const url = `${API_BASE}/resources/download?${q.toString()}`;
    const data = await this.http('GET', url, { expectJson: true });
    return data.href;
  }

  async ydEnsureFolder(absPath) {
    const q = new URLSearchParams({ path: absPath });
    const url = `${API_BASE}/resources?${q.toString()}`;
    try {
      await this.http('PUT', url, { maxAttempts: 1, noRetryStatuses: [409] });
    } catch (e) {
      if ((e?.message || '').includes('HTTP 409')) return;
      throw e;
    }
  }

  async ydDelete(absPath, permanently = false) {
    const q = new URLSearchParams({ path: absPath, permanently: String(!!permanently) });
    const url = `${API_BASE}/resources?${q.toString()}`;
    await this.http('DELETE', url);
  }

  async ydMove(fromAbs, toAbs, overwrite = true) {
    const q = new URLSearchParams({ from: fromAbs, path: toAbs, overwrite: String(!!overwrite) });
    const url = `${API_BASE}/resources/move?${q.toString()}`;
    await this.http('POST', url);
  }

  remoteAbs(rel) {
    let base = this.getRemoteBase();
    base = base.replace(/\/+$/, '');
    if (base.startsWith('app:') || base.startsWith('disk:') || base.startsWith('trash:')) {
      return `${base}/${normalizeRelPath(rel)}`;
    }
    if (!base.startsWith('/')) base = '/' + base;
    return `${base}/${normalizeRelPath(rel)}`;
  }

  listLocalFilesInScope() {
    const base = normalizeRelPath(this.settings.localBasePath || '');
    const out = [];
    const all = this.app.vault.getAllLoadedFiles();
    for (const f of all) {
      if (f instanceof TFolder) continue;
      const rel = this.toLocalRel(f.path);
      if (!this.inScope(rel)) continue;
      if (this.matchesIgnore(rel)) continue;
      const ext = getExt(rel);
      if (this.settings.excludeExtensions.includes(ext)) continue;
      const size = f.stat.size;
      if (size > this.settings.maxSizeMB * 1024 * 1024) continue;
      out.push({ rel, tfile: f, size, mtime: f.stat.mtime, ctime: f.stat.ctime, ext });
    }
    return out;
  }

  async buildPlan() {
    const local = this.listLocalFilesInScope();
    const remoteBase = this.getRemoteBase();
    await this.ydEnsureFolder(remoteBase || '/');
    const remote = await this.ydListFolderRecursive(remoteBase || '/');

    const localMap = new Map(local.map((x) => [x.rel, x]));
    const remoteMap = new Map(remote.map((x) => [x.rel, x]));
    const plan = [];

    const rels = new Set([...localMap.keys(), ...remoteMap.keys()]);
    for (const rel of rels) {
      const loc = localMap.get(rel);
      const rem = remoteMap.get(rel);
      const idx = this.index.files[rel];
      const canUpload = this.settings.syncMode !== 'download';
      const canDownload = this.settings.syncMode !== 'upload';

      if (loc && !rem) {
        if (canUpload) plan.push({ type: 'upload', rel, from: loc, toAbs: this.remoteAbs(rel) });
        continue;
      }
      if (!loc && rem) {
        if (canDownload) plan.push({ type: 'download', rel, fromAbs: rem.path, toRel: rel, remote: rem });
        continue;
      }
      if (loc && rem) {
        const localChanged = !idx || loc.mtime > (idx.localMtime || 0) || loc.size !== (idx.localSize || 0);
        const remoteChanged = !idx || new Date(rem.modified).getTime() > (idx.remoteModified || 0) || rem.revision !== (idx.remoteRevision || rem.revision);

        if (localChanged && !remoteChanged) {
          if (canUpload) plan.push({ type: 'upload', rel, from: loc, toAbs: rem.path });
        } else if (!localChanged && remoteChanged) {
          if (canDownload) plan.push({ type: 'download', rel, fromAbs: rem.path, toRel: rel, remote: rem });
        } else if (localChanged && remoteChanged) {
          if ((this.settings.conflictStrategy || 'newest-wins') === 'duplicate-both') {
            plan.push({ type: 'conflict', rel, from: loc, remote: rem });
          } else {
            const tolMs = Math.max(0, (this.settings.timeSkewToleranceSec || 0) * 1000);
            const localTs = Number(loc.mtime) || 0;
            const remoteTs = Number(new Date(rem.modified).getTime()) || 0;
            if (canUpload && localTs > remoteTs + tolMs) {
              plan.push({ type: 'upload', rel, from: loc, toAbs: rem.path });
              this.logInfo(`Конфликт решён (новейшее): загрузка ${rel}`);
            } else if (canDownload && remoteTs > localTs + tolMs) {
              plan.push({ type: 'download', rel, fromAbs: rem.path, toRel: rel, remote: rem });
              this.logInfo(`Конфликт решён (новейшее): скачивание ${rel}`);
            } else {
              if (canUpload) {
                plan.push({ type: 'upload', rel, from: loc, toAbs: rem.path });
                this.logInfo(`Конфликт в пределах допуска: выбрана локальная версия для ${rel}`);
              }
            }
          }
        }
      }
    }

    if (this.settings.deletePolicy === 'mirror') {
      for (const rel of Object.keys(this.index.files)) {
        const existsLocal = localMap.has(rel);
        const existsRemote = remoteMap.has(rel);
        const idx = this.index.files[rel];
        if (!existsLocal && existsRemote && this.settings.syncMode !== 'upload') {
          const rem = remoteMap.get(rel);
          if (rem) {
            const remoteChanged = !idx || new Date(rem.modified).getTime() > (idx.remoteModified || 0) || rem.revision !== (idx.remoteRevision || rem.revision);
            if (!remoteChanged) plan.push({ type: 'remote-delete', rel, abs: rem.path });
          }
        } else if (existsLocal && !existsRemote && this.settings.syncMode !== 'download') {
          const loc = localMap.get(rel);
          if (loc) {
            const localChanged = !idx || loc.mtime > (idx.localMtime || 0) || loc.size !== (idx.localSize || 0);
            if (!localChanged) plan.push({ type: 'local-delete', rel, tfile: loc.tfile });
          }
        }
      }
    }

    const pri = (t) => (t === 'conflict' ? 3 : (t === 'upload' || t === 'download') ? 2 : 1);
    const byRel = new Map();
    for (const op of plan) {
      const prev = byRel.get(op.rel);
      if (!prev || pri(op.type) > pri(prev.type)) byRel.set(op.rel, op);
    }
    const finalPlan = Array.from(byRel.values());

    return { plan: finalPlan, localMap, remoteMap };
  }

  async syncNow(dryRun = false) {
    try {
      if (!this.settings.accessToken) {
        new Notice('Сначала подключите аккаунт в настройках.');
        return;
      }
      this.logInfo(`Синхронизация запущена (предпросмотр=${dryRun})`);
      this.startRun(dryRun, 0);
      const { plan, localMap } = await this.buildPlan();
      this.setRunPlan(plan);
      if (dryRun) {
        const lines = plan.map((op) => {
          try {
            switch (op.type) {
              case 'upload': return `загрузить ${op.rel} -> ${op.toAbs}`;
              case 'download': return `скачать ${op.rel} <- ${op.fromAbs}`;
              case 'conflict': return `конфликт ${op.rel}`;
              case 'remote-delete': return `удалить удалённо ${op.rel} (${op.abs})`;
              case 'local-delete': return `удалить локально ${op.rel}`;
              default: return JSON.stringify(op, (k, v) => (k === 'tfile' ? (v?.path || '[tfile]') : v));
            }
          } catch (_) { return `[непечатаемая операция ${op?.type || 'unknown'} ${op?.rel || ''}]`; }
        });
        const txt = lines.join('\n');
        this.logInfo(`План (${plan.length} операций) построен`);
        new DiagnosticsModal(this.app, `План синхронизации (${plan.length} операций)\n\n${txt}`).open();
        this.finishRun(true);
        return;
      }
      await this.executePlan(plan, localMap);
      this.index.lastSyncAt = nowIso();
      await this.saveSettings();
      new Notice('Синхронизация завершена');
      this.finishRun(true);
    } catch (e) {
      this.logError(`Синхронизация провалена: ${e?.message || e}`);
      new Notice(`Синхронизация провалена: ${e?.message || String(e)}`);
      this.finishRun(false);
    }
  }

  async executePlan(plan, localMap) {
    const uploads = plan.filter((x) => x.type === 'upload');
    const downloads = plan.filter((x) => x.type === 'download');
    const conflicts = plan.filter((x) => x.type === 'conflict');
    const rDeletes = plan.filter((x) => x.type === 'remote-delete');
    const lDeletes = plan.filter((x) => x.type === 'local-delete');

    await this.runWithConcurrency(uploads, this.settings.uploadConcurrency, async (op) => {
      await this.uploadLocalFile(op.rel, op.from.tfile, op.toAbs);
    });
    await this.runWithConcurrency(downloads, this.settings.downloadConcurrency, async (op) => {
      await this.downloadRemoteFile(op.fromAbs, op.toRel);
    });

    for (const op of conflicts) {
      if (this.currentRun?.canceled) break;
      this.reportOpStart(op);
      try {
        await this.resolveConflictByDuplication(op.rel, op.from?.tfile, op.remote);
        this.reportOpEnd(op, true);
      } catch (e) {
        const msg = e?.message || String(e);
        this.logWarn(`Ошибка (конфликт ${op.rel}): ${msg}`);
        this.reportOpEnd(op, false, msg);
      }
    }

    for (const op of rDeletes) {
      if (this.currentRun?.canceled) break;
      this.reportOpStart(op);
      try { await this.ydDelete(op.abs, false); this.reportOpEnd(op, true); }
      catch (e) { const msg = e?.message || String(e); this.logWarn(`Ошибка удаления (удалённо) ${op.abs}: ${msg}`); this.reportOpEnd(op, false, msg); }
    }
    for (const op of lDeletes) {
      if (this.currentRun?.canceled) break;
      this.reportOpStart(op);
      try { await this.app.vault.delete(op.tfile); this.reportOpEnd(op, true); }
      catch (e) { const msg = e?.message || String(e); this.logWarn(`Ошибка удаления (локально) ${op.tfile?.path}: ${msg}`); this.reportOpEnd(op, false, msg); }
    }

    const localAfter = this.listLocalFilesInScope();
    const remoteAfter = await this.ydListFolderRecursive(this.settings.remoteBasePath || '/');
    const remoteMap = new Map(remoteAfter.map((x) => [x.rel, x]));
    const newIndex = {};
    for (const loc of localAfter) {
      const rem = remoteMap.get(loc.rel);
      newIndex[loc.rel] = {
        localMtime: loc.mtime,
        localSize: loc.size,
        remoteModified: rem ? new Date(rem.modified).getTime() : 0,
        remoteRevision: rem ? rem.revision : undefined,
      };
    }
    this.index.files = newIndex;
    await this.saveSettings();
  }

  async runWithConcurrency(items, limit, task) {
    let i = 0;
    const workers = Array.from({ length: Math.max(1, limit | 0) }, async () => {
      while (true) {
        const idx = i++;
        if (idx >= items.length) return;
        const it = items[idx];
        if (this.currentRun?.canceled) return;
        try {
          this.reportOpStart(it);
          await task(it);
          this.reportOpEnd(it, true);
        } catch (e) {
          const ctx = `${it?.type || 'task'}${it?.rel ? ` ${it.rel}` : ''}` + (it?.toAbs ? ` -> ${it.toAbs}` : '') + (it?.fromAbs ? ` <- ${it.fromAbs}` : '');
          const msg = e?.message || String(e);
          this.logWarn(`Ошибка задачи (${ctx}): ${msg}`);
          this.reportOpEnd(it, false, msg);
        }
      }
    });
    await Promise.all(workers);
  }

  async uploadLocalFile(rel, tfile, toAbs) {
    const lastSlash = toAbs.lastIndexOf('/');
    if (lastSlash > 0) {
      const parent = toAbs.slice(0, lastSlash) || toAbs;
      await this.ydEnsureFolder(parent).catch(() => {});
    }
    const href = await this.ydGetUploadHref(toAbs, true);
    const data = await this.app.vault.readBinary(tfile);
    await this.http('PUT', href, { body: data, contentType: 'application/octet-stream' });
    this.logInfo(`Загружено: ${rel}`);
  }

  async downloadRemoteFile(fromAbs, toRel) {
    const href = await this.ydGetDownloadHref(fromAbs);
    const bin = await this.http('GET', href, {}, true);
    const targetPath = this.fromLocalRel(toRel);
    const existing = this.app.vault.getAbstractFileByPath(targetPath);
    if (existing && existing instanceof TFile) {
      await this.app.vault.modifyBinary(existing, bin);
    } else if (existing && existing instanceof TFolder) {
      const filename = toRel.split('/').pop();
      await this.app.vault.createBinary(pathJoin(targetPath, filename), bin);
    } else {
      await this.ensureFolderForPath(targetPath);
      await this.app.vault.createBinary(targetPath, bin);
    }
    this.logInfo(`Скачано: ${toRel}`);
  }

  async ensureFolderForPath(path) {
    const parts = path.split('/');
    parts.pop();
    let cur = '';
    for (const p of parts) {
      cur = pathJoin(cur, p);
      if (!cur) continue;
      const f = this.app.vault.getAbstractFileByPath(cur);
      if (!f) await this.app.vault.createFolder(cur);
    }
  }

  async resolveConflictByDuplication(rel, localTFile, remoteMeta) {
    const ts = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
    const ext = getExt(rel);
    const base = ext ? rel.slice(0, -(ext.length + 1)) : rel;
    const suffixLocal = ` (конфликт ${ts} локально)`;
    const suffixRemote = ` (конфликт ${ts} удалённо)`;
    const conflictLocal = `${base}${suffixLocal}${ext ? '.' + ext : ''}`;
    const conflictRemote = `${base}${suffixRemote}${ext ? '.' + ext : ''}`;

    const remoteHref = await this.ydGetDownloadHref(remoteMeta.path);
    const remoteBuf = await this.http('GET', remoteHref, {}, true);
    const localIsBinary = !(getExt(rel).toLowerCase() === 'md');

    const localConflictPath = this.fromLocalRel(conflictLocal);
    const remoteConflictPath = this.fromLocalRel(conflictRemote);
    await this.ensureFolderForPath(localConflictPath);
    await this.ensureFolderForPath(remoteConflictPath);

    if (localIsBinary) {
      const localBuf = await this.app.vault.readBinary(localTFile).catch(() => new Uint8Array());
      await this.app.vault.createBinary(localConflictPath, localBuf).catch(async () => {
        const f = this.app.vault.getAbstractFileByPath(localConflictPath);
        if (f) await this.app.vault.modifyBinary(f, localBuf);
      });
      await this.app.vault.createBinary(remoteConflictPath, remoteBuf).catch(async () => {
        const f = this.app.vault.getAbstractFileByPath(remoteConflictPath);
        if (f) await this.app.vault.modifyBinary(f, remoteBuf);
      });
    } else {
      let remoteText = '';
      try { remoteText = new TextDecoder('utf-8').decode(remoteBuf); } catch { remoteText = ''; }
      let localText = '';
      try { localText = await this.app.vault.read(localTFile); } catch { localText = ''; }
      await this.app.vault.create(localConflictPath, localText).catch(async () => {
        const f = this.app.vault.getAbstractFileByPath(localConflictPath);
        if (f) await this.app.vault.modify(f, localText);
      });
      await this.app.vault.create(remoteConflictPath, remoteText).catch(async () => {
        const f = this.app.vault.getAbstractFileByPath(remoteConflictPath);
        if (f) await this.app.vault.modify(f, remoteText);
      });
    }
    this.logWarn(`Конфликт -> созданы дубликаты: ${conflictLocal}, ${conflictRemote}`);
  }
}

module.exports = YandexDiskSyncPlugin;

// --- КОНЕЦ ФАЙЛА main.js ---
