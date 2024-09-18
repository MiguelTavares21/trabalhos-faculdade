document.getElementById("custoPontos").addEventListener("input", function () {
  const custoPontosInput = parseFloat(this.value);
  const errorElement = document.getElementById("custoPontosError");
  if (isNaN(custoPontosInput) || custoPontosInput <= 0) {
    errorElement.style.display = "inline";
    this.setCustomValidity(
      "Por favor, insira um valor numérico positivo maior que zero."
    );
  } else {
    errorElement.style.display = "none";
    this.setCustomValidity("");
  }
});