require('module-alias/register')
require('dotenv').config()
const fetch = require('node-fetch')
console.log(
  `<?xml version="1.0" encoding="UTF-8"?><request version="1.0"><merchant><id>${process.env.merhcantId}</id><signature>${process.env.merhcantPassword}</signature></merchant><data><oper>cmt</oper><wait>0</wait><test>1</test><payment id=""><prop name="sd" value="01.01.2022" /><prop name="ed" value="01.02.2022" /><prop name="card" value="${process.env.merhcantCard}" /></payment></data></request>`,
)
fetch('https://api.privatbank.ua/p24api/rest_fiz', {
  method: 'POST',
  headers: {
    'Content-Type': 'text/xml',
  },
  body: `<?xml version="1.0" encoding="UTF-8"?><request version="1.0"><merchant><id>${process.env.merhcantId}</id><signature>${process.env.merhcantPassword}</signature></merchant><data><oper>cmt</oper><wait>0</wait><test>1</test><payment id=""><prop name="sd" value="01.01.2022" /><prop name="ed" value="01.02.2022" /><prop name="card" value="${process.env.merhcantCard}" /></payment></data></request>`,
}).then(async (response) => {
  console.log('Response status: ' + response.status)
  let text = await response.text()
  console.log(text)
  return response.text()
})
