import React, { useEffect, useState } from "react";

export default function App() {

  const [advice, setAdvice] = useState("");
  const [count, setCount] = useState(0);

  async function getAdvice() {
    const res = await fetch("https://api.adviceslip.com/advice");
    const data = await res.json();
    setAdvice(data.slip.advice);
    setCount((c) => c + 1);
  }

  //i want this to show first after launching this page
  useEffect(function (){
    getAdvice();
  }, [])

  return (
    <div>
      <h1>{advice}</h1>
      <button onClick={getAdvice}>Get Advice</button>
      <Message count={count}/>
    </div>
  );
}

function Message(props){
  return (
    <p>You have read <strong>{props.count}</strong> pieces of advices</p>
  );
}
