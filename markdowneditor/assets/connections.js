/* Optional GitHub integration. Connection settings persist in this browser. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const CONNECTION_STORAGE_KEY = 'markdown-editor-github-connection-v1';
  let connection = null, active = null, folder = '', entries = [], busy = false, pending = null;
  let selectedTab = 'azure';
  function selectTab(name, focus = false) {
    selectedTab = name;
    for (const [tab, panel] of [['azureConnection', 'blobSettingsPanel'], ['githubConnection', 'githubConnectionPanel']]) {
      const selected = tab === (name === 'azure' ? 'azureConnection' : 'githubConnection');
      $(tab).setAttribute('aria-selected', String(selected));
      $(tab).tabIndex = selected ? 0 : -1;
      $(panel).hidden = !selected;
      if (selected && focus) $(tab).focus();
    }
  }
  function openConnections(tab = selectedTab) {
    if (!$('connectionsPanel').classList.contains('open')) fillBlobSettingsForm();
    $('connectionsPanel').classList.add('open');
    selectTab(tab, true);
  }
  function closeConnections() {
    $('connectionsPanel').classList.remove('open');
    $('connectionsBtn').focus();
  }
  function closeBrowser() {
    if (busy) return;
    $('repoBrowserPanel').classList.remove('open');
    $('connectionsPanel').classList.add('open');
    selectTab('github');
    $('openArticleBtn').focus();
  }
  const markdown = () => state.view === 'markdown' ? els.markdownEditor.value : buildMarkdown();
  const dirty = () => active && markdown() !== active.baseline;
  const pathEncode = path => path.split('/').map(encodeURIComponent).join('/');
  const decode = value => new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(atob(value.replace(/\s/g, '')), c => c.charCodeAt(0)));
  const encode = value => {
    const bytes = new TextEncoder().encode(value);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    return btoa(binary);
  };
  async function api(c, route, options = {}) {
    let response;
    try {
      response = await fetch(`https://api.github.com/repos/${c.repo}${route ? '/' + route : ''}`, {
        ...options, signal: AbortSignal.timeout(30000), cache: 'no-store', headers: {
          Accept: 'application/vnd.github+json', Authorization: `Bearer ${c.token}`,
          'X-GitHub-Api-Version': '2022-11-28', ...(options.body ? { 'Content-Type': 'application/json' } : {})
        }
      });
    } catch (error) {
      if (error.name === 'TimeoutError') throw new Error('GitHub did not respond within 30 seconds. Try again.');
      throw new Error('The browser could not reach the GitHub API. Check your network, browser extensions or proxy. Your draft is retained.');
    }
    if (!response.ok) {
      const messages = {
        401: 'Token invalid or expired. Reconnect with a valid token.',
        403: 'GitHub refused access. Check token permissions, organization approval, branch rules or API limits.',
        404: 'Repository, branch or file not found, or this token has no access.',
        409: 'The file changed on GitHub. Export your draft, reopen the file and merge your changes before committing.',
        422: 'GitHub rejected the commit. Check branch protection and repository rules.'
      };
      throw new Error(messages[response.status] || `GitHub request failed (${response.status}). Your draft is retained.`);
    }
    return response.json();
  }
  const contentRoute = (c, path) => `contents${path ? '/' + pathEncode(path) : ''}?ref=${encodeURIComponent(c.branch)}`;
  function status() {
    $('repoActive').textContent = active ? `${active.path} · ${dirty() ? 'Uncommitted changes' : 'Up to date'}` : 'Open a Markdown file to edit it.';
    $('ghArticleStatus').textContent = !connection ? 'Connect to GitHub to browse your repository.' : $('repoActive').textContent;
    $('openArticleBtn').disabled = !connection || busy;
    $('closeRepoBrowser').disabled = busy;
    $('commitBtn').hidden = !connection;
    $('commitBtn').disabled = !active || busy;
  }
  function allowReplace() {
    return !dirty() || window.confirm('This article has uncommitted changes. Discard them and continue? Use Cancel and Export to keep a copy first.');
  }
  function detach() {
    if (busy || !allowReplace()) return false;
    active = null; delete state.githubDraft; pending = null; $('commitPanel').classList.remove('open'); status(); return true;
  }
  function button(text, action, className = '') {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = text; b.className = className;
    b.addEventListener('click', action); return b;
  }
  function drawFiles() {
    const list = $('repoFiles'); list.replaceChildren();
    const filter = $('repoSearch').value.toLowerCase();
    const visible = entries.filter(e => e.name.toLowerCase().includes(filter));
    for (const entry of visible) {
      const isDir = entry.type === 'dir';
      const editable = entry.type === 'file' && /\.(md|markdown)$/i.test(entry.name);
      const b = button(`${isDir ? '📁' : '📄'} ${entry.name}`, () => isDir ? browse(entry.path) : openFile(entry.path), 'repo-entry');
      b.disabled = busy || (!isDir && !editable);
      b.title = isDir ? entry.path : editable ? `Open ${entry.path}` : 'Only Markdown articles can be edited';
      if (active?.path === entry.path) b.setAttribute('aria-current', 'page');
      list.append(b);
    }
    if (!visible.length) list.textContent = 'No matching files or folders.';
    $('repoUp').disabled = busy || !folder;
    $('repoRefresh').disabled = busy;
  }
  function drawCrumbs() {
    const nav = $('repoBreadcrumbs'); nav.replaceChildren(button('Root', () => browse('')));
    let path = '';
    for (const part of folder.split('/').filter(Boolean)) {
      path += (path ? '/' : '') + part;
      const target = path;
      nav.append(document.createTextNode(' / '), button(part, () => browse(target)));
    }
  }
  async function browse(path) {
    if (!connection || busy) return;
    busy = true; status(); drawFiles(); $('repoStatus').textContent = 'Loading folder…';
    try {
      const data = await api(connection, contentRoute(connection, path));
      if (!Array.isArray(data)) throw new Error('This path is not a folder.');
      folder = path; entries = data.sort((a,b) => Number(b.type === 'dir') - Number(a.type === 'dir') || a.name.localeCompare(b.name));
      $('repoSearch').value = ''; drawCrumbs();
      $('repoStatus').textContent = `${entries.length} entries${entries.length >= 1000 ? ' · GitHub limits folder listings to 1,000 entries.' : ''}`;
    } catch (error) { $('repoStatus').textContent = error.message; }
    finally { busy = false; drawFiles(); status(); }
  }
  async function openFile(path) {
    if (busy || !allowReplace()) return;
    if (!active && markdown().trim() && !window.confirm('Replace the current local draft with this GitHub article? Export it first if you want to keep a copy.')) return;
    busy = true; status(); drawFiles(); $('repoStatus').textContent = 'Opening article…';
    const before = markdown();
    try {
      const data = await api(connection, contentRoute(connection, path));
      if (data.type !== 'file' || data.encoding !== 'base64' || data.size > 1000000) throw new Error('Only UTF-8 Markdown files up to 1 MB are supported.');
      const text = decode(data.content);
      if (text.includes('\0')) throw new Error('This file is not a text article.');
      if (markdown() !== before) throw new Error('The draft changed while loading. Open the article again when ready.');
      clearTimeout(saveTimer); clearTimeout(normalizeTimer);
      state.metadata = { title: '', slug: '', date: '', tags: '', categories: '', description: '', hidden: 'false', weight: '' };
      state.projectName = path.split('/').pop().replace(/\.(md|markdown)$/i, '');
      const {frontMatter} = splitMarkdownFrontMatter(text);
      rememberRawFrontMatter(frontMatter); applyParsedFrontMatter(frontMatter);
      els.projectName.value = state.projectName;
      // Open exact source in Code view: never normalize a repository file on load.
      els.visualEditor.innerHTML = '';
      els.markdownEditor.value = text; state.markdownCache = text;
      applyViewChrome('markdown'); fillPostInfoForm(); updateMarkdownHighlight();
      active = { repo: connection.repo, branch: connection.branch, path, sha: data.sha, baseline: els.markdownEditor.value, crlf: text.includes('\r\n') };
      state.githubDraft = active;
      saveProject(); $('repoStatus').textContent = 'Article opened in Code view. Visual editing is also available.';
      $('repoBrowserPanel').classList.remove('open');
      els.markdownEditor.focus();
    } catch (error) { $('repoStatus').textContent = error.message; }
    finally { busy = false; status(); drawFiles(); }
  }
  function save() {
    saveProject();
    if (!connection) { showToast('Draft saved in this browser'); return; }
    if (busy) { showToast('Wait for the GitHub request to finish'); return; }
    if (!active) { showToast('Open a repository article before committing. Your draft is saved locally.'); return; }
    if (!dirty()) { showToast('No changes to commit'); return; }
    if ($('commitPanel').classList.contains('open')) return;
    pending = { text: markdown(), path: active.path, sha: active.sha };
    $('commitTarget').textContent = `${connection.repo} · ${connection.branch} · ${active.path}`;
    $('commitMessage').value = ''; $('commitStatus').textContent = '';
    $('commitPanel').classList.add('open'); $('commitMessage').focus();
  }
  $('commitPanel').addEventListener('keydown', event => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.isComposing) {
      event.preventDefault();
      if (!busy && !event.repeat) $('commitForm').requestSubmit();
    }
  });
  $('commitForm').addEventListener('submit', async event => {
    event.preventDefault();
    const message = $('commitMessage').value.trim();
    if (busy || !pending || !connection || !message) { $('commitStatus').textContent = 'Enter a commit message.'; return; }
    const snapshot = pending;
    busy = true; status(); drawFiles(); $('confirmCommit').disabled = true; $('cancelCommit').disabled = true;
    $('commitStatus').textContent = 'Committing…';
    try {
      const result = await api(connection, `contents/${pathEncode(snapshot.path)}`, {
        method: 'PUT', body: JSON.stringify({ message, content: encode(active.crlf ? snapshot.text.replace(/\r?\n/g, '\r\n') : snapshot.text), sha: snapshot.sha, branch: connection.branch })
      });
      active.sha = result.content.sha; active.baseline = snapshot.text;
      pending = null; $('commitPanel').classList.remove('open'); saveProject();
      showToast('Changes committed to GitHub');
    } catch (error) { $('commitStatus').textContent = error.message; }
    finally { busy = false; $('confirmCommit').disabled = false; $('cancelCommit').disabled = false; status(); drawFiles(); }
  });
  $('ghConnect').addEventListener('click', async () => {
    if (busy || !allowReplace()) return;
    const repo = $('ghRepo').value.trim().replace(/^https:\/\/github\.com\//i, '').replace(/\/$/, '');
    const token = $('ghToken').value.trim();
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo) || !token) { $('ghStatus').textContent = 'Enter owner/repository and a personal access token.'; return; }
    busy = true; $('ghConnect').disabled = true; $('ghStatus').textContent = 'Connecting…';
    const candidate = { repo, token, branch: $('ghBranch').value.trim() };
    try {
      const info = await api(candidate, '');
      candidate.branch ||= info.default_branch;
      await api(candidate, `branches/${encodeURIComponent(candidate.branch)}`);
      connection = candidate;
      const draft = state.githubDraft;
      active = draft?.repo === repo && draft.branch === candidate.branch && typeof draft.baseline === 'string' && draft.path && draft.sha ? draft : null;
      if (!active) delete state.githubDraft;
      pending = null; folder = ''; entries = [];
      $('commitPanel').classList.remove('open');
      $('ghToken').value = candidate.token; $('ghBranch').value = candidate.branch;
      $('ghStatus').textContent = `Connected to ${repo} · ${candidate.branch}`;
      try {
        localStorage.setItem(CONNECTION_STORAGE_KEY, JSON.stringify(candidate));
      } catch {
        $('ghStatus').textContent += ' · Browser storage unavailable; token is only available for this session.';
        showToast('Connected, but the browser could not save your GitHub token');
      }
      $('repoIdentity').textContent = `${repo} · ${candidate.branch}`;
      drawCrumbs(); drawFiles(); saveProject();
    } catch (error) { $('ghStatus').textContent = error.message; }
    finally { busy = false; $('ghConnect').disabled = false; status(); }
  });
  $('ghDisconnect').addEventListener('click', () => {
    if (busy) return;
    try {
      localStorage.removeItem(CONNECTION_STORAGE_KEY);
    } catch {
      $('ghStatus').textContent = 'Could not remove the saved token. Clear this site’s browser data to forget it, then try Disconnect again.';
      return;
    }
    // Keep the current article as a standalone local draft.
    connection = null; active = null; delete state.githubDraft; pending = null; entries = [];
    $('ghToken').value = ''; $('repoBrowserPanel').classList.remove('open'); $('commitPanel').classList.remove('open');
    $('ghStatus').textContent = 'Disconnected. Saved token removed; current article retained as a local draft.'; saveProject(); status();
  });
  $('connectionsBtn').addEventListener('click', () => openConnections());
  $('closeConnections').addEventListener('click', closeConnections);
  $('openArticleBtn').addEventListener('click', async () => {
    if (!connection || busy) return;
    $('connectionsPanel').classList.remove('open');
    $('repoBrowserPanel').classList.add('open');
    $('repoSearch').focus();
    await browse(folder);
  });
  $('closeRepoBrowser').addEventListener('click', closeBrowser);
  $('azureConnection').addEventListener('click', () => selectTab('azure'));
  $('githubConnection').addEventListener('click', () => selectTab('github'));
  document.querySelector('.connection-tabs').addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    selectTab(event.key === 'Home' ? 'azure' : event.key === 'End' ? 'github' : selectedTab === 'azure' ? 'github' : 'azure', true);
  });
  $('commitBtn').addEventListener('click', save);
  $('cancelCommit').addEventListener('click', () => { if (!busy) { pending = null; $('commitPanel').classList.remove('open'); $('commitBtn').focus(); } });
  $('repoUp').addEventListener('click', () => browse(folder.split('/').slice(0, -1).join('/')));
  $('repoRefresh').addEventListener('click', () => browse(folder));
  $('repoSearch').addEventListener('input', drawFiles);
  document.addEventListener('input', status);
  document.addEventListener('click', () => queueMicrotask(status));
  for (const id of ['connectionsPanel', 'commitPanel', 'repoBrowserPanel']) {
    $(id).addEventListener('keydown', event => {
      if (event.key === 'Escape' && id === 'repoBrowserPanel') { event.preventDefault(); closeBrowser(); return; }
      if (event.key === 'Escape' && !busy) { $(id).classList.remove('open'); (id === 'commitPanel' ? $('commitBtn') : $('connectionsBtn')).focus(); }
      if (event.key === 'Tab') {
        const items = [...$(id).querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]')].filter(el => el.tabIndex >= 0 && el.getClientRects().length);
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  }
  window.addEventListener('beforeunload', event => { if (dirty() || busy) { event.preventDefault(); event.returnValue = ''; } });
  window.editorConnections = { save, detach, openAzure: () => openConnections('azure'), close: closeConnections };
  if (state.githubDraft) {
    $('ghRepo').value = state.githubDraft.repo || '';
    $('ghBranch').value = state.githubDraft.branch || '';
    $('ghStatus').textContent = 'Local GitHub draft restored. Reconnect to the same repository and branch to resume committing.';
  }
  try {
    const saved = JSON.parse(localStorage.getItem(CONNECTION_STORAGE_KEY) || 'null');
    if (saved && typeof saved.token === 'string' && saved.token && typeof saved.repo === 'string' && typeof saved.branch === 'string') {
      $('ghToken').value = saved.token;
      $('ghRepo').value = saved.repo;
      $('ghBranch').value = saved.branch;
      $('ghStatus').textContent = 'Saved connection restored. Click Connect GitHub to reconnect.';
    }
  } catch {
    // Missing, unavailable or malformed settings must not prevent standalone use.
  }
  status();
})();
