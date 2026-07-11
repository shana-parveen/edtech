import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function RequirementsField({
  name,
  label,
  register,
  setValue,
  errors,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)
  const [requirement, setRequirement] = useState("")
  const [requirementsList, setRequirementsList] = useState([])

  useEffect(() => {
    if (editCourse) {
      setRequirementsList(course?.instructions)
    }
    register(name, { required: true, validate: (value) => value.length > 0 })
  }, [])

  useEffect(() => {
    setValue(name, requirementsList)
  }, [requirementsList])

  const handleAddRequirement = () => {
    if (requirement) {
      setRequirementsList([...requirementsList, requirement])
      setRequirement("")
    }
  }

  const handleRemoveRequirement = (index) => {
    const updatedRequirements = [...requirementsList]
    updatedRequirements.splice(index, 1)
    setRequirementsList(updatedRequirements)
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

      <div className="flex flex-col items-start space-y-3">
        {/* Input with rich black background and styling */}
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-richblack-800 text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent placeholder:text-gray-500"
          placeholder="Enter a requirement"
        />
        {/* Add button with styling */}
        <button
          type="button"
          onClick={handleAddRequirement}
          className="mt-2 w-full py-2 font-semibold text-center text-white bg-yellow-400 rounded-md hover:bg-yellow-500"
        >
          Add Requirement
        </button>
      </div>

      {/* Display the list of requirements */}
      {requirementsList.length > 0 && (
        <ul className="mt-2 list-inside list-disc space-y-1">
          {requirementsList.map((requirement, index) => (
            <li key={index} className="flex items-center text-richblack-5">
              {/* Requirement text */}
              <span className="flex-grow">{requirement}</span>
              {/* Remove button */}
              <button
                type="button"
                className="ml-2 text-xs text-pure-greys-300 hover:text-pink-300"
                onClick={() => handleRemoveRequirement(index)}
              >
                Clear
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Error message */}
      {/* {errors[name] && (
        <span className="ml-2 text-xs text-pink-200">
          {label} is required
        </span>
      )} */}
    </div>
  )
}
