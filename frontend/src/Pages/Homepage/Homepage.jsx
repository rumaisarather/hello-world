import "./styles.css";
import React, { useState, useEffect, lazy, Suspense } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { RiUserAddFill } from "react-icons/ri";
import CkEditorComponent from "../../Components/ckEditorComponent.jsx";
import { Box, CircularProgress } from "@mui/material";

const ShowUsers = lazy(() => import("../../Components/ShowUsers/ShowUsers.jsx"));

function Homepage() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({});
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [showCkEditor, setShowCkEditor] = useState({ open: false, recipientUserId: null });
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch('http://localhost:8000/api/users',{
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`, // Include token in headers
                },
            });
            if (res.status === 401) {
                // Unauthorized, possibly token expired
                localStorage.removeItem('authToken');
                navigate('/login'); // Redirect to login page
              } else {
            const data = await res.json();
            setUsers(data);
            handleStoreData(data);
              }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNewChange = (event) => {
        const { name, value } = event.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleStoreData = (data) => {
        if (data.length > 0) {
            data.forEach(user => {
                localStorage.setItem(`User ${user.id}`, JSON.stringify(user));
            });
        }
    };
    // Register a new user via your backend API
    const handleAddUser = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                throw new Error('Failed to register user');
            }

            const addedUser = await response.json();
            console.log('User registered successfully:', addedUser);

            // Optionally fetch users again to update the table after adding a new user
            fetchUsers();

            // Close the dialog after adding a user
            setOpenAddDialog(false);
            setNewUser({}); // Reset the form

        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Box className="container">
            <Box sx={{ border: '1px solid grey', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.3rem' }}>
                <h4 sx={{ paddingLeft: '1rem' }}>Users</h4>
                <Button endIcon={<RiUserAddFill />} variant="contained" size={'small'} onClick={() => setOpenAddDialog(true)}>Create New User</Button>
            </Box>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Seconadery_email</th>
                        <th>Notification</th>
                    </tr>
                </thead>
                <tbody>
                    {loading
                        ? (
                            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                                <CircularProgress />
                            </Box>)
                        : 
                        // <ShowUsers users={users} openCK={() => setShowCkEditor(true)} />}
                        ( <Suspense fallback={<CircularProgress />}>
                                <ShowUsers users={users} openCK={(userId) => setShowCkEditor({ open: true, recipientUserId: userId })} />
                            </Suspense>
                            )}

                </tbody>
            </table>

            {showCkEditor.open && (
    <CkEditorComponent
        closeCk={() => setShowCkEditor({ open: false, recipientUserId: null })}
        recipientUserId={showCkEditor.recipientUserId} 
    />
)}
            <AddDialog
                user={newUser}
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                onChange={handleNewChange}
                onAdd={handleAddUser} 
            />

        </Box>

    );

}

const AddDialog = ({ user, open, onClose, onChange,onAdd  }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={styles.dialogTitle}>Add New User</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="User Name"
                    fullWidth
                    variant="outlined"
                    name="name"
                    type="text"
                    value={user.name || ''}
                    onChange={onChange}
                />
                <TextField
                    margin="dense"
                    label="Email"
                    fullWidth
                    variant="outlined"
                    name="email"
                    type="email"
                    value={user.email || ''}
                    onChange={onChange}
                />
                <TextField
                    margin="dense"
                    label="User password"
                    fullWidth
                    variant="outlined"
                    name="password"
                    type="text"
                    value={user.password || ''}
                    onChange={onChange}
                />
                 <TextField
                    margin="dense"
                    label="Secondary Email"
                    fullWidth
                    variant="outlined"
                    name="secondary_email"
                    type="email"
                    value={user.secondary_email || ''}
                    onChange={onChange}
                />
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' color='error' onClick={onClose}>Cancel</Button>
                <Button variant='contained' sx={styles.dialogConfirmBtn}  onClick={onAdd}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

const styles = {
    dialogTitle: { backgroundColor: 'blue', color: '#fff' },
    dialogConfirmBtn: {
        backgroundColor: 'blue',
        '&:hover': {
            backgroundColor: '#146b60',
        }
    }
};

export default Homepage;