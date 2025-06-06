import { Flex, Link, Text, Container, VStack } from '@chakra-ui/react';

const footerData = [
  {
    label: 'Writing',
    href: '#',
    links: [
      { label: 'Digital Garden', href: '#' },
      { label: 'Tutorials', href: '#' },
      { label: 'React', href: '#' },
      { label: 'Community', href: '#' }
    ]
  },
  {
    label: 'Art',
    href: '#',
    links: [
      { label: 'Design', href: '#' },
      { label: '3D Art', href: '#' },
      { label: 'Photography', href: '#' }
    ]
  },
  {
    label: 'About',
    href: '#',
    links: [
      { label: 'Appearances', href: '#' },
      { label: 'Projects', href: '#' },
      { label: 'Uses', href: '#' }
    ]
  },
  {
    label: 'Social',
    href: '#',
    links: [
      { label: 'Email', href: '#' },
      { label: 'Twitter', href: '#' },
      { label: 'Github', href: '#' },
      { label: 'Linkedin', href: '#' },
      { label: 'RSS', href: '#' }
    ]
  }
];

const Footer = () => {
  return (
    <Container minWidth={'100%'} borderTopWidth={'1px'} bg={'#edf2f6'} p={{ base: 5, md: 10 }}>
      <VStack spacing={5} alignItems="initial">
        <Flex
          flexWrap="wrap"
          direction={{ base: 'column', md: 'row' }}
          alignItems="start"
          justifyContent="space-between"
        >
          {footerData.map((data, index) => (
            <Flex key={index} direction="column" mb="3">
              <Text
                fontWeight="500"
                color={'gray.800'}
                mb={2}
              >
                {data.label}
              </Text>
              <Flex direction={{ base: 'row', md: 'column' }}>
                {data.links.map((link, index) => (
                  <Link
                    key={index}
                    padding={1}
                    fontSize={{ base: 'sm', sm: 'md' }}
                    href="#"
                    mr={{ base: 1, sm: 2, md: 0 }}
                    color="gray.500"
                    _hover={{ color: 'brand.hoverBlueColor' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Flex>
            </Flex>
          ))}
        </Flex>
        <Flex alignItems="center">
          <Text color="gray.500" fontSize="0.875rem" pl="0.5rem">
            &copy; 2025 Lukáš Vlasák, Zápočtový projekt. Icons by <a rel="noreferrer" style={{textDecoration: 'underline'}} target='_blank' href='https://icons8.com/'>Icons8</a>
          </Text>
        </Flex>
      </VStack>
    </Container>
  );
};

export default Footer;