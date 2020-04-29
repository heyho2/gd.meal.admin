import request from '@/utils/request'

export function login(phone, password) {

  return request({
    url: '/meal/MealAdmin/Login',
    method: 'post',
    isLoading: false,
    data: {
      userName: phone,
      password,
      days: 1
    }
  })
}
//获取当前登陆人信息
export function GetLoginUserInfoAsync() {
  return request({
    url: 'System/User/GetLoginUserInfoAsync',
    method: 'get'
  })
}

export function UpdatePassword(password) {
  return request({
    url: '/meal/MealAdmin/UpdatePassword',
    method: 'post',
    data: {
      password
    }
  })
}

export function RestPassword(userId, password) {
  return request({
    url: '/meal/MealAdmin/RestPassword',
    method: 'post',
    data: {
      userId,
      password
    }
  })
}