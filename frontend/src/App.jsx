import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const TextBox = (props) => {
  return (<div className='border-2 border-gray-400 w-3/5 rounded mx-auto mt-20 mb-16 text-white'>
    <p className='ml-3 mt-3'>
      Review
    </p>
    <div className='mx-auto border-t-2 border-gray-600 p-4 font-mono' dangerouslySetInnerHTML={{ __html: props.html }}></div>
  </div>);
}

function App() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    console.log("file change provoked");
    setFile(event.target.files[0]);
  }

  const handleSubmit = async (event) => {
    setMessage('Reviewing your resume...')
    console.log('submit provoked');
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    const response_ = await axios.post('http://localhost:5000/upload', formData);
    const data = {
      mode: 'markdown',
      text: response_.data['response']
    }
    console.log(response_.data['response'])
    const html = await axios.post('https://api.github.com/markdown', data);
    setResponse(html.data);
  }

  return (
    <div className="App flex flex-col mt-32">
      <div className="title flex justify-center items-center">
        <div>
          <h7 className='text-5xl font-bold title'>Resume Reviewer</h7>

          <form className='mt-5'>
            <label htmlFor="file-upload" className="block text-gray-300 font-bold mb-2">
              Choose a file to upload:
            </label>
            <input
              id="file-upload"
              type="file"
              name="file"
              className="mb-4 text-gray-300"
              onChange={handleFileChange}
            />
            <button
              className="bg-transparent border-2 border-white hover:bg-gray-200 hover:text-black text-white font-bold py-2 px-4 rounded-lg"
              onClick={handleSubmit}
            >
              Upload
            </button>
          </form>
        </div>
      </div>

      {response !== null ? <TextBox html={response} /> : <p className='text-center mt-20 text-white'>{message}</p>}
    </div>
  )
}

export default App