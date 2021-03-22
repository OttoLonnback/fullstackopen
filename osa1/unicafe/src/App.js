import React, { useState } from 'react'

const Button = ({text, click}) => <button type="button" onClick={click}>{text}</button>

const StatisticsLine = ({text, value}) => <tr><td>{text}</td> <td>{value}</td></tr>

const Statistics = ({good, neutral, bad}) => {
  if (good > 0 || neutral > 0 || bad > 0) {
    return (
      <div>
        <h1>statistics</h1>
        <table>
          <StatisticsLine text="good" value={good} />
          <StatisticsLine text="neutral" value={neutral} />
          <StatisticsLine text="bad" value={bad} />
          <StatisticsLine text="all" value={good + neutral + bad }/>
          <StatisticsLine text="average" value={(good + 0.5 * neutral) / (good + neutral + bad)} />
          <StatisticsLine text="positive" value={`${good / (good + neutral + bad) * 100 } %`} />
        </table>
      </div>
    )
  } else {
    return (
      <div>
        <h1>statistics</h1>
        <div>No feedback given</div>
      </div>
    )
  }
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" click={() => setGood(good + 1)} />
      <Button text="neutral" click={() => setNeutral(neutral+ 1)} />
      <Button text="bad" click={() => setBad(bad + 1)} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App;
