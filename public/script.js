const API_KEY = '123456'; // Deve ser a mesma chave definida no .env

// Evento de cadastro
$('#cadastroForm').submit(function (e) {
    e.preventDefault();

    const nome = $('#nome').val();
    const email = $('#email').val();

    $.ajax({
        url: '/api/cadastrar',
        method: 'POST',
        headers: {
            'x-api-key': API_KEY
        },
        contentType: 'application/json',
        data: JSON.stringify({ nome, email }),
        success: function (response) {
            alert(response.message);
            $('#cadastroForm')[0].reset();
        },
        error: function (xhr) {
            alert(xhr.responseJSON.message);
        }
    });
});

// Evento de consulta
$('#consultarBtn').click(function () {
    $.ajax({
        url: '/api/consultar',
        method: 'GET',
        headers: {
            'x-api-key': API_KEY
        },
        success: function (data) {
            $('#dadosLista').empty();
            data.forEach(item => {
                $('#dadosLista').append(`<li>${item.nome} - ${item.email}</li>`);
            });
        },
        error: function () {
            alert('Erro ao consultar dados');
        }
    });
});
