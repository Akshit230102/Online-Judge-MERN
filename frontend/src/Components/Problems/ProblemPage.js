import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Navbar from "../Navbar/Navbar";
import MonacoEditor from "@monaco-editor/react";
import { VscRunAll } from "react-icons/vsc";

const getDifficultyClass = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-200 text-green-800";
    case "Medium":
      return "bg-yellow-200 text-yellow-800";
    case "Hard":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const defaultCode = {
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  python: 'print("Hello, World!")',
};

const ProblemPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState({});
  const [activeTab, setActiveTab] = useState("problem");
  const [language, setLanguage] = useState("cpp");
  const [activeEditorTab, setActiveEditorTab] = useState("input");
  const [bgColor, setBgColor] = useState("white");
  const [color, setColor] = useState("black");
  //const editorRef = useRef(null);
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const [verdict, setVerdict] = useState("");
  const [details, setDetails] = useState([]);
  const [verdictBgColor, setVerdictBgColor] = useState("white");
  const [verdictColor, setVerdictColor] = useState("black");

  useEffect(() => {
    axios
      .get(`http://localhost:5001/details/${id}`)
      .then((response) => {
        setProblem(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  if (!problem) {
    return <div>Loading...</div>;
  }

  {
    /*const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    if (editorRef.current) {
      const newValue = defaultCode[event.target.value];
      editorRef.current.editor.setValue(newValue);
      editorRef.current.editor.setModelLanguage(
        editorRef.current.editor.getModel(),
        event.target.value
      );
    }
  };*/
  }

  const handleRun = async () => {
    const payload = {
      language,
      code,
      input,
    };

    try {
      const { data } = await axios.post("http://localhost:8000/run", payload);
      console.log(data);
      setOutput(data.output);
      setBgColor("white");
      setColor("black");
    } catch (error) {
      // Differentiate between network errors and backend errors
      if (!error.response) {
        console.error("Network or other error:", error.message);
        setOutput(`Error: Network error or other issue.`);
        return; // Exit early for network or other errors
      }

      // Handle backend errors (including compilation and runtime errors)
      const { error: backendError, stderr } = error.response.data;
      console.error(`Backend error type: ${backendError}`);
      console.error(`Error details:\n${stderr}`);
      if (stderr == "") {
        setOutput(`Error:\nsegmentation fault`);
      } else {
        setOutput(`Error:\n${stderr}`);
      }
      setBgColor("#ffe6e6");
      setColor("#ff0000");
      {
        /*\n${backendError}*/
      }
    }
  };

  const handleRunClick = async () => {
    const wait = await handleRun();
    setActiveEditorTab("output");
  };

  const handleSubmit = async () => {
    const payload = {
      language,
      code,
      id,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:8000/submit",
        payload
      );
      if (data.verdict === "Accepted") {
        setVerdict("Accepted");
        setVerdictBgColor("#00cc00");
        setVerdictColor("#00cc00");
        setColor("white");
        setDetails(
          Array.from({ length: data.testcases }, (_, i) => `Test case ${i + 1}`)
        );
      } else if (data.verdict === "Wrong Answer") {
        setVerdict("Wrong Answer");
        setVerdictBgColor("#ff0000");
        setVerdictColor("#ff0000");
        setColor("white");
        setDetails([`Test case ${data.testcase}`]);
      } else {
        setVerdict("Error");
        setVerdictBgColor("#ffe6e6");
        setVerdictColor("#ff0000");
        setDetails([data.stderr]);
      }
    } catch (error) {
      setVerdict("Error");
      setVerdictBgColor("#ffe6e6");
      setVerdictColor("#ff0000");
      setColor('#ff0000');
      setDetails([error.response.data.stderr || "Unknown error"]);
    }
  };

  const handleSubmitClick = async () => {
    const submitWait = await handleSubmit();
    setActiveEditorTab("verdict");
  };

  return (
    <div className="min-h-screen flex flex-col overflow-y-hidden">
      <Navbar />
      <div className="flex flex-1 m-2 space-x-4">
        <div className="flex-1 bg-white p-4 rounded-lg shadow-lg overflow-y-auto max-h-screen">
          <div className="text-lg font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-4">
            <ul className="flex flex-wrap -mb-px">
              <li className="me-2">
                <a
                  href="#"
                  className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg ${
                    activeTab === "problem"
                      ? "text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500"
                      : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("problem")}
                >
                  Problem
                </a>
              </li>
              <li className="me-2">
                <a
                  href="#"
                  className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg ${
                    activeTab === "submissions"
                      ? "text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500"
                      : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("submissions")}
                >
                  My Submissions
                </a>
              </li>
              <li className="me-2">
                <a
                  href="#"
                  className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg ${
                    activeTab === "leaderboard"
                      ? "text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500"
                      : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("leaderboard")}
                >
                  Leaderboard
                </a>
              </li>
            </ul>
          </div>
          <div className="mb-8">
            {activeTab === "problem" && (
              <div>
                <h2 className="text-2xl font-bold mb-2">{problem.title}</h2>
                <div className="flex items-center mb-8">
                  <span
                    className={`px-3 py-1 rounded-full mr-2 ${getDifficultyClass(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    overflowX: "hidden",
                    overflowY: "auto",
                    wordWrap: "break-word",
                  }}
                >
                  <ReactMarkdown className="prose">
                    {problem.description}
                  </ReactMarkdown>
                </div>
              </div>
            )}
            {activeTab === "submissions" && (
              <div>
                <h2 className="text-xl font-bold mb-2">My Submissions</h2>
                {/* Add your submissions component here */}
              </div>
            )}
            {activeTab === "leaderboard" && (
              <div>
                <h2 className="text-xl font-bold mb-2">Leaderboard</h2>
                {/* Add your leaderboard component here */}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 bg-white p-4 rounded-lg shadow-lg overflow-y-auto max-h-screen flex flex-col">
          <div className="flex items-center mb-2">
            <label htmlFor="language" className="mr-2 font-medium">
              Language:
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-gray-300 rounded p-2"
            >
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>
          <MonacoEditor
            //ref={editorRef}
            width="100%"
            height="100%"
            language={language}
            theme="vs-dark"
            //value={defaultCode[language]}
            value={code}
            onChange={(code) => setCode(code)}
            options={{
              selectOnLineNumbers: true,
              automaticLayout: true,
              minimap: { enabled: false },
            }}
          />
          <div className="mt-4">
            <ul className="flex border-b mb-4">
              <li className="mr-2">
                <button
                  className={`inline-block py-2 px-4 ${
                    activeEditorTab === "input"
                      ? "border-l border-t border-r rounded-t"
                      : "text-black-500 hover:text-black-800"
                  }`}
                  onClick={() => setActiveEditorTab("input")}
                >
                  Input
                </button>
              </li>
              <li className="mr-2">
                <button
                  className={`inline-block py-2 px-4 ${
                    activeEditorTab === "output"
                      ? "border-l border-t border-r rounded-t"
                      : "text-black-500 hover:text-black-800"
                  }`}
                  onClick={() => setActiveEditorTab("output")}
                >
                  Output
                </button>
              </li>
              <li className="mr-2">
                {" "}
                {/* Added new Verdict tab */}
                <button
                  className={`inline-block py-2 px-4 ${
                    activeEditorTab === "verdict"
                      ? "border-l border-t border-r rounded-t"
                      : "text-black-500 hover:text-black-800"
                  }`}
                  onClick={() => setActiveEditorTab("verdict")}
                >
                  Verdict
                </button>
              </li>
            </ul>
            <div>
              {activeEditorTab === "input" && (
                <textarea
                  className="w-full border p-2 rounded mb-4"
                  rows="4"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  style={{ height: "100px" }}
                />
              )}
              {activeEditorTab === "output" && (
                <div
                  className="w-full border p-2 rounded mb-4 min-h-[4rem]"
                  style={{
                    backgroundColor: bgColor,
                    color: color,
                    height: "100px",
                    overflowY: "auto",
                    maxHeight: "100px",
                  }}
                >
                  {output.split("\n").map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              )}
              {activeEditorTab === "verdict" && ( // Added Verdict section
                <div
                  className="w-full border p-2 rounded mb-4 min-h-[4rem]"
                  style={{
                    backgroundColor: bgColor,
                    color: color,
                    height: "100px",
                    overflowY: "auto",
                    maxHeight: "100px",
                  }}
                >
                  <h1 style={{ fontWeight: 'bold' , fontSize: '20px' , color: verdictColor , marginBottom: '20px' }}>{verdict}</h1>
                  <ul>
                    {details.map((detail, index) => (
                      <li
                        key={index}
                        style={{
                          backgroundColor: verdictBgColor,
                          color: {color},
                          borderRadius: "8px",
                          padding: "5px",
                          marginRight: "10px",
                          marginBottom: "10px",
                          display: 'inline-block',
                          wordWrap: 'break-word'
                        }}
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex space-x-2">
                <button
                  className="flex-1 bg-green-500 hover:bg-green-400 text-white p-2 rounded"
                  onClick={handleRunClick}
                >
                  Run
                </button>
                <button
                  className="flex-1 bg-black hover:bg-gray-800 text-white p-2 rounded"
                  onClick={handleSubmitClick}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
