// Importing React hook for managing component state
import { useEffect, useState } from "react"
// Importing React icon component
import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"

// Defining a functional component ChipInput
export default function ChipInput({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)

  const [chips, setChips] = useState([])

  useEffect(() => {
    if (editCourse) {
      setChips(course?.tag)
    }
    register(name, { required: true, validate: (value) => value.length > 0 })
  }, [])

  useEffect(() => {
    setValue(name, chips)
  }, [chips])

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      const chipValue = event.target.value.trim()
      if (chipValue && !chips.includes(chipValue)) {
        setChips([...chips, chipValue])
        event.target.value = ""
      }
    }
  }

  const handleDeleteChip = (chipIndex) => {
    const newChips = chips.filter((_, index) => index !== chipIndex)
    setChips(newChips)
  }

  return (
    <div className="flex flex-col space-y-3">
      {/* Label with Tailwind styling */}
      <label
        className="text-lg font-semibold text-richblack-5"
        htmlFor={name}
      >
        {label} <sup className="text-pink-200">*</sup>
      </label>
      
      {/* Chips and input with improved styling */}
      <div className="flex w-full flex-wrap gap-2">
        {chips.map((chip, index) => (
          <div
            key={index}
            className="m-1 flex items-center rounded-lg bg-yellow-400 px-3 py-1 text-sm font-medium text-richblack-5"
          >
            {chip}
            <button
              type="button"
              className="ml-2 text-xs text-richblack-5 hover:text-white"
              onClick={() => handleDeleteChip(index)}
              aria-label={`Delete chip ${chip}`}
            >
              <MdClose />
            </button>
          </div>
        ))}
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 mt-1 rounded-md bg-richblack-800 text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent placeholder:text-gray-500"
        />
      </div>

      {/* Error message styling */}
      {/* {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )} */}
    </div>
  )
}
