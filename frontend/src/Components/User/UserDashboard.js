// src/ProblemsPage.js
import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

const problems = [
  {
    id: 1,
    name: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    description: "Find the two numbers that add up to a specific target.",
  },
  {
    id: 2,
    name: "Reverse Integer",
    difficulty: "Medium",
    category: "Array",
    description: "Reverse digits of an integer.",
  },
  {
    id: 3,
    name: "Longest Substring Without Repeating Characters",
    difficulty: "Hard",
    category: "String",
    description:
      "Find the length of the longest substring without repeating characters.",
  },
  // Add more problems as needed
];

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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState("All");

  const filteredProblems =
    selectedCategory === "All"
      ? problems
      : problems.filter((problem) => problem.category === selectedCategory);

  const handleEdit = (problem) => {
    setSelectedProblem(problem);
    setShowEditForm(true);
  };

  const handleDelete = (problemId) => {
    // Implement delete functionality
  };

  const handleCreate = () => {
    setShowCreateForm(true);
  };

  const filteredByDifficulty =
    filterDifficulty === "All"
      ? filteredProblems
      : filteredProblems.filter(
          (problem) => problem.difficulty === filterDifficulty
        );

  return (
    <div className="bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <div className="flex-1 ml-64 p-4">
          <div className="flex justify-between mb-4">
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
          <div className="grid grid-cols-1 gap-4">
            {filteredByDifficulty.map((problem) => (
              <div
                key={problem.id}
                className="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center transition-transform duration-200 transform hover:bg-gray-100"
              >
                <div>
                  <h2 className="text-xl font-bold mb-1">{problem.name}</h2>
                  <p
                    className={`text-sm ${getDifficultyClass(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Render Create/Edit forms conditionally */}
    </div>
  );
};

export default UserDashboard;
