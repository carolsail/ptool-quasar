import taskApi from '../../api/task'

export function deadlines ({ commit }) {
    taskApi.deadlineLists().then(response=>{
        commit('setDeadlines', { deadlines: response.data.lists })
    })
}