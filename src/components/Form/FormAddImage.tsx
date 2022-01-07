import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';
import { fileURLToPath } from 'url';

interface FormAddImageProps {
  closeModal: () => void;
}

interface CreateImageFormData {
  title: string,
  url: string,
  description: string
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const validateImage = (value: FileList) => {
    const tenMB = 10485760;
    if (value.length > 0) {
      if (value[0].size > tenMB) {
        return "O arquivo deve ser menor que 10MB";
      }
      const type = value[0].type.toLowerCase();
      const regex = /png|jpe?g|gif/;
      if (!regex.test(type)) {
        return "Somente são aceitos arquivos PNG, JPEG e GIF";
      }
    }
    return true;
  }

  const formValidations = {
    image: {
      required: "Arquivo obrigatório",
      validate: validateImage
    },
    title: {
      required: "Título obrigatório",
      minLength: { value: 2, message: 'Mínimo de 2 caracteres' },
      maxLength: { value: 20, message: 'Máximo de 20 caracteres' }
    },
    description: {
      required: "Descrição obrigatória",
      maxLength: { value: 65, message: 'Máximo de 65 caracteres' }
    },
  };

  const queryClient = useQueryClient();
  const createImage = useMutation(
    async (formData: CreateImageFormData) => {
      const response = await api.post('/api/images', formData)
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images')
      }
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: CreateImageFormData): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: `Imagem não adicionada`,
          description: 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'error',
        });
        return;
      }
      const { title, description } = data;
      const response = await createImage.mutateAsync({ title, description, url: imageUrl });
      if (response.data.success) {
        toast({
          title: `Imagem cadastrada`,
          description: 'Sua imagem foi cadastrada com sucesso.',
          status: 'success',
        });
        return;
      }

    } catch {
      toast({
        title: `Falha no cadastro`,
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
      });
    } finally {
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register("image", formValidations.image)}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          {...register("title", formValidations.title)}
          error={errors.title}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          {...register("description", formValidations.description)}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
