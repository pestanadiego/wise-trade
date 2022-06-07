import { useState } from 'react';

export default function Tabs({ data }) {
  const [CurTab, setCurTab] = useState(data[0]);
  return (
    <div className="container flex items-center flex-col w-full mt-4">
      <div className="ml-2 flex w-full gap-3 pb-8 text-wise-blue uppercase text-md">
        {data.map((d) => {
          return (
            <p
              className="font-medium cursor-pointer relative"
              onClick={() => {
                if (CurTab.Id !== d.Id) setCurTab(d);
              }}
              key={d.Id}
              active={CurTab.Id === d.Id}
            >
              {d.Title}
            </p>
          );
        })}
      </div>
      <div className="p-4">{CurTab.Content}</div>
    </div>
  );
}
