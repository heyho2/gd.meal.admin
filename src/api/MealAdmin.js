
import request from '@/utils/request'
//获取餐别列表
export function GetMealCategories(params) {
    return request({
        url: '/meal/MealAdmin/GetMealCategories',
        method: 'get',
        params
    })
}
//创建餐别
export function CreateCategory(data) {
    return request({
        url: '/meal/MealAdmin/CreateCategory',
        method: 'post',
        data
    })
}

//更新餐别
export function UpdateCategory(data) {
    return request({
        url: '/meal/MealAdmin/UpdateCategory',
        method: 'post',
        data
    })
}

//删除餐别
export function DeleteCategory(hospitalGuid, categoryGuid) {
    return request({
        url: '/meal/MealAdmin/DeleteCategory',
        method: 'post',
        params: { hospitalGuid, categoryGuid }
    })
}


//获取餐别列表
export function GetMealDishes(params) {
    return request({
        url: '/meal/MealAdmin/GetMealDishes',
        isLoading: false,
        method: 'get',
        params
    })
}


//创建菜品
export function CreateMealDishes(data) {
    return request({
        url: '/meal/MealAdmin/CreateMealDishes',
        method: 'post',
        data
    })
}
//修改菜品
export function UpdateMealDishes(data) {
    return request({
        url: '/meal/MealAdmin/UpdateMealDishes',
        method: 'post',
        data
    })
}

//菜品上下架
export function UpdateMealDishesStatus(hospitalGuid, dishesGuid) {
    return request({
        url: '/meal/MealAdmin/UpdateMealDishesStatus',
        method: 'post',
        params: { hospitalGuid, dishesGuid }
    })
}
//获取指定医院用户钱包账户明细
export function GetMealAccountDetails(params) {
    return request({
        url: '/meal/MealAdmin/GetMealAccountDetails',
        isLoading: false,
        method: 'get',
        params
    })
}


//获取指定医院用户钱包账户列表
export function GetMealAccounts(params) {
    return request({
        url: '/meal/MealAdmin/GetMealAccounts',
        method: 'get',
        isLoading: false,
        params
    })
}

//更新账户状态
export function UpdatePassword(params) {
    return request({
        url: '/meal/MealAdmin/UpdatePassword',
        method: 'post',
        params
    })
}
//更新账户状态
export function UpdateMealAccountStatus(data) {
    return request({
        url: '/meal/MealAdmin/UpdateMealAccountStatus',
        method: 'post',
        data
    })
}


//更新用户账户身份
export function UpdateMealAccountIdentity(data) {
    return request({
        url: '/meal/MealAdmin/UpdateMealAccountIdentity',
        method: 'post',
        data
    })
}


//更新用户账户身份
export function RechargeAccount(data) {
    return request({
        url: '/meal/MealAdmin/RechargeAccount',
        method: 'post',
        data
    })
}

//个人充值账户充值或扣减
export function RechargeAccountRechargeOrDeduction(data) {
    return request({
        url: '/meal/MealAdmin/RechargeAccountRechargeOrDeduction',
        method: 'post',
        data
    })
}

//指定医院所有赠款账户充值或扣减
export function AllGrantAccountRechargeOrDeduction(data) {
    return request({
        url: '/meal/MealAdmin/AllGrantAccountRechargeOrDeduction',
        method: 'post',
        data
    })
}
//指定医院指定赠款账户充值或扣减
export function GrantAccountRechargeOrDeduction(data) {
    return request({
        url: '/meal/MealAdmin/GrantAccountRechargeOrDeduction',
        method: 'post',
        data
    })
}


//获取食堂操作员列表
export function GetMealOperators(params) {
    return request({
        url: '/meal/MealAdmin/GetMealOperators',
        isLoading: false,
        method: 'get',
        params
    })
}

//删除操作员
export function DeleteMealOperator(hospitalGuid, operatorGuid) {
    return request({
        url: '/meal/MealAdmin/DeleteMealOperator',
        method: 'post',
        params: { hospitalGuid, operatorGuid }
    })
}
//重置操作员密码
export function ResetMealOperatorPassword(data) {
    return request({
        url: '/meal/MealAdmin/ResetMealOperatorPassword',
        method: 'post',
        data
    })
}

//创建食堂操作员账户
export function CreateMealOperator(data) {
    return request({
        url: '/meal/MealAdmin/CreateMealOperator',
        method: 'post',
        data
    })
}