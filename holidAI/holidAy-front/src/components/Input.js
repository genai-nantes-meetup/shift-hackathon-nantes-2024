import React, { useState, useEffect } from 'react';
import { ReactComponent as DocumentPlusIcon } from '../public/icons/document-plus.svg';
import { ReactComponent as PaperAirplaneIcon } from '../public/icons/paper-airplane.svg';
import { FaRegFilePdf } from "react-icons/fa";

const Input = ({ prompt, setPrompt, file, setFile, handleSubmit }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
    }
  };

  useEffect(() => {
    // Clear preview URL if file is removed
    if (!file) {
      setPreviewUrl(null);
    }
  }, [file]);

  return (
    <div className='w-full flex flex-wrap flex-row'>
      <div className='w-full flex flex-row flex-wrap'>
        {file && (
          <div className='w-auto flex justify-items-start pl-4 pt-2'>
            {file.type === 'application/pdf' ? (
              <div className='w-10 h-auto'>  
                <FaRegFilePdf className='w-auto h-12' />
              </div>
            ) : (
              <img src={previewUrl} alt="Preview" className="w-auto h-12 rounded-md" />
            )}
          </div>
        )}
      </div>
      <form onSubmit={(e) => handleSubmit(e, file)} className="w-full flex items-center lg:p-4 p-0 rounded-b-xl flex-wrap lg:mb-0 mb-16">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type something"
          className="flex-grow bg-secondary text-white rounded-l-lg px-4 py-2 text-sm focus:outline-none border-none h-full"
          disabled={!!file}
        />
        <div className='bg-secondary flex rounded-r-lg border-l-2 border-secondary-dark px-2'>
          <label htmlFor="file-input" className="mx-2 my-2 border rounded-lg hover:border-primary-purple border-opacity-50 cursor-pointer">
            <DocumentPlusIcon className='text-gray-400 h-6 mx-4 my-2'/>
            <input id="file-input" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} style={{ display: 'none' }} disabled={prompt !== ''} />
          </label>
          <button type="submit" className="mx-2 my-2 rounded-lg bg-primary-purple hover:bg-opacity-50">
            <PaperAirplaneIcon className='text-gray-400 h-6 mx-4 my-2'/>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Input;
