'use client'
import { useState } from 'react'
import { Button } from '@plume-ui-react/lib'

export default function ButtonList() {
  const handleClick = () => {
    console.log('Button clicked!')
  }
  const [isDisabled, setIsDisabled] = useState(true)

  return (
    <>
      <Button
        onClick={() => setIsDisabled((state) => !state)}
        label="Toggle disabled"
        variant="unstyled"
        customClasses="mb-3"
      />
      <Button
        onClick={handleClick}
        label="Add to cart"
        customClasses="py-3 px-4 inline-flex justify-center items-center rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all text-sm"
        iconRight={
          <svg
            className="w-3.5 h-3.5"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M5.071 1.243a.5.5 0 0 1 .858.514L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 6h1.717L5.07 1.243zM3.5 10.5a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3z" />
          </svg>
        }
        variant="unstyled"
      />
      <Button
        onClick={handleClick}
        customClasses="py-3 px-4 text-lime-500 hover:text-lime-700"
        variant="unstyled"
      >
        <svg
          className="w-3.5 h-3.5"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M5.071 1.243a.5.5 0 0 1 .858.514L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 6h1.717L5.07 1.243zM3.5 10.5a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3z" />
        </svg>
      </Button>
      <Button
        onClick={handleClick}
        label="Large"
        size="lg"
        busy={isDisabled}
        busyText="Loading"
        shape="pill"
      />
      <Button onClick={handleClick} shape="pill" colorScheme="primary">
        Button Pill
      </Button>
      <Button
        shape="rounded"
        size="lg"
        variant="outline"
        colorScheme="salmon"
        label="Button Outline"
        onClick={handleClick}
      />
      <Button size="sm" variant="link" colorScheme="pink" onClick={handleClick}>
        Button Link
      </Button>
    </>
  )
}
