'use client';

import { Button, Modal, Label, Accordion ,TextInput, FileInput, Dropdown, ListGroup } from 'flowbite-react';
import React, { useState } from 'react';
// the @ when pathing through our folder structre repsresnts our root foolder
import BlogEntries from '@/utils/BlogEntries.json'
import { IBlogItems } from '@/Interfaces/interface';
import NavbarComponent from '../Components/NavbarComponent';



// User's Dashboard page with their Published and unpublished Blog, entries, We will also add / edit blog entries
const Dashboard = () => {

    const [openModal, setOpenModal] = useState(false);
    const [blogItems, setBlogItems] = useState<IBlogItems[]>(BlogEntries);

    // forms
    // description, tags, categories, title, and Image

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [tags, setTags] = useState<string>("");
    const [categories, setCategories] = useState<string>("");
    const [image, setImage] = useState<any>("");

    const handleShow = () => {
        setOpenModal(true);
        setEditBool(false);
        setCategories("");
        setTitle("");
        setTags("");
        setDescription("");
        setImage("");
    }

    //Booleans
    const [editBool, setEditBool] = useState<boolean>(true);

    const handlePublish = () => {
      setOpenModal(false);
    }

    const handleEdit = () => {
      setEditBool(true);
      setOpenModal(true);
    }
    
    const handleDelete = () => {

    }

    const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
    const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value);
    const handleTags = (e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value);
    
    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        let reader = new FileReader();
        const file = e.target.files?.[0]
        console.log(file);
        if(file){
            reader.onload = () => {
                console.log(reader.result)
                setImage(reader.result);
            }
            reader.readAsDataURL(file);
        }

    }


  return (
    <>
      <NavbarComponent />
    <div className='flex min-h-screen flex-col p-24'>
        <div className='flex flex-col items-center mb-10'>
      <h1 className='text-3xl' >This is Dashboard</h1>
      <Button onClick={handleShow}>Add Blog Item</Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>{editBool ? 'Edit' : 'Add'}Blog Item</Modal.Header>
        <Modal.Body>
        <form className="flex max-w-md flex-col gap-4">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="Title" value="Title" />
        </div>
        <TextInput onChange={handleTitle} id="Title" type="Text" placeholder="Enter Title" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="Description" value="Description" />
        </div>
        <TextInput onChange={handleDescription}  id="Description" type="Text" placeholder="Enter Description" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="Tags" value="Tags" />
        </div>
        <TextInput onChange={handleTags} id="Tags" type="Text" placeholder="Enter Tags" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="Picture" value="Picture" />
        </div>
        <FileInput onChange={handleImage} accept='image/png, image/jpg' id="Picture" placeholder='Chose Image' required />
      </div>
      <div className="flex items-center gap-2">
      <Dropdown label="Dropdown button" dismissOnClick={true}>
      <Dropdown.Item onClick={() => setCategories("Sports")} >Sports</Dropdown.Item>
      <Dropdown.Item onClick={() => setCategories("Martial Arts")}  >Martial Arts</Dropdown.Item>
      <Dropdown.Item onClick={() => setCategories("Fitness")}  >Fitness</Dropdown.Item>
    </Dropdown>
      </div>
    </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handlePublish}>Save and Publish</Button>
          <Button color="gray" onClick={handlePublish}>Save</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

    <Accordion alwaysOpen >
      <Accordion.Panel>
        <Accordion.Title>Published Blog Items</Accordion.Title>
        <Accordion.Content>
         <ListGroup className='w-484' >
          {
            blogItems.map((item, idx) => {
              return (
                <div key={idx}>
                  {
                    item.isPublished && <div className='flex flex-col p-10' >
                      <h1 className='text-2xl' >{item.title}</h1>
                      <div className='flex flex-row space-x-3' >
                        <Button color='blue' onClick={handleEdit} >Edit</Button>
                        <Button color='yellow' onClick={handlePublish} >Unpublish</Button>
                        <Button color='red' onClick={handleDelete} >Delete</Button>
                      </div>
                    </div>
                  }
                </div>
              )}
            )
          }
         </ListGroup>
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel>
        <Accordion.Title>Unpublished Blog Items</Accordion.Title>
        <Accordion.Content>
        <ListGroup className='w-484' >
          {
            blogItems.map((item, idx) => {
              return (
                <div key={idx}>
                  {
                    !item.isPublished && <div className='flex flex-col p-10' >
                      <h1 className='text-2xl' >{item.title}</h1>
                      <div className='flex flex-row space-x-3' >
                        <Button color='blue' onClick={handleEdit} >Edit</Button>
                        <Button color='yellow' onClick={handlePublish} >Publish</Button>
                        <Button color='red' onClick={handleDelete} >Delete</Button>
                      </div>
                    </div>
                  }
                </div>
              )}
            )
          }
         </ListGroup>
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
      </div>
    </div>
    </>
  )
}

export default Dashboard