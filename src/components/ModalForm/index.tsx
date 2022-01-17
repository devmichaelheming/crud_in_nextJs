import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'

import api from '../../services/api'

import InputForm from '../InputForm'

export interface clientsProps {
  id: string
  name: string
  email: string
}

interface errorsProps {
  name?: string
  email?: string
}

type Props = {
  state: boolean;
  name: string;
  setName(): string;
}

const ModalForm = function ({ state, name, setName }: Props) {
  const {onClose} = useDisclosure()
  const [clients, setClients] = useState<clientsProps[]>([])

  const [id, setId] = useState('')
  const [email, setEmail] = useState('')

  const [errors, setErrors] = useState<errorsProps>()

  const isValidateForm = () => {
    if (!name) {
      setErrors({
        name: 'Name is required'
      })
      return false
    }

    if (!email) {
      setErrors({
        email: 'E-Mail is required'
      })
      return false
    }

    if (
      clients.some(client => {
        client.email === email && client.id !== id
      })
    ) {
      setErrors({ email: 'E-Mail already in use' })
      return
    }

    setErrors({})
    return true
  }

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidateForm()) return

    try {
      const { data } = await api.post('/clients', { name, email })

      setClients(clients.concat(data.data))
      setName('')
      setEmail('')
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name && !email) return

    try {
      await api.put(`/clients/${id}`, { name, email })

      setClients(
        clients.map(client =>
          client.id === id ? { id: id, name, email } : client
        )
      )

      setId('')
      setName('')
      setEmail('')
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <>
      <Modal
        isOpen={state}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crie o cliente</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack
              marginY="1rem"
              as="form"
              onSubmit={id ? handleUpdateClient : handleCreateClient}
            >
              <InputForm
                label="Name"
                name="name"
                type="text"
                value={name}
                error={errors?.name}
                onChange={e => setName(e.target.value)}
              />

              <InputForm
                label="E-Mail"
                name="email"
                type="email"
                value={email}
                error={errors?.email}
                onChange={e => setEmail(e.target.value)}
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              fontSize="sm"
              alignSelf="flex-end"
              type="submit"
              colorScheme='blue'
              mr={3}
            >
              {id ? 'Atualizar' : 'Cadastrar'}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ModalForm;