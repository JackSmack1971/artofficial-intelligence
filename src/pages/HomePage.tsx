import React from 'react'
import { Button } from '@/components/ui'

const HomePage: React.FC = () => {
  const handleClick = () => {
    console.log('Home clicked')
  }
  return (
    <div>
      <h1>Welcome to ArtOfficial Intelligence</h1>
      <Button label="Click Me" onClick={handleClick} />
    </div>
  )
}

export default HomePage
