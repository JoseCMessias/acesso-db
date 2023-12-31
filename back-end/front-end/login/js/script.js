const form = document.getElementById("form");
const campos = document.querySelectorAll(".required");
const spans = document.querySelectorAll(".span-required");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    emailValidate();
    senhaValidate();

    const Email = document.getElementById("email").value;
    const Senha = document.getElementById("senha").value;

    const login_Data = {
        Email,
        Senha,
    };

    try {
        const resposta = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(login_Data),
        });

        const data = await resposta.json();

        if (resposta.ok) {
            console.log(data.msg);
            localStorage.setItem("jwtToken", data.token);
            const user_id = data.id;
            const jwtToken = localStorage.getItem("jwtToken");
            try {
                const response = await fetch(`/user/${user_id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });

                if (response.ok) {
                    const dados = await response.json();
                    window.location.href = `/Home?id=${user_id}`;
                } else {
                    alert(
                        "Não autorizado ou erro ao acessar a rota protegida"
                    );
                }
            } catch (error) {
                console.error("Erro ao acessar a rota protegida:", error);
            }
        } else {
            alert(data.msg);
        }
    } catch (error) {
        console.error(error);
    }
});

function setError(index) {
    campos[index].style.border = "2px solid #e63636";
    spans[index].style.display = "block";
}

function removeError(index) {
    campos[index].style.border = "";
    spans[index].style.display = "none";
}

function emailValidate() {
    if (!emailRegex.test(campos[0].value)) {
        setError(0);
    } else {
        removeError(0);
    }
}

function senhaValidate() {
    if (campos[1].value.length < 8) {
        setError(1);
    } else {
        removeError(1);
    }
}
