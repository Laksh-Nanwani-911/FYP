export const isUserlogin =()=>{
    const token = localStorage.getItem('customerToken')
    if(token===null){
        return false
    }
    return true
}