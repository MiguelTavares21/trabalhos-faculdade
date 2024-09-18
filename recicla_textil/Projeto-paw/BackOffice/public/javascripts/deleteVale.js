async function deleteVale(valeId) {
  try {
    const response = await fetch(`/vales/delete_vale/${valeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Erro desconhecido ao apagar o vale");
    }

    const data = await response.json();

    if (data && data.message) {
      const popup = document.createElement('div');
      popup.style.backgroundColor = 'green';
      popup.className = 'popup';
      popup.textContent = data.message;
      
      document.body.appendChild(popup);
      setTimeout(() => {
          document.body.removeChild(popup);
          window.location.reload();
      }, 2000);

    }
  } catch (error) {
    const errorMessage = error.message || "Erro desconhecido ao apagar o vale";
    const popup = document.createElement("div");
    popup.className = 'popup';
    popup.textContent = errorMessage|| 'Insira valores positivos'
    
    document.body.appendChild(popup);

    setTimeout(() => {
      document.body.removeChild(popup);
    }, 3000);
  }
}
