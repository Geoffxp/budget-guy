import Head from 'next/head'
import Image from 'next/image'
import Script from 'next/script';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'

const selectValues = [
  {name:"Monthly", multiplier: 1},
  {name:"Bi-weekly", multiplier: 2},
  {name:"Weekly", multiplier: 4.333}
]

export default function Home() {
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
    if (type === "income") {
      setSchema({
        ...schema,
        incomes: [
          ...schema.incomes,
          {
            name: "Income Name",
            amount: 100,
            interval: 1
          }
        ]
      })
    } else {
      setSchema({
        ...schema,
        expenses: [
          ...schema.expenses,
          {
            name: "Expense Name",
            amount: 100,
            interval: 1
          }
        ]
      })
    }
  }
  const removeItem = (type, index) => {
    if (type === "income") {
      setSchema({
        ...schema,
        incomes: schema.incomes.filter((thing, i) => i !== index)
      })
    } else {
      setSchema({
        ...schema,
        expenses: schema.expenses.filter((thing, i) => i !== index)
      })
    }
  }
  const handleChange = (e, type, index, isNumber) => {
    if (type === "income") {
      const updatedIncomes = schema.incomes.map((inc, i) => {
        if (index === i) {
          if (isNumber && !isNaN(e.target.value)) {
            return {
              ...schema.incomes[i],
              [e.target.name]: e.target.value
            }
          } else if (isNumber) {
            return {
              ...schema.incomes[i]
            }
          } else {
            return {
              ...schema.incomes[i],
              [e.target.name]: e.target.value
            }
          }
        }
        return inc
      })
      setSchema({
        ...schema,
        incomes: updatedIncomes
      })
    } else {
      const updatedExpenses = schema.expenses.map((exp, i) => {
        if (index === i) {
          if (isNumber && !isNaN(e.target.value)) {
            return {
              ...schema.expenses[i],
              [e.target.name]: e.target.value
            }
          } else if (isNumber) {
            return {
              ...schema.expenses[i]
            }
          } else {
            return {
              ...schema.expenses[i],
              [e.target.name]: e.target.value
            }
          }
        }
        return exp
      })
      setSchema({
        ...schema,
        expenses: updatedExpenses
      })
    }
  }

  const changeInterval = (e, type, index) => {
    if (type === "income") {
      const updatedIncomes = schema.incomes.map((inc, i) => {
        if (i === index) {
          return {
            ...schema.incomes[i],
            interval: e.target.value
          }
        }
        return inc
      })
      setSchema({
        ...schema,
        incomes: updatedIncomes
      })
    } else {
      const updatedExpenses = schema.expenses.map((exp, i) => {
        if (i === index) {
          return {
            ...schema.expenses[i],
            interval: e.target.value
          }
        }
        return exp
      })
      setSchema({
        ...schema,
        expenses: updatedExpenses
      })
    }
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
      <h1>BUDGET GUY</h1>
      <section className="breakdown">
        <div className="income">
          <h2>INCOMES</h2>
          <ul className="income-box">
            {schema.incomes && schema.incomes.map((inc, index) => (
              <li key={index}>
                <input
                  type="text"
                  onClick={({ target }) => target.setSelectionRange(0, target.value.length)}
                  onChange={(e) => handleChange(e, "income", index)}
                  name="name"
                  value={inc.name}
                />
                <input
                  type="text"
                  pattern="[0-9]+"
                  onClick={({ target }) => target.setSelectionRange(0, target.value.length)}
                  onChange={(e) => handleChange(e, "income", index, true)}
                  name="amount"
                  value={inc.amount}
                />
                <select value={inc.interval} onChange={(e) => changeInterval(e, "income", index)}>
                  {selectValues.map((v, i) => <option key={v.name} value={v.multiplier}>{v.name}</option>)}
                </select>
                <button
                  className="remove"
                  onClick={() => removeItem("income", index)}
                >-</button>
              </li>
            ))}
          </ul>
          <h3>Total: {iTotal.toFixed(2)}</h3>
          <button className="add" onClick={(e) => addItem(e, "income")}>ADD INCOME</button>
        </div>
        <div className="expenses">
          <h2>EXPENSES</h2>
          <ul className="expense-box">
            {schema.expenses && schema.expenses.map((exp, index) => (
              <li key={index}>
                <input
                  type="text"
                  onClick={({ target }) => target.setSelectionRange(0, target.value.length)}
                  onChange={(e) => handleChange(e, "expense", index)}
                  name="name"
                  value={exp.name}
                />
                <input
                  type="text"
                  pattern="[0-9]+"
                  onClick={({ target }) => target.setSelectionRange(0, target.value.length)}
                  onChange={(e) => handleChange(e, "expense", index, true)}
                  name="amount"
                  value={exp.amount}
                />
                <select value={exp.interval} onChange={(e) => changeInterval(e, "expense", index)}>
                  {selectValues.map((v, i) => <option key={v.name} value={v.multiplier}>{v.name}</option>)}
                </select>
                <button
                  className="remove"
                  onClick={() => removeItem("expense", index)}
                >-</button>
              </li>
            ))}
          </ul>
          <h3>Total: {eTotal.toFixed(2)}</h3>
          <button className="add" onClick={(e) => addItem(e, "expense")}>ADD EXPENSE</button>
        </div>
      </section>
      <div className="total">NET: ${(iTotal - eTotal).toFixed(2)}</div>
    </main>
  )
}
