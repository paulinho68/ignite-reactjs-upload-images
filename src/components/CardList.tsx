import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const [imgUrl, setImgUrl] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openModal = (url: string) => {
    setImgUrl(url);
    onOpen();
  }

  return (
    <>
      <SimpleGrid columns={3} spacing="40px">
        {cards.map(card =>
          <Card
            data={card}
            viewImage={openModal}
            key={card.id}
          />
        )}
      </SimpleGrid>

      <ModalViewImage
        isOpen={isOpen}
        onClose={onClose}
        imgUrl={imgUrl}
      />
    </>
  );
}
