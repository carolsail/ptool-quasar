export function setToken( state, {token} ) {
    state.token = token
}

export function setNickname( state, {nickname} ) {
    state.nickname = nickname
}

export function resetState( state ) {
    state.token = ''
    state.nickname = ''
}