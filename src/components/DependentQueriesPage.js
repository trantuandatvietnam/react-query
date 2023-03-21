import React from 'react'
import axios from "axios"
import { useQuery } from "react-query";

const fetchUserByEmail = (email) => {
    return axios.get(`http://localhost:4000/users/${email}`)
}

const fetchUserByChannelId = (email) => {
    return axios.get(`http://localhost:4000/channels/${email}`)
}

export const DependentQueriesPage = ({email = "dat130902@gmail.com"}) => { 
    const {data: user} = useQuery(['user', email], () => fetchUserByEmail(email))
    const channelId = user?.data.channelId
    useQuery(['courses', channelId], () => fetchUserByChannelId(channelId), {
        enabled: !!channelId
    })
  return (
    <div>DependentQueriesPage</div>
  )
}
