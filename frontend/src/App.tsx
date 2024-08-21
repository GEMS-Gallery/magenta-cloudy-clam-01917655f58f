import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Button, Grid, Card, CardMedia, CardActions, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';

interface Image {
  id: bigint;
  data: number[];
}

const Input = styled('input')({ display: 'none' });

const App: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const result = await backend.getAllImages();
      setImages(result.map(([id, image]) => ({ id, ...image })));
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const onSubmit = async (data: { image: FileList }) => {
    if (data.image && data.image[0]) {
      setLoading(true);
      const file = data.image[0];
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      try {
        await backend.uploadImage(Array.from(uint8Array));
        await fetchImages();
        reset();
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.deleteImage(id);
      await fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (image: Image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const createImageUrl = (imageData: number[]) => {
    const blob = new Blob([new Uint8Array(imageData)], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" component="h1" gutterBottom>
        Image Gallery
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="contained-button-file">
          <Input
            accept="image/*"
            id="contained-button-file"
            type="file"
            {...register('image')}
          />
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            disabled={loading}
          >
            Upload Image
          </Button>
        </label>
        {loading && <CircularProgress />}
      </form>

      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={Number(image.id)}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={createImageUrl(image.data)}
                alt={`Image ${image.id}`}
                onClick={() => openModal(image)}
                style={{ cursor: 'pointer' }}
              />
              <CardActions>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(image.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal
        isOpen={!!selectedImage}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: 0,
            border: 'none',
            borderRadius: '4px',
            overflow: 'hidden',
          },
        }}
      >
        {selectedImage && (
          <img
            src={createImageUrl(selectedImage.data)}
            alt={`Image ${selectedImage.id}`}
            style={{ maxWidth: '90vw', maxHeight: '90vh' }}
          />
        )}
      </Modal>
    </Container>
  );
};

export default App;
