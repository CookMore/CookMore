import { Control, FieldValues, Path } from 'react-hook-form'
import { Controller } from 'react-hook-form'

interface FormControlProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  render: (props: { field: any }) => React.ReactElement
}

export function FormControl<T extends FieldValues>({ control, name, render }: FormControlProps<T>) {
  return <Controller control={control} name={name} render={render} />
}
