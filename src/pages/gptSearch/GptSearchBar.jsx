import React from "react";
import { useSelector } from "react-redux";
import lang from "../../utils/languagesConstants";

const GptSearchBar = () => {
  const selectedLang = useSelector((store) => store.config.lang);
  console.log(selectedLang);
  return (
    <div className="flex justify-center pt-[10%]">
      <form className="w-6/12 p-1 bg-black rounded-lg grid grid-cols-12">
        <input
          type="text"
          placeholder={lang[selectedLang]?.gptSearchPlaceHolder}
          className="p-4 m-2 bg-white col-span-10 rounded-lg"
        />
        <button className="bg-red-700 m-2 text-white rounded-lg col-span-2">
          {lang[selectedLang]?.search}
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
