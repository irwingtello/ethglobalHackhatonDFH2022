import {Client} from '@uauth/node'
import Resolution from '@unstoppabledomains/resolution'
import express from 'express'
import 'express-async-errors'
import session from 'express-session'
import morgan from 'morgan'
import 'whatwg-fetch'
var cors = require('cors')

;(global as any).XMLHttpRequest = require('xhr2') as any
;(global as any).XMLHttpRequestUpload = (
  (global as any).XMLHttpRequest as any
).XMLHttpRequestUpload

const resolution = new Resolution()

const client = new Client({
  clientID: 'c530a22d-b179-4341-b43d-15ef18ffb337',
  clientSecret: 'eOG0VmM35mK5jciYsqhyDHn0xk',
  redirectUri: 'http://localhost:5001/callback',
  resolution,
})

const app = express()

app.use(cors({
  origin: '*'
}))

app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'))

app.get('/', (_, res) => {
  res.sendFile('./index.html', {root: __dirname })
})

// Required for express session middleware
app.use(session({secret: 'keyboard cat'}))

// Required for /login & /callback
app.use(express.urlencoded({extended: true}))

const {login, callback, middleware} = client.createExpressSessionLogin()

app.post('/login', (req, res, next) => {
  console.log(req)
  return login(req,res,next, {
    username: req.body.username_hint
  })
})

app.post('/callback', async (req, res: any, next) => {
  await callback(req, res, next)

  return res.redirect('/profile')
})

const onlyAuthorized = middleware()

app.get('/profile', onlyAuthorized, async (req, res) => {
  res.json(res.locals.uauth)
})

app.listen(5001, () => {
  console.log('Listening at http://localhost:5001')
})
