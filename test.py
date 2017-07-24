import requests as rq
import json

def getAddressFromNaver(name):
    url = "http://map.naver.com/search2/local.nhn"
    header = {'User-Agent': 'Mozilla/5.0'}
    payload = {'query': name}

    req = rq.Request('Get', url, headers=header, params=payload)
    r = req.prepare()
    s = rq.Session()
    result = s.send(r).json()
    return result['result']['site']['list'][0]['tel']

if __name__ == '__main__':
    print(getAddressFromNaver('asdf'))
