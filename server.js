
var fs = require('fs');
var express = require('express');
var app = express();

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
  //app.rout(`/${/d/}`).get(function(req, res) {
		//  res.sendFile(process.cwd() + '/views/index.html');
  //  })
  
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
   })
   app.get('/:dateVal',function(req,res,next){
     var dateVal=req.params.dateVal;
     var dateformattingoptios={
       year:'numeric',
       month:'long',
       day:'numeric'
     };
     if(isNaN(dateVal)){
       var naturalDate=new Date(dateVal);
       naturalDate=naturalDate.toLocaleDateString("en-us",dateformattingoptios);
       var unixDate=new Date(dateVal).getTime()/1000;
       
     }
     else{
     var  unixDate=dateVal;
       var naturalDate=new Date(dateVal* 1000);
       naturalDate=naturalDate.toLocaleDateString("en-us",dateformattingoptios);
       
       
     }
     res.json({unix:unixDate, natural:naturalDate});
     
       
     next();
   });

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});