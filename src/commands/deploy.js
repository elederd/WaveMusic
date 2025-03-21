const https = require("https");

const RENDER_API_KEY = process.env.APIKEY;
const SERVICE_ID = process.env.SERVICEID;

module.exports = {
    name: "deploy",
    description: "Limpia la caché y vuelve a desplegar en Render.",
    execute(message, args) {
        const data = JSON.stringify({ clearCache: true });

        const options = {
            hostname: "api.render.com",
            path: `/v1/services/${SERVICE_ID}/deploys`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${RENDER_API_KEY}`,
                "Content-Type": "application/json",
                "Content-Length": data.length
            }
        };

        const req = https.request(options, (res) => {
            let responseData = "";

            res.on("data", (chunk) => {
                responseData += chunk;
            });

            res.on("end", () => {
                if (res.statusCode === 201) {
                    message.channel.send("🚀 **Bot reiniciándose en Render...**");
                } else {
                    message.channel.send("❌ **Error al reiniciar el bot en Render.**");
                    console.error("Error en la respuesta de Render:", responseData);
                }
            });
        });

        req.on("error", (error) => {
            message.channel.send("❌ **Error al conectar con Render.**");
            console.error("Error en la solicitud HTTP:", error);
        });

        req.write(data);
        req.end();
    }
};
