import http from "../utils/http";

export default {
    //========== task item =========
    itemLists(startRow, rowsPerPage, sortBy, descending, filter){
        return http.post('task/items', {startRow, rowsPerPage, sortBy, descending, filter})
    },
    itemAdd(data){
        return http.post('task/item/add', data)
    },
    itemChangeUrgent(id, is_urgent){
        return http.post('task/item/change/urgent', {id, is_urgent})
    },
    itemUpdate(data){
        return http.post('task/item/update', data)
    },
    itemDelete(id){
        return http.post('task/item/delete', {id})
    },
    //========== task category =========
    categoryLists(startRow, rowsPerPage, sortBy, descending, filter){
        return http.post('task/categories', {startRow, rowsPerPage, sortBy, descending, filter})
    },
    categoryAdd(data){
        return http.post('task/category/add', data)
    },
    categoryChangeActive(id, is_active){
        return http.post('task/category/change/active', {id, is_active})
    },
    categoryUpdate(data){
        return http.post('task/category/update', data)
    },
    categoryDelete(id){
        return http.post('task/category/delete', {id})
    },
    categorySearchByTitle(search){
        return http.post('task/category/search', {search})
    },
    //========== task timer =========
    timerAdd(data){
        return http.post('task/timer/add', data)
    },
    //========== task deadline =========
    deadlineMark(){
        return http.get('task/deadline/mark')
    },
    deadlineLists(){
        return http.get('task/deadlines')
    },
    deadlineCheck(id){
        return http.post('task/deadline/change/check', {id})
    }
}