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
  Container,
  useDisclosure
} from '@chakra-ui/react'

import api from '../services/api'

import { InputForm, ModalForm } from '../components'

import { clientsProps } from "../components/ModalForm";

const Home: NextPage = () => {
  const { isOpen, onOpen } = useDisclosure()
  const [clients, setClients] = useState<clientsProps[]>([])
  const [name, setName] = useState('')
  // const handleDeleteClient = async (id: string) => {
  //   try {
  //     await api.delete(`/clients/${id}`)
  //     setClients(clients.filter(client => client.id !== id))
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // const handleShowUpdateClient = ({ id, name, email }: clientsProps) => {
  //   setId(id)
  //   setName(name)
  //   setEmail(email)
  //   setIsFormOpen(true)
  // }

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
          onClick={onOpen}
        >
        </Button>
        <ModalForm
          state={isOpen}
          name={name}
          setName={setName}
        />
      </Flex>
      
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
                    // onClick={() => handleShowUpdateClient(cliente)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    fontSize="smaller"
                    colorScheme="red"
                    // onClick={() => handleDeleteClient(cliente.id)}
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
