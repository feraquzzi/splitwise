import React, {useState} from 'react';
import './App.css';

export default function App() {
  const [count, setCount] = useState(0);
  const [inputs, setInputs] = useState([]);
  const [splitType, setSplitType] = useState("equal");
  const [amount, setAmount] = useState(0);
  const [values, setValues] = useState([]);
  const [result, setResult] = useState([]);
  

  function increasePeople() {
    setCount((c) => c + 1);
    setInputs([...inputs, ""]);   
    setValues([...values, ""]);   
  }

  function reducePeople() {
    if (count > 0) {
      setCount((c) => c - 1);
      setInputs((prev) => prev.slice(0, -1));
      setValues((prev) => prev.slice(0, -1));
    }
  }

  function handleChange(index, value){
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  function handleValueChange(index, value) {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  }

  function calculateSplit(amount, people, splitType, values) {
    if (people === 0) return [];

    if (splitType === "equal") {
      return Array(people).fill(amount / people);
    }

    if (splitType === "percentage") {
      return values.map(v => (Number(v) / 100) * amount);
    }

    if (splitType === "custom") {
      return values.map(v => Number(v));
    }

    return [];
  }

  function handleCalculate() {
    const res = calculateSplit(amount, count, splitType, values);
    setResult(res);
  }



  return(
    <div className='App'>
      <CreateSplit 
        count={count} 
        increasePeople={increasePeople} 
        reducePeople={reducePeople} 
        handleChange={handleChange}
        inputs={inputs}
        splitType={splitType}
        setSplitType={setSplitType}
        amount={amount}
        setAmount={setAmount}
        values={values}
        handleValueChange={handleValueChange}
        calculateSplit={calculateSplit}
        result={result}
        handleCalculate={handleCalculate}
        
      />
      <SplitResult result={result} inputs={inputs} />
    </div>
  );
}


function CreateSplit(props) {

  async function pickContact(index) {
    try {
      if (!('contacts' in navigator) || !('select' in navigator.contacts)) {
        alert("Contact Picker API not supported on this device");
        return;
      }

      const contacts = await navigator.contacts.select(
        ['tel'],
        { multiple: false }
      );

      if (contacts.length > 0) {
        const phone = contacts[0].tel?.[0];

        if (phone) {
          props.handleChange(index, phone);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  
  return(
    <div className='createSplit'>
      <div style={{
          marginBottom: "10px !important", 
          boxShadow:"0px 0px 20px 5px rgba(120,120,120, 0.1)",  
          paddingBottom: "20px", 
          paddingTop: "20px", 
          width: "100%"
        }}>
        <div style={{display: "flex", columnGap: "15px", width: "92% !important", marginLeft: "3%" }}>
          <i class="bi bi-calendar3"></i>
          <div style={{marginTop: "-5px", lineHeight: "5px"}}>
            <h2>Create New Split</h2>
            <p>Add an expense, enter the number of people,</p>
            <p>and split it your way</p>
          </div>
        </div>
       
      </div>

      <div className='all'>
        
        <div style={{
          marginBottom: "20px",
          boxShadow:"0px 0px 20px 5px rgba(120,120,120, 0.1)",  
          border: "1px solid rgba(120,120,120, 0.1)",
          paddingBottom: "20px", 
          paddingTop: "20px",
          width: "94%",
          marginLeft: "3%",
          backgroundColor: "rgba(225, 242, 232, 0.4)",
          borderRadius: "10px"
        }}>
          <div className="expensedetails">
            <div className="expenseHeader" style={{ display: "flex",  columnGap: "10px"}}>
              <i class="bi bi-1-square-fill"></i> 
              <h4 style={{marginTop: "7px", color: "#000"}}>Expense Details</h4>
            </div>

            <p style={{color: "#000"}}>Expense Title</p>

            <div className="expenseFields">
              <i class="bi bi-calendar2-week-fill"></i>
              <input type="text"  
                className='expenseAmount'
              />
            </div>
            

            <p style={{color: "#000"}}>Total Amount</p>
            <div className="expenseFields">
              <img src="/naira.svg" alt="Naira symbol" className="nairaIcon"/>
              <input type="number"  
                className='expenseAmount'
                value={props.amount}
                onChange={(e) => props.setAmount(Number(e.target.value))}
              />
            </div>
            
          </div>
        </div>
        
        <div style={{width: "92%", marginLeft: "4%"}}>
          <div className="expenseHeader" style={{ display: "flex",  columnGap: "10px", marginTop: "40px" ,}}>
            <i class="bi bi-2-square-fill"></i> 
            <h4 style={{marginTop: "7px"}}>Add Participants</h4>
          </div>
        
          <p>Number of people.</p>
          <div className = "people">
            
            <div className="addPeople">
              <button onClick={props.reducePeople}>-</button>
              <input type="text" 
                value={props.count}
                readOnly
              />
              <button onClick={props.increasePeople}>+</button>
            </div>

            <p>Add the phone number of people sharing this expense</p>
          </div>

          
          <div className="peopleName">
            {props.inputs.map((input, index) => (
              <div key={index} className="peopleNameInput" style={{ marginBottom: "10px" }}>

                <input 
                  type="text"
                  placeholder={`Person ${index + 1}`}
                  value={input}
                  onChange={(e) => props.handleChange(index, e.target.value)}
                  style={{ padding: "8px", width: "200px" }}
                />

                <button onClick={() => pickContact(index)} style={{ marginLeft: "10px" }}>
                  <i class="bi bi-person-fill"></i>
                </button>

                {props.splitType !== "equal" && (
                  <input className='expenseAmount'
                    type="number"
                    placeholder={
                      props.splitType === "percentage" ? "%" : "Amount"
                    }
                    value={props.values[index] || ""}
                    onChange={(e) =>
                      props.handleValueChange(index, e.target.value)
                    }
                    style={{
                      padding: "8px",
                      width: "100px",
                      marginTop: "10px",
                      border: "2px solid rgba(27, 140, 75, 0.2)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        

        <div className="splitType">
          <div className="expenseHeader" style={{ display: "flex",  columnGap: "10px", marginTop: "40px" }}>
            <i class="bi bi-3-square-fill"></i> 
            <h4 style={{marginTop: "7px"}}>Split Type</h4>
          </div>
          
          <p>How should we split this?</p>
          <div className="splitTypeOptions">
            <div className="cardContainer">
              <div
                className={`card ${props.splitType === "equal" ? "active" : ""}`}
                onClick={() => props.setSplitType("equal")}
              >
                
                <div className="cardTextSplitType">
                  <i class="bi bi-diagram-3"></i>
                  <div>
                    <p className="splitTitle">Equal Split</p>
                    <p className="smallText">Everyone pays the same amount</p>
                  </div> 
                  
                </div>
                
              </div>

              <div
                className={`card ${props.splitType === "percentage" ? "active" : ""}`}
                onClick={() => props.setSplitType("percentage")}
              >
                
                <div className="cardTextSplitType">
                  <i class="bi bi-percent"></i> 
                  <div> 
                    <p className="splitTitle">Percentage</p>
                    <p className="smallText">Split by percentage </p>
                  </div>
                  
                </div>
               
              </div>

              <div
                className={`card ${props.splitType === "custom" ? "active" : ""}`}
                onClick={() => props.setSplitType("custom")}
              >
                 
                <div className="cardTextSplitType">
                  <i class="bi bi-pen"></i>
                  <div>
                    <p className="splitTitle">Custom</p>
                    <p className="smallText">Set different amounts</p>
                  </div>
                  
                </div>
                
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className='createSplitButton'>
        <button onClick={props.handleCalculate}>Calculate Split</button>
      </div>
    </div>
  );
}

function SplitResult({result, inputs }) {
  return (
    <div className='splitResult'>
      <h1>Split Result</h1>

      {result.map((value, index) => (
        <p key={index}>
          {inputs[index] || `Person ${index + 1}`} : ₦{value?.toFixed(2)}
        </p>
      ))}
    </div>
  );
}