import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Public from './components/Public';
import Login from './components/Login';
import DashLayout from './components/DashLayout';
import Welcome from './features/auth/Welcome';
import UsersList from './features/user/UserList';
import NotesList from './features/auth/notes/NoteList';
const App = () => {
    return (
        <Routes>
            <Route path='/' element={<Layout />} >
                <Route index element={<Public />} />
                <Route path='login' element={<Login />} ></Route>
                <Route path='dash' element={<DashLayout />} >
                    <Route index element={<Welcome />} />
                    <Route path='users' element={<UsersList />} />
                    <Route path='notes' element={<NotesList />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default App