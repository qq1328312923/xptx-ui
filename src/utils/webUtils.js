import qs from 'qs'
import CryptoJS from 'crypto-js/crypto-js'

/**
 * WebUtil常用的一些工具类
 */

export function formatData(arr) {
  const params = new URLSearchParams()
  for (const key in arr) {
    params.append(key, arr[key])
  }
  return params
}

export function formatDataToJson(arr) {
  var params = '['
  for (var key in arr) {
    params = params + key + ':' + arr[key] + ','
  }
  params += ']'
  return params
}

export function formatDataToForm(arr) {
  const params = new FormData()
  for (var key in arr) {
    console.log('"' + key + '"', arr[key])
    params.append('"' + key + '"', arr[key])
  }
  return params
}

export function getPar(data) {
  return qs.stringify(data)
}

//密码加密传递给后台 后台解密
export function passwordEncrypt( word){
  var _word = CryptoJS.enc.Utf8.parse(word),
      _key = CryptoJS.enc.Utf8.parse('ihaierForTodoKey'),
  _iv = CryptoJS.enc.Utf8.parse('ihaierForTodo_Iv');
  var encrypted = CryptoJS.AES.encrypt(_word, _key, {
      iv: _iv,
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7
      });
  return encrypted.toString();
}