function createAccount() {
    document.getElementById("modal").style.display = "block";

    document.getElementById("btn-close").addEventListener("click", function () {
        document.getElementById("modal").style.display = "none";
    });
}

function createNormalAccount() {
    window.location.href = "/createUser";
}

function createEntityAccount() {
    window.location.href = "/createEntity";
}
