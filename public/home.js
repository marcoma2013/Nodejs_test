let url = 'localhost';
window.onload = () => {
    let headers = new Headers();
    headers.append('Authorization', window.localStorage.getItem('token'));
    fetch(`${url}/userInfo`, {
        headers: headers
    }).then((res) => {
        res.json().then((res)=>{
            document.getElementById('welcome').innerHTML =`Welcome -${res.data.id}-` ;
        });
    })
}
