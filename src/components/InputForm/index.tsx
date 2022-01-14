import type { NextPage } from 'next'
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage
} from '@chakra-ui/react'

type Props = {
  label: string;
  name?: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  error: string | undefined;
}

const InputForm: NextPage<Props> = ({ label, onChange, value, error = null, ...rest }) => {
  return (
    <FormControl marginY='1rem' isInvalid={!!error}>
        <FormLabel>{label}</FormLabel>
        <Input onChange={onChange} value={value} {...rest}/>

        {!!error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default InputForm
