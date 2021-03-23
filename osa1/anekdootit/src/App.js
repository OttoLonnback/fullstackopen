import React, { useState } from 'react'

const Anecdote = ({ title, text, votes }) =>
<div>
  <h1>{title}</h1>
  <div>{text}</div>
  <div>has {votes} votes</div>
</div>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]
   
  const [selected, setSelected] = useState(Math.floor(Math.random() * anecdotes.length))
  const [votes, setVotes] = useState((new Array(anecdotes.length)).fill(0))

  const [mostVotedVotes, mostVoted] = votes.reduce(([lv, li], v, i) => v > lv ? [v, i] : [lv, li], [votes[0], 0])

  return (
    <div>
      <Anecdote title="Anecdote of the day" text={anecdotes[selected]} votes={votes[selected]}/>
      <button type="button" onClick={() => setVotes(Object.assign(votes.slice(), { [selected]: votes[selected] + 1 }))}>vote</button>
      <button type="button" onClick={() => setSelected(Math.floor(Math.random() * anecdotes.length))}>next anecdote</button>
      {mostVotedVotes > 0 && <Anecdote title="Anecdote with most votes" text={anecdotes[mostVoted]} votes={mostVotedVotes}/>}
    </div>
  )
}

export default App
