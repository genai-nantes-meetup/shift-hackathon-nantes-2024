import React, { useState } from "react";

interface InputSearchProps {
    onSearch: (search: string) => void;
}

const InputSearch: React.FC<InputSearchProps> = ({ onSearch }) => {
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSearchClick = () => {
        const urlPattern = new RegExp(
            "^(https?:\\/\\/|www\\.)" +
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // optional port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // optional query string
            "(\\#[-a-z\\d_]*)?$", "i" // optional fragment locator  
        );

        if (inputValue.trim() === "") {
            setError(true);
            setErrorMessage("Please enter your website");
        } else if (!urlPattern.test(inputValue)) {
            setError(true);
            setErrorMessage("Please enter a valid website");
        } else {
            setError(false);
            setErrorMessage("");
            onSearch(inputValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    return (
        <div className="flex flex-col items-center text-center justify-center">
            <h1 className="text-5xl text-center">MapUrValue</h1>
            <h1 className="text-5xl text-center text-graySmooth mt-6">Map tech competitors</h1>
            <p className="text-graySmallTitle text-sm mt-4">Instant market insights empowered by AI</p>
            <div className="flex w-full justify-center space-x-2 mt-20">
                <div className="relative w-3/5">
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-gradientStart to-gradientEnd p-search ${error ? 'p-0' : ''}`}></div>
                    <div className={`relative flex items-center w-full bg-gray rounded-full text-grayText px-4 py-2 ${error ? 'border border-red' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="21" viewBox="0 0 19 21" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M6.78703 4.25721C7.05423 3.47432 8.18806 3.4743 8.45526 4.25721L8.51223 4.42411C9.44988 7.17146 11.6572 9.3273 14.4702 10.2431L14.6411 10.2987C15.4427 10.5597 15.4427 11.6671 14.6411 11.928L14.4702 11.9837C11.6572 12.8994 9.44988 15.0553 8.51223 17.8026L8.45526 17.9695C8.18807 18.7524 7.05423 18.7524 6.78703 17.9695L6.73006 17.8026C5.79241 15.0553 3.58507 12.8994 0.772093 11.9837L0.601197 11.928C-0.200387 11.6671 -0.20041 10.5597 0.601196 10.2987L0.772091 10.2431C3.58506 9.3273 5.79241 7.17146 6.73006 4.42412L6.78703 4.25721Z"
                                  fill="#808080"/>
                            <path
                                d="M15.1965 0.40051C15.3988 -0.133504 16.1721 -0.133503 16.3745 0.400511L16.8726 1.71535C16.9362 1.88324 17.0718 2.01561 17.2437 2.07774L18.5899 2.56427C19.1367 2.76187 19.1367 3.51717 18.5899 3.71478L17.2437 4.20131C17.0718 4.26344 16.9362 4.39581 16.8726 4.5637L16.3745 5.87854C16.1721 6.41255 15.3988 6.41255 15.1965 5.87854L14.6983 4.5637C14.6347 4.39581 14.4992 4.26344 14.3273 4.20131L12.981 3.71478C12.4343 3.51717 12.4343 2.76187 12.981 2.56427L14.3273 2.07774C14.4992 2.01561 14.6347 1.88324 14.6983 1.71535L15.1965 0.40051Z"
                                fill="#808080"/>
                            <path
                                d="M14.5685 16.3482C14.7708 15.8142 15.5441 15.8142 15.7464 16.3482L16.075 17.2153C16.1386 17.3832 16.2741 17.5156 16.446 17.5777L17.3339 17.8986C17.8806 18.0962 17.8806 18.8515 17.3339 19.0491L16.446 19.37C16.2741 19.4321 16.1386 19.5645 16.075 19.7324L15.7464 20.5995C15.5441 21.1335 14.7708 21.1335 14.5685 20.5995L14.2399 19.7324C14.1763 19.5645 14.0408 19.4321 13.8689 19.37L12.981 19.0491C12.4343 18.8515 12.4343 18.0962 12.981 17.8986L13.8689 17.5777C14.0408 17.5156 14.1763 17.3832 14.2399 17.2153L14.5685 16.3482Z"
                                fill="#808080"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="www.product.ia"
                            className="bg-gray ml-4 flex-grow focus:outline-none"
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                if (error) {
                                    setError(false);
                                    setErrorMessage("");
                                }
                            }}
                            onKeyDown={handleKeyDown}/>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="28"
                            height="28"
                            color="gray"
                            fill="none"
                            className="cursor-pointer"
                            onClick={handleSearchClick}>
                            <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                            <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor"
                                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>
            {error && <span className="text-red text-sm w-full mt-4">{errorMessage}</span>}
        </div>
    );
};

export default InputSearch;
