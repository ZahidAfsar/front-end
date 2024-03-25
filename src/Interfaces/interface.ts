export interface IBlogItems {
    id: number
    userID: number
    publishedName: string
    date: string
    title: string
    description: string
    image: string
    tags: string
    categories: string
    isPublished: boolean
    isDeleted: boolean
}

//Getting our token
export interface IToken {
    token: string
}

// For Login and Create Account fetch
export interface IUserInfo {
    username: string
    password: string
}

// this for getting ur user's info Id and Username
export interface IUserData {
    id: number
    username: string
}