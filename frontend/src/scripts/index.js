const fetch = require('node-fetch')
const baseUrl = 'http://localhost:3000'

export function formatDate(date) {
  date = new Date(date)
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  return dd + '.' + mm + '.' + yyyy;
}

export function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export async function fetchRequest(url, method, data, headers) {
  url = baseUrl + url
  let params = {method, headers: headers || {}}
  if (method == 'POST' && data) {
    params.json = true
    params.headers['Content-Type'] = 'application/json'
    params.body = JSON.stringify(data)
  } else if (data) {
    url += '?' + new URLSearchParams(data)
  }
  console.log(params)
  if (localStorage.token) params.headers.Authorization = localStorage.token
  return new Promise(async resolve => {
    let body, headers
    try {
      const response = await fetch(url, params).catch(err => {throw err})
      if (response.ok != null && !response.ok) {
        console.log(response)
        throw 'ok - false'
      }
      if (url.includes('/file-handler')) {
        body = await response.blob()
        console.log(URL.createObjectURL(body))
        resolve(body)
      } else {
        body = await response.text()
        try {
          body = JSON.parse(body)
        } catch {}
      }
      headers = response.headers && Object.fromEntries(response.headers.entries())
    } catch (err) {
      console.log("Request error", url, err)
      resolve({err})
    }
    if (headers && headers.authorization) localStorage.setItem('token', headers.authorization)
    resolve({body, headers})
  })
}