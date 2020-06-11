// Bills script

// Require
const {
  requestFactory,
  scrape,
  saveBills,
  log
} = require('cozy-konnector-libs')
const moment = require('moment')

// Request (Cheerio)
const request = requestFactory({
  // debug: true,
  cheerio: true,
  json: false,
  jar: true
})

// Bills function
async function bills(urlList, folderPath) {
  let $ = await request(urlList)

  log('info', 'Parsing bills')
  const bills = parseBills($)

  log('info', 'Saving bills to Cozy')
  await saveBills(bills, folderPath, {
    identifiers: ['kubii'],
    contentType: 'application/pdf'
  })
}

function parseBills($) {
  const bills = scrape(
    $,
    {
      fileurl: {
        sel: 'a[title="Facture"]',
        attr: 'href'
      },
      idFacture: {
        sel: 'td:nth-child(1)'
      },
      amount: {
        sel: 'td:nth-child(3)',
        parse: amount => parseFloat(amount.replace(' €', '').replace(',', '.'))
      },
      date: {
        sel: 'td:nth-child(2)',
        parse: date => moment(date, 'DD/MM/YYYY')
      }
    },
    '#order-list tbody tr'
  )

  return bills.map(bill => ({
    ...bill,
    vendor: 'kubii',
    currency: '€',
    filename: `${bill.date.format('YYYY-MM-DD')}-${String(bill.amount).replace(
      '.',
      ','
    )}€.pdf`,
    date: bill.date.toDate()
  }))
}

module.exports = {
  bills
}
