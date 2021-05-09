const e = require('express');
const path =require('path')
const { request } = require('express');
const express = require('express');
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast  = require('./utils/forecast')

console.log(__dirname)
const app = express()

// DEfine paths for express config
const pd = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')



//setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)


//setup static directory to serve
app.use(express.static(pd))


app.get('',(req,res)=>{
    res.render('index',{
        title: 'Weather',
        name: 'May'
    })
})
app.get('/about',(req,res)=>{
    res.render('about',{
        title: 'About',
        name: 'May'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        helpText : 'Hello there',
        title: 'Help',
        name: "MAY"
    })
})





app.get('/weather',(req,res)=>{
   if(!req.query.address){
       return res.send({
           'error':'You must provide address'
       })
   }
  
       geocode(req.query.address,(error,{latitude,longitude,location})=>{
       if(error){
           return res.send({error})
       }

       forecast(latitude,longitude,(error,forecastData)=>{
           if(error){
               return res.send({error})
           }

           res.send({
               forecast: forecastData,
               location,
               address: req.query.address
           })

       })

       })
    //    res.send(
    //        {
    //            forecast: 'It is snowing',
    //            location: 'Philadelphia',
    //            address: req.query.address
    //        }
    //    )
   
})


app.get('/help/*',(req,res)=>{
    res.render('404',{
        title: '404',
        name:'MAY',
        errorMessage : 'Help article does not exist'
    })
    
})
app.get('*',(req,res)=>{
    res.render('404',{
        title: '404',
        name:'MAY',
        errorMessage : 'Hello there the page does not exist'
    })
})

app.listen(3000,()=>{
    console.log('Server is up on port 3000')
})