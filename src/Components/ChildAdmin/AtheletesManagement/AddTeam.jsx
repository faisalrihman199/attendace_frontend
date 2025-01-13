import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useAPI } from '../../../contexts/Apicontext';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { showToastNotification } from '../../Utilities/toastNotification';

const AddTeam = () => {
    const [selectedValue, setSelectedValue] = useState('team');
    const { register, handleSubmit, getValues, setValue } = useForm();
    const [loading, setLoading] = useState(false);
    const { addTeam } = useAPI();
    const location = useLocation();
    const navigate=useNavigate();
    const { team } = location.state || {};
    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
    };
    useEffect(()=>{
        if(team){
            console.log("Team here is :", team);
            
            setSelectedValue(team.category);
            setValue('groupName', team.groupName);
        }
    },[])
    const handleGroup = () => {
        if (!getValues('groupName')) {
            toast.error("Please Add Team/Clas Name");
            return
        }
        setLoading(true);
        const data = {
            groupName: getValues('groupName'),
            category: selectedValue
        }
        addTeam(data,team?.id)
            .then((res) => {
                if (res.success) {
                    toast.success(res.message);
                    navigate('/admin/teams')
                }
                else {
                    toast.error(res.message);
                }
            })
            .catch((err) => {
                console.log("Error :", err);
                toast.error(err.message);
            })
            .finally(() => {
                setLoading(false);
            })

    }

    const returnToTeamManage = () => {
        // Defined nav functions
        const functionsMap = {
            navigateAway: () => navigate('/admin/teams'),
            stayOnPage: () => console.log('Staying on the page...'),
        };
        try {

            // Define input to be validated
            const inputElement = document.getElementById('groupName');
            const inputValue = inputElement.value;

            // Navigate if true, else throw warning notification                                    
            if ((!team && inputValue == '') || (team?.groupName == inputValue)) {
                navigate('/admin/teams')
            } else {
                showToastNotification({
                    message: 'You have unsaved changes. Are you sure you want to cancel?',
                    confirmText: 'Confirm',
                    confirmFunction: 'navigateAway',
                    cancelText: 'Cancel',
                    cancelFunction: 'stayOnPage',
                    functionsMap
                });
            }
        } catch (err) {
            console.log("Error :", err);
            toast.error(err.message);
        }
    }

    return (
        <>
            <div className="my-3">
                <div className='d-flex'>
                    <div className="form-check mx-2">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="teamClassRadio"
                            id="teamRadio"
                            value="team"
                            checked={selectedValue === 'team'}
                            onChange={handleRadioChange}
                        />
                        <label className="form-check-label" htmlFor="teamRadio" style={{ color: 'black' }}>
                            Team
                        </label>
                    </div>

                    <div className="form-check mx-2">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="teamClassRadio"
                            id="classRadio"
                            value="class"
                            checked={selectedValue === 'class'}
                            onChange={handleRadioChange}
                        />
                        <label className="form-check-label" htmlFor="classRadio" style={{ color: 'black' }}>
                            Class
                        </label>
                    </div>
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-sm-12 tooltip-container">
                    <label htmlFor="groupName" className="form-label">
                        Team/Class Name
                    </label>
                    <span className="tooltip-text-right">Input the name of your team or class</span>
                    <input
                        type="text"
                        id="groupName"
                        className="form-control p-2 bg_dede"
                        placeholder="Team/Class Name"
                        {...register('groupName')}
                    />
                </div>
            </div>

            <div className="d-flex my-2 justify-content-end">
                <button className="btn rounded color_bao poppins-medium " onClick={returnToTeamManage} style={{ borderColor: '#247BA0', width: '180px' }}>
                    Cancel
                </button>
                {
                    loading ?
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            { team ? 'Saving...' : 'Adding...' }
                        </>
                        :
                        <button className="btn mx-2 rounded  btns poppins-medium  " onClick={handleGroup} style={{ width: '180px' }}>
                            { team ? 'Save' : 'Add' }
                        </button>
                }
            </div>
        </>
    )
}

export default AddTeam