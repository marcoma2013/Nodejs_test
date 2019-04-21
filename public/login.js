let formEle = document.getElementById("form");
let url = 'localhost';
if (formEle) {
    formEle.addEventListener("submit", (event) => {
        event.preventDefault();
        let form = document.getElementById('form');
        let formData = new FormData(form);
        let id = formData.get('id');
        let password = formData.get('password');

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        fetch(`${url}/login`, {
                body: JSON.stringify({
                    id,
                    password
                }),
                headers: headers,
                method: 'POST',
                //mode: 'no-cors'
            })
            .then((res) => {
                res.json().then((data) => {
                        if (data.token) {
                            window.localStorage.setItem("token", `Bearer ${data.token}`);
                            window.location.href = "/home.html";
                        } else {
                            document.getElementById('message').innerHTML = data.message;
                            setTimeout(() => {
                                document.getElementById('message').innerHTML = null
                            }, 2000)
                            console.log(data.message);
                        }
                    })
                    .catch((err) => {
                        console.log(JSON.stringify(err));
                    });
            })
            .catch((err) => {
                console.log(JSON.stringify(err));
            });
        // console.log("data");
    })
}
