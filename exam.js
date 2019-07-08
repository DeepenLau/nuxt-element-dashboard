const crypto = require('crypto')
const request = require('request')

const url =
  'https://easy-mock.com/mock/5bbefdf6faedce31cd6a5261/example/exam-intermediate'

module.exports = function(config, cb) {
  return new Promise((resolve, reject) => {
    const nonce = Date.now()
    const date = new Date()
    const errorMsg = []
    config = config || {}
    const {
      action,
      tagName,
      subject,
      htmlBody,
      textBody,
      toAddress,
      fromAlias,
      toAddress,
      addressType,
      accessKeyID,
      accountName,
      templateCode,
      templateName,
      receiversName,
      replyToAddress,
      accessKeySecret
    } = config

    setRequiredMsg(errorMsg, accessKeyID, 'accessKeyID')
    setRequiredMsg(errorMsg, accessKeySecret, 'accessKeySecret')
    setRequiredMsg(errorMsg, accountName, 'accountName')

    const param = {
      AccessKeyId: accessKeyID,
      Format: 'JSON',
      AccountName: accountName,
      AddressType: typeof addressType == 'undefined' ? 0 : addressType,
      SignatureMethod: 'HMAC-SHA1',
      SignatureNonce: nonce,
      SignatureVersion: '1.0',
      TemplateCode: templateCode,
      Timestamp: date.toISOString(),
      Version: '2015-11-23'
    }

    switch (action) {
      case 'single':
        setRequiredMsg(errorMsg, toAddress, 'toAddress')
        setParams(param, {
          Action: 'single',
          ReplyToAddress: !!replyToAddress,
          ToAddress: toAddress
        })
        setParamsIfExist(param, {
          FromAlias: fromAlias,
          Subject: subject,
          HtmlBody: htmlBody,
          TextBody: textBody
        })
        break
      case 'batch':
        setRequiredMsg(errorMsg, templateName, 'templateName')
        setRequiredMsg(errorMsg, receiversName, 'receiversName')
        setParams(param, {
          Action: 'batch',
          TemplateName: templateName,
          ReceiversName: receiversName
        })
        setParamsIfExist(param, {
          TagName: tagName
        })
        break
      default:
        reject({
          errorMsg: 'error action'
        })
        break
    }

    if (errorMsg.length) {
      reject(errorMsg.join(','))
      return
    }

    const reqBody = generateReqBody(config, param)

    request(
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri: url,
        body: reqBody,
        method: 'POST'
      },
      function(err, res, body) {
        if (err) {
          reject({
            errorMsg: err,
            body
          })
          return
        }
        resolve(res)
      }
    )
  })
}

function setRequiredMsg(errorMsg, value, key) {
  !value && errorMsg.push(`${key} required`)
}

function setParams(param, data) {
  Object.keys(data).forEach(key => {
    param[key] = data[key]
  })
}

function setParamsIfExist(param, data) {
  Object.keys(data).forEach(key => {
    const value = data[key]
    if (value) {
      data[key] && (param[key] = value)
    }
  })
}

function generateSign(config, param) {
  var signStr = []
  for (var i in param) {
    signStr.push(encodeURIComponent(i) + '=' + encodeURIComponent(param[i]))
  }
  signStr.sort()
  signStr = signStr.join('&')
  signStr = 'POST&%2F&' + encodeURIComponent(signStr)
  const sign = crypto
    .createHmac('sha1', config.accessKeySecret + '&')
    .update(signStr)
    .digest('base64')
  const signature = encodeURIComponent(sign)
  return signature
}

function generateReqBody(config, param) {
  var reqBody = ['Signature=' + generateSign(config, param)]
  for (var i in param) {
    reqBody.push(i + '=' + param[i])
  }
  reqBody = reqBody.join('&')
  return reqBody
}

function a() {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove('yes1', 'yes2')
    }, 1000)
  })
}

a().then((...args) => {
  console.log(args)
})
