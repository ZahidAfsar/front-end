import { IBlogItems, IToken, IUserData, IUserInfo } from "@/Interfaces/interface";
import { headers } from "next/headers";

const url = "https://myblogapi.azurewebsites.net";

let userData: IUserData

export const createAccount = async (createdUser : IUserInfo) => {
    // were using this fetch to make a POST request
    // We have to set the method to POST
    // we set the content type to application/json to specify our json data format
    const res = await fetch(url + '/User/AddUser',{
        method: "POST",
        headers: {
            'Content-Type' : "application/json"
        },
        body: JSON.stringify(createdUser)
    });
    // We neeed to check if our post was succesful
    if(!res.ok){
        const message = "An error has occured " + res.status;
        throw new Error(message);
    }
    const data = await res.json();
    console.log(data);
}

export const login = async (loginUser: IUserInfo) => {
    const res = await fetch(url + "/User/Login", {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(loginUser)
    });
    if(!res.ok){
        const message = "An Error has occured " + res.status;
        throw new Error(message);
    }
    const data: IToken = await res.json();
    return data;
}

export const getLoggedInUserData = async (username: string) => {
    const res = await fetch(url + "/User/GetUserByUsername/" + username)
    const data = await res.json();
    userData = data;
}

export const loggedinData = () => {
    return userData;
}

// this function will check if our user is logged in
export const checkToken = () => {
    let result = false;

    let lsData = localStorage.getItem("Token");

    if(lsData != null){
        result = true
    }
    return result
}


// Dashboard Fetches

export const getBlogItemsByUserId = async (userId: number) => {
    const res = await fetch(url + '/Blog/GetItemsByUserId/' + userId);
    const data = await res.json();
    return data;
}

export const addBlogItems = async (Blog: IBlogItems) => {
    const res = await fetch(url + '/Blog/AddBlogItems', {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(Blog)
    })
    if(!res.ok){
        const message = "An Error has Occured" + res.status;
        throw new Error(message);
    }
    // returns a boolean value depending on wheter or not we added a blog item successfuly
    const data = await res.json();
    return data;
}

export const updateBlogItems = async (Blog: IBlogItems) => {
    const res = await fetch(url + '/Blog/UpdateBlogItems', {
        method: "PUT",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(Blog)
    })
    if(!res.ok){
        const message = "An Error has Occured" + res.status;
        throw new Error(message);
    }
    // returns a boolean value depending on wheter or not we added a blog item successfuly
    const data = await res.json();
    return data;
}

export const getAllBlogItems = async () => {
    const res = await fetch(url + '/Blog/GetAllBlogItems');
    const data = await res.json();
    return data
}