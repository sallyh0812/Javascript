const http = require('http') //透過http模組啟動web server服務
const url = require('url') //啟動url module服務

const server = http.createServer(function (req, res) {

  //解析url
  urlData = url.parse(req.url,true)
  action = urlData.pathname

  //設定回應為text文件，並回應 Hello World!
  res.writeHead(200,{'Content-Type':'text/plain'})
  if (action == "/getPosition"){
    position = urlData.query
    x = String(position.x)
    y = String(position.y)
    res.write("click.x= "+ x+ "\nclick.y= "+ y+ "\n")
    res.end("Success")
  }
  else{
    res.end('Fail')
  }
})

//設定服務監聽localhost:3000(127.0.0.1/:3000)
server.listen('3000', function () {  
  console.log('server start on 3000 port')
})