const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const TELEGRAM_BOT_TOKEN = "8369522135:AAG2gbvAhjmbpTXPktrFQLWbKUN_sg_2PEQ";

app.post("/telegram", async (req, res) => {
  try {
    const message = req.body.message;

    if (message && message.document) {
      const file_id = message.document.file_id;
      const file_name = message.document.file_name;

      const getFileUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${file_id}`;
      const response = await axios.get(getFileUrl);
      const file_path = response.data.result.file_path;

      return res.json({
        ok: true,
        file_name,
        file_id,
        file_path,
        download_url: `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${file_path}`
      });
    }

    res.json({ ok: false, message: "No se envió un documento." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
