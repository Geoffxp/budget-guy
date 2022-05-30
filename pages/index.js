import { useEffect, useRef, useState } from 'react';

const selectValues = [
  {name:"Monthly", multiplier: 1},
  {name:"Bi-weekly", multiplier: 2},
  {name:"Weekly", multiplier: 4.333}
]

export default function Home() {
  const alerts = useRef();
  const [loaded, setLoaded] = useState(false)
  const [schema, setSchema] = useState({
    incomes: [
      {
        name: "Income Name",
        amount: 100,
        interval: 1
      }
    ],
    expenses: [
      {
        name: "Expense Name",
        amount: 100,
        interval: 1
      }
    ]
  })
  useEffect(() => {
    const existingBudget = localStorage.getItem("budget");
    if (existingBudget) setSchema(JSON.parse(existingBudget));
    setLoaded(true);
  }, [])
  const [eTotal, setETotal] = useState(0);
  const [iTotal, setITotal] = useState(0);

  const addItem = (e, type) => {
      setSchema({
        ...schema,
        [type]: [
          ...schema[type],
          {
            name: "Name",
            amount: 100,
            interval: 1
          }
        ]
      })
  }
  const removeItem = (type, index) => {
      setSchema({
        ...schema,
        [type]: schema[type].filter((thing, i) => i !== index)
      })
  }
  const handleChange = (e, type, index, isNumber) => {
    const updated = schema[type].map((val, i) => {
      if (index === i) {
        if (isNumber && !isNaN(e.target.value)) {
          return {
            ...schema[type][i],
            [e.target.name]: e.target.value
          }
        } else if (isNumber) {
          return {
            ...schema[type][i]
          }
        } else {
          return {
            ...schema[type][i],
            [e.target.name]: e.target.value
          }
        }
      }
      return val
    })
    setSchema({
      ...schema,
      [type]: updated
    })
  }
  const changeInterval = (e, type, index) => {
    const updated = schema[type].map((val, i) => {
      if (i === index) {
        return {
          ...schema[type][i],
          interval: e.target.value
        }
      }
      return val
    })
    setSchema({
      ...schema,
      [type]: updated
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let json;
    try {
      json = JSON.parse(e.target['jsonIn'].value);
      if (json && json.expenses && json.incomes && Array.isArray(json.incomes) && Array.isArray(json.expenses)) {
        setSchema(JSON.parse(e.target['jsonIn'].value));
      } else {
        sendAlert("INVALID SCHEMA");
      }
    } catch(err) {
      sendAlert("INVALID JSON");
    }
  }
  const setHeight = (e) => {
    const maxHeight = e.target.parentNode.scrollHeight + "px"
    if (e.target.parentNode.style.maxHeight !== maxHeight) {
      e.target.parentNode.style.maxHeight = maxHeight
    } else {
      e.target.parentNode.style.maxHeight = "20px"
    }
  }
  const sendAlert = (alert) => {
    navigator.clipboard.writeText(JSON.stringify(schema))
    alerts.current.innerHTML = `<h3>${alert}</h3>`;
    alerts.current.classList.add("alerting");
    setTimeout(() => {
      alerts.current.classList.remove("alerting");
    }, 3000)
  }

  useEffect(() => {
    setETotal(schema.expenses.reduce((acc, cur) => {
      if (cur.amount) {
        return acc += parseInt(cur.amount) * cur.interval
      } else {
        return acc += 0
      }
    }, 0))
    setITotal(schema.incomes.reduce((acc, cur) => {
      if (cur.amount) {
        return acc += parseInt(cur.amount) * cur.interval
      } else {
        return acc += 0
      }
    }, 0))
    if (loaded) {
      localStorage.setItem("budget", JSON.stringify(schema));
    }
  }, [schema])
  return (
    <main>
      <div ref={alerts} className="alert"></div>
      <h1>BUDGET GUY</h1>
      <div className="json-input">
        <button type="button" onClick={() => sendAlert("COPIED TO CLIPBOARD")}>COPY JSON</button>
        <form style={{ maxHeight: "20px", overflow: "hidden" }} onSubmit={handleSubmit}>
          <label onClick={setHeight} htmlFor="jsonIn">INPUT JSON?</label>
          <input type="text" id="jsonIn" name="jsonIn" />
          <button type="submit">SUBMIT</button>
        </form>
      </div>
      <section className="breakdown">
        <div className="income">
          <h2>INCOMES</h2>
          <ul className="income-box">
            {schema.incomes && schema.incomes.map((inc, index) => (
              <li key={index}>
                <input
                  type="text"
                  onClick={({ target }) => target.setSelectionRange(0, target.value.length)}
                  onChange={(e) => handleChange(e, "incomes", index)}
                  name="name"
                  value={inc.name}
                />
                <input
                  type="text"
                  pattern="[0-9]+"
                  onClick={({ target }) => target.setSelectionRange(0, target.value.length)}
                  onChange={(e) => handleChange(e, "incomes", index, true)}
                  name="amount"
                  value={inc.amount}
                />
                <select value={inc.interval} onChange={(e) => changeInterval(e, "incomes", index)}>
                  {selectValues.map((v, i) => <option key={v.name} value={v.multiplier}>{v.name}</option>)}
                </select>
                <button
                  className="remove"
                  onClick={() => removeItem("incomes", index)}
                >-</button>
              </li>
            ))}
          </ul>
          <h3>Total: {iTotal.toFixed(2)}</h3>
          <button className="add" onClick={(e) => addItem(e, "incomes")}>ADD INCOME</button>
        </div>
        <div className="expenses">
          <h2>EXPENSES</h2>
          <ul className="expense-box">
            {schema.expenses && schema.expenses.map((exp, index) => (
              <li key={index}>
                <input
                  type="text"
                  onClick={({ target }) => target.setSelectionRange(0, target.value.length)}
                  onChange={(e) => handleChange(e, "expenses", index)}
                  name="name"
                  value={exp.name}
                />
                <input
                  type="text"
                  pattern="[0-9]+"
                  onClick={({ target }) => target.setSelectionRange(0, target.value.length)}
                  onChange={(e) => handleChange(e, "expenses", index, true)}
                  name="amount"
                  value={exp.amount}
                />
                <select value={exp.interval} onChange={(e) => changeInterval(e, "expenses", index)}>
                  {selectValues.map((v, i) => <option key={v.name} value={v.multiplier}>{v.name}</option>)}
                </select>
                <button
                  className="remove"
                  onClick={() => removeItem("expenses", index)}
                >-</button>
              </li>
            ))}
          </ul>
          <h3>Total: {eTotal.toFixed(2)}</h3>
          <button className="add" onClick={(e) => addItem(e, "expenses")}>ADD EXPENSE</button>
        </div>
      </section>
      <div className="total">NET: ${(iTotal - eTotal).toFixed(2)}</div>
    </main>
  )
}