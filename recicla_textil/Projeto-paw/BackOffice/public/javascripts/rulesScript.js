function submitForm() {
    const formData = new FormData(document.getElementById('formRulesPoints'));
    const data = Object.fromEntries(formData.entries());

   const allPositive = Object.values(data).every(value => parseFloat(value) >= 0);
    if (!allPositive) {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.textContent = 'Por favor, insira apenas valores positivos ou zero.';
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 3000);
        
        return;
    }

    fetch('/rules/editar_regras', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(json => { throw json; }); 
        }
        return response.json();
    })
    .then(data => {
        const popup = document.createElement('div');
        popup.style.backgroundColor = 'green';
        popup.className = 'popup';
        popup.textContent = data.message;
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            document.body.removeChild(popup);
            window.location.href = '/rules';
        }, 3000);
    })
    .catch(error => {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.textContent = error.message || 'Insira valores positivos'
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 3000);
    });
}
