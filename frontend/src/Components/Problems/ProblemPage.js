import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Navbar from "../Navbar/Navbar";
import MonacoEditor from "@monaco-editor/react";
import LoadingSpinner from "./LoadingSpinner";
import { VscRunAll } from "react-icons/vsc";
import { FaCode } from "react-icons/fa6";
import { getToken } from "../../Utils/helpers";
import { jwtDecode } from "jwt-decode";

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
  const [isLoading, setIsLoading] = useState(false);

  const [submissions, setSubmissions] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [showModal, setShowModal] = useState(false);

  const token = getToken(); // Assuming you have a function to get the token
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/details/${id}`)
      .then((response) => {
        setProblem(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  // if (!problem) {
  //   return <div>Loading...</div>;
  // }

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

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/getsubmissions`,
          {
            params: { userId: userId, problemId: id },
          }
        );
        setSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };

    fetchSubmissions();
  }, [id, userId]);

  const handleRun = async () => {
    const payload = {
      language,
      code,
      input,
    };
  
    try {
      const { data } = await axios.post("http://localhost:8000/run", payload);
      if (data.error === "Time Limit Exceeded") {
        setVerdict("");
        setOutput("Time Limit Exceeded");
        setColor("#ff0000");
      } else {
        setOutput(data.output);
        setVerdict("");
        setBgColor("white");
        setColor("black");
      }
    } catch (error) {
      if (!error.response) {
        console.error("Network or other error:", error.message);
        setOutput(`Error: Network error or other issue.`);
        return;
      }
      const { error: backendError, stderr } = error.response.data;
      console.error(`Backend error type: ${backendError}`);
      console.error(`Error details:\n${stderr}`);
      if (stderr == "") {
        setOutput(`Error:\nsegmentation fault`);
        setVerdict("");
      } else {
        setOutput(`Error:\n${stderr}`);
        setVerdict("");
      }
      setBgColor("#ffe6e6");
      setColor("#ff0000");
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
      const { data } = await axios.post("http://localhost:8000/submit", payload);
      setBgColor('white');
      if (data.verdict === "Accepted") {
        setVerdict(data.verdict);
        setOutput("");
        setVerdictBgColor("#00cc00");
        setVerdictColor("#00cc00");
        setColor("white");
        setDetails(
          Array.from({ length: data.testcases }, (_, i) => `Test case ${i + 1}`)
        );
      } else if (data.verdict === "Wrong Answer") {
        setVerdict(data.verdict);
        setOutput("");
        setVerdictBgColor("#ff0000");
        setVerdictColor("#ff0000");
        setColor("white");
        setDetails([`Test case ${data.testcase}`]);
      } else if (data.verdict === "Time Limit Exceeded") {
        setVerdict(data.verdict);
        setOutput("");
        setVerdictBgColor("#ff0000");
        setVerdictColor("#ff0000");
        setColor("white");
        setDetails([`Test case ${data.testcase}`]);
      } else {
        setVerdict("Error");
        setOutput("");
        setVerdictBgColor("#ffe6e6");
        setVerdictColor("#ff0000");
        setDetails([data.stderr]);
      }

      try{
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/submissions`,
          {
            userId: userId,
            code: payload.code,
            verdict: data.verdict,
            problemId: payload.id,
          },
          { withCredentials: true }
        );
      } catch(error){
        console.log("Verdict:", verdict);
        console.log(error);
      }


    } catch (error) {
      setVerdict("Error");
      setOutput("");
      setVerdictBgColor("#ffe6e6");
      setVerdictColor("#ff0000");
      setColor('#ff0000');
      setDetails([error.response.data.stderr || "Unknown error"]);
    }
    finally {
      setIsLoading(false); // Set loading to false after verdict is generated
    }
  };
  

  const handleSubmitClick = async () => {
    setActiveEditorTab("verdict");
    setIsLoading(true);
    const submitWait = await handleSubmit();
  };

  const handleCodeClick = (code) => {
    setSelectedCode(code);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-y-hidden">
      <Navbar fixed={false}/>
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
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-black text-white">
                      <th className="px-4 py-2 border border-gray-300 w-300">
                        Verdict
                      </th>
                      <th className="px-4 py-2 border border-gray-300 w-32">
                        Code
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.codes &&
                      submissions.codes.map((code, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="px-4 py-2 border border-gray-300">
                            {submissions.verdicts[index]}
                          </td>
                          <td className="px-4 py-2 border border-gray-300 w-32">
                            <button
                              className="bg-red-500 text-white px-2 py-2 rounded flex items-center justify-center"
                              onClick={() => handleCodeClick(code)}
                            >
                              <FaCode />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {showModal && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-3xl">
                      <span
                        className="close text-black cursor-pointer float-right text-2xl"
                        onClick={() => setShowModal(false)}
                      >
                        &times;
                      </span>
                      <textarea
                        readOnly
                        value={selectedCode}
                        className="w-full h-64 p-2 border border-gray-300 rounded mt-4"
                      />
                    </div>
                  </div>
                )}
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
              {activeEditorTab === "verdict" && (
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
          {isLoading ? (
            <LoadingSpinner /> // Show spinner while loading
          ) : (
            <>
              <h1
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: verdictColor,
                  marginBottom: "20px",
                }}
              >
                {verdict}
              </h1>
              <ul>
                {details.map((detail, index) => (
                  <li
                    key={index}
                    style={{
                      backgroundColor: verdictBgColor,
                      color: color,
                      borderRadius: "8px",
                      padding: "5px",
                      marginRight: "10px",
                      marginBottom: "10px",
                      display: "inline-block",
                      wordWrap: "break-word",
                    }}
                  >
                    {detail}
                  </li>
                ))}
              </ul>
            </>
          )}
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
