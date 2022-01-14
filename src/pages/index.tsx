import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import {
  Button,
  Flex,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Container
} from '@chakra-ui/react'

import InputForm from '../components/InputForm'
import api from '../services/api'

interface clientsProps {
  id: string
  name: string
  email: string
}

interface errorsProps {
  name?: string
  email?: string
}

const Home: NextPage = () => {
  const [clients, setClients] = useState<clientsProps[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)

  const [id, setId] = useState('')
  const [name, setName] = useState('')
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
      setIsFormOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name && !email) return

    try {
      await api.put(`/clientes/${id}`, { name, email })

      setClients(
        clients.map(client =>
          client.id === id ? { id: id, name, email } : client
        )
        )

      setId('')
      setName('')
      setEmail('')
      setIsFormOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleShowUpdateClient = ({ id, name, email }: clientsProps) => {
    setId(id)
    setName(name)
    setEmail(email)
    setIsFormOpen(true)
  }

  const handleDeleteClient = async (id: string) => {
    try {
      await api.delete(`/clients/${id}`)
      setClients(clients.filter(client => client.id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    api.get('/clients').then(({ data }) => {
      const newData: any = []
      const convertData = data.data

      convertData.map((item: any) => {
        newData.push({
          id: item._id,
          name: item.name,
          email: item.email,
          createdAt: item.createdAt
        })
      })

      setClients(newData)
    })
  }, [])

  return (
    <Container maxW="container.xl">
      <Flex color="white" justifyContent="space-between" marginY="4">
        <Text color="black" fontSize="24">
          Testando
        </Text>

        <Button
          colorScheme="facebook"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? '-' : '+'}
        </Button>
      </Flex>
      {isFormOpen
? (
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

          <Button
            colorScheme="blue"
            fontSize="sm"
            alignSelf="flex-end"
            type="submit"
          >
            {id ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </VStack>
      )
        : <></>
      )}
      <Table variant="simple" marginY="10">
        <TableCaption>Imperial to metric conversion factors</TableCaption>
        <Thead bgColor="blue.500">
          <Tr>
            <Th textColor="white">Name</Th>
            <Th textColor="white">E-Mail</Th>
            <Th textColor="white">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {clients.map(cliente => (
            <Tr key={cliente.email}>
              <Td>{cliente.name}</Td>
              <Td>{cliente.email}</Td>
              <Td>
                <Flex gap="2">
                  <Button
                    size="sm"
                    fontSize="smaller"
                    colorScheme="green"
                    onClick={() => handleShowUpdateClient(cliente)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    fontSize="smaller"
                    colorScheme="red"
                    onClick={() => handleDeleteClient(cliente.id)}
                  >
                    Remover
                  </Button>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  )
}

export default Home
