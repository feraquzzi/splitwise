import React, {useState} from 'react';
import './App.css';

export default function App() {
  const [count, setCount] = useState(0);
  const [inputs, setInputs] = useState([]);
  const [splitType, setSplitType] = useState("equal split");
  const [amount, setAmount] = useState("");
  const [values, setValues] = useState([]);
  const [result, setResult] = useState([]);
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");
  const [showResult, setShowResult] = useState(false);
  

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

  function handleNoteChange(value) {
    if (value.length !== 0) {
      setNote(value);
    }
  }

  function handleTitleChange(value) {
    if (value.length !== 0) {
      setTitle(value);
    }
  }

  function handleAmountChange(value) {
    if (value.length !== 0) {
      setAmount(value);
    }
  }

  function calculateSplit(amount, people, splitType, values) {
    if (people === 0) return [];

    if (splitType === "equal split") {
      return Array(people).fill(amount / people);
    }

    if (splitType === "percentage split") {
      return values.map(v => (Number(v) / 100) * amount);
    }

    if (splitType === "custom split") {
      return values.map(v => Number(v));
    }

    return [];

    
  }

  function handleCalculate() {
    const res = calculateSplit(amount, count, splitType, values);
    setResult(res);

    if(res.length > 0) {
      setShowResult(true);
    } else {
      alert("Please enter a valid amount and ensure there is at least one participant.");
    }
     
  }

  handleNoteChange("");
  handleTitleChange("");
  handleAmountChange("");



 return (
  <div className='App'>
    {!showResult ? (
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
        note={note}
        setNote={setNote}
        title={title}
        setTitle={setTitle}
      />
    ) : (
      <SplitResult 
        result={result} 
        inputs={inputs} 
        note={note} 
        title={title} 
        amount={amount} 
        count={count} 
        splitType={splitType}
        goBack={() => setShowResult(false)}
      />
    )}
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
        ['name', 'tel'],
        { multiple: false }
      );

      if (contacts.length > 0) {
        const name = contacts[0].name?.[0];
        const phone = contacts[0].tel?.[0];

     
        if (name || phone) {
          const displayName = props.inputs[index]?.name || props.inputs[index]?.phone ||
          `Person ${index + 1}`;

          props.handleChange(index, {
            name: displayName,
            phone: phone || ""
          });
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
                value={props.title}
                onChange={(e) => props.setTitle(e.target.value)}
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
                  value={input?.name || input?.phone || `Person ${index + 1}`}
                  onChange={(e) =>
                    props.handleChange(index, {
                      ...props.inputs[index],
                      name: e.target.value
                    })
                  
                  }
                  style={{ padding: "8px", width: "200px" }}
                />

                <button onClick={() => pickContact(index)} style={{ marginLeft: "10px" }}>
                  <i class="bi bi-person-fill"></i>
                </button>

                {props.splitType !== "equal split" && (
                  <input className='expenseAmount'
                    type="number"
                    placeholder={
                      props.splitType === "percentage split" ? "%" : "Amount"
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
                className={`card ${props.splitType === "equal split" ? "active" : ""}`}
                onClick={() => props.setSplitType("equal split")}
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
                className={`card ${props.splitType === "percentage split" ? "active" : ""}`}
                onClick={() => props.setSplitType("percentage split")}
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
                className={`card ${props.splitType === "custom split" ? "active" : ""}`}
                onClick={() => props.setSplitType("custom split")}
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

      <div className="addNote">
        <i class="bi bi-pen"></i>
        <input className='noteInput'
          type="text"
          placeholder="Add a note (optional)"
          value={props.note}
          onChange={(e) => props.setNote(e.target.value)}
        />
      </div>

      <div className='createSplitButton'>
        <button onClick={props.handleCalculate}>Calculate Split</button>
      </div>
    </div>
  );
}

function SplitResult({result, inputs, note, title, amount, count, splitType, goBack}) {

  const colors = ["#1B8C4B", "#FF6B6B", "#4D96FF", "#FFC75F", "#9D4EDD"];
  const bgColors = ["rgba(27, 140, 75, 0.1)", "rgba(255, 107, 107, 0.1)", "rgba(77, 150, 255, 0.1)", "rgba(255, 199, 95, 0.1)", "rgba(157, 78, 221, 0.1)"];

  function generateMessage() {
    let message = `${title}\n`;
    message += `Total: ₦${amount}\n`;
    message += `Split Type: ${splitType}\n\n`;

    result.forEach((value, index) => {
      const name = inputs[index]?.name || `Person ${index + 1}`;
      const phone = inputs[index]?.phone || "N/A";
      message += `${name} || ${phone}: ₦${value.toFixed(2)}\n`;
    });

    if (note) {
      message += `\nNote: ${note}`;
    }

    return message;
  }

  function handleShare() {
    const message = generateMessage();

    if (navigator.share) {
      navigator.share({
        title: "Split Details",
        text: message,
      });
    } else {
      alert("Sharing not supported on this device");
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(generateMessage());
    alert("Copied!");
  }

  return (
    <div className='splitResult'>
      <div style={{
        // marginBottom: "10px !important", 
        // boxShadow:"0px 0px 20px 5px rgba(120,120,120, 0.1)",  
        paddingBottom: "20px",
        paddingTop: "20px", 
        width: "100%",
        backgroundColor: "rgba(225, 242, 232)",
        display: "flex",
        justifyContent: "space-between"
        }}>
        <div style={{display: "flex", columnGap: "15px", width: "92% !important", marginLeft: "3%"}}>
          <i class="bi bi-check-circle-fill"></i>
          <div style={{marginTop: "-5px", lineHeight: "5px"}}>
            <h2>Split Result</h2>
            <p style={{color: "rgba(100,100,100)", fontSize: "14px"}}>Here is how this expense is divided</p>
          </div>
          
        </div>
        <button onClick={goBack} style={{marginRight: "5%", border: "none", backgroundColor: "transparent"}}><i class="bi bi-arrow-left" style={{fontSize: "30px"}}></i></button>

        
      </div>

      <div className="splitSummaryTitle">
        <div style={{width: "92%", marginLeft: "4%", display: "flex", columnGap: "5px"}}>
          <i class="bi bi-pencil-square" style={{alignSelf: "center", color: "#1b8c4b", fontSize: "20px"}}></i>
          {title && (
            <p style={{ 
                fontStyle: "normal", 
                fontWeight: "bold", 
                marginBottom: "10px", 
                alignSelf: "center", 
                marginTop: "5px", 
                fontSize: "14px"
              }}>
              {title}
            </p>
          )}
        </div>
        
      </div>

      <div style={{backgroundColor: "#fff",
        marginTop:"40px !important", 
        borderBottomLeftRadius: "15px",  
        borderBottomRightRadius: "15px",
        boxShadow:"0px 0px 20px 5px rgba(120,120,120, 0.1)"
        }}>

        <div className="splitSumary">
         
          <div style={{width: "49%",
            height: "80px" ,
            display: "flex",
            flexDirection: "column",
            border: "1px solid rgba(150,150,150, 0.2)",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0px 0px 20px 5px rgba(120,120,120, 0.1)", 
            borderRadius: "10px",
            marginTop: "20px",
            marginBottom: "20px",
            }}>
            <div style={{lineHeight: "0px", display: "flex", flexDirection: "column", alignItems: "center"}}>
              <p style={{color: "rgb(100,100,100)" , fontSize: "14px"}}>Total Amount</p>
              {amount && (
                <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  {"\u20A6"}{amount}
                </p>
              )}
            </div>
           
          </div>
          <div style={{width: "49%",
            height: "80px" ,
            display: "flex",
            backgroundColor: "rgba(225, 242, 232, 0.4)",
            border: "1px solid rgba(150,150,150, 0.2)",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0px 0px 20px 5px rgba(120,120,120, 0.1)", 
            borderRadius: "10px",
            marginTop: "20px",
            marginBottom: "20px",
            }}>


            <div style={{lineHeight: "5px", display: "flex", flexDirection: "column", alignItems: "center"}}>
              <p style={{color: "rgb(100,100,100)" , fontSize: "14px"}}>People</p>
              {count && (
                <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  {count}
                </p>
              )}
            </div>
          </div>
          
          
          
        </div>
        
      </div>

      
     
      
      <div style={{ backgroundColor: "#fff", 
        width: "100%", 
        marginTop: "10px", 
        borderRadius: "10px", 
        boxShadow: "0px 0px 20px 5px rgba(120,120,120, 0.1)"
        }}>
        <div style={{width: "92%", marginLeft: "4%", paddingTop: "5px", paddingBottom: "5px", }}>
          <div style={{display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(120,120,120, 0.1)"}}>
            <p style={{alignSelf: "center" , fontWeight: "500"}}>Breakdown</p>
            <p style={{backgroundColor: "rgba(120,120,120, 0.1)", padding: "5px 10px", borderRadius: "8px"}}>{splitType}</p>
          </div>
        
          {result.map((value, index) => (
            <p key={index} style={{paddingTop: "5px", paddingBottom: "5px !important", borderBottom: "1px solid rgba(120,120,120, 0.1)"}}>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <p style={{alignSelf: "center"}}><i class="bi bi-person-fill"  style={{
                  padding:"8px 8px",
                  fontSize: "13px",
                  backgroundColor: bgColors[index % bgColors.length],
                  borderRadius: "5px",
                  color: colors[index % colors.length]   
                }}></i>{inputs[index]?.name || inputs[index]?.phone || `Person ${index + 1}`}</p> 
                <span style={{alignSelf: "center" , fontWeight: "500"}}>₦{value?.toFixed(2)}</span>
              </div>
              
            </p>
          ))}
        </div>
        
      </div>
      

      <div style={{width: "94%", marginLeft: "3%"}}>
        <p style={{fontSize: "16px", fontWeight: "500"}}>Payment Information</p>
        {note && (
          <p style={{ fontStyle: "normal", marginBottom: "10px", backgroundColor: "rgba(77, 150, 255, 0.1)", padding: "10px", borderRadius: "5px" }}>
           <i class="bi bi-info-circle"></i> {note}
          </p>
        )}
      </div>

      <div style={{width: "94%", marginLeft: "3%", display: "flex", justifyContent:"space-between", marginBottom: "20px"}}>
        <button onClick={handleShare} style={{fontSize:"16px", width: "48%", padding: "12px 0px" , backgroundColor: "#fff", borderRadius: "5px", border: "1px solid rgba(120,120,120, 0.4)"}}><i class="bi bi-whatsapp" style={{color: "rgba(27, 140, 75)"}}></i> Share</button>
        <button onClick={copyToClipboard} style={{fontSize:"16px", width: "48%", padding: "12px 0px", backgroundColor: "rgba(27, 140, 75)", color: "#fff", borderRadius: "5px", border: "1px solid rgba(120,120,120, 0.4)"}}><i class="bi bi-copy"></i> Copy details</button>
      </div>
      
    </div>
  );
}