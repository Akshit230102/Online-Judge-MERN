// src/ProblemsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

const getDifficultyClass = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return "text-green-500";
    case "Medium":
      return "text-yellow-500";
    case "Hard":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const UserDashboard = () => {
  const [problems, setProblems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/problems`)
      .then((response) => {
        setProblems(response.data);
        console.log(problems);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const filteredProblems =
    selectedCategory === "All"
      ? problems
      : problems.filter((problem) => problem.category === selectedCategory);

  const filteredByDifficulty =
    filterDifficulty === "All"
      ? filteredProblems
      : filteredProblems.filter(
          (problem) => problem.difficulty === filterDifficulty
        );

  return (
    <div className="bg-gray-200 min-h-screen">
      <Navbar fixed={true}/>
      <div className="flex pt-14">
        <Sidebar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <div className="flex-1 ml-64 p-4 overflow-y-auto">
          <div className="flex justify-between mb-4">
            <div className="flex space-x-4">
              <select
                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md"
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
              >
                <option value="All">Sort By</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {filteredByDifficulty.map((problem) => (
              <Link
                key={problem._id}
                to={`/problems/${problem._id}`}
                className="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center transition-transform duration-200 transform hover:bg-gray-100"
              >
                <div>
                  <h2 className="text-xl font-bold mb-1">{problem.title}</h2>
                  <p
                    className={`text-sm ${getDifficultyClass(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;