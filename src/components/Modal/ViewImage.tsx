import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent >
        <ModalBody padding="0">
          <Image src={imgUrl} w="100%" maxH="900px" maxW="600px" />
        </ModalBody>
        <ModalFooter
          h="32px"
          backgroundColor="#353431"
          justifyContent="flex-start"
          borderBottomRightRadius="4px"
          borderBottomLeftRadius="4px"
        >
          <Link href={imgUrl} isExternal>Abrir original</Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
