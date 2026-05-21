import axios from "axios";
import { useState } from "react";
import "./App.css";
import Editor from "@monaco-editor/react";
import JSZip from "jszip";
import { saveAs } from "file-saver";


function App() {

  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePreview = (fileList = files) => {

    const html = fileList.find(f => f.name.includes("index.html"))?.content || "";
    const css = fileList.find(f => f.name.includes("style.css"))?.content || "";
    const js = fileList.find(f => f.name.includes("script.js"))?.content || "";

    const fullPage = `
<html>
<head>
<style>
${css}
</style>
</head>

<body>
${html}

<script>
${js}
</script>

</body>
</html>
`;

    setPreview(fullPage);

  };

  const generateWebsite = async () => {

    if (!prompt) {
      alert("Please enter a prompt");
      return;
    }

    try {

      setLoading(true);
      setFiles([]);

      const res = await axios.post("https://ai-webgen-backend-l2oo.onrender.com/api/generate",
        { prompt },
        { timeout: 120000 }
      );

      // setFiles(res.data.output || []);
      if (res.data.success) {
        setFiles(res.data.files || []);
        const htmlFile = res.data.files.find(
          f => f.name.includes("index.html")
        );

        if (htmlFile) {
          setActiveFile(htmlFile);
        }
        generatePreview(res.data.files);
      } else {
        alert("Generation failed");
      }

    } catch (error) {

      console.error("FULL ERROR:", error);

      alert(error.response?.data?.message || error.message || "Failed to generate website");

    } finally {

      setLoading(false);

    }

  };

  const downloadZip = async () => {

    if (!files.length) {
      alert("No files to download");
      return;
    }

    const zip = new JSZip();

    files.forEach(file => {
      zip.file(file.name, file.content);
    });

    const content = await zip.generateAsync({ type: "blob" });

    saveAs(content, "generated-website.zip");

  };

  const updateFileContent = (value) => {

    const updatedFiles = files.map((file) => {

      if (file.name === activeFile.name) {
        return { ...file, content: value };
      }

      return file;

    });

    setFiles(updatedFiles);

    const updatedActive = updatedFiles.find(
      f => f.name === activeFile.name
    );

    setActiveFile(updatedActive);

    generatePreview(updatedFiles);

  };

  const isMernProject = files.some(file =>
    file.name.includes("server.js") ||
    file.name.includes("package.json") ||
    file.name.includes("client/")
  );

  const getLanguage = (filename) => {

    if (filename.endsWith(".html")) return "html";

    if (filename.endsWith(".css")) return "css";

    if (filename.endsWith(".js")) return "javascript";

    if (filename.endsWith(".json")) return "json";

    if (filename.endsWith(".md")) return "markdown";

    return "html";

  };

  const buildFileTree = (files) => {

    const tree = {};

    files.forEach(file => {

      const parts = file.name.split("/");
      let current = tree;

      parts.forEach((part, index) => {

        if (!current[part]) {

          current[part] = index === parts.length - 1
            ? { file }
            : {};

        }

        current = current[part];

      });

    });

    return tree;

  };

  const renderTree = (node, path = "") => {

    return Object.keys(node)
      .sort((a, b) => typeof node[a] === "object" && !node[a].content ? -1 : 1)
      .map((key) => {

        const value = node[key];
        const currentPath = path ? `${path}/${key}` : key;

        if (value.file) {

          return (
            <div
              key={currentPath}
              className="file-item"
              onClick={() => setActiveFile(value.file)}
            >
              📄 {key}
            </div>
          );

        }

        return (
          <div key={currentPath} className="folder">
            📁 {key}
            <div style={{ marginLeft: "15px" }}>
              {renderTree(value, currentPath)}
            </div>
          </div>
        );

      });

  };

  return (

    <div className="container">

      <h1 className="title">
        AI Website Generator
      </h1>

      <p className="subtitle">
        Generate complete websites using AI prompts
      </p>

      <div className="input-section">

        <textarea
          className="prompt-box"
          placeholder="Example: Create a modern portfolio website with HTML, CSS and JavaScript...⚠ For best results, generate projects with fewer than 10 files.
Large full-stack projects may need to be downloaded and run locally."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          className="generate-btn"
          onClick={generateWebsite}
        >

          {loading ? "Generating..." : "Generate Website"}

        </button>

        <button
          className="download-btn"
          onClick={downloadZip}
        >
          Download ZIP
        </button>

      </div>

      <div className="workspace">

        <div className="file-explorer">

          <h3>Files</h3>

          {renderTree(buildFileTree(files))}

        </div>

        <div className="editor">

          {activeFile ? (

            <Editor
              height="400px"
              language={getLanguage(activeFile.name)}
              value={activeFile.content}
              onChange={(value) => updateFileContent(value)}
              options={{
                minimap: { enabled: false }
              }}
            />

          ) : (

            <p>Select a file to view code</p>

          )}

        </div>

        <div className="preview">

          <h3>Live Preview</h3>

          {isMernProject ? (
            <p style={{ color: "orange" }}>
              ⚠ Preview not available for MERN stack, ReactJS, NodeJS or ExpressJS projects.
              Please download the project and run it locally.

              Steps to run:

              1. Download ZIP
              2. Extract
              3. Run backend:
              npm install
              npm start

              4. Run frontend:
              cd client
              npm install
              npm start
            </p>
          ) : (
            <iframe
              title="preview"
              srcDoc={preview}
              width="100%"
              height="400px"
            />

          )}

        </div>

      </div>
      {/* Footer */}
      <footer className="footer">
        <p>
          Built for educational purposes &nbsp;·&nbsp; Not intended for commercial use
        </p>
        <p>
          Made with ❤️ by{" Yash Raut "}
          <a
            href="https://github.com/Yash-Raut0801"
            target="_blank"
            rel="noopener noreferrer"
          >
            Yash Raut
          </a>
        </p>
      </footer>

    </div>

  );

}

export default App;