import React from "react";

const SlideContent = ({ title, content }) => (
  <div className="mb-6">
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p>{content}</p>
  </div>
);

export default SlideContent;