import { useState } from 'react';

export default function FAQItem({ question, response }) {
  const [show, setShow] = useState(false);

  const handleClick = () => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
    }
  };

  return (
    <div className="border-b py-4">
      <div className="flex items-center ">
        <span className="flex-1">{question}</span>
        {show ? (
          <i
            onClick={handleClick}
            className="text-wise-purple fas fa-chevron-up cursor-pointer"
          />
        ) : (
          <i
            onClick={handleClick}
            className="text-wise-purple fas fa-chevron-down cursor-pointer"
          />
        )}
      </div>
      {!!show && (
        <div className="mt-3 text-wise-grey">
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
