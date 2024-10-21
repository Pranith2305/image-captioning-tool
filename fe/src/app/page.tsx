"use client"
import { useState, ChangeEvent } from 'react';
import axios from 'axios';

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>('');
 
  const handleImageChange = (e : ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0){
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async() => {
    if(!image) return;

    const formData = new FormData();
    formData.append('Image', image);
    try {
      setLoading(true);
      const response = await axios.post<{ caption: string }>('http://localhost:5000/upload', formData);
      setCaption(response.data.caption);
    } catch (error){
        console.error('Error of the uploaded image', error);
    } finally{
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>AI Image Caption Generator</h1>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleSubmit} disabled={loading || !image}>Generate Caption</button>
      {loading ? <p>Loading...</p> : <p>{caption}</p>}
    </div>
  );
}
