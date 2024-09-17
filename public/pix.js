document.getElementById('generate-qr').addEventListener('click', function() {
    // Defina a chave PIX fixa aqui
    const pixKey = 'sua-chave-pix-aqui@exemplo.com';  // Substitua pela sua chave PIX
    const qrCodeBox = document.getElementById('qr-code-box');

    if (pixKey) {
        const qrCodeData = `pix://00020126430014BR.GOV.BCB.PIX0114${pixKey}5204000053039865405802BR5906Lojinha6008SAO PAULO62070503***6304`;
        const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeData)}&size=200x200`;

        qrCodeBox.innerHTML = `<img src="${qrCodeImageUrl}" alt="QR Code">`;
    } else {
        qrCodeBox.innerHTML = '<p style="color: red;">Por favor, preencha a chave PIX.</p>';
    }
});
