import React, { useState } from 'react';
import axios from 'axios';

const CodeSubmission = ({ language, code, problemId }) => {
  const [verdict, setVerdict] = useState('');
  const [details, setDetails] = useState([]);
  const [verdictBgColor, setVerdictBgColor] = useState('white');
  const [verdictColor, setVerdictColor] = useState('black');

  const handleSubmit = async () => {
    const payload = {
      language,
      code,
      problemId,
    };

    try {
      const { data } = await axios.post('http://localhost:8000/submit', payload);
      if (data.verdict === 'Accepted') {
        setVerdict('Accepted');
        setVerdictBgColor('#e6ffe6');
        setVerdictColor('#00cc00');
        setDetails(Array.from({ length: data.testcases }, (_, i) => `Test case ${i + 1}`));
      } else if (data.verdict === 'Wrong Answer') {
        setVerdict('Wrong Answer');
        setVerdictBgColor('#ffe6e6');
        setVerdictColor('#ff0000');
        setDetails([`Test case ${data.testcase}`]);
      } else {
        setVerdict('Error');
        setVerdictBgColor('#ffe6e6');
        setVerdictColor('#ff0000');
        setDetails([data.stderr]);
      }
    } catch (error) {
      setVerdict('Error');
      setVerdictBgColor('#ffe6e6');
      setVerdictColor('#ff0000');
      setDetails([error.response.data.stderr || 'Unknown error']);
    }
  };

  return (
    <div>
      <button className="flex-1 bg-blue-500 text-white p-2 rounded" onClick={handleSubmit}>
        Submit
      </button>
      <div style={{ backgroundColor: verdictBgColor, color: verdictColor, padding: '1rem', marginTop: '1rem' }}>
        <h2>{verdict}</h2>
        <div>
          {details.map((detail, index) => (
            <div
              key={index}
              style={{
                backgroundColor: verdict === 'Accepted' ? 'green' : 'red',
                verdictColor: 'white',
                padding: '0.5rem',
                borderRadius: '9999px',
                margin: '0.5rem 0',
                display: 'inline-block',
              }}
            >
              {detail}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeSubmission;
