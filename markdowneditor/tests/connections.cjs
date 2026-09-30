const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), assert = require('assert/strict');
const root = path.resolve(__dirname, '..');
const original = '---\r\ntitle: "Café"\r\ncustom: preserved\r\n---\r\n\r\n# Hello 🌍\r\n\r\nOriginal.\r\n';
fs.mkdirSync(path.join(__dirname,'screenshots'), {recursive:true});
let writes = [], conflict = false, fail = false;
const server = http.createServer((req,res) => {
  const file = path.join(root, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html');
  res.end(fs.readFileSync(file));
});
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1',r));
  const browser = await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE,headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1000}}), errors=[];
    page.on('pageerror', e => errors.push(e.message));
    page.on('dialog', d => d.accept());
    await page.route('https://**/*', async route => {
      const url = new URL(route.request().url());
      if (url.hostname !== 'api.github.com') return route.abort();
      if (fail) return route.fulfill({status:401,json:{message:'Bad credentials'}});
      const p = decodeURIComponent(url.pathname);
      if (route.request().method() === 'PUT') {
        writes.push(route.request().postDataJSON());
        return route.fulfill({status:conflict?409:200,json:conflict?{}:{content:{sha:'updated-sha'}}});
      }
      let data;
      if (p.endsWith('/demo/repo')) data = {default_branch:'main'};
      else if (p.includes('/branches/')) data = {name:'main'};
      else if (p.endsWith('/contents')) data = [{name:'articles',path:'articles',type:'dir'},{name:'logo.png',path:'logo.png',type:'file'}];
      else if (p.endsWith('/contents/articles')) data = [{name:'café.md',path:'articles/café.md',type:'file'}];
      else data = {type:'file',encoding:'base64',size:Buffer.byteLength(original),sha:'original-sha',content:Buffer.from(original).toString('base64')};
      return route.fulfill({json:data});
    });
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.locator('#codeBtn').click();
    await page.locator('#markdownEditor').fill('# Standalone');
    await page.keyboard.press('Control+s');
    await page.waitForTimeout(200);
    assert.equal(writes.length,0);
    assert.equal(await page.locator('#commitPanel').isVisible(),false);
    await page.locator('#connectionsBtn').click(); await page.locator('#githubConnection').click();
    await page.locator('#azureConnection').click();
    assert.equal(await page.locator('#blobSettingsPanel').isVisible(),true);
    await page.locator('#cancelBlobSettingsBtn').click();
    await page.locator('#connectionsBtn').click(); await page.locator('#githubConnection').click();
    await page.locator('#ghRepo').fill('demo/repo'); await page.locator('#ghToken').fill('test-secret');
    await page.locator('#ghConnect').click();
    assert.equal(await page.locator('.sidebar #repoBrowser').count(),0);
    await page.locator('#openArticleBtn').click();
    await page.getByRole('button',{name:'📁 articles',exact:true}).click();
    await page.locator('#repoSearch').fill('café');
    await page.locator('#closeRepoBrowser').click();
    assert.equal(await page.locator('#githubConnection').getAttribute('aria-selected'),'true');
    await page.locator('#openArticleBtn').click();
    await page.getByRole('button',{name:'📄 café.md',exact:true}).click();
    await page.waitForFunction(() => document.getElementById('repoActive').textContent.includes('café.md'));
    // textarea normalizes CRLF in the DOM: compare using LF for source fidelity.
    assert.equal(await page.locator('#markdownEditor').inputValue(), original.replace(/\r\n/g,'\n'));
    await page.keyboard.press('Control+s');
    assert.equal(await page.locator('#commitPanel').isVisible(),false, 'opening a file must not be dirty');
    await page.locator('#codeBtn').click();
    assert.equal(await page.locator('#markdownEditor').inputValue(), original.replace(/\r\n/g,'\n'));
    const edited = original.replace(/\r\n/g,'\n')+'\nEdited café 🚀';
    await page.locator('#markdownEditor').fill(edited);
    await page.keyboard.press('Control+s');
    await page.locator('#cancelCommit').click(); assert.equal(writes.length,0);
    await page.locator('#commitBtn').click();
    await page.locator('#commitMessage').focus();
    await page.keyboard.press('Control+Enter');
    assert.equal(writes.length,0);
    await page.locator('#commitMessage').fill('Update article');
    await page.keyboard.press('Control+Enter');
    await page.waitForFunction(() => !document.getElementById('commitPanel').classList.contains('open'));
    assert.equal(writes.length,1); assert.equal(writes[0].message,'Update article'); assert.equal(writes[0].sha,'original-sha');
    assert.equal(Buffer.from(writes[0].content,'base64').toString('utf8'),edited.replace(/\n/g,'\r\n'));
    assert.equal(writes[0].branch,'main');
    await page.waitForTimeout(200);
    await page.reload();
    assert.equal(await page.locator('#markdownEditor').inputValue(),edited);
    await page.locator('#connectionsBtn').click(); await page.locator('#githubConnection').click();
    assert.equal(await page.locator('#ghRepo').inputValue(),'demo/repo');
    assert.equal(await page.locator('#ghToken').inputValue(),'test-secret'); await page.locator('#ghConnect').click();
    await page.waitForFunction(() => !document.getElementById('commitBtn').disabled);
    await page.locator('#closeConnections').click();
    await page.keyboard.press('Control+s');
    assert.equal(await page.locator('#commitPanel').isVisible(),false);
    await page.locator('#editorBtn').click();
    await page.locator('#codeBtn').click();
    assert.match(await page.locator('#markdownEditor').inputValue(),/custom: preserved/);
    await page.locator('#markdownEditor').fill(edited+'\nConflict test');
    conflict=true; await page.keyboard.press('Control+s'); await page.locator('#commitMessage').fill('Conflict'); await page.keyboard.press('Control+Enter');
    await page.waitForFunction(() => document.getElementById('commitStatus').textContent.includes('changed on GitHub'));
    assert.equal(writes[1].sha,'updated-sha');
    assert.equal(await page.locator('#markdownEditor').inputValue(),edited+'\nConflict test');
    await page.locator('#cancelCommit').click();
    await page.screenshot({path:path.join(__dirname,'screenshots/editor.png'),fullPage:true});
    await page.locator('#connectionsBtn').click(); await page.locator('#githubConnection').click();
    assert.equal(await page.locator('#ghToken').inputValue(),'test-secret');
    assert.equal(await page.evaluate(() => JSON.stringify({...localStorage,...sessionStorage}).includes('test-secret')),true);
    await page.locator('#ghDisconnect').click();
    assert.equal(await page.evaluate(() => localStorage.getItem('markdown-editor-github-connection-v1')),null);
    assert.equal(await page.locator('#ghToken').inputValue(),'');
    await page.locator('#closeConnections').click();
    await page.keyboard.press('Control+s'); assert.equal(writes.length,2);
    assert.equal(await page.locator('#repoBrowser').isVisible(),false);
    await page.locator('#connectionsBtn').click(); await page.locator('#githubConnection').click(); await page.locator('#ghToken').fill('bad'); fail=true; await page.locator('#ghConnect').click();
    await page.waitForFunction(() => document.getElementById('ghStatus').textContent.includes('invalid or expired'));
    await page.screenshot({path:path.join(__dirname,'screenshots/connections.png')});
    assert.deepEqual(errors,[]);
    assert.equal(await page.evaluate(() => localStorage.getItem('markdown-editor-github-connection-v1')),null);
    await page.setViewportSize({width:390,height:844});
    await page.screenshot({path:path.join(__dirname,'screenshots/mobile.png'),fullPage:true});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true);
    console.log('PASS: standalone, Azure menu, connect, browse, source fidelity, no-op save, cancel, Ctrl+Enter validation/commit, Unicode commit, SHA conflict, reload/reconnect, visual metadata preservation, token persistence and removal, disconnect, invalid token, mobile width.');
  } finally { await browser.close(); server.close(); }
})().catch(e => {console.error(e);server.close();process.exitCode=1;});






