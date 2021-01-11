require("./check-versions")();

var config = require("../config");
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

var opn = require("opn");
var path = require("path");
var express = require("express");
var ssestream = require("ssestream");
var eventsource = require("eventsource");
var webpack = require("webpack");
var proxyMiddleware = require("http-proxy-middleware");
var history = require('connect-history-api-fallback');
var webpackConfig =
  process.env.NODE_ENV === "testing" || process.env.NODE_ENV === "production" ?
  require("./webpack.prod.conf") :
  require("./webpack.dev.conf");

const axios = require("axios");
var request = require("request");
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var multer = require('multer');
var upload = multer({ dest: './upload/' });
var fs = require('fs');
var FormData = require('form-data');

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port;
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable;

var app = express();
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' })); // for parsing application/json
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded

var apiRoutes = express.Router();

const buildUrlencodedData = jsonData => {
  let ret = "";
  for (const it in jsonData) {
    //eslint-disable-line
    ret +=
      encodeURIComponent(it) + "=" + encodeURIComponent(jsonData[it]) + "&"; //eslint-disable-line
  }
  return ret;
};

// build devServer routes
const devServer = config.dev.devServer;
const apis = config.dev.apis;

// ====== 重定向
app.get('/zh-cn/spd/:map/overview/', (req, res) => {
  res.redirect(301, `${devServer.remoteServer}${req.url}`);
});

// TO-DO
const buildRoutes = pathObj => {
  const headers = {
    Origin: devServer.remoteServer,
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.8",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.79 Safari/537.36",
    "Content-Type": pathObj.isfile ? "multipart/form-data" : "application/x-www-form-urlencoded; charset=UTF-8",
    Accept: "application/json, text/javascript, */*; q=0.01",
    Referer: `${devServer.remoteServer}/zh-cn/app14/datapath/edit/`,
    "X-Requested-With": "XMLHttpRequest",
    Connection: "keep-alive",
    Cookie: `sessionid=${devServer.sessionId}; csrftoken=${devServer.csrftoken}`
  };

  apiRoutes[pathObj.method](pathObj.path, upload.any(), function(req, res) {
    const options = {
      url: `${devServer.remoteServer}${req.originalUrl}`,
      method: pathObj.method.toUpperCase(),
      headers: headers,
      gzip: true
    };
    if (pathObj.method === "post") {
      if (pathObj.isfile === true) {  // 目前只能用于上传license
        // 这个地方来接收和发送formdata文件
        console.log(req.files[0]);
        // let rname = 'upload\\' + req.files[0].originalname;
        // console.log('rname:', rname);
        console.log(req.body);
        fs.rename(req.files[0].path, req.files[0].path + req.files[0].originalname, (err, data) => {
          if (err) {
            console.log('修改文件名出错');
          } else {
            console.log('修改文件名成功');
            var formData = {
              csrfmiddlewaretoken: devServer.csrftoken,
            }
            Object.assign(formData, req.body);
            formData[req.files[0].fieldname] = fs.createReadStream(req.files[0].path + req.files[0].originalname);
            console.log(formData);
            options.formData = formData;
            request(options, cb);
          }
        });
        
      } else {
        const bodyData = Object.assign({}, req.body, {
          csrfmiddlewaretoken: devServer.csrftoken
        });
        if (pathObj.isJson === false) {
          options.body = buildUrlencodedData(bodyData);
        } else {
          options.body = JSON.stringify(bodyData);
          options.json = true;
        }
      }

      // GET
    } else {
      // TO-DO
      options.qs = req.body;
    }

    function cb(error, response, body) {
      if (error) {
        console.error("error: ", error);
        if (response) {
          res.status(response.statusCode).end(" WRONG IN DEV PROXY SERVER ");
        } else {
          res.status(500).end(' Connection Fail. ');
        }
      } else {
        console.log(options.method, options.url, response.statusCode);
        if (!error && response.statusCode == 200) {
          res.send(body);
        } else {
          res.status(response.statusCode).end('server response with ' + JSON.stringify(response) + ',error ' + error);
        }
      }
      if (pathObj.isfile === true) {
        delDir('./upload/');
      }
    }
    function delDir(path){
      let files = [];
      if(fs.existsSync(path)){
          files = fs.readdirSync(path);
          files.forEach((file, index) => {
              let curPath = path + "/" + file;
              if(fs.statSync(curPath).isDirectory()){
                  delDir(curPath); //递归删除文件夹
              } else {
                  fs.unlinkSync(curPath); //删除文件
              }
          });
          // fs.rmdirSync(path); //不要删除upload文件夹
      }
    }

    if (pathObj.type === 'eventsource') {
      const sseStream = new ssestream(req);
      const sseClient = new eventsource(options.url, { headers: { 'Cookie': options.headers.Cookie } });
      sseStream.pipe(res);

      console.log('eventsource', options.url);

      sseClient.onopen = (ev) => {
        console.log('onopen', options.url, ev);
      };

      sseClient.onmessage = (ev) => {
        console.log('onmessage', options.url, ev);
      };

      sseClient.onerror = (ev) => {
        console.log('onerror', options.url, ev);
      };

      pathObj.events.forEach((d, i) => {
        sseClient.addEventListener(d, (ev) => {
          sseStream.write({
            event: d,
            data: ev.data,
          });
          if (i === pathObj.events.length - 1 && pathObj.events.length !== 1) {
            sseStream.unpipe(res);
            sseClient.close();
          }
        });
      });

    } else if(!pathObj.isfile) {
      request(options, cb);
    }
  });
};

apis.forEach(api => buildRoutes(api));

app.use("/", apiRoutes);

var compiler = webpack(webpackConfig);

var devMiddleware = require("webpack-dev-middleware")(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
});

var hotMiddleware = require("webpack-hot-middleware")(compiler, {
  log: false,
  heartbeat: 2000
});
// force page reload when html-webpack-plugin template changes
compiler.plugin("compilation", function(compilation) {
  compilation.plugin("html-webpack-plugin-after-emit", function(data, cb) {
    hotMiddleware.publish({ action: "reload" });
    cb();
  });
});

// proxy api requests
Object.keys(proxyTable).forEach(function(context) {
  var options = proxyTable[context];
  if (typeof options === "string") {
    options = { target: options };
  }
  app.use(proxyMiddleware(options.filter || context, options));
});

// handle fallback for HTML5 history API
const pathMap = config.dev.maps;
app.use(history({
  index: '/index.html',
  rewrites: pathMap,
}));

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
var staticPath = path.posix.join(
  config.dev.assetsPublicPath,
  config.dev.assetsSubDirectory
);
app.use(staticPath, express.static("./static"));

var uri = "http://localhost:" + port;

var _resolve;
var readyPromise = new Promise(resolve => {
  _resolve = resolve;
});

console.log("> Starting dev server...");
devMiddleware.waitUntilValid(() => {
  console.log("> Listening at " + uri + "\n");
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== "testing") {
    opn(uri);
  }
  _resolve();
});

var server = app.listen(port);

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close();
  }
};
