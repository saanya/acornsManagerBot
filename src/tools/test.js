require('module-alias/register')
const fetch = require('node-fetch')

fetch('https://api.privatbank.ua/p24api/rest_fiz', {
  method: 'POST',
  headers: {
    'Content-Type': 'text/xml',
  },
  body: '<?xml version="1.0" encoding="UTF-8"?><request version="1.0"><merchant><id>205826</id><signature>Tw95y2WdR0k6T4C2uUp34oXDriOu5B26</signature></merchant><data><oper>cmt</oper><wait>0</wait><test>0</test><payment id=""><prop name="sd" value="01.01.2022" /><prop name="ed" value="01.02.2022" /><prop name="card" value="4731185602391028" /></payment></data></request>',
}).then((response) => {
  console.log('Response status: ' + response.status)
  console.log(response.text())
  return response.text()
})
