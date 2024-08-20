import "./styles.css";
import { Button } from '@mui/material';

function ShowUsers({ users, openCK }) {

    const handleSendNotification = (user) => {
        openCK(user.id); // Open CKEditor when sending notification
        // console.log(`Preparing to send notification to ${user.email}`);
    };
    return (
 <>
            {Array.isArray(users) && users.length === 0 ? (
                <tr>
                    <td colSpan="4">No users found</td>
                </tr>
            ) : (
                users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.secondary_email}</td>
                        <td>
                           
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleSendNotification(user)}
                                >
                                    Send 
                                </Button>
                        
                           </td>
                    </tr>
                ))
            )}
        </>
    );
};

export default ShowUsers;

