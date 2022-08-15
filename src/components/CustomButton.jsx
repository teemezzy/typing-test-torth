import React from "react";

const CustomButton = ({btnDetails}) => {
  return (
    <div className="w-96 m-auto">
      <button className=" py-[18px] rounded-lg bg-[#6A52FD] text-white w-full">
        {btnDetails}
      </button>
    </div>
  );
};

export default CustomButton;
