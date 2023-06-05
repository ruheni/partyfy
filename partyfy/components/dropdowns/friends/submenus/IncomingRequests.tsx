import { FaCheckCircle } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';
import { useEffect, useState } from 'react';
import { UserProfile } from '@auth0/nextjs-auth0/client';

import Swal from 'sweetalert2';
import Loading from '@/components/misc/Loading';

const IncomingRequests = ({ user } : { user : UserProfile } ) => {
    const [usersReturned, setUsersReturned] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchRequests() {
        const response = await fetch('/api/database/friends?UserID=' + (user.sub ?? user.user_id) + '&action=requests')
        const data = await response.json();
        if (data) {
            setLoading(false);
            setUsersReturned(data);
        }
    }

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 2000);
        return () => clearInterval(interval);
    }, [user]);

    async function deleteIncomingRequest(FriendUserID: string, FriendUsername: string) {
        let result = await Swal.fire({
            title: 'Are you sure?',
            text: `Are you sure you want to delete your friend request from ${FriendUsername}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        });

        if (result.isConfirmed) {
            await fetch('/api/database/friends', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserID: user.sub ?? user.user_id,
                    FriendID: FriendUserID,
                    action: 'DeleteFriendRequest'
                })
            });
        }
        fetchRequests();
    }

    async function acceptIncomingRequest(FriendUserID: string, FriendUsername: string) {
        let result = await Swal.fire({
            title: 'Are you sure?',
            text: `Are you sure you want to accept the friend request from ${FriendUsername}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        });

        if (result.isConfirmed) {
            await fetch('/api/database/friends', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserID: user.sub ?? user.user_id,
                    FriendID: FriendUserID,
                    action: 'AcceptFriendRequest'
                })
            });
        }
        fetchRequests();
    }

    return (
        <div>
        {
            loading 
            ?
            <Loading />
            :
                usersReturned.length === 0 || !usersReturned
                ?
                <div>
                    <h5 className="text-center">You have no sent friend requests.</h5>
                </div>
                :
                usersReturned.map((user, index) => {
                    return (
                        <div key={index} className="card bg-dark p-2 mt-3">
                            <div className="d-flex flex-row align-items-center justify-content-between">
                                <h5 className="me-4 mt-2">{user.Username}</h5>
                                <div className="d-flex flex-row align-items-center">
                                    <button className="btn btn-small btn-success me-2" onClick={() => acceptIncomingRequest(user.UserID, user.Username)}><FaCheckCircle /></button>
                                    <button className="btn btn-small btn-danger" onClick={() => deleteIncomingRequest(user.UserID, user.Username)}><GiCancel /></button>
                                </div>
                            </div>
                        </div>
                    );
                })
        }
    </div>
    )
}

export default IncomingRequests;