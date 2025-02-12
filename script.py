import qrcode

json_data = {
    "machineName": "Machine 1",
    "points": 100,
}

json_string = str(json_data)

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(json_string)
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save("qr-code.png")
print("QR code generated and saved as qr-code.png")