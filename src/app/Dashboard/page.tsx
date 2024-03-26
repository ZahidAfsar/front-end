'use client';

import { Button, Modal, Label, Accordion ,TextInput, FileInput, Dropdown, ListGroup } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
// the @ when pathing through our folder structre repsresnts our root foolder
import BlogEntries from '@/utils/BlogEntries.json'
import { IBlogItems } from '@/Interfaces/interface';
import NavbarComponent from '../Components/NavbarComponent';
import { useRouter } from 'next/navigation';
import { addBlogItems, checkToken, getBlogItemsByUserId, loggedinData, updateBlogItems } from '@/utils/DataService';
import { log } from 'console';



// User's Dashboard page with their Published and unpublished Blog, entries, We will also add / edit blog entries
const Dashboard = () => {

    const [openModal, setOpenModal] = useState(false);
    const [blogItems, setBlogItems] = useState<IBlogItems[]>();

    // forms
    // description, tags, categories, title, and Image

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [tags, setTags] = useState<string>("");
    const [categories, setCategories] = useState<string>("");
    const [image, setImage] = useState<any>("");
    const [blogUserId, setBlogUserId] = useState<number>(0);
    const [publisherName, setPublisherName] = useState<string>("")
    const [blogId, setBlogId] = useState<number>(0);

    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
      let item: IBlogItems = {
        id: blogId,
        userID: blogUserId,
        publishedName: publisherName,
        description: description,
        date: new Date().toString(),
        title: title,
        image: image,
        tags: tags,
        categories: categories,
        isPublished: e.currentTarget.textContent === "Save and Publish" ? true : false,
        isDeleted: false
      }
      let result = false;

      if(editBool){
        // if edit bool is true we are updating our blog item
        // if it is false we are should be adding a new item
        result = await updateBlogItems(item);
      }else{
        result = await addBlogItems(item);
      }
      // if our blogs updated / add we will call our blog items again from our api
      if(result){
        let userBlogItems: IBlogItems[] = await getBlogItemsByUserId(blogUserId);
        let filteredBlogItems = userBlogItems.filter(item => item.isDeleted === false)
        setBlogItems(filteredBlogItems);
      }
      setOpenModal(false);
    }

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

    // useRouter should be from next/navigation
    let router = useRouter()

    // this useEffect will grab the users information as well as their blog info,
    // Will perform a check if users is logged in if not it will take them to login page
    useEffect(() => {
      // Async function beacause we are calling getBlogItemsById Fetch
      const getLoggedInData = async () => {
        // Storing our user info in a variable
        const loggedIn = loggedinData();
        let userBlogItems: IBlogItems[] = await getBlogItemsByUserId(loggedIn.userId);
        let filteredBlogItems = userBlogItems.filter(item => item.isDeleted === false)
        // setting our user info / fetched data inside of our state variables
        setBlogUserId(loggedIn.userId);
        setPublisherName(loggedIn.publisherName);
        setBlogItems(filteredBlogItems);
      }
      // checks if you have a token in local sotrage if so get user info else go back to login
      if(checkToken()){
        getLoggedInData()
      }else{
        router.push('/');
      }

    }, [])

    const handlePublish = async (item: IBlogItems) => {
      item.isPublished = !item.isPublished
      let result = await updateBlogItems(item)

      if(result){
        const loggedIn = loggedinData()
        let userBlogItems: IBlogItems[] = await getBlogItemsByUserId(loggedIn.userId);
        let filteredBlogItems = userBlogItems.filter(item => item.isDeleted === false);
        setBlogItems(filteredBlogItems);
      }
    }

    const handleEdit = (item: IBlogItems) => {
      setEditBool(true);
      setOpenModal(true);
      setBlogId(item.id);
      setPublisherName(item.publishedName);
        setCategories(item.categories);
        setTitle(item.title);
        setTags(item.tags);
        setDescription(item.description);
        setImage(item.image);
    }
    
    const handleDelete = async (item: IBlogItems) => {
      item.isDeleted = !item.isDeleted
      let result = await updateBlogItems(item)

      if(result){
        const loggedIn = loggedinData()
        let userBlogItems: IBlogItems[] = await getBlogItemsByUserId(loggedIn.userId);
        let filteredBlogItems = userBlogItems.filter(item => item.isDeleted === false);
        setBlogItems(filteredBlogItems);
      }
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
          <Button onClick={handleSave}>Save and Publish</Button>
          <Button color="gray" onClick={handleSave}>Save</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

    <Accordion alwaysOpen >
      <Accordion.Panel>
        <Accordion.Title>Published Blog Items</Accordion.Title>
        <Accordion.Content>
         <ListGroup className='w-484' >
          {
            blogItems && blogItems.map((item, idx) => {
              return (
                <div key={idx}>
                  {
                    item.isPublished && <div className='flex flex-col p-10' >
                      <h1 className='text-2xl' >{item.title}</h1>
                      <div className='flex flex-row space-x-3' >
                        <Button color='blue' onClick={() => handleEdit(item)} >Edit</Button>
                        <Button color='yellow' onClick={() => handlePublish(item)} >Unpublish</Button>
                        <Button color='red' onClick={() => handleDelete(item)} >Delete</Button>
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
           blogItems && blogItems.map((item, idx) => {
              return (
                <div key={idx}>
                  {
                    !item.isPublished && <div className='flex flex-col p-10' >
                      <h1 className='text-2xl' >{item.title}</h1>
                      <div className='flex flex-row space-x-3' >
                        <Button color='blue' onClick={() => handleEdit(item)} >Edit</Button>
                        <Button color='yellow' onClick={() => handlePublish(item)} >Publish</Button>
                        <Button color='red' onClick={() => handleDelete(item)} >Delete</Button>
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