const http = require('http');
const { URL } = require('url');
const { DEBUG, HEADFUL, CHROME_BIN, PORT } = process.env;

const puppeteer = require('puppeteer');

const truncate = (str, len) => str.length > len ? str.slice(0, len) + '…' : str;

const pageOptions = {
  viewport : {
    width:500,
    height:500
  },
  timeout:200000,
};
const pdfOptions = {
  width:'500px',
  height:'500px',
  format:null,
  printBackground:true,
  path:'test.pdf'
};

const puppeteerConfig = {
  headless:true,
  ignoreHTTPSErrors: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--enable-features=NetworkService',
    '-—disable-dev-tools',

    '--headless',
    '--disable-gpu',
    '--full-memory-crash-report',
    '--unlimited-storage',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'

  ],
  devtools: false,
};

function testUrl(url){
  if (!/^https?:\/\//i.test(url)) {
    throw new Error('Invalid URL');
  }
}

function timeoutAndReject(timeout,message) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(message)
    }, timeout)
  })
}

async function checkPageHTML(hostname, port, search, path){
  return new Promise((resolve, reject) => {
    const req = http.request({
      method: 'HEAD',
      host: hostname,
      port,
      search,
      //searchParams,
      path,
    }, ({ statusCode, headers }) => {
      if (!headers || (statusCode == 200 && !/text\/html/i.test(headers['content-type']))){
        reject(new Error('Not a HTML page'));
      } else {
        resolve();
      }
    });
    req.on('error', reject);
    req.end();
  });
};

//const url = "http://awongh.com";
const url = "http://info.cern.ch/";

module.exports = async function pdf(){

  let browser, page;

  try{

    testUrl(url);

    const { origin, hostname, pathname, searchParams, port, search } = new URL(url);
    const path = decodeURIComponent(pathname);

    await checkPageHTML(hostname, port, search, path);

    if (DEBUG) puppeteerConfig.dumpio = true;

    if (HEADFUL) {
      config.headless = false;
      config.args.push('--auto-open-devtools-for-tabs');
    }

    if (CHROME_BIN) config.executablePath = CHROME_BIN;

    browser = await puppeteer.launch(puppeteerConfig);
    page = await browser.newPage();

    let actionDone = false;
    let reqCount = 0;
    const nowTime = +new Date();

    await page.setRequestInterception(true);

    page.on('request', (request) => {
      const url = request.url();
      const method = request.method();
      const resourceType = request.resourceType();

      // Skip data URIs
      if (/^data:/i.test(url)){
        request.continue();
        return;
      }

      const seconds = (+new Date() - nowTime) / 1000;
      const shortURL = truncate(url, 70);
      const otherResources = /^(manifest|other)$/i.test(resourceType);
      // Abort requests that exceeds 15 seconds
      // Also abort if more than 100 requests
      if (seconds > 15 || reqCount > 100 || actionDone){
        console.log(`❌⏳ ${method} ${shortURL}`);
        request.abort();
      } else if (otherResources){
        console.log(`❌ ${method} ${shortURL}`);
        request.abort();
      } else {
        console.log(`✅ ${method} ${shortURL}`);
        request.continue();
        reqCount++;
      }
    });

    let responseReject;
    const responsePromise = new Promise((_, reject) => {
      responseReject = reject;
    });


    page.on('response', (resp) => {

      let headers = resp._headers;
      if (headers && headers['location'] !== undefined && headers['location'].includes(hostname)){

          responseReject(new Error('Possible infinite redirects detected.'));

      }else if (resp && resp._status !== undefined && resp._status !== 200 ){
        responseReject(new Error('Status not 200.'));
      }


    });

    await page.setViewport({
      width:pageOptions.viewport.width,
      height:pageOptions.viewport.height,
    });

    await Promise.race([
      responsePromise,
      page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: pageOptions.timeout
      })
    ]);

    // Pause all media and stop buffering
    page.frames().forEach((frame) => {
      frame.evaluate(() => {
        document.querySelectorAll('video, audio').forEach(m => {
          if (!m) return;
          if (m.pause) m.pause();
          m.preload = 'none';
        });
      });
    });

    // wait to render pdf
    const PDF_TIMEOUT = 100000;

    await Promise.race([
      timeoutAndReject(PDF_TIMEOUT, 'PDF timed out'),
      page.pdf(pdfOptions)
    ]);

    actionDone = true;

    if (browser){
      await browser.close();
    }

    return pdf;

  } catch (e) {
    if (!DEBUG && page) {
      page.removeAllListeners();
      page.close();
    }
    const { message = '' } = e;

    // Handle websocket not opened error
    if (/not opened/i.test(message) && browser){
      console.error('🕸 Web socket failed');
      try {
        browser.close();
        browser = null;
      } catch (err) {
        console.warn(`Chrome could not be killed ${err.message}`);
        browser = null;
      }
    }

    if (browser){
      await browser.close();
    }

    console.error(e)
    return Promise.reject();
  }
};
