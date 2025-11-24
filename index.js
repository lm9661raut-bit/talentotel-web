const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// ✅ Reemplaza con tu token de Telegram
const TELEGRAM_BOT_TOKEN = "8369522135:AAG2gbvAhjmbpTXPktrFQLWbKUN_sg_2PEQ";

// ✅ Reemplaza con tu URL de Webhook de Zapier
const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/123456/abcdef";

app.post("/telegram", async (req, res) => {
  try {
    const message = req.body.message;

    // Si el mensaje contiene un documento
    if (message && message.document) {
      const file_id = message.document.file_id;
      const file_name = message.document.file_name;

      // Obtener file_path de Telegram
      const getFileUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${file_id}`;
      const response = await axios.get(getFileUrl);
      const file_path = response.data.result.file_path;

      // Generar URL de descarga directa
      const download_url = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${file_path}`;

      // JSON que se enviará a Zapier
      const jsonData = {
        ok: true,
        file_name,
        file_id,
        file_path,
        download_url
      };

      // Enviar JSON a Zapier
      await axios.post(ZAPIER_WEBHOOK_URL, jsonData);

      // Responder a Telegram
      return res.json({
        ok: true,
        message: "Archivo recibido y enviado a Zapier",
        ...jsonData
      });
    }

    // Si no hay documento
    res.json({ ok: false, message: "No se envió un documento." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Puerto asignado por Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
