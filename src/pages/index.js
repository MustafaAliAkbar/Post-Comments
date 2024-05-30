// src/pages/index.js
import { Box, Button, Input, FormControl, FormLabel, Select, Alert, AlertIcon, Table, Thead, Tbody, Tr, Th, Td, Tabs, TabList, TabPanels, Tab, TabPanel, useToast, Grid, GridItem, Link, Spinner, Center } from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import { FaPlus, FaUser, FaList, FaEye } from 'react-icons/fa';
import api from '../utils/axios';
import NextLink from 'next/link';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingUser, setIsCreatingUser] = useState(false); // State to manage loading status for creating user
  const toast = useToast();

  useEffect(() => {
    api.get('/users')
      .then(response => {
        setUsers(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setIsLoading(false);
      });
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const createUser = () => {
    if (!name || !email || !gender || !status) {
      toast({
        title: "Validation Error",
        description: "All fields are mandatory. Please fill in all the fields.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const userData = { name, email, gender, status };
    setIsCreatingUser(true); // Set loading state to true

    api.post('/users', userData)
      .then(response => {
        setUsers([response.data, ...users]);
        setName('');
        setEmail('');
        setGender('');
        setStatus('');
        setError('');
        setIsCreatingUser(false); // Set loading state to false
        toast({
          title: "User created.",
          description: "The user has been created successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      })
      .catch(error => {
        console.error('Error creating user:', error);
        setError(error.response?.data?.message || 'An error occurred');
        setIsCreatingUser(false); // Set loading state to false
      });
  };

  return (
    <Box p={8} maxW="1200px" mx="auto">
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <Tabs variant="soft-rounded" colorScheme="teal" defaultIndex={0}>
        <TabList mb={4}>
          <Tab>
            <FaList style={{ marginRight: 8 }} /> User List
          </Tab>
          <Tab>
            <FaUser style={{ marginRight: 8 }} /> Create User
          </Tab>
        </TabList>
        <TabPanels>

          <TabPanel>
            <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="lg">
              {isLoading ? (
                <Center>
                  <Spinner size="xl" color="teal.500" />
                </Center>
              ) : (
                <Table variant="striped" colorScheme="teal">
                  <Thead>
                    <Tr >
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Gender</Th>
                      <Th>Status</Th>
                      <Th>Posts</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users.map(user => (
                      <Tr key={user.id}>
                        <Td>{user.name}</Td>
                        <Td>{user.email}</Td>
                        <Td>{user.gender}</Td>
                        <Td>{user.status}</Td>
                        <Td>
                          <NextLink href={`/user/${user.id}`} passHref>
                            <Link colorScheme="#808080">
                              <Button leftIcon={<FaEye />} colorScheme="gray" size="sm" borderRadius="lg" boxShadow="lg">
                                Posts
                              </Button>
                            </Link>
                          </NextLink>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Box>
          </TabPanel>

          <TabPanel>
            <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="lg">
              <Box display="flex" alignItems="center" mb={4}>
                <FaUser size={24} />
                <FormLabel ml={2} fontSize="2xl" fontWeight="bold">
                  Create New User
                </FormLabel>
              </Box>
              <FormControl id="name" mb={4} isRequired>
                <FormLabel>Name</FormLabel>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
              </FormControl>
              <FormControl id="email" mb={4} isRequired>
                <FormLabel>Email</FormLabel>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
              </FormControl>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                  <FormControl id="gender" isRequired>
                    <FormLabel>Gender</FormLabel>
                    <Select value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Select gender">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl id="status" isRequired>
                    <FormLabel>Status</FormLabel>
                    <Select value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Select status">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Select>
                  </FormControl>
                </GridItem>
              </Grid>
              <Button
                colorScheme="teal"
                onClick={createUser}
                leftIcon={<FaPlus />}
                mt={4}
                isLoading={isCreatingUser} // Add isLoading prop
              >
                Create User
              </Button>
            </Box>
          </TabPanel>

        </TabPanels>
      </Tabs>
    </Box >
  );
};

export default Home;

