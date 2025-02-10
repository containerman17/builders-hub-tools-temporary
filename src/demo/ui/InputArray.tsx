import { FC } from 'react'

interface InputArrayProps {
    values: string[]
    onChange: (values: string[]) => void
}

export const InputArray: FC<InputArrayProps> = ({ values, onChange }) => {
    const handleChange = (index: number, value: string) => {
        const newValues = [...values]
        newValues[index] = value
        onChange(newValues)
    }

    const handleAdd = () => {
        onChange([...values, ''])
    }

    const handleRemove = (index: number) => {
        const newValues = values.filter((_, i) => i !== index)
        onChange(newValues)
    }

    return (
        <div className="space-y-2">
            {values.map((value, index) => (
                <div key={index} className="flex gap-2">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(index, e.target.value)}
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                        onClick={() => handleRemove(index)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                        Remove
                    </button>
                </div>
            ))}
            <button
                onClick={handleAdd}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
            >
                Add Item
            </button>
        </div>
    )
}
