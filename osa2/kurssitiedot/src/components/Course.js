import React from 'react'

const Header = props => <h2>{props.course}</h2>

const Part = ({ name, exercises }) =>
<p>
  {name} {exercises}
</p>

const Content = ({ parts }) => parts.map(p => <Part name={p.name} exercises={p.exercises} key={p.id} />)

const Total = ({ parts }) => <p><b>total of {parts.reduce((acc, p) => acc + p.exercises, 0)} exercises</b></p>

const Course = ({ course }) =>
<div>
  <Header course={course.name} />
  <Content parts={course.parts} />
  <Total parts={course.parts} />
</div>

export default Course