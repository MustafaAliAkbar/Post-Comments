import { Box, Flex, Link, useColorMode, Button, Spacer } from "@chakra-ui/react";
import { useRouter } from 'next/router';
import NextLink from 'next/link';

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const router = useRouter();

    return (
        <Box as="nav" bg="teal.500" px={4} py={2} position="fixed" width="100%" top={0} zIndex="1000">
            <Flex alignItems="center" justifyContent="space-between">
                <NextLink href="/" passHref>
                    <Link color="white" fontSize="xl" fontWeight="bold">
                        Home
                    </Link>
                </NextLink>
                <Spacer />
                <Button onClick={toggleColorMode} colorScheme="teal">
                    Toggle {colorMode === "light" ? "Dark" : "Light"}
                </Button>
            </Flex>
        </Box>
    );
};

export default Navbar;
