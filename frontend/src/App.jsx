import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const COLORS = [
  "rgba(255, 0, 0, 0.4)",
  "rgba(0, 255, 0, 0.4)",
  "rgba(0, 0, 255, 0.4)",
  "rgba(255, 255, 0, 0.4)",
  "rgba(255, 0, 255, 0.4)",
  "rgba(0, 255, 255, 0.4)",
];

function App() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  //  Soumettre l'image au modèle
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !url) return alert("Veuillez fournir un fichier ou une URL.");

    setLoading(true); // Début de l'analyse
    setResult(null); // Réinitialiser l'ancien résultat

    try {
      let response;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        response = await axios.post("http://127.0.0.1:8000/predict", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axios.post("http://127.0.0.1:8000/predict", { image_url: url });
      }
      setResult(response.data);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'analyse de l'image");
    } finally {
      setLoading(false); // Fin de l'analyse
    }
  };

  // ✅ Dessiner le résultat sur le canvas
  const drawResult = () => {
    if (!result) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    if (file) img.src = URL.createObjectURL(file);
    else if (url) {
      img.crossOrigin = "Anonymous";
      img.src = url;
    }

    img.onload = () => {
      const originalWidth = result.image.width;
      const originalHeight = result.image.height;
      const maxWidth = 400; // Pour que le canvas et l'image originale aient la même taille max
      const scale = Math.min(1, maxWidth / originalWidth);

      canvas.width = originalWidth * scale;
      canvas.height = originalHeight * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      result.predictions.forEach((pred, index) => {
        const color = COLORS[index % COLORS.length];

        // Masque
        ctx.beginPath();
        pred.points.forEach((p, i) => {
          const x = p.x * scale;
          const y = p.y * scale;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        // Contour
        ctx.strokeStyle = color.replace("0.4", "1");
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label + confiance
        // 
        /*
        const label = `${pred.class} (${(pred.confidence * 100).toFixed(1)}%)`;
        ctx.fillStyle = "black";
        ctx.font = `${24 * scale}px Arial`;
        ctx.fillText(label, pred.x * scale, pred.y * scale - 5);
        */
      });
    };
  };

  useEffect(() => {
    drawResult();
  }, [result]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "segmentation_result.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const uniqueClasses = [...new Set(result?.predictions.map((p) => p.class))];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Header */}
<header
  style={{
    background: "linear-gradient(135deg, #4CAF50, #81C784)",
    color: "white",
    padding: "40px 20px",
    textAlign: "left", // Texte aligné à droite
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    transition: "all 0.3s ease",
  }}
>
  <h1
    style={{
      fontSize: 42,
      margin: 0,
      textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
    }}
  >
    Segmentation des Fruits 
  </h1>
  <p
    style={{
      fontSize: 20,
      marginTop: 10,
      fontStyle: "italic",
      textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
    }}
  >
    Chargez une image pour détecter et segmenter les fruits
  </p>
</header>


      {/* Main content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 20,
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 10,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ padding: 5, marginBottom: 10 }}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Ou entrer une URL d'image"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: 300, padding: 5, marginBottom: 10 }}
            disabled={loading}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: loading ? "#ccc" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "0.3s",
            }}
          >
            {loading ? "Analyse en cours..." : "Analyser"}
          </button>
        </form>

        {/* Loader */}
        {loading && (
          <div style={{ marginTop: 20, fontSize: 18, color: "#3422ffff" }}>
            🔄 Analyse en cours, veuillez patienter...
          </div>
        )}

        {/* Affichage de l'image originale et du canvas */}
        {result && !loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 20,
              marginTop: 20,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {/* Image originale */}
            <div
              style={{
                backgroundColor: "#fff",
                padding: 10,
                borderRadius: 10,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h4 style={{ textAlign: "center" }}>Image originale</h4>
              <img
                src={file ? URL.createObjectURL(file) : url}
                alt="Originale"
                style={{ maxWidth: 400, maxHeight: 400, display: "block" }}
              />
            </div>

            {/* Canvas segmenté */}
            <div
              style={{
                backgroundColor: "#fff",
                padding: 10,
                borderRadius: 10,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h4 style={{ textAlign: "center" }}>Image segmentée</h4>
              <canvas
                ref={canvasRef}
                style={{ border: "1px solid #ccc", maxWidth: 400, maxHeight: 400 }}
              />
            </div>
          </div>
        )}

        {/* Légende et téléchargement */}
{/* Légende et téléchargement */}
{result && !loading && (
  <div style={{ marginTop: 20, textAlign: "center" }}>
    <button
      onClick={downloadImage}
      style={{
        padding: "8px 16px",
        backgroundColor: "#2196F3",
        color: "white",
        border: "none",
        borderRadius: 5,
        cursor: "pointer",
        marginBottom: 10,
      }}
    >
      Télécharger l'image segmentée
    </button>
    <h3>Objets détectés :</h3>
    <ul style={{ listStyle: "none", padding: 0 }}>
      {result.predictions.map((pred, i) => (
        <li key={i} style={{ marginBottom: 5, fontSize: 16 }}>
          <span
            style={{
              display: "inline-block",
              width: 20,
              height: 20,
              backgroundColor: COLORS[i % COLORS.length],
              marginRight: 10,
              verticalAlign: "middle",
            }}
          ></span>
          <strong>{pred.class}</strong> — Confiance: {(pred.confidence * 100).toFixed(1)}%
        </li>
      ))}
    </ul>
  </div>
)}

      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#333",
          color: "#fff",
          padding: 15,
          textAlign: "center",
          fontSize: 14,
          marginTop: "auto",
        }}
      >
        &copy; 2025 Younes ELBOUKNIFY - Application de segmentation d'images
      </footer>
    </div>
  );
}

export default App;
