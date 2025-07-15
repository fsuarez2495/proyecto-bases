import React, { useEffect } from "react";

function App() {
  // Agrega los estilos globales al <head> una sola vez
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      body, html, #root {
        height: 100%;
        margin: 0;
        font-family: sans-serif;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const styles = {
    container: {
      display: "grid",
      gridTemplateColumns: "200px 1fr",
      gridTemplateRows: "100px 1fr",
      gridTemplateAreas: `
        "top-left top-right"
        "sidebar main"
      `,
      height: "100vh",
    },
    topLeft: {
      backgroundColor: "black",
      gridArea: "top-left",
    },
    topRight: {
      backgroundColor: "yellow",
      gridArea: "top-right",
      display: "flex",
      alignItems: "center",
      paddingLeft: "20px",
    },
    sidebar: {
      backgroundColor: "blue",
      gridArea: "sidebar",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "10px",
    },
    newBtn: {
      backgroundColor: "cyan",
      color: "black",
      padding: "20px 40px",
      fontWeight: "bold",
      border: "none",
      marginBottom: "20px",
      borderRadius: "10px",
      cursor: "pointer",
    },
    menuButtons: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    menuButton: {
      backgroundColor: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "10px",
      cursor: "pointer",
    },
    mainContent: {
      backgroundColor: "burlywood",
      gridArea: "main",
      padding: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.topLeft}></div>
      <div style={styles.topRight}>
        <h1>Mi buscador</h1>
      </div>

      <div style={styles.sidebar}>
        <button style={styles.newBtn}>+ NUEVO</button>
        <div style={styles.menuButtons}>
          <button style={styles.menuButton}>Pagina Principal</button>
          <button style={styles.menuButton}>Mi Unidad</button>
          <button style={styles.menuButton}>Compartido</button>
          <button style={styles.menuButton}>Papeleria</button>
        </div>
      </div>

      <div style={styles.mainContent}>4</div>
    </div>
  );
}

export default App;
